import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get serviceType from query params
        const { searchParams } = new URL(request.url)
        const serviceType = searchParams.get("serviceType") // "Personal Loans" or "Solar Equipment"

        // Find user by Clerk ID
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
            include: {
                personalDocuments: true,
                solarDocuments: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Check documents based on service type
        if (serviceType === "Solar Equipment" || serviceType?.toLowerCase().includes("solar")) {
            return NextResponse.json({
                hasDocuments: !!user.solarDocuments,
                documents: user.solarDocuments || null,
            })
        } else {
            // Default to Personal Loans
        return NextResponse.json({
                hasDocuments: !!user.personalDocuments,
                documents: user.personalDocuments || null,
        })
        }
    } catch (error) {
        console.error("Error checking user documents:", error)
        return NextResponse.json(
            { error: "Failed to check user documents" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const { 
            serviceType, // "Personal Loans" or "Solar Equipment"
            // Personal Loans fields
            nrcFront, 
            nrcBack, 
            payslip,
            proofOfAddress,
            liveSelfie,
            bankStatement,
            // Solar Equipment fields
            landOwnership,
            utilityBill,
            vendorQuotation,
            subsidyReceipt
        } = body

        // Find user by Clerk ID
        const user = await prisma.user.findUnique({
            where: { clerkUserId: userId },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Handle Solar Equipment documents
        if (serviceType === "Solar Equipment" || serviceType?.toLowerCase().includes("solar")) {
            // Validate required fields for Solar Equipment
            if (!nrcFront || !nrcBack || !landOwnership || !utilityBill || !vendorQuotation || !subsidyReceipt) {
                return NextResponse.json(
                    { error: "All documents are required: NRC front, NRC back, Land Ownership, Utility Bill, Vendor Quotation, and Subsidy Receipt" },
                    { status: 400 }
                )
        }

        // Check if documents already exist
            const existingDocuments = await prisma.solarLoanDocuments.findUnique({
            where: { userId: user.id },
        })

        if (existingDocuments) {
                // Update existing documents
                const updatedDocuments = await prisma.solarLoanDocuments.update({
                    where: { userId: user.id },
                    data: {
                        Nrcfront: nrcFront,
                        NrcBack: nrcBack,
                        LandOwnership: landOwnership,
                        UtilityBill: utilityBill,
                        VendorQuotation: vendorQuotation,
                        SubsidyReceipt: subsidyReceipt,
                    },
                })

                return NextResponse.json({
                    message: "Documents updated successfully",
                    documents: updatedDocuments,
                })
            }

            // Create new documents
            const solarDocuments = await prisma.solarLoanDocuments.create({
                data: {
                    userId: user.id,
                    Nrcfront: nrcFront,
                    NrcBack: nrcBack,
                    LandOwnership: landOwnership,
                    UtilityBill: utilityBill,
                    VendorQuotation: vendorQuotation,
                    SubsidyReceipt: subsidyReceipt,
                },
            })

            return NextResponse.json({
                message: "Documents uploaded successfully",
                documents: solarDocuments,
            })
        } 
        // Handle Personal Loans documents (default)
        else {
            // Validate required fields for Personal Loans
            if (!nrcFront || !nrcBack || !payslip) {
            return NextResponse.json(
                    { error: "NRC front, NRC back, and payslip are required" },
                { status: 400 }
            )
        }

            // Check if documents already exist
            const existingDocuments = await prisma.personalLoanDocuments.findUnique({
                where: { userId: user.id },
            })

            if (existingDocuments) {
                // Update existing documents
                const updatedDocuments = await prisma.personalLoanDocuments.update({
                    where: { userId: user.id },
                    data: {
                        Nrcfront: nrcFront,
                        NrcBack: nrcBack,
                        PaySlip: payslip,
                        ProofOfAddress: proofOfAddress || null,
                        LiveSelfie: liveSelfie || null,
                        BankStatement: bankStatement || null,
                    },
                })

                return NextResponse.json({
                    message: "Documents updated successfully",
                    documents: updatedDocuments,
                })
            }

            // Create new documents
            const personalDocuments = await prisma.personalLoanDocuments.create({
            data: {
                userId: user.id,
                Nrcfront: nrcFront,
                NrcBack: nrcBack,
                PaySlip: payslip,
                    ProofOfAddress: proofOfAddress || null,
                    LiveSelfie: liveSelfie || null,
                    BankStatement: bankStatement || null,
            },
        })

        return NextResponse.json({
            message: "Documents uploaded successfully",
                documents: personalDocuments,
        })
        }
    } catch (error) {
        console.error("Error uploading user documents:", error)
        return NextResponse.json(
            { error: "Failed to upload documents" },
            { status: 500 }
        )
    }
}
