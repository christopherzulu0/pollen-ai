# Loan System Documentation

This document explains the loan system implementation, including the database schema and API endpoints.

## Database Schema

### LoanRequest Model

The `LoanRequest` model represents a loan request made by a user to a group. It includes the following fields:

```prisma
model LoanRequest {
  id                String            @id @default(cuid())
  amount            Decimal
  purpose           String            @db.Text
  repaymentDate     DateTime
  repaymentTerms    String            @db.Text
  installments      Int               @default(1)
  interestRate      Decimal           @default(0)
  status            LoanStatus        @default(PENDING)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  userId            String
  user              User              @relation("UserLoanRequests", fields: [userId], references: [id], onDelete: Cascade)
  groupId           String
  group             Group             @relation("GroupLoanRequests", fields: [groupId], references: [id], onDelete: Cascade)
  transactions      Transaction[]
  votes             LoanVote[]        @relation("LoanRequestVotes")
}
```

### LoanVote Model

The `LoanVote` model represents a vote cast by a group member on a loan request. It includes the following fields:

```prisma
model LoanVote {
  id                String            @id @default(cuid())
  vote              Boolean           // true = approve, false = reject
  comment           String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  userId            String
  user              User              @relation("UserLoanVotes", fields: [userId], references: [id], onDelete: Cascade)
  loanRequestId     String
  loanRequest       LoanRequest       @relation("LoanRequestVotes", fields: [loanRequestId], references: [id], onDelete: Cascade)
  membershipId      String
  membership        Membership        @relation("MembershipLoanVotes", fields: [membershipId], references: [id], onDelete: Cascade)

  @@unique([userId, loanRequestId])
}
```

### LoanStatus Enum

The `LoanStatus` enum represents the possible states of a loan request:

```prisma
enum LoanStatus {
  PENDING
  APPROVED
  REJECTED
  DISBURSED
  REPAYING
  REPAID
  DEFAULTED
}
```

### Additional Changes

1. Added new transaction types for loan operations:
   ```prisma
   enum TransactionType {
     // Existing types...
     LOAN_DISBURSEMENT
     LOAN_REPAYMENT
   }
   ```

2. Added new notification types for loan operations:
   ```prisma
   enum NotificationType {
     // Existing types...
     LOAN_REQUEST
     LOAN_APPROVED
     LOAN_REJECTED
     LOAN_REPAYMENT_DUE
   }
   ```

3. Added relations to existing models:
   - User model: Added relations to LoanRequest and LoanVote
   - Group model: Added relation to LoanRequest
   - Membership model: Added relation to LoanVote
   - Transaction model: Added relation to LoanRequest
   - Notification model: Added relatedLoanRequestId field

## API Endpoints

### POST /api/loans

Creates a new loan request.

**Request Body:**
```json
{
  "groupId": "string",
  "amount": "number",
  "purpose": "string",
  "repaymentDate": "date",
  "repaymentTerms": "string",
  "installments": "number",
  "interestRate": "number"
}
```

**Response:**
```json
{
  "id": "string",
  "amount": "number",
  "purpose": "string",
  "repaymentDate": "date",
  "repaymentTerms": "string",
  "installments": "number",
  "interestRate": "number",
  "status": "PENDING",
  "createdAt": "date",
  "updatedAt": "date",
  "userId": "string",
  "groupId": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "avatar": "string"
  },
  "group": {
    // Group details
  }
}
```

### GET /api/loans

Retrieves loan requests based on query parameters.

**Query Parameters:**
- `tab`: Optional. Can be "my-requests" or "pending".
- `groupId`: Optional. Filters requests by group ID.

**Response:**
```json
[
  {
    "id": "string",
    "amount": "number",
    "purpose": "string",
    "repaymentDate": "date",
    "repaymentTerms": "string",
    "installments": "number",
    "interestRate": "number",
    "status": "string",
    "createdAt": "date",
    "updatedAt": "date",
    "userId": "string",
    "groupId": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "avatar": "string"
    },
    "group": {
      // Group details
    },
    "votes": [
      {
        "id": "string",
        "vote": "boolean",
        "comment": "string",
        "createdAt": "date",
        "updatedAt": "date",
        "userId": "string",
        "user": {
          "id": "string",
          "name": "string",
          "avatar": "string"
        }
      }
    ]
  }
]
```

### PATCH /api/loans

Votes on a loan request.

**Request Body:**
```json
{
  "loanRequestId": "string",
  "vote": "boolean",
  "comment": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "vote": "boolean",
  "comment": "string",
  "createdAt": "date",
  "updatedAt": "date",
  "userId": "string",
  "loanRequestId": "string",
  "membershipId": "string"
}
```

## Loan Request Flow

1. User selects a group and submits a loan request
2. System creates a new LoanRequest record with status "PENDING"
3. System notifies all group members about the new loan request
4. Group members vote on the loan request (approve or reject)
5. When the voting threshold is reached, the system determines the outcome:
   - If majority approves, status changes to "APPROVED" and requester is notified
   - If majority rejects, status changes to "REJECTED" and requester is notified
6. For approved loans, the system can later update the status to "DISBURSED" when funds are transferred
7. As repayments are made, the system tracks them and can update the status to "REPAYING" and eventually "REPAID"
8. If repayments are not made on time, the system can update the status to "DEFAULTED"

## Integration with Frontend

The loan request form in the frontend (`components/loans/loan-request-form.tsx`) should be updated to use the new API endpoints:

1. When submitting a loan request, make a POST request to `/api/loans`
2. When viewing loan requests, make a GET request to `/api/loans` with appropriate query parameters
3. When voting on a loan request, make a PATCH request to `/api/loans`

The frontend should also be updated to display loan requests and allow voting on them.