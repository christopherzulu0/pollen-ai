# Flow Diagram - Quick Reference Card

## 📋 Quick Stats
- **Total Modules**: 12
- **Flow Nodes**: 120+
- **Color Categories**: 11
- **Status Indicators**: 3 types
- **Version**: 2.0

## 🎨 Color Guide (At a Glance)

| Color | Module | Key Features |
|-------|--------|--------------|
| 🔵 | **Onboarding** | Clerk Auth, Sign Up/In |
| 🟢 | **Savings** | Auto AI Analysis, Goals |
| 🟠 | **Groups** | Max 2 Groups, 3 Privacy Levels |
| 🟣 | **Loans** | AI Loans, Aave DeFi, Institutional |
| 💧 | **Payments** | Send/Request/Bills, Transactions |
| 🟡 | **Credit** | AI Scoring (300-850) |
| 🌸 | **Blockchain** | Celo Network, Smart Contracts |
| 🔶 | **Admin** | Group Management |
| 🟪 | **Merchant** | Credit Approval, Product Sales |

## ⚡ Status Icons

| Icon | Meaning | Color |
|------|---------|-------|
| ✅ | Success | Green (Thick Border) |
| ⚠️ | Warning | Orange (Thick Border) |
| ❌ | Error | Red (Thick Border) |
| 🤖 | AI Action | Auto AI Analysis |
| 🔐 | Security | Encryption, Wallet |
| 📊 | Analytics | Score, Metrics |
| ⏳ | Pending | Awaiting Approval |

## 🔑 Key User Paths

### Path 1: First-Time User
```
Visit → Sign Up → Create Profile → AI Score → Dashboard
```

### Path 2: Start Saving
```
Dashboard → Savings → Create Goal → 🤖 Auto AI Analysis → Deposit
```

### Path 3: Join Group
```
Dashboard → Groups → Browse → Filter → Join → (Privacy) → Active
```

### Path 4: Get Loan
```
Dashboard → Loans → Choose Type → Apply → Approval → Get Funds → Repay
```

### Path 5: DeFi Loan
```
Dashboard → Loans → Aave → Setup Wallet → Deposit → Borrow → Repay
```

### Path 6: Merchant Purchase
```
Dashboard → Merchant → Buy Product → Credit Form → Credit Check → Approve → Sale
```

## 📊 AI Credit Score Factors

1. **Payment History** - 35%
2. **Savings Behavior** - 30%
3. **Group Activity** - 20%
4. **DeFi Usage** - 10%
5. **Account Age** - 5%

## 🔒 Group Privacy Levels

| Level | Join Method | Status |
|-------|-------------|--------|
| **PUBLIC** | Join instantly | ACTIVE immediately |
| **INVITE_ONLY** | Enter code | ACTIVE with valid code |
| **PRIVATE** | Request to join | PENDING → Admin approval |

## ⚠️ Important Limits

- **Max Groups**: 2 active groups per user
- **Credit Score**: 300-850 range
- **Score Categories**: 
  - Excellent: 750-850
  - Good: 650-749
  - Fair: 550-649
  - Poor: 300-549

## 🛠️ Technical Stack (Quick)

```
Frontend:  Next.js 15 + React + TypeScript + Tailwind
Backend:   Next.js API Routes + Prisma ORM
Database:  PostgreSQL
Auth:      Clerk
AI:        OpenAI GPT-4
Blockchain: Celo + Ethers.js
DeFi:      Aave (Demo Mode)
State:     React Query
UI:        shadcn/ui
```

## 🎯 Features Status

### ✅ Live
- Clerk Authentication
- Auto AI Analysis
- AI Credit Scoring
- Groups (Max 2 Limit)
- Privacy Levels
- Wallet Setup
- Aave Demo Mode
- React Query
- Toast Notifications
- Responsive Design
- Multi-language

### 🚧 In Progress
- AI Loan Applications
- Group Loan Voting
- Payment Processing
- Real Aave Integration

### 📋 Planned
- Institutional Loans
- Advanced Group Chat
- Knock Notifications

## 📁 Related Files

1. `flowdiagram.md` - Main flowchart
2. `FLOWDIAGRAM_GUIDE.md` - Comprehensive guide
3. `FLOWDIAGRAM_UPDATE_SUMMARY.md` - Update details
4. `AUTO_AI_ANALYSIS.md` - AI analysis docs
5. `GROUPS_API_DOCUMENTATION.md` - Groups API
6. `AAVE_LOAN_SYSTEM.md` - Aave integration

## 🔗 View the Diagram

1. **GitHub**: Push and view (renders automatically)
2. **Mermaid Live**: https://mermaid.live
3. **VS Code**: Install Mermaid extension
4. **Notion/Obsidian**: Native support

## 💡 Pro Tips

1. **Color Scanning**: Quickly identify which module you're in
2. **Follow Arrows**: Solid arrows = flow, dotted = data updates
3. **Thick Borders**: Status indicators (success/warning/error)
4. **Emoji Markers**: 🤖 = AI, 🔐 = Security, 📊 = Analytics
5. **Subgraphs**: Group related actions together

## 🎓 Use Cases

- **Developers**: System understanding, integration points
- **PMs**: Feature relationships, user stories
- **Designers**: User paths, UX consistency
- **QA**: Test scenario planning
- **Stakeholders**: Progress visualization

---

**Quick Tip**: Start from the top (Visit Platform) and follow the colored paths to understand each module's flow!

**Version**: 2.0 | **Last Updated**: December 2024

