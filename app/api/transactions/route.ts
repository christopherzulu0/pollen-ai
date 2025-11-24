import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to fetch transactions
export async function GET(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get the user
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: {
                wallet: true,
                personalSavings: true,
                savingsGoals: true,
                memberships: {
                    include: {
                        group: true
                    }
                }
            }
        })

        if (!user) {
            // Return empty array if user not found (user might not be set up yet)
            return NextResponse.json([])
        }

        // Fetch all transactions for the user
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: user.id
            },
            include: {
                group: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                wallet: {
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Transform transactions to match component's expected format
        const transformedTransactions = transactions.map(transaction => ({
            id: transaction.id,
            amount: Number(transaction.amount),
            type: transaction.type as "DEPOSIT" | "WITHDRAWAL",
            status: transaction.status as "PENDING" | "COMPLETED" | "FAILED",
            createdAt: transaction.createdAt.toISOString(),
            momoNumber: transaction.momoNumber || "",
            reference: transaction.reference || undefined,
            group: transaction.group ? {
                id: transaction.group.id,
                name: transaction.group.name
            } : undefined,
            wallet: transaction.wallet ? {
                id: transaction.wallet.id,
                name: undefined // Wallet doesn't have a name field in schema
            } : undefined
        }))

        return NextResponse.json(transformedTransactions)
    } catch (error) {
        console.error("[TRANSACTIONS_GET_ERROR]", error)
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { amount, type, accountId, momoNumber, isGroup, isSavingsGoal } = body

        if (!amount || !type || !momoNumber) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        // Get the user
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: {
                wallet: true,
                personalSavings: true,
                savingsGoals: true,
                memberships: {
                    include: {
                        group: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Auto-create wallet and personal savings if they don't exist
        if (!user.wallet) {
            console.log("[TRANSACTIONS] Creating wallet for user:", user.id)
            user.wallet = await prisma.wallet.create({
                data: {
                    userId: user.id,
                    balance: 0
                }
            })
        }

        if (!user.personalSavings) {
            console.log("[TRANSACTIONS] Creating personal savings for user:", user.id)
            user.personalSavings = await prisma.personalSavings.create({
                data: {
                    userId: user.id,
                    balance: 0
                }
            })
        }

        // Create the transaction
        const transaction = await prisma.transaction.create({
            data: {
                amount: amount,
                type: type,
                status: "PENDING",
                userId: user.id,
                momoNumber: momoNumber,
                ...(isGroup && accountId !== 'wallet' ? {
                    groupId: accountId
                } : isSavingsGoal ? {
                    // For savings goals, we don't need to set any additional fields
                } : {
                    walletId: user.wallet?.id
                })
            }
        })

        // Handle different types of transactions
        if (isGroup && accountId !== 'wallet') {
            // Create a contribution for the group
            const contribution = await prisma.contribution.create({
                data: {
                    amount: amount,
                    status: "PENDING",
                    userId: user.id,
                    groupId: accountId,
                    transactionId: transaction.id
                }
            })

            // Update group membership balance
            await prisma.membership.update({
                where: {
                    userId_groupId: {
                        userId: user.id,
                        groupId: accountId
                    }
                },
                data: {
                    balance: {
                        increment: amount
                    },
                    totalContributed: {
                        increment: amount
                    },
                    lastContribution: new Date()
                }
            })

            // Update transaction status
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: "COMPLETED" }
            })

            return NextResponse.json({ transaction, contribution })
        } else if (isSavingsGoal) {
            // Start a transaction to ensure data consistency
            const result = await prisma.$transaction(async (tx) => {
                // Create savings transaction
                const savingsTransaction = await tx.savingsTransaction.create({
                    data: {
                        savingsGoalId: accountId,
                        amount: amount,
                        type: 'WITHDRAWAL',
                        description: `Withdrawal from savings goal`
                    }
                })

                // Update savings goal balance
                await tx.savingsGoal.update({
                    where: {
                        id: accountId
                    },
                    data: {
                        currentAmount: {
                            decrement: amount
                        }
                    }
                })

                // Update personal savings balance
                if (user.personalSavings) {
                    await tx.personalSavings.update({
                        where: {
                            userId: user.id
                        },
                        data: {
                            balance: {
                                decrement: amount
                            }
                        }
                    })
                }

                // Update main transaction status
                await tx.transaction.update({
                    where: { id: transaction.id },
                    data: { status: "COMPLETED" }
                })

                return { transaction, savingsTransaction }
            })

            return NextResponse.json(result)
        } else {
            // Handle wallet transaction
            await prisma.wallet.update({
                where: {
                    userId: user.id  // Use userId instead of wallet.id since it's a unique field
                },
                data: {
                    balance: {
                        increment: type === "DEPOSIT" ? amount : -amount
                    }
                }
            })

            // Update transaction status
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: "COMPLETED" }
            })

            return NextResponse.json(transaction)
        }
    } catch (error) {
        console.error("[TRANSACTIONS_ERROR]", error)
        const errorMessage = error instanceof Error ? error.message : "Internal Error"
        return NextResponse.json({ error: errorMessage }, { status: 500 })
    }
} 
