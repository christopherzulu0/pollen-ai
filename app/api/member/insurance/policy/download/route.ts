import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

// Define comprehensive styles with premium design system
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  // Enhanced header with gradient effect
  header: {
    marginBottom: 30,
    padding: 24,
    backgroundColor: "#1e5a6b",
    borderRadius: 8,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  headerContent: {
    borderBottomWidth: 3,
    borderBottomColor: "#4fb3d4",
    paddingBottom: 12,
  },
  companyName: {
    fontSize: 11,
    color: "#4fb3d4",
    marginBottom: 8,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 26,
    color: "#ffffff",
    marginBottom: 6,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#b3e5fc",
    marginBottom: 8,
    fontWeight: "500",
  },
  policyNumber: {
    fontSize: 10,
    color: "#e0f2f7",
    fontWeight: "500",
    paddingTop: 8,
  },
  // Two-column layout for info
  twoColumn: {
    flexDirection: "row",
    gap: 20,
  },
  column: {
    flex: 1,
  },
  // Section styling
  section: {
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e7ff",
  },
  sectionTitle: {
    fontSize: 14,
    color: "#1e5a6b",
    marginBottom: 12,
    fontWeight: "bold",
    borderLeftWidth: 4,
    borderLeftColor: "#4fb3d4",
    paddingLeft: 12,
    letterSpacing: 0.5,
  },
  // Info rows for key-value pairs
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 12,
  },
  infoLabel: {
    fontWeight: "600",
    color: "#5a6b7d",
    width: 130,
    fontSize: 9,
  },
  infoValue: {
    color: "#1e293b",
    flex: 1,
    fontWeight: "500",
    fontSize: 10,
  },
  // Enhanced table styling
  table: {
    marginLeft: 12,
    marginRight: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e7ff",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  tableRowAlternate: {
    backgroundColor: "#f8fbfc",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#1e5a6b",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#4fb3d4",
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: "#1e293b",
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
  // Feature item styling
  featureItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 12,
  },
  featureCheck: {
    color: "#10b981",
    marginRight: 8,
    fontSize: 12,
    fontWeight: "bold",
  },
  featureText: {
    flex: 1,
    color: "#1e293b",
    fontSize: 10,
  },
  // Description and terms
  descriptionText: {
    paddingLeft: 12,
    paddingRight: 12,
    color: "#5a6b7d",
    fontSize: 9,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  // Footer styling
  pageNumber: {
    fontSize: 9,
    color: "#a0aec0",
    textAlign: "center",
    marginTop: 20,
  },
  footer: {
    marginTop: 40,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: "#1e5a6b",
    textAlign: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#5a6b7d",
    marginBottom: 6,
  },
  footerHighlight: {
    fontSize: 9,
    color: "#1e5a6b",
    fontWeight: "bold",
    marginBottom: 4,
  },
  // Premium highlight boxes
  highlightBox: {
    backgroundColor: "#f0f8fb",
    borderLeftWidth: 4,
    borderLeftColor: "#4fb3d4",
    padding: 12,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 15,
  },
  highlightLabel: {
    fontSize: 8,
    color: "#4fb3d4",
    fontWeight: "bold",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  highlightValue: {
    fontSize: 13,
    color: "#1e5a6b",
    fontWeight: "bold",
  },
  // Status badge styling
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusActive: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  statusInactive: {
    backgroundColor: "#fee2e2",
    color: "#7f1d1d",
  },
  // Summary box
  summaryBox: {
    backgroundColor: "#fef3c7",
    borderLeftWidth: 4,
    borderLeftColor: "#d97706",
    padding: 12,
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 8,
    color: "#92400e",
    fontWeight: "bold",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 10,
    color: "#78350f",
    fontWeight: "500",
  },
})

// GET - Download policy document as PDF
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const policyId = searchParams.get("policyId")

    if (!policyId) {
      return NextResponse.json({ error: "Policy ID is required" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch policy with product details
    const policy = await prisma.insurancePolicy.findFirst({
      where: {
        id: policyId,
        userId: user.id,
      },
      include: {
        product: {
          select: {
            name: true,
            productType: true,
            description: true,
            features: true,
            coverageTerms: true,
            exclusions: true,
          },
        },
      },
    })

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 })
    }

    // Generate PDF document
    const pdfBuffer = await generatePDFDocument(policy, user)

    // Return as downloadable PDF file
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Policy_${policy.policyNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[POLICY_DOWNLOAD_ERROR]", error)
    return NextResponse.json(
      {
        error: "Failed to generate policy document",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

async function generatePDFDocument(policy: any, user: any): Promise<Buffer> {
  const formatCurrency = (amount: number) => {
    return `ZMW ${parseFloat(amount.toString()).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateRenewalDate = (endDate: Date) => {
    const date = new Date(endDate)
    date.setFullYear(date.getFullYear() + 1)
    return formatDate(date)
  }

  const getDaysUntilExpiry = (endDate: Date) => {
    const today = new Date()
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const statusColor = policy.status.toLowerCase() === "active"
    ? styles.statusActive
    : styles.statusInactive

  // Create PDF document using React.createElement (no JSX in .ts files)
  const PolicyDocument = React.createElement(
    Document,
    {},
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      // Branded Header with Enhanced Design
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          { style: styles.headerContent },
          React.createElement(Text, { style: styles.companyName }, "SECURE INSURANCE CO."),
          React.createElement(
            View,
            { style: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" } },
            React.createElement(Text, { style: styles.title }, "INSURANCE POLICY DOCUMENT"),
            React.createElement(Text, { style: { ...styles.statusBadge, ...statusColor } }, policy.status.toUpperCase())
          ),
          React.createElement(Text, { style: styles.subtitle }, policy.product.name),
          React.createElement(Text, { style: styles.policyNumber }, `Policy #${policy.policyNumber}`)
        )
      ),

      // Key Highlights with KPI Box
      React.createElement(
        View,
        { style: styles.highlightBox },
        React.createElement(Text, { style: styles.highlightLabel }, "PREMIUM DUE"),
        React.createElement(Text, { style: styles.highlightValue }, formatCurrency(policy.premiumAmount))
      ),

      // Quick Summary
      React.createElement(
        View,
        { style: styles.summaryBox },
        React.createElement(Text, { style: styles.summaryLabel }, "POLICY EXPIRES IN"),
        React.createElement(
          Text,
          { style: styles.summaryText },
          `${getDaysUntilExpiry(policy.endDate)} days (${formatDate(policy.endDate)})`
        )
      ),

      // Policyholder Information with Two Columns
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "POLICYHOLDER INFORMATION"),
        React.createElement(
          View,
          { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoLabel }, "Full Name"),
          React.createElement(Text, { style: styles.infoValue }, user.name || user.email || "N/A")
        ),
        React.createElement(
          View,
          { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoLabel }, "Email Address"),
          React.createElement(Text, { style: styles.infoValue }, user.email || "N/A")
        ),
        React.createElement(
          View,
          { style: styles.infoRow },
          React.createElement(Text, { style: styles.infoLabel }, "Policy Type"),
          React.createElement(Text, { style: styles.infoValue }, policy.product.productType || "Standard")
        )
      ),

      // Premium Payment Summary
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "PREMIUM PAYMENT SUMMARY"),
        React.createElement(
          View,
          { style: styles.table },
          React.createElement(
            View,
            { style: styles.tableRowHeader },
            React.createElement(Text, { style: { ...styles.tableCellHeader, flex: 1.2 } }, "Description"),
            React.createElement(Text, { style: { ...styles.tableCellHeader, flex: 0.8, textAlign: "right" } }, "Amount")
          ),
          React.createElement(
            View,
            { style: styles.tableRow },
            React.createElement(Text, { style: { ...styles.tableCell, flex: 1.2 } }, "Coverage Amount"),
            React.createElement(Text, { style: { ...styles.tableCell, flex: 0.8, textAlign: "right" } }, formatCurrency(policy.coverageAmount))
          ),
          React.createElement(
            View,
            { style: { ...styles.tableRow, ...styles.tableRowAlternate } },
            React.createElement(Text, { style: { ...styles.tableCell, flex: 1.2 } }, `Annual Premium (${policy.premiumFrequency})`),
            React.createElement(Text, { style: { ...styles.tableCell, flex: 0.8, textAlign: "right", fontWeight: "bold" } }, formatCurrency(policy.premiumAmount))
          ),
          React.createElement(
            View,
            { style: styles.tableRow },
            React.createElement(Text, { style: { ...styles.tableCell, flex: 1.2, fontWeight: "bold" } }, "Next Payment Due"),
            React.createElement(Text, { style: { ...styles.tableCell, flex: 0.8, textAlign: "right", fontWeight: "bold", color: "#d97706" } }, policy.nextPremiumDue ? formatDate(policy.nextPremiumDue) : "On renewal")
          )
        )
      ),

      // Policy Coverage Terms
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "COVERAGE VALIDITY PERIOD"),
        React.createElement(
          View,
          { style: styles.table },
          React.createElement(
            View,
            { style: styles.tableRowHeader },
            React.createElement(Text, { style: { ...styles.tableCellHeader, flex: 0.6 } }, "Term"),
            React.createElement(Text, { style: { ...styles.tableCellHeader, flex: 1.4 } }, "Date")
          ),
          React.createElement(
            View,
            { style: styles.tableRow },
            React.createElement(Text, { style: { ...styles.tableCell, flex: 0.6 } }, "Start Date"),
            React.createElement(Text, { style: { ...styles.tableCell, flex: 1.4 } }, formatDate(policy.startDate))
          ),
          React.createElement(
            View,
            { style: { ...styles.tableRow, ...styles.tableRowAlternate } },
            React.createElement(Text, { style: { ...styles.tableCell, flex: 0.6 } }, "Expiry Date"),
            React.createElement(Text, { style: { ...styles.tableCell, flex: 1.4, fontWeight: "bold", color: "#d97706" } }, formatDate(policy.endDate))
          ),
          React.createElement(
            View,
            { style: styles.tableRow },
            React.createElement(Text, { style: { ...styles.tableCell, flex: 0.6 } }, "Renewal Date"),
            React.createElement(Text, { style: { ...styles.tableCell, flex: 1.4 } }, calculateRenewalDate(policy.endDate))
          )
        )
      ),

      // Coverage Features
      ...(policy.product.features && Array.isArray(policy.product.features) && policy.product.features.length > 0
        ? [
            React.createElement(
              View,
              { key: "features-section", style: styles.section },
              [
                React.createElement(Text, { key: "features-title", style: styles.sectionTitle }, "COVERAGE FEATURES"),
                React.createElement(
                  View,
                  { key: "features-table", style: styles.table },
                  policy.product.features.map((feature: string, index: number) =>
                    React.createElement(
                      View,
                      { key: `feature-${index}`, style: { ...styles.tableRow, ...((index + 1) % 2 === 0 ? styles.tableRowAlternate : {}) } },
                      [
                        React.createElement(Text, { key: `check-${index}`, style: styles.featureCheck }, "✓"),
                        React.createElement(Text, { key: `text-${index}`, style: styles.featureText }, feature || "")
                      ]
                    )
                  )
                )
              ]
            ),
          ]
        : []),

      // Product Description
      policy.product.description &&
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, "PRODUCT OVERVIEW"),
          React.createElement(Text, { style: styles.descriptionText }, policy.product.description)
        ),

      // Coverage Terms
      policy.product.coverageTerms &&
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, "COVERAGE TERMS & CONDITIONS"),
          React.createElement(Text, { style: styles.descriptionText }, policy.product.coverageTerms)
        ),

      // Exclusions
      policy.product.exclusions &&
        React.createElement(
          View,
          { style: styles.section },
          React.createElement(Text, { style: styles.sectionTitle }, "EXCLUSIONS & LIMITATIONS"),
          React.createElement(Text, { style: styles.descriptionText }, policy.product.exclusions)
        ),

      // Important Notes
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "IMPORTANT NOTES"),
        React.createElement(
          View,
          { style: styles.infoRow },
          React.createElement(Text, { style: { ...styles.infoLabel, width: "auto", marginRight: 8 } }, "•"),
          React.createElement(
            Text,
            { style: { ...styles.infoValue, color: "#5a6b7d", fontWeight: "400" } },
            "Please retain this document for your records. It serves as proof of your insurance coverage."
          )
        ),
        React.createElement(
          View,
          { style: styles.infoRow },
          React.createElement(Text, { style: { ...styles.infoLabel, width: "auto", marginRight: 8 } }, "•"),
          React.createElement(
            Text,
            { style: { ...styles.infoValue, color: "#5a6b7d", fontWeight: "400" } },
            "For claims or policy inquiries, contact our customer service team during business hours."
          )
        ),
        React.createElement(
          View,
          { style: styles.infoRow },
          React.createElement(Text, { style: { ...styles.infoLabel, width: "auto", marginRight: 8 } }, "•"),
          React.createElement(
            Text,
            { style: { ...styles.infoValue, color: "#5a6b7d", fontWeight: "400" } },
            "Review your policy details to ensure accuracy. Report any discrepancies immediately."
          )
        )
      ),

      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(Text, { style: styles.footerHighlight }, "This is an official policy document"),
        React.createElement(
          Text,
          { style: styles.footerText },
          `Document Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
        ),
        React.createElement(
          Text,
          { style: styles.footerText },
          "Secure Insurance Co. | Registration #: SIC-2024-001"
        ),
        React.createElement(
          Text,
          { style: { ...styles.footerText, marginTop: 8 } },
          "Support: support@secureinsurance.com | Phone: +260-123-456-7890 | Website: www.secureinsurance.co.zm"
        )
      )
    )
  )

  // Render PDF to buffer
  const pdfBuffer = await renderToBuffer(PolicyDocument)
  return Buffer.from(pdfBuffer)
}
