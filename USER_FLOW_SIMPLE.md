# User Flow Diagrams - Dashboard & Services

## Services Page User Flow

```mermaid
flowchart TD
    Start([User Visits Services Page]) --> ViewServices[Browse Services]
    
    ViewServices --> SelectService{Choose Service}
    SelectService -->|Digital Loans| DigitalLoan[View Digital Loan Details]
    SelectService -->|Village Banking| VillageBanking[View Village Banking]
    SelectService -->|Crypto Loans via Aave| CryptoLoan[View Aave DeFi Loans]
    SelectService -->|Institution Banking| InstitutionLoan[View Institution Banking]
    
    DigitalLoan --> ViewFeatures[View Features:<br/>- AI-Powered Credit Scoring<br/>- Blockchain Transparency<br/>- Smart Contract Loans]
    ViewFeatures --> UseLoanCalc[Use Loan Calculator]
    UseLoanCalc --> AIEstimate[AI Estimates Your Eligibility]
    AIEstimate --> ApplyLoan[Click Apply Now]
    
    VillageBanking --> ViewBlockchain[View Blockchain Benefits:<br/>- Immutable Records<br/>- Transparent Voting<br/>- Smart Contracts]
    ViewBlockchain --> ViewGroups[View Available Groups]
    ViewGroups --> ApplyLoan
    
    CryptoLoan --> ViewAaveInfo[Learn About Aave:<br/>- Supply & Earn Interest<br/>- Borrow Against Crypto<br/>- No Credit Checks<br/>- On Celo Blockchain]
    ViewAaveInfo --> ApplyLoan
    
    InstitutionLoan --> ViewAIScoring[AI Credit Scoring for Institutions]
    ViewAIScoring --> ApplyLoan
    
    ApplyLoan --> CheckAuth{Logged In?}
    CheckAuth -->|No| SignIn[Sign In/Sign Up]
    CheckAuth -->|Yes| CheckCreditScore[View Your AI Credit Score]
    
    SignIn --> CreateProfile[Create Profile]
    CreateProfile --> AIInitialScore[AI Generates Initial Score]
    AIInitialScore --> CheckCreditScore
    
    CheckCreditScore --> ApplicationForm[Fill Application Form]
    ApplicationForm --> AIPreApproval[AI Pre-Approval Analysis]
    AIPreApproval --> SubmitApp[Submit to Blockchain]
    SubmitApp --> Dashboard[Go to Dashboard]
```

## Dashboard User Flow

```mermaid
flowchart TD
    Start([User Logs In]) --> Dashboard[Dashboard Home]
    Dashboard --> ViewCreditScore[View AI Credit Score Widget]
    ViewCreditScore --> Dashboard
    
    Dashboard --> ChooseAction{What to Do?}
    
    %% Personal Savings Flow
    ChooseAction -->|Manage Savings| Savings[Personal Savings]
    Savings --> SavingsAction{Action}
    SavingsAction -->|Create Goal| NewGoal[Create Savings Goal]
    SavingsAction -->|Add Funds| AddFunds[Add Money to Goal]
    SavingsAction -->|View Progress| ViewProgress[Check Progress]
    NewGoal --> Dashboard
    AddFunds --> Dashboard
    ViewProgress --> Dashboard
    
    %% Groups Flow
    ChooseAction -->|Groups| Groups[Village Banking Groups]
    Groups --> GroupAction{Action}
    GroupAction -->|View My Groups| ViewGroup[View Group Details]
    GroupAction -->|Create Group| CreateGroup[Create New Group]
    GroupAction -->|Join Group| JoinGroup[Join Existing Group]
    
    ViewGroup --> GroupDetail[See Members & Contributions]
    GroupDetail --> Contribute[Make Contribution]
    Contribute --> Dashboard
    
    CreateGroup --> SetupGroup[Configure Group Settings]
    SetupGroup --> InviteMembers[Invite Members]
    InviteMembers --> Dashboard
    
    JoinGroup --> FindGroup[Browse or Enter Code]
    FindGroup --> RequestJoin[Request to Join]
    RequestJoin --> Dashboard
    
    %% Loans Flow
    ChooseAction -->|Loans| Loans[Loans]
    Loans --> CheckCreditScore[View AI Credit Score & Recommendations]
    CheckCreditScore --> LoanAction{Action}
    LoanAction -->|Request Loan| RequestLoan[Request Group Loan]
    LoanAction -->|Vote on Loan| VoteLoan[Vote on Pending Loans]
    LoanAction -->|View My Loans| MyLoans[View My Loan Status]
    LoanAction -->|DeFi Loan via Aave| AaveLoan[Explore Aave DeFi Loans]
    
    RequestLoan --> LoanForm[Fill Loan Details]
    LoanForm --> AIAnalysis[AI Analyzes Creditworthiness]
    AIAnalysis --> AIRecommendation[Get AI Loan Recommendation]
    AIRecommendation --> SubmitLoan[Submit Request to Blockchain]
    SubmitLoan --> BlockchainRecord[Record on Celo Blockchain]
    BlockchainRecord --> WaitVote[Wait for Group Votes]
    WaitVote --> LoanApproved{Approved?}
    LoanApproved -->|Yes| SmartContract[Create Smart Contract]
    SmartContract --> GetFunds[Receive Funds via Celo]
    LoanApproved -->|No| Dashboard
    GetFunds --> Repay[Make Repayments on Chain]
    Repay --> UpdateScore[AI Score Updates]
    UpdateScore --> Dashboard
    
    AaveLoan --> ConnectCelo[Connect Celo Wallet]
    ConnectCelo --> ViewAave[View Aave Lending Pools]
    ViewAave --> DepositCollateral[Deposit Crypto Collateral]
    DepositCollateral --> BorrowAave[Borrow via Aave]
    BorrowAave --> Dashboard
    
    VoteLoan --> ReviewLoan[Review Loan Request]
    ReviewLoan --> CastVote[Cast Vote & Comment]
    CastVote --> Dashboard
    
    MyLoans --> CheckStatus[Check Loan Status]
    CheckStatus --> Dashboard
    
    %% Payments Flow
    ChooseAction -->|Payments| Payments[Payments]
    Payments --> PaymentAction{Action}
    PaymentAction -->|Send Money| SendMoney[Send Money]
    PaymentAction -->|Request Money| RequestMoney[Request Money]
    PaymentAction -->|Pay Bill| PayBill[Pay Bill]
    
    SendMoney --> EnterDetails[Enter Recipient & Amount]
    EnterDetails --> ConfirmPay[Confirm Payment]
    ConfirmPay --> PaySuccess[Payment Successful]
    PaySuccess --> Dashboard
    
    RequestMoney --> RequestDetails[Enter Request Details]
    RequestDetails --> SendRequest[Send Request]
    SendRequest --> Dashboard
    
    PayBill --> SelectBill[Select Bill & Amount]
    SelectBill --> ConfirmPay
    
    %% Deposit/Withdraw Flow
    ChooseAction -->|Deposit/Withdraw| DepositWithdraw[Deposit or Withdraw]
    DepositWithdraw --> DWAction{Action}
    DWAction -->|Deposit| Deposit[Deposit Money]
    DWAction -->|Withdraw| Withdraw[Withdraw Money]
    
    Deposit --> DepositMethod[Choose Method: Mobile Money, Bank, Crypto]
    DepositMethod --> DepositAmount[Enter Amount]
    DepositAmount --> DepositConfirm[Complete Deposit]
    DepositConfirm --> Dashboard
    
    Withdraw --> WithdrawMethod[Choose Method]
    WithdrawMethod --> WithdrawAmount[Enter Amount]
    WithdrawAmount --> WithdrawConfirm[Complete Withdrawal]
    WithdrawConfirm --> Dashboard
    
    %% View Balances Flow
    ChooseAction -->|Check Balances| Balances[View Balances]
    Balances --> ViewBalance{View}
    ViewBalance -->|Personal| PersonalBal[Personal Wallet Balance]
    ViewBalance -->|Groups| GroupBal[All Group Balances]
    ViewBalance -->|Savings| SavingsBal[Savings Goals Balance]
    ViewBalance -->|Crypto| CryptoBal[Crypto Wallet Balance]
    ViewBalance -->|Aave Positions| AavePositions[Aave DeFi Positions]
    
    CryptoBal --> CryptoConnected{Wallet Connected?}
    CryptoConnected -->|No| ConnectWallet[Connect Celo Wallet]
    CryptoConnected -->|Yes| ViewCrypto[View CELO, cUSD, cEUR]
    ConnectWallet --> ViewCrypto
    ViewCrypto --> CeloActions[Celo Blockchain Actions]
    CeloActions --> Dashboard
    
    AavePositions --> ViewAaveBalance[View Supplied & Borrowed]
    ViewAaveBalance --> Dashboard
    
    PersonalBal --> Dashboard
    GroupBal --> Dashboard
    SavingsBal --> Dashboard
    
    %% Notifications Flow
    ChooseAction -->|Check Notifications| Notifications[Notifications]
    Notifications --> ViewNotif[View All Notifications]
    ViewNotif --> NotifAction[Click Notification]
    NotifAction --> TakeAction[Take Action or Mark Read]
    TakeAction --> Dashboard
    
    %% Settings Flow
    ChooseAction -->|Settings| Settings[Settings]
    Settings --> SettingOption{What to Change?}
    SettingOption -->|Profile| EditProfile[Edit Profile Info]
    SettingOption -->|Language| ChangeLanguage[Change Language]
    SettingOption -->|Theme| ToggleTheme[Toggle Dark/Light Mode]
    SettingOption -->|Security| Security[Security Settings]
    
    EditProfile --> SaveChanges[Save Changes]
    SaveChanges --> Dashboard
    ChangeLanguage --> Dashboard
    ToggleTheme --> Dashboard
    Security --> Dashboard
```

## Quick Actions Flow (From Dashboard)

```mermaid
flowchart TD
    Dashboard[Dashboard Home] --> QuickAction{Quick Action}
    
    QuickAction -->|Send Money| SendModal[Send Money Modal]
    SendModal --> EnterRecipient[Enter Recipient]
    EnterRecipient --> EnterAmount[Enter Amount]
    EnterAmount --> SendConfirm[Confirm & Send]
    SendConfirm --> Success[Success]
    Success --> Dashboard
    
    QuickAction -->|Request Money| RequestModal[Request Money Modal]
    RequestModal --> EnterRequester[Enter Details]
    EnterRequester --> RequestSend[Send Request]
    RequestSend --> Dashboard
    
    QuickAction -->|Add Money| AddModal[Add Money Modal]
    AddModal --> SelectMethod[Select Method]
    SelectMethod --> AddAmount[Enter Amount]
    AddAmount --> AddConfirm[Confirm]
    AddConfirm --> Dashboard
    
    QuickAction -->|Pay Bill| BillModal[Pay Bill Modal]
    BillModal --> SelectBiller[Select Biller]
    SelectBiller --> BillAmount[Enter Amount]
    BillAmount --> BillConfirm[Confirm]
    BillConfirm --> Dashboard
```

## Complete User Journey Map

```mermaid
flowchart LR
    A[Visit Website] --> B[Browse Services]
    B --> C[Sign Up/Login]
    C --> D[Dashboard]
    D --> E{Choose Activity}
    E -->|Save| F[Create Savings Goal]
    E -->|Join Community| G[Join/Create Group]
    E -->|Need Money| H[Request Loan]
    E -->|Transfer| I[Send/Receive Money]
    F --> J[Use Platform Regularly]
    G --> J
    H --> J
    I --> J
    J --> K[Achieve Financial Goals]
```

## Loan Request Journey (with AI Credit Scoring)

```mermaid
flowchart LR
    A[Need Money] --> B[Go to Loans Page]
    B --> C[View AI Credit Score]
    C --> D[Click New Loan Request]
    D --> E[Select Group]
    E --> F[Enter Amount & Purpose]
    F --> G[AI Analyzes Request]
    G --> H[Get Credit Assessment]
    H --> I[Set Repayment Terms]
    I --> J[Submit Request]
    J --> K[Recorded on Celo Blockchain]
    K --> L[Group Members Vote]
    L --> M{Vote Result}
    M -->|Approved| N[Smart Contract Created]
    N --> O[Receive Funds via Celo]
    M -->|Rejected| P[AI Suggests Improvements]
    O --> Q[Make Repayments]
    Q --> R[Payment Recorded on Chain]
    R --> S[AI Score Improves]
    S --> T[Loan Complete]
```

## Village Banking Journey

```mermaid
flowchart LR
    A[Want to Save in Group] --> B[Go to Groups]
    B --> C{Join or Create?}
    C -->|Join| D[Browse Groups]
    C -->|Create| E[Create New Group]
    D --> F[Request to Join]
    E --> G[Invite Members]
    F --> H[Get Approved]
    G --> H
    H --> I[Make Regular Contributions]
    I --> J[Attend Meetings]
    J --> K[Request Loans if Needed]
    K --> I
```

## Savings Goal Journey

```mermaid
flowchart LR
    A[Want to Save] --> B[Go to Personal Savings]
    B --> C[Create Goal]
    C --> D[Set Target & Deadline]
    D --> E[Make Regular Deposits]
    E --> F[Track Progress]
    F --> G{Goal Reached?}
    G -->|Yes| H[Withdraw or New Goal]
    G -->|No| E
```

---

## Key User Paths Summary

### 1. **New User → First Loan**
Visit Website → Browse Services → Sign Up → Dashboard → Loans → Request Loan → Get Approved → Receive Funds

### 2. **New User → Join Village Banking**
Visit Website → Sign Up → Dashboard → Groups → Browse Groups → Request to Join → Get Approved → Make Contributions

### 3. **Regular User → Daily Activity**
Login → Dashboard → Check Balances → View Notifications → Make Payment → Send Money → Check Savings Goals

### 4. **Group Member → Request Loan**
Dashboard → Loans → New Request → Select Group → Enter Details → Submit → Wait for Votes → Get Funds → Repay

### 5. **Group Member → Vote on Loan**
Dashboard → Notifications (New Loan Request) → Click Notification → Review Loan → Cast Vote → Done

### 6. **User → Manage Savings**
Dashboard → Personal Savings → Create Goal → Add Funds → Track Progress → Reach Goal

### 7. **User → DeFi Lending via Aave**
Dashboard → View Balances → Crypto Wallet → Connect Celo → Aave Pools → Supply Crypto → Earn Interest

### 8. **User → DeFi Borrowing via Aave**
Dashboard → Loans → Aave DeFi → Supply Collateral → Borrow Assets → Monitor Health Factor → Repay

### 9. **Credit Score Improvement Journey**
Make Deposits → Timely Contributions → On-time Repayments → AI Score Increases → Better Loan Terms → Higher Limits

---

## Complete Loan Flow with AI & Blockchain

```mermaid
flowchart TD
    Start([User Needs Loan]) --> CheckScore[Check AI Credit Score on Dashboard]
    CheckScore --> ScoreDisplay[Score: 300-850<br/>Score Factors Shown<br/>Improvement Tips]
    
    ScoreDisplay --> InitiateLoan[Click Request Loan]
    InitiateLoan --> ChooseLoanType{Loan Type}
    
    ChooseLoanType -->|Group Loan| GroupLoan[Group Village Banking Loan]
    ChooseLoanType -->|DeFi Loan| DeFiLoan[Aave DeFi Loan]
    
    %% Group Loan Path
    GroupLoan --> SelectGroup[Select Village Banking Group]
    SelectGroup --> FillDetails[Fill Loan Details:<br/>- Amount<br/>- Purpose<br/>- Repayment Terms]
    FillDetails --> AIAnalysis[AI Analyzes Request]
    
    AIAnalysis --> AIFactors[AI Considers:<br/>- Credit Score<br/>- Payment History<br/>- Group Standing<br/>- Debt-to-Income<br/>- Blockchain History]
    
    AIFactors --> AIRecommendation[AI Generates Recommendation]
    AIRecommendation --> ScoreImpact{Credit Score}
    
    ScoreImpact -->|700+| HighScore[AI Recommends APPROVAL<br/>Suggested Interest: 4-5%]
    ScoreImpact -->|550-699| MedScore[AI Recommends REVIEW<br/>Suggested Interest: 6-8%]
    ScoreImpact -->|<550| LowScore[AI Flags for SCRUTINY<br/>Suggested Interest: 10%+]
    
    HighScore --> SubmitToBlockchain
    MedScore --> SubmitToBlockchain
    LowScore --> SubmitToBlockchain
    
    SubmitToBlockchain[Submit to Celo Blockchain]
    SubmitToBlockchain --> CreateTx[Create Transaction on Celo]
    CreateTx --> BlockchainRecord[Immutable Record Created:<br/>- Loan Request ID<br/>- Timestamp<br/>- Amount & Terms<br/>- AI Score at Time<br/>- Hash]
    
    BlockchainRecord --> NotifyGroup[Notify Group Members]
    NotifyGroup --> DisplayAI[Show AI Recommendation to Voters]
    DisplayAI --> MemberVote[Members Vote with AI Context]
    
    MemberVote --> VoteOnChain[Votes Recorded on Blockchain]
    VoteOnChain --> TallyVotes[Tally Votes via Smart Contract]
    TallyVotes --> VoteResult{Result}
    
    VoteResult -->|Approved| CreateSmartContract[Create Loan Smart Contract]
    VoteResult -->|Rejected| RecordRejection[Record Rejection on Chain]
    
    CreateSmartContract --> ContractTerms[Smart Contract Contains:<br/>- Borrower Address<br/>- Amount<br/>- Interest Rate<br/>- Repayment Schedule<br/>- Auto-execute Penalties]
    
    ContractTerms --> DisburseFunds[Disburse Funds via Celo]
    DisburseFunds --> FundsInWallet[Funds in User's Celo Wallet]
    FundsInWallet --> ConvertCurrency[Convert cUSD to Fiat if Needed]
    
    ConvertCurrency --> RepaymentPhase[Repayment Phase Begins]
    RepaymentPhase --> RepaymentOptions{Payment Status}
    
    RepaymentOptions -->|On Time| OnTimePayment[Make On-Time Payment]
    RepaymentOptions -->|Late| LatePayment[Late Payment Penalty]
    RepaymentOptions -->|Missed| MissedPayment[Missed Payment]
    
    OnTimePayment --> PaymentToChain[Record Payment on Blockchain]
    PaymentToChain --> SmartContractUpdate[Smart Contract Updates]
    SmartContractUpdate --> AIScoreIncrease[AI Score Increases +10 to +50]
    AIScoreIncrease --> ScoreOnChain[New Score Recorded on Chain]
    ScoreOnChain --> ContinuePayments{Loan Paid Off?}
    
    LatePayment --> LatePenalty[Late Fee Applied by Smart Contract]
    LatePenalty --> AIScoreDecrease[AI Score Decreases -20]
    AIScoreDecrease --> PaymentToChain
    
    MissedPayment --> MissedPenalty[Missed Payment Penalty]
    MissedPenalty --> AIScoreDrop[AI Score Drops -50 to -100]
    AIScoreDrop --> AlertGroup[Alert Group Members]
    AlertGroup --> PaymentToChain
    
    ContinuePayments -->|No| RepaymentPhase
    ContinuePayments -->|Yes| LoanComplete[Loan Fully Repaid]
    
    LoanComplete --> FinalBlockchainUpdate[Final Update on Blockchain]
    FinalBlockchainUpdate --> ReleaseCollateral[Release Any Collateral]
    ReleaseCollateral --> MajorScoreBoost[AI Score Boost +100 to +200]
    MajorScoreBoost --> UnlockBenefits[Unlock Benefits:<br/>- Lower Rates for Next Loan<br/>- Higher Limits<br/>- Premium Features]
    UnlockBenefits --> BuildCreditHistory[Verifiable Credit History on Chain]
    
    RecordRejection --> AIFeedback[AI Provides Feedback:<br/>- Why Rejected<br/>- How to Improve<br/>- Alternative Options]
    AIFeedback --> MinorScorePenalty[Minor Score Impact -10]
    MinorScorePenalty --> TryAgain[Improve & Try Again]
    
    %% DeFi Loan Path
    DeFiLoan --> ConnectCeloWallet[Connect Celo Wallet]
    ConnectCeloWallet --> ViewAavePools[View Aave Lending Pools]
    ViewAavePools --> SelectCollateral[Select Crypto Collateral]
    SelectCollateral --> DepositCollateral[Deposit Collateral to Aave]
    DepositCollateral --> CheckBorrowPower[Check Borrowing Power]
    CheckBorrowPower --> SelectBorrowAsset[Select Asset to Borrow]
    SelectBorrowAsset --> BorrowFromAave[Borrow from Aave Pool]
    BorrowFromAave --> AaveSmartContract[Aave Smart Contract Executes]
    AaveSmartContract --> ReceiveBorrowedFunds[Receive Borrowed Funds]
    ReceiveBorrowedFunds --> MonitorHealth[Monitor Health Factor]
    MonitorHealth --> RepayAave[Repay to Aave When Ready]
    RepayAave --> ReclaimCollateral[Reclaim Collateral]
    ReclaimCollateral --> AIScoreAave[DeFi Activity Improves AI Score]
    AIScoreAave --> BuildCreditHistory
```

---

## AI Credit Scoring Flow

```mermaid
flowchart TD
    Start([User Signs Up]) --> InitialScore[AI Generates Initial Credit Score]
    InitialScore --> Factors[Based on:<br/>- Profile completeness<br/>- Identity verification<br/>- Initial deposits]
    
    Factors --> BaseScore[Base Credit Score: 300-850]
    BaseScore --> Dashboard[Score Displayed on Dashboard]
    
    Dashboard --> Activities{User Activities}
    
    Activities -->|Make Deposits| PosDeposit[+Points for Regular Deposits]
    Activities -->|Group Contributions| PosGroup[+Points for Timely Contributions]
    Activities -->|Loan Repayments| PosRepay[+Points for On-Time Repayments]
    Activities -->|Late Payments| NegLate[-Points for Late Payments]
    Activities -->|Defaults| NegDefault[-Severe Penalty for Defaults]
    
    PosDeposit --> AIUpdate[AI Updates Score in Real-Time]
    PosGroup --> AIUpdate
    PosRepay --> AIUpdate
    NegLate --> AIUpdate
    NegDefault --> AIUpdate
    
    AIUpdate --> RecordChain[Score History on Celo Blockchain]
    RecordChain --> NewScore[Updated Credit Score]
    
    NewScore --> Benefits{Score Benefits}
    Benefits -->|High Score 700+| HighBenefits[Benefits:<br/>- Lower Interest Rates<br/>- Higher Loan Limits<br/>- Faster Approvals<br/>- Premium Features]
    Benefits -->|Medium Score 550-699| MedBenefits[Benefits:<br/>- Standard Interest Rates<br/>- Moderate Loan Limits<br/>- Regular Approvals]
    Benefits -->|Low Score <550| LowBenefits[Limitations:<br/>- Higher Interest Rates<br/>- Lower Loan Limits<br/>- Requires More Votes<br/>- Improvement Tips]
    
    HighBenefits --> LoanRequest[When Requesting Loan]
    MedBenefits --> LoanRequest
    LowBenefits --> LoanRequest
    
    LoanRequest --> AIAssessment[AI Assesses Loan Request]
    AIAssessment --> ScoreCheck{Credit Score Check}
    ScoreCheck -->|Good Score| AutoRecommend[AI Recommends Approval]
    ScoreCheck -->|Fair Score| StandardProcess[Standard Voting Process]
    ScoreCheck -->|Low Score| ExtraScrutiny[Extra Group Scrutiny Required]
    
    AutoRecommend --> GroupVote[Group Votes with AI Recommendation]
    StandardProcess --> GroupVote
    ExtraScrutiny --> GroupVote
```

## Celo Blockchain Integration Flow

```mermaid
flowchart TD
    Start([User Action Requiring Blockchain]) --> CheckWallet{Celo Wallet Connected?}
    
    CheckWallet -->|No| ConnectPrompt[Prompt to Connect Wallet]
    ConnectPrompt --> WalletOptions{Wallet Type}
    WalletOptions -->|MetaMask| MetaMask[Connect via MetaMask]
    WalletOptions -->|Valora| Valora[Connect via Valora]
    WalletOptions -->|Celo Wallet| CeloWallet[Connect via Celo Wallet]
    
    MetaMask --> AuthWallet[Authenticate Wallet]
    Valora --> AuthWallet
    CeloWallet --> AuthWallet
    
    AuthWallet --> WalletConnected[Wallet Connected Successfully]
    WalletConnected --> StoreAddress[Store Celo Address in DB]
    
    CheckWallet -->|Yes| BlockchainAction{Select Action}
    StoreAddress --> BlockchainAction
    
    BlockchainAction -->|Loan Request| LoanOnChain[Create Loan Request Transaction]
    BlockchainAction -->|Contribution| ContribOnChain[Create Contribution Transaction]
    BlockchainAction -->|Repayment| RepayOnChain[Create Repayment Transaction]
    BlockchainAction -->|Send Money| SendOnChain[Create Send Transaction]
    
    LoanOnChain --> SmartContract[Deploy Smart Contract]
    SmartContract --> ContractDetails[Contract Contains:<br/>- Loan Amount<br/>- Interest Rate<br/>- Repayment Schedule<br/>- Parties Involved]
    ContractDetails --> SignTransaction[Sign Transaction]
    
    ContribOnChain --> SignTransaction
    RepayOnChain --> SignTransaction
    SendOnChain --> SignTransaction
    
    SignTransaction --> BroadcastTx[Broadcast to Celo Network]
    BroadcastTx --> Confirmation[Wait for Confirmation]
    Confirmation --> BlockConfirmed[Transaction Confirmed on Block]
    
    BlockConfirmed --> UpdateDB[Update Database]
    UpdateDB --> ImmutableRecord[Immutable Record on Blockchain]
    ImmutableRecord --> UserNotified[User Notified of Success]
    
    UserNotified --> TransparencyBenefits[Benefits:<br/>- Full Transparency<br/>- Cannot be Altered<br/>- Verifiable by All<br/>- Lower Fees<br/>- Fast Settlement]
```

## Aave DeFi Integration Flow

```mermaid
flowchart TD
    Start([User Wants DeFi Loan]) --> DeFiOption[Select DeFi Lending via Aave]
    DeFiOption --> CheckWallet{Celo Wallet Connected?}
    
    CheckWallet -->|No| ConnectWallet[Connect Celo Wallet]
    CheckWallet -->|Yes| ViewAave[View Aave Lending Pools]
    ConnectWallet --> ViewAave
    
    ViewAave --> AavePools[Available Pools:<br/>- CELO<br/>- cUSD<br/>- cEUR<br/>- Other Stablecoins]
    
    AavePools --> UserChoice{Choose Action}
    
    UserChoice -->|Supply/Lend| Supply[Supply Crypto to Pool]
    UserChoice -->|Borrow| Borrow[Borrow from Pool]
    UserChoice -->|View Positions| Positions[View My Positions]
    
    %% Supply Flow
    Supply --> SelectSupplyAsset[Select Asset to Supply]
    SelectSupplyAsset --> EnterSupplyAmount[Enter Amount]
    EnterSupplyAmount --> ApproveSupply[Approve Token Spending]
    ApproveSupply --> ConfirmSupply[Confirm Supply Transaction]
    ConfirmSupply --> SupplySuccess[Assets Supplied to Aave]
    SupplySuccess --> EarnInterest[Start Earning Interest]
    EarnInterest --> Dashboard
    
    %% Borrow Flow
    Borrow --> CheckCollateral{Have Collateral?}
    CheckCollateral -->|No| SupplyCollateral[First Supply Collateral]
    SupplyCollateral --> Borrow
    
    CheckCollateral -->|Yes| ViewBorrowPower[View Borrowing Power]
    ViewBorrowPower --> SelectBorrowAsset[Select Asset to Borrow]
    SelectBorrowAsset --> EnterBorrowAmount[Enter Borrow Amount]
    EnterBorrowAmount --> ViewTerms[View Terms:<br/>- Interest Rate<br/>- Liquidation Threshold<br/>- Health Factor]
    
    ViewTerms --> SafetyCheck{Health Factor > 1.5?}
    SafetyCheck -->|No| Warning[⚠️ Warning: Risk of Liquidation]
    SafetyCheck -->|Yes| ConfirmBorrow[Confirm Borrow Transaction]
    Warning --> AdjustAmount[Adjust Amount]
    AdjustAmount --> EnterBorrowAmount
    
    ConfirmBorrow --> BorrowSuccess[Assets Borrowed from Aave]
    BorrowSuccess --> ReceiveFunds[Receive Funds in Wallet]
    ReceiveFunds --> MonitorHealth[Monitor Health Factor]
    MonitorHealth --> Dashboard
    
    %% View Positions
    Positions --> ViewSupplied[View Supplied Assets & Interest Earned]
    Positions --> ViewBorrowed[View Borrowed Assets & Interest Owed]
    Positions --> ViewHealthFactor[View Health Factor]
    
    ViewSupplied --> PositionActions{Actions}
    ViewBorrowed --> PositionActions
    ViewHealthFactor --> PositionActions
    
    PositionActions -->|Repay| RepayDebt[Repay Borrowed Amount]
    PositionActions -->|Withdraw| WithdrawSupply[Withdraw Supplied Assets]
    PositionActions -->|Add Collateral| AddCollateral[Supply More Collateral]
    
    RepayDebt --> ImproveHealth[Health Factor Improves]
    AddCollateral --> ImproveHealth
    ImproveHealth --> Dashboard
    
    WithdrawSupply --> WithdrawSuccess[Assets Withdrawn]
    WithdrawSuccess --> Dashboard
```

## AI Credit Score Factors

### Positive Factors (Increase Score)
1. **Payment History (35%)**
   - On-time loan repayments
   - Regular group contributions
   - Consistent deposits

2. **Credit Utilization (30%)**
   - Low loan-to-savings ratio
   - Multiple active savings goals
   - Diversified financial activities

3. **Account Age (15%)**
   - Length of time on platform
   - Consistent activity over time
   - Long-term memberships

4. **Financial Behavior (10%)**
   - Group participation
   - Meeting attendance
   - Helping other members (votes)

5. **Blockchain Verification (10%)**
   - Verified transactions on-chain
   - Smart contract compliance
   - Transparent financial history

### Negative Factors (Decrease Score)
1. **Late Payments** (-50 to -100 points)
2. **Defaults** (-150 to -300 points)
3. **Missed Group Contributions** (-20 to -50 points)
4. **High Debt-to-Income Ratio** (limits increases)
5. **Recent Loan Rejections** (-10 points)

## Blockchain Benefits

### For Users
- **Transparency**: All transactions visible and verifiable
- **Security**: Immutable records prevent fraud
- **Lower Fees**: No intermediaries
- **Fast Settlement**: Near-instant confirmations
- **Accessibility**: Financial services for unbanked
- **Portable Credit**: Credit history moves with you

### For Groups
- **Trust**: Cannot manipulate records
- **Automation**: Smart contracts auto-execute
- **Reduced Disputes**: Clear transaction history
- **Compliance**: Automatic record-keeping
- **Governance**: On-chain voting mechanisms

## Aave Benefits

### As a Lender (Supplying)
- **Earn Passive Income**: Interest on supplied assets
- **Flexible Withdrawals**: Remove funds anytime
- **Low Risk**: Overcollateralized system
- **Multiple Assets**: Support for various tokens

### As a Borrower
- **Keep Your Crypto**: Don't sell during market dips
- **No Credit Checks**: DeFi is permissionless
- **Competitive Rates**: Market-driven interest rates
- **Flexible Repayment**: Pay back when you want
- **Flash Loans**: Advanced DeFi strategies

## System Integration Architecture

```mermaid
flowchart TD
    User([User]) --> Frontend[Pollen Web Frontend]
    
    Frontend --> Backend[Backend API]
    Backend --> Database[(PostgreSQL Database)]
    
    Backend --> AIService[AI Credit Scoring Engine]
    AIService --> OpenAI[OpenAI API]
    AIService --> MLModel[Machine Learning Models]
    
    Backend --> BlockchainService[Blockchain Service]
    BlockchainService --> Celo[Celo Blockchain Network]
    Celo --> SmartContracts[Smart Contracts]
    
    BlockchainService --> AaveProtocol[Aave Protocol on Celo]
    AaveProtocol --> LendingPools[Aave Lending Pools]
    
    Backend --> Auth[Clerk Authentication]
    Backend --> Notifications[Knock Labs Notifications]
    Backend --> Storage[UploadThing File Storage]
    
    SmartContracts --> LoanContract[Loan Smart Contracts]
    SmartContracts --> GroupContract[Group Governance Contracts]
    SmartContracts --> VotingContract[Voting Smart Contracts]
    
    AIService --> ScoreCalculation[Real-time Score Calculation]
    ScoreCalculation --> FactorAnalysis[Analyze:<br/>- Payment History<br/>- Transaction Patterns<br/>- Group Participation<br/>- Blockchain Activity]
    
    FactorAnalysis --> RiskAssessment[Risk Assessment]
    RiskAssessment --> RecommendationEngine[Loan Recommendation Engine]
    
    Celo --> TransactionLog[Immutable Transaction Log]
    TransactionLog --> AuditTrail[Audit Trail for Compliance]
    
    LendingPools --> InterestRates[Dynamic Interest Rates]
    LendingPools --> CollateralMgmt[Collateral Management]
    LendingPools --> Liquidation[Automated Liquidation]
```

## AI Credit Score Calculation Method

```mermaid
flowchart LR
    A[User Activity Data] --> B[Data Collection]
    B --> C[Feature Engineering]
    C --> D[ML Model Processing]
    D --> E[Score Generation: 300-850]
    
    F[Blockchain Data] --> B
    G[Transaction History] --> B
    H[Group Participation] --> B
    I[Payment Behavior] --> B
    
    E --> J[Weight Factors]
    J --> K[Payment History: 35%]
    J --> L[Credit Utilization: 30%]
    J --> M[Account Age: 15%]
    J --> N[Financial Behavior: 10%]
    J --> O[Blockchain Verification: 10%]
    
    K --> P[Final AI Credit Score]
    L --> P
    M --> P
    N --> P
    O --> P
    
    P --> Q[Record on Celo Blockchain]
    Q --> R[Update User Dashboard]
```

## Smart Contract Loan Lifecycle

```mermaid
flowchart TD
    Request[Loan Request Submitted] --> Deploy[Deploy Loan Smart Contract]
    Deploy --> Initialize[Initialize Contract with:<br/>- Borrower Address<br/>- Lender Addresses Group<br/>- Loan Amount<br/>- Interest Rate<br/>- Payment Schedule<br/>- Penalties]
    
    Initialize --> Vote[Group Voting Period]
    Vote --> Threshold{Voting Threshold Met?}
    Threshold -->|No| Rejected[Contract Cancelled]
    Threshold -->|Yes| Approved[Contract Activated]
    
    Approved --> Disbursement[Disburse Function Called]
    Disbursement --> TransferFunds[Transfer cUSD to Borrower]
    TransferFunds --> ActiveLoan[Loan Status: ACTIVE]
    
    ActiveLoan --> Monitor[Monitor Repayments]
    Monitor --> PaymentDue{Payment Due?}
    
    PaymentDue -->|Yes| CheckPayment{Payment Made?}
    CheckPayment -->|Yes| ProcessPayment[Process Payment]
    ProcessPayment --> UpdateContract[Update Contract State]
    UpdateContract --> AIUpdate[Update AI Credit Score +]
    
    CheckPayment -->|No, Within Grace| GracePeriod[Grace Period Active]
    GracePeriod --> CheckPayment
    
    CheckPayment -->|No, Past Grace| ApplyPenalty[Apply Late Penalty]
    ApplyPenalty --> AIDecrease[Decrease AI Credit Score -]
    AIDecrease --> NotifyBorrower[Notify Borrower & Group]
    NotifyBorrower --> CheckPayment
    
    AIUpdate --> CheckComplete{Fully Repaid?}
    CheckComplete -->|No| Monitor
    CheckComplete -->|Yes| CompleteLoan[Mark Loan as COMPLETED]
    
    CompleteLoan --> FinalUpdate[Final Contract Update]
    FinalUpdate --> ReleaseGuarantee[Release Group Guarantee]
    ReleaseGuarantee --> ScoreBoost[Major AI Score Boost +100]
    ScoreBoost --> ArchiveContract[Archive Contract on Chain]
```

## Aave Integration Technical Flow

```mermaid
flowchart TD
    User[User Connects Wallet] --> Interface[Pollen Web Aave Interface]
    Interface --> AaveContract[Aave Protocol Contract]
    
    AaveContract --> Action{User Action}
    
    Action -->|Supply| SupplyFlow[Supply Flow]
    SupplyFlow --> ApproveToken[Approve Token Spending]
    ApproveToken --> DepositToken[Deposit Token to Pool]
    DepositToken --> MintAToken[Mint aToken Receipt]
    MintAToken --> AccrueInterest[Start Accruing Interest]
    
    Action -->|Borrow| BorrowFlow[Borrow Flow]
    BorrowFlow --> CheckCollateral[Check Collateral Value]
    CheckCollateral --> CalculatePower[Calculate Borrow Power]
    CalculatePower --> HealthFactor[Calculate Health Factor]
    HealthFactor --> AllowBorrow{Health Factor > 1?}
    AllowBorrow -->|Yes| ExecuteBorrow[Execute Borrow]
    AllowBorrow -->|No| RejectBorrow[Reject: Insufficient Collateral]
    ExecuteBorrow --> TransferBorrowed[Transfer Borrowed Asset]
    TransferBorrowed --> AccrueDebt[Start Accruing Debt]
    
    AccrueInterest --> MonitorPosition[Monitor Position]
    AccrueDebt --> MonitorPosition
    
    MonitorPosition --> CheckHealth{Health Factor}
    CheckHealth -->|> 1.5| Safe[Position Safe]
    CheckHealth -->|1.0 - 1.5| Warning[⚠️ Warning Zone]
    CheckHealth -->|< 1.0| Liquidate[Liquidation Triggered]
    
    Liquidate --> LiquidationBot[Liquidation Bot Called]
    LiquidationBot --> SellCollateral[Sell Collateral]
    SellCollateral --> RepayDebt[Repay Debt]
    RepayDebt --> LiquidationPenalty[Liquidation Penalty Applied]
    
    Action -->|Repay| RepayFlow[Repay Flow]
    RepayFlow --> SelectRepayAmount[Select Repay Amount]
    SelectRepayAmount --> ApproveRepayToken[Approve Token]
    ApproveRepayToken --> ExecuteRepay[Execute Repayment]
    ExecuteRepay --> BurnDebtToken[Burn Debt Token]
    BurnDebtToken --> UpdateHealth[Update Health Factor]
    UpdateHealth --> Safe
    
    Action -->|Withdraw| WithdrawFlow[Withdraw Flow]
    WithdrawFlow --> CheckUtilization[Check Pool Utilization]
    CheckUtilization --> AllowWithdraw{Liquidity Available?}
    AllowWithdraw -->|Yes| BurnAToken[Burn aToken]
    AllowWithdraw -->|No| WaitLiquidity[Wait for Liquidity]
    BurnAToken --> TransferPrincipal[Transfer Principal + Interest]
    TransferPrincipal --> WithdrawComplete[Withdrawal Complete]
```

## Data Flow: AI Score Update

1. **Event Occurs** (Payment made, contribution added, etc.)
2. **Captured in Database** (PostgreSQL records transaction)
3. **Blockchain Verification** (Transaction confirmed on Celo)
4. **AI Engine Triggered** (Event listener activates)
5. **Factor Analysis** (Analyze impact on credit score)
6. **Score Calculation** (ML model processes data)
7. **New Score Generated** (Updated score: 300-850)
8. **Blockchain Recording** (New score hash stored on-chain)
9. **Database Update** (PostgreSQL updated with new score)
10. **User Notification** (Real-time notification via Knock Labs)
11. **Dashboard Refresh** (UI updates with new score)

## Security & Privacy

### AI Credit Scoring
- **Privacy-Preserving**: Only aggregated metrics stored on-chain
- **Transparent Factors**: Users see what affects their score
- **Appeal Process**: Users can dispute incorrect data
- **Regular Audits**: ML model fairness checks

### Blockchain Security
- **Encryption**: Sensitive data encrypted before storage
- **Access Control**: Role-based permissions
- **Immutability**: Transaction history cannot be altered
- **Verification**: All parties can verify transactions

### Aave Integration
- **Non-Custodial**: Users control their keys
- **Smart Contract Audits**: Aave contracts are audited
- **Oracle Security**: Chainlink price feeds used
- **Automated Risk Management**: Liquidations prevent bad debt

## Mobile vs Desktop Navigation

### Mobile
- Bottom Navigation Bar
- Hamburger Menu
- Floating Action Button (FAB)
- Swipeable Cards

### Desktop
- Left Sidebar (Always Visible)
- Top Navigation Bar
- Dropdown Menus
- Grid Layouts

---

## Key Features Summary

### 🤖 AI Credit Scoring
- **Real-time Score Updates**: Score updates immediately after activities
- **Transparent Factors**: Users see exactly what affects their score
- **Personalized Recommendations**: AI suggests optimal loan amounts and terms
- **Risk Assessment**: Automated risk analysis for loan requests
- **Score Range**: 300-850 (similar to traditional FICO scores)
- **Blockchain Verified**: Score history immutably stored on-chain
- **Improvement Path**: Clear guidance on how to improve score

### ⛓️ Celo Blockchain Integration
- **Immutable Records**: All transactions permanently recorded
- **Smart Contracts**: Automated loan execution and repayment
- **Transparency**: Full transaction visibility for all parties
- **Low Fees**: Minimal gas fees on Celo network
- **Fast Settlement**: Near-instant transaction confirmation
- **Mobile-First**: Optimized for mobile money integration
- **Stablecoin Support**: cUSD and cEUR for price stability
- **Governance**: On-chain voting for group decisions

### 🏦 Aave DeFi Integration
- **Decentralized Lending**: Permissionless borrowing and lending
- **Earn Interest**: Supply crypto and earn passive income
- **Borrow Against Crypto**: Keep crypto while accessing liquidity
- **No Credit Checks**: DeFi is permissionless and accessible to all
- **Flexible Terms**: Borrow and repay on your schedule
- **Multiple Assets**: Support for CELO, cUSD, cEUR, and more
- **Risk Management**: Automated liquidations protect the protocol
- **Health Factor Monitoring**: Real-time position health tracking
- **Flash Loans**: Advanced DeFi strategies for power users

### 💡 Innovation Benefits
1. **Financial Inclusion**: Serve the unbanked with blockchain identity
2. **Credit Building**: Build verifiable credit history on-chain
3. **Lower Costs**: Blockchain reduces intermediary fees
4. **Faster Processing**: Automated smart contracts speed up approvals
5. **Global Access**: Borderless financial services
6. **Data Ownership**: Users control their financial data
7. **Fraud Prevention**: Immutable records prevent manipulation
8. **Community Trust**: Transparent operations build confidence

### 🎯 User Benefits
- **Better Rates**: High credit scores = lower interest rates
- **Higher Limits**: Proven track record = larger loan amounts
- **Instant Approvals**: AI pre-approval speeds up process
- **Multiple Options**: Traditional groups + DeFi lending
- **Portable Credit**: Blockchain credit moves with you
- **Passive Income**: Earn interest on crypto holdings
- **Financial Education**: AI provides personalized tips
- **Community Support**: Village banking + modern tech

---

## Technology Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend
- Next.js API Routes
- PostgreSQL (Neon)
- Prisma ORM
- Clerk Authentication

### AI/ML
- OpenAI API
- Custom ML Models
- Real-time Scoring Engine
- Sentiment Analysis

### Blockchain
- Celo Network
- Solidity Smart Contracts
- Ethers.js
- ContractKit

### DeFi
- Aave Protocol v3
- Lending Pools
- Flash Loans
- Liquidation Engine

### Integrations
- Knock Labs (Notifications)
- Vapi AI (Voice Navigation)
- UploadThing (File Storage)
- Mobile Money APIs

---

## Future Enhancements

### AI Features
- **Predictive Analytics**: Forecast loan repayment probability
- **Personalized Offers**: Tailored loan products based on behavior
- **Fraud Detection**: AI-powered fraud prevention
- **Chatbot Support**: AI assistant for financial advice

### Blockchain Features
- **Cross-Chain Support**: Expand to Ethereum, Polygon, etc.
- **NFT Collateral**: Use NFTs as loan collateral
- **DAO Governance**: Decentralized platform governance
- **Yield Farming**: Additional DeFi earning strategies

### DeFi Features
- **More Protocols**: Integrate Compound, Uniswap, etc.
- **Liquidity Mining**: Earn rewards for providing liquidity
- **Staking**: Stake platform tokens for benefits
- **Insurance**: DeFi insurance for loan protection

---

This comprehensive user flow now includes **AI Credit Scoring**, **Celo Blockchain**, and **Aave DeFi** integration throughout the platform! 🚀

