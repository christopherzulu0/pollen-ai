# Pollen Platform - Flow Diagram Guide

## 📊 Overview

The `flowdiagram.md` file contains a comprehensive Mermaid flowchart that visualizes the complete user journey through the Pollen platform, including all implemented features and planned functionality.

## 🎨 How to View the Diagram

### Option 1: GitHub (Recommended)
1. Push the `flowdiagram.md` file to GitHub
2. View it directly on GitHub (GitHub renders Mermaid diagrams automatically)

### Option 2: Mermaid Live Editor
1. Visit [mermaid.live](https://mermaid.live)
2. Copy and paste the contents of `flowdiagram.md`
3. The diagram will render interactively

### Option 3: VS Code Extensions
1. Install "Markdown Preview Mermaid Support" extension
2. Open `flowdiagram.md`
3. Use `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac) to preview

### Option 4: Notion, Obsidian, or other Markdown editors
Most modern markdown editors support Mermaid diagrams natively.

## 🎯 Diagram Structure

The flowchart is organized into **11 major modules**:

### 1. **Authentication Module** 🔵 (Blue)
- Sign Up / Sign In with Clerk
- Automatic user profile creation
- Initial AI credit score generation

### 2. **Personal Savings Module** 🟢 (Green)
- Create savings goals
- **Automatic AI analysis** on goal creation and changes
- Track progress and timeline
- View transaction history
- Complete goals and withdraw funds

### 3. **Village Banking Groups Module** 🟠 (Orange)
- **Maximum 2 groups per user** (enforced limit)
- Three privacy levels:
  - **PUBLIC**: Join instantly
  - **INVITE_ONLY**: Requires invitation code
  - **PRIVATE**: Requires admin approval
- Group contributions and balance tracking
- Group loan requests with member voting
- Group meetings and chat

### 4. **AI-Powered Loans Module** 🟣 (Purple)
- View AI credit score (300-850 range)
- Score breakdown by 5 factors:
  - Payment History (35%)
  - Savings Behavior (30%)
  - Group Activity (20%)
  - DeFi Usage (10%)
  - Account Age (5%)
- AI pre-approval system
- Community voting on loans
- Repayment tracking with score updates

### 5. **Aave DeFi Loans Module** 🟣 (Purple)
- Celo wallet setup (generate or import)
- **Demo Mode** with mock data (Aave V3 not yet on Celo)
- View lending pools and positions
- Deposit collateral
- Borrow assets
- Monitor health factor
- Repay and withdraw

### 6. **Institutional Loans Module** 🟣 (Purple)
- Planned feature
- Partner bank integrations
- Traditional loan applications

### 7. **Payments & Transactions Module** 💧 (Cyan)
- Send money
- Request money
- Pay bills
- Transaction processing via Celo blockchain

### 8. **Account & Profile Module** 💧 (Cyan)
- View/edit profile
- View all balances (savings, groups, loans)
- Transaction history
- Notifications
- Settings (language, security)

### 9. **AI Credit Scoring Module** 🟡 (Yellow)
- Real-time credit score dashboard
- Score categories:
  - **Excellent**: 750-850
  - **Good**: 650-749
  - **Fair**: 550-649
  - **Poor**: 300-549
- AI-powered recommendations
- Credit history tracking

### 10. **Blockchain Integration** 🌸 (Lavender)
- Celo network integration
- Smart contracts for loans and group savings
- Immutable transaction log
- Blockchain verification

### 11. **Group Admin Functions** 🔶 (Coral)
- Admin dashboard
- Review membership requests
- Approve/reject members
- Review loan requests
- View group finances
- Send notifications

### 12. **Merchant Credit Approval** 🟪 (Deep Purple)
- Product purchase workflow
- Credit application submission
- Sales team consultation
- **AI Credit Score Integration** (uses user's AI credit score)
- Accounts receivable balance checking
- Credit terms calculation
- Automated approval/rejection
- Management oversight
- Credit report generation

## 🎨 Color Legend

| Color | Module | Description |
|-------|--------|-------------|
| 🔵 **Blue** | Onboarding | Authentication, Sign Up/In, Initial Setup |
| 🟢 **Green** | Savings | Personal Savings Goals, AI Analysis, Deposits |
| 🟠 **Orange** | Village Banking | Groups, Contributions, Group Loans |
| 🟣 **Purple** | Loans | AI Loans, Aave DeFi, Institutional Loans |
| 💧 **Cyan** | Payments | Transactions, Transfers, Bills, Account Info |
| 🟡 **Yellow** | Credit | AI Credit Scoring, Score Improvement |
| 🌸 **Lavender** | Blockchain | Celo Network, Smart Contracts |
| 🔶 **Coral** | Admin | Group Administration, Member Management |
| 🟪 **Deep Purple** | Merchant | Credit Approval, Product Purchases, Sales |

### Status Indicators

| Color | Status | Examples |
|-------|--------|----------|
| ✅ **Green (Thick)** | Success | Completed Actions, Approvals, Funds Received |
| ⚠️ **Orange (Thick)** | Warning | Limits Reached, Pending Approval, Demo Mode |
| ❌ **Red (Thick)** | Error | Failed Payments, Rejected Requests |

## 🔄 Key User Flows

### Flow 1: New User Onboarding
```
Visit Platform → Sign Up → Create Profile → AI Initial Score → Dashboard
```

### Flow 2: Create Savings Goal
```
Dashboard → Savings → Create Goal → Auto AI Analysis → View Insights → Deposit Funds
```

### Flow 3: Join a Group
```
Dashboard → Groups → Browse → Filter → View Details → Join → (Privacy Check) → Membership Active
```

### Flow 4: Request AI Loan
```
Dashboard → Loans → AI Loan → Check Score → Fill Application → AI Analysis → Submit → Vote → Get Funds → Repay
```

### Flow 5: Aave DeFi Loan
```
Dashboard → Loans → Aave → Setup Wallet → View Pools → Deposit Collateral → Borrow → Monitor → Repay → Withdraw
```

### Flow 6: Merchant Purchase with Credit
```
Dashboard → Merchant Purchases → Buy Product → Submit Credit Form → Sales Call → Order Entry → AI Credit Check → (Approved) → Calculate Terms → Sale Approved
```

## 🚀 Features Status

### ✅ Fully Implemented
- ✅ Clerk Authentication
- ✅ Personal Savings with Auto AI Analysis
- ✅ AI Credit Scoring (300-850)
- ✅ Village Banking Groups (Max 2 limit)
- ✅ Group Privacy Levels
- ✅ Membership Approval Workflow
- ✅ Wallet Setup (Generate/Import)
- ✅ Aave Integration (Demo Mode)
- ✅ React Query with Optimistic Updates
- ✅ Toast Notifications
- ✅ Responsive Design
- ✅ Multi-language Support

### 🚧 In Progress
- 🚧 AI-Powered Loan Applications
- 🚧 Group Loan Voting System
- 🚧 Payment Processing
- 🚧 Real Aave V3 Integration (waiting for Celo deployment)

### 📋 Planned
- 📋 Institutional Loan Partnerships
- 📋 Advanced Group Chat
- 📋 Knock Labs Notifications
- 📋 More DeFi Integrations

## 📝 Technical Implementation

### Frontend
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **State**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Clerk
- **AI**: OpenAI GPT-4

### Blockchain
- **Network**: Celo
- **Library**: Ethers.js
- **DeFi**: Aave Protocol (Demo Mode)

## 🔍 Understanding the Diagram

### Symbols
- `([Rounded])` - Entry/Exit points
- `[Rectangle]` - Process/Action
- `{Diamond}` - Decision point
- `-->` - Flow direction
- `-.->` - Data flow/Update
- `subgraph` - Module grouping

### Reading Tips
1. **Start** at the top with "Visit Pollen Platform"
2. **Follow arrows** to see the flow
3. **Decision diamonds** show branching logic
4. **Colors** indicate which module you're in
5. **Emoji indicators** show status (✅/⚠️/❌)

## 🎯 Use Cases

### For Developers
- Understand complete user journey
- Identify integration points
- Plan new features
- Debug user flow issues
- Onboard new team members

### For Product Managers
- Visualize feature relationships
- Plan user stories
- Identify gaps in functionality
- Communicate with stakeholders

### For Designers
- Understand user paths
- Design consistent experiences
- Identify UI/UX improvement areas

### For Stakeholders
- High-level platform overview
- Feature completeness assessment
- Progress tracking

## 📊 Metrics & Analytics Points

The flowchart highlights key points for analytics tracking:

1. **Conversion Funnels**
   - Sign Up → Profile → First Savings Goal
   - Browse Groups → Join → First Contribution
   - View Loans → Apply → Approval

2. **Drop-off Points**
   - Wallet setup abandonment
   - Loan application incompletion
   - Group join cancellation

3. **Success Metrics**
   - Goals completed
   - Groups joined
   - Loans repaid
   - Credit score improvements

## 🔄 Keeping the Diagram Updated

When adding new features:

1. **Identify the module** the feature belongs to
2. **Add nodes** with appropriate colors
3. **Connect flows** with arrows
4. **Update the legend** if adding new categories
5. **Update this guide** with new flow descriptions

## 📚 Related Documentation

- `AUTO_AI_ANALYSIS.md` - Automatic AI analysis for savings goals
- `GROUPS_API_DOCUMENTATION.md` - Groups API endpoints and usage
- `AAVE_LOAN_SYSTEM.md` - Aave DeFi loan implementation
- `SEED_GROUPS_README.md` - Sample groups and database seeding
- `COLOR_SCHEME_UPDATES.md` - UI color scheme and theming

## 🎓 Learning Resources

### Mermaid Syntax
- [Mermaid Documentation](https://mermaid.js.org/)
- [Flowchart Guide](https://mermaid.js.org/syntax/flowchart.html)

### Platform Architecture
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Celo Docs](https://docs.celo.org/)

---

**Last Updated**: December 2024  
**Version**: 2.0  
**Maintained By**: Pollen Platform Development Team

