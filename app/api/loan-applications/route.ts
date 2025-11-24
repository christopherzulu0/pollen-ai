import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session || !session.userId === null) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 })
        }

        const data = await req.json();

        // Check if user exists in our database
        let dbUser = await prisma.user.findFirst({
            where: {
                clerkUserId: session?.userId
            }
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Check if it's a Group Loan (Village Banking)
        if (data.groupId) {
            // Validate the group exists and user is a member
            const membership = await prisma.membership.findUnique({
                where: {
                    userId_groupId: {
                        userId: dbUser.id,
                        groupId: data.groupId
                    }
                }
            });

            if (!membership) {
                return NextResponse.json({ error: "You are not a member of this group" }, { status: 403 })
            }

            // Calculate repayment date based on period (simplified logic)
            const repaymentDate = new Date();
            const months = parseInt(data.repaymentPeriod) || 1;
            repaymentDate.setMonth(repaymentDate.getMonth() + months);

            // Create the loan request
            const newLoanRequest = await prisma.loanRequest.create({
                data: {
                    amount: data.amount,
                    purpose: data.purpose,
                    repaymentDate: repaymentDate,
                    repaymentTerms: `${data.repaymentPeriod} months repayment period`,
                    installments: months, // Assuming 1 installment per month
                    interestRate: 0, // Default to 0 or fetch from group settings if needed
                    status: "PENDING",
                    userId: dbUser.id,
                    groupId: data.groupId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatar: true
                        }
                    },
                    group: true
                }
            });

            // Create notifications for all group members
            const groupMembers = await prisma.membership.findMany({
                where: {
                    groupId: data.groupId,
                    userId: {
                        not: dbUser.id // Exclude the requester
                    }
                },
                include: {
                    user: true
                }
            });

            // Create notifications in a transaction
            await prisma.$transaction(
                groupMembers.map(member =>
                    prisma.notification.create({
                        data: {
                            title: "New Loan Request",
                            message: `${dbUser.name} has requested a loan of ${data.amount} from your group.`,
                            type: "LOAN_REQUEST",
                            userId: member.userId,
                            relatedGroupId: data.groupId,
                            relatedLoanRequestId: newLoanRequest.id
                        }
                    })
                )
            );

            return NextResponse.json(newLoanRequest);
        }

        // It's an Individual Loan (Personal or Solar)
        else {
            // Validate user profile completeness
            // if (!dbUser.nationalId || !dbUser.address) {
            //     return NextResponse.json(
            //         { error: "Please update your profile with National ID and Address before applying." },
            //         { status: 400 }
            //     );
            // }

            const newIndividualLoan = await prisma.individualLoan.create({
                data: {
                    userId: dbUser.id,
                    serviceType: data.serviceName,
                    serviceName: data.serviceName,
                    serviceCategory: data.serviceCategory,
                    amount: data.amount,
                    purpose: data.purpose,
                    repaymentPeriod: data.repaymentPeriod,
                    // Fetch from User profile
                    fullName: dbUser.name || "Unknown",
                    email: dbUser.email,
                    phone: dbUser.phone || "Unknown",
                    nationalId: dbUser.nationalId || "",
                    address: dbUser.address || "",
                    employmentStatus: data.employmentStatus,
                    monthlyIncome: data.monthlyIncome,
                    businessDetails: data.businessDetails,
                    status: "PENDING"
                }
            });

            return NextResponse.json(newIndividualLoan);
        }

    } catch (error) {
        console.error("Error creating loan application:", error);
        return NextResponse.json(
            { error: "Failed to create loan application" },
            { status: 500 }
        );
    }
}
