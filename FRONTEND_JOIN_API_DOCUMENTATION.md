# Frontend Join & Request API Documentation

## 📚 Overview

Two new API endpoints for joining and requesting to join savings groups:

- **`/api/Frontend/join`** - Join PUBLIC groups or INVITE_ONLY groups with a code
- **`/api/Frontend/request`** - Request to join PRIVATE groups (requires approval)

## 🎯 Endpoints

---

### 1. **POST /api/Frontend/join**

Join a PUBLIC group directly or an INVITE_ONLY group with a valid invitation code.

#### **Request**

```typescript
POST /api/Frontend/join
Content-Type: application/json
Authorization: Required (Clerk session)

{
  "groupId": "string",        // Required: Group ID to join
  "inviteCode": "string"      // Optional: Required for INVITE_ONLY groups
}
```

#### **Response (Success)**

```typescript
{
  "success": true,
  "message": "Successfully joined Weekend Savers Club!",
  "membership": {
    "id": "membership-id",
    "groupId": "group-id",
    "role": "MEMBER",
    "status": "ACTIVE",
    "joinedAt": "2024-11-28T12:00:00Z",
    "groupName": "Weekend Savers Club"
  }
}
```

#### **Response (Error)**

```typescript
{
  "error": "Error message",
  "details": "Optional detailed error message"
}
```

#### **Status Codes**

| Code | Meaning |
|------|---------|
| 200 | Successfully joined the group |
| 400 | Bad request (missing groupId, already a member, at capacity, etc.) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (suspended, private group, invalid invite code, etc.) |
| 404 | Group not found |
| 500 | Internal server error |

#### **Error Messages**

- `"Group ID is required"` - Missing groupId in request body
- `"Group not found"` - Invalid group ID
- `"This is a private group. Please use the request endpoint instead."` - Attempted to join a PRIVATE group
- `"Invitation code is required for this group"` - INVITE_ONLY group without code
- `"Invalid or expired invitation code"` - Bad or expired invite code
- `"You are already a member of this group"` - Already has ACTIVE membership
- `"You have a pending request for this group"` - Already has PENDING request
- `"Your membership in this group has been suspended"` - SUSPENDED status
- `"This group is at full capacity"` - Group is full
- `"This group no longer allows late joining"` - Past the grace period

#### **Special Cases**

1. **INACTIVE Membership**: Automatically reactivated when user rejoins
   ```typescript
   {
     "success": true,
     "message": "Welcome back to Weekend Savers Club!",
     "membership": { /* reactivated membership */ }
   }
   ```

2. **INVITE_ONLY with Valid Code**: Marks invitation as ACCEPTED
   ```typescript
   // Invitation record updated to status: "ACCEPTED"
   ```

#### **Example Usage**

```typescript
// Join PUBLIC group
const response = await fetch('/api/Frontend/join', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    groupId: 'group-123',
  }),
})

// Join INVITE_ONLY group with code
const response = await fetch('/api/Frontend/join', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    groupId: 'group-456',
    inviteCode: 'ABC123XYZ',
  }),
})
```

---

### 2. **POST /api/Frontend/request**

Request to join a PRIVATE group (requires admin approval).

#### **Request**

```typescript
POST /api/Frontend/request
Content-Type: application/json
Authorization: Required (Clerk session)

{
  "groupId": "string",        // Required: Group ID to request
  "message": "string"         // Optional: Message to admin
}
```

#### **Response (Success)**

```typescript
{
  "success": true,
  "message": "Your request to join Professional Growth Fund has been sent to the group admin for review",
  "membership": {
    "id": "membership-id",
    "groupId": "group-id",
    "role": "MEMBER",
    "status": "PENDING",
    "joinedAt": "2024-11-28T12:00:00Z",
    "groupName": "Professional Growth Fund",
    "adminName": "Admin Name",
    "adminEmail": "admin@example.com"
  }
}
```

#### **Response (Error)**

```typescript
{
  "error": "Error message",
  "details": "Optional detailed error message"
}
```

#### **Status Codes**

| Code | Meaning |
|------|---------|
| 200 | Request successfully submitted |
| 400 | Bad request (missing groupId, already a member, wrong group type, etc.) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (suspended, invite-only group, late joining disabled) |
| 404 | Group not found |
| 500 | Internal server error |

#### **Error Messages**

- `"Group ID is required"` - Missing groupId in request body
- `"Group not found"` - Invalid group ID
- `"This is a public group. Please use the join endpoint instead."` - Attempted to request PUBLIC group
- `"This group requires an invitation code. Please use the join endpoint with a valid code."` - Attempted to request INVITE_ONLY group
- `"You are already a member of this group"` - Already has ACTIVE membership
- `"You already have a pending request for this group"` - Already has PENDING request
- `"Your membership in this group has been suspended"` - SUSPENDED status
- `"This group is at full capacity"` - Group is full
- `"This group no longer allows late joining"` - Past the grace period

#### **Special Cases**

1. **INACTIVE Membership**: Resubmits as PENDING
   ```typescript
   {
     "success": true,
     "message": "Your request has been resubmitted to the group admin for review",
     "membership": { /* pending membership */ }
   }
   ```

2. **PRIVATE Group Without Approval Required**: Joins directly as ACTIVE
   ```typescript
   {
     "success": true,
     "message": "Successfully joined Professional Growth Fund!",
     "membership": { /* active membership */ }
   }
   ```

#### **Example Usage**

```typescript
// Request to join PRIVATE group
const response = await fetch('/api/Frontend/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    groupId: 'group-789',
    message: 'I would love to join this group!',
  }),
})

const result = await response.json()
if (result.success) {
  console.log('Request submitted:', result.membership)
} else {
  console.error('Error:', result.error)
}
```

---

### 3. **GET /api/Frontend/request**

Get all pending membership requests for the authenticated user.

#### **Request**

```typescript
GET /api/Frontend/request
Authorization: Required (Clerk session)
```

#### **Response (Success)**

```typescript
{
  "success": true,
  "count": 2,
  "pendingRequests": [
    {
      "membershipId": "membership-id-1",
      "groupId": "group-id-1",
      "groupName": "Professional Growth Fund",
      "groupDescription": "For professionals looking to save...",
      "groupLogo": "https://...",
      "privacy": "PRIVATE",
      "contributionAmount": "25000",
      "contributionFrequency": "MONTHLY",
      "adminName": "Admin Name",
      "requestedAt": "2024-11-28T12:00:00Z",
      "status": "PENDING"
    },
    // ... more pending requests
  ]
}
```

#### **Response (No User)**

```typescript
{
  "pendingRequests": []
}
```

#### **Status Codes**

| Code | Meaning |
|------|---------|
| 200 | Success (may return empty array) |
| 401 | Unauthorized (not logged in) |
| 500 | Internal server error |

#### **Example Usage**

```typescript
// Get pending requests
const response = await fetch('/api/Frontend/request', {
  method: 'GET',
})

const result = await response.json()
console.log(`You have ${result.count} pending requests`)
result.pendingRequests.forEach(req => {
  console.log(`- ${req.groupName} (requested ${req.requestedAt})`)
})
```

---

## 🔄 Flow Diagrams

### **Join Flow (PUBLIC Groups)**

```
User clicks "Join" on PUBLIC group
          ↓
POST /api/Frontend/join { groupId }
          ↓
Check authentication
          ↓
Validate group exists & is PUBLIC
          ↓
Check not already member
          ↓
Check capacity & late joining
          ↓
Create ACTIVE membership
          ↓
Return success + membership
```

### **Join Flow (INVITE_ONLY Groups)**

```
User clicks "Join" on INVITE_ONLY group
          ↓
Show invitation code dialog
          ↓
User enters code
          ↓
POST /api/Frontend/join { groupId, inviteCode }
          ↓
Check authentication
          ↓
Validate invitation code
          ↓
Mark invitation as ACCEPTED
          ↓
Create ACTIVE membership
          ↓
Return success + membership
```

### **Request Flow (PRIVATE Groups)**

```
User clicks "Request to Join" on PRIVATE group
          ↓
POST /api/Frontend/request { groupId }
          ↓
Check authentication
          ↓
Validate group exists & is PRIVATE
          ↓
Check not already member/pending
          ↓
Check capacity & late joining
          ↓
Create PENDING membership
          ↓
Notify admin (TODO)
          ↓
Return success + pending membership
```

---

## 🎨 UI Integration

### **GroupCard Component**

The `group-card.tsx` component uses these endpoints based on group privacy:

```typescript
const handleJoin = async () => {
  if (group.privacy === "INVITE_ONLY") {
    setShowInviteDialog(true)
    return
  }

  // Use /api/Frontend/join for PUBLIC
  // Use /api/Frontend/request for PRIVATE
  const endpoint = group.privacy === "PUBLIC" 
    ? "/api/Frontend/join" 
    : "/api/Frontend/request"
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ groupId: group.id }),
  })
  
  // Handle response...
}
```

### **Button Labels**

| Privacy | Button Text | Action |
|---------|------------|--------|
| PUBLIC | "Join Now" | Direct join via `/api/Frontend/join` |
| PRIVATE | "Request" | Submit request via `/api/Frontend/request` |
| INVITE_ONLY | "Join" | Show dialog, then join via `/api/Frontend/join` |

---

## 🔐 Security & Validation

### **Authentication**

Both endpoints require Clerk authentication:
```typescript
const { userId: clerkUserId } = await auth()
if (!clerkUserId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

### **User Creation**

If user doesn't exist in database, automatically creates:
```typescript
dbUser = await prisma.user.create({
  data: {
    clerkUserId,
    name: `${clerkUser.firstName} ${clerkUser.lastName}`,
    email: clerkUser.emailAddresses[0]?.emailAddress,
    avatar: clerkUser.imageUrl,
  },
})
```

### **Validations**

#### **Join Endpoint**
- ✅ User is authenticated
- ✅ Group exists
- ✅ Group is PUBLIC or INVITE_ONLY
- ✅ Valid invitation code (for INVITE_ONLY)
- ✅ Not already a member (ACTIVE/PENDING)
- ✅ Group has capacity
- ✅ Late joining is allowed (if applicable)

#### **Request Endpoint**
- ✅ User is authenticated
- ✅ Group exists
- ✅ Group is PRIVATE
- ✅ Not already a member (ACTIVE/PENDING)
- ✅ Group has capacity
- ✅ Late joining is allowed (if applicable)

---

## 📊 Database Schema

### **Membership Model**

```prisma
model Membership {
  id               String            @id @default(cuid())
  userId           String
  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  groupId          String
  group            Group             @relation(fields: [groupId], references: [id], onDelete: Cascade)
  role             MembershipRole    @default(MEMBER)
  joinedAt         DateTime          @default(now())
  status           MembershipStatus  @default(ACTIVE)
  balance          Decimal           @default(0)
  totalContributed Decimal           @default(0)
  lastContribution DateTime?
}
```

### **MembershipStatus Enum**

```prisma
enum MembershipStatus {
  PENDING    // Awaiting approval
  ACTIVE     // Active member
  SUSPENDED  // Temporarily suspended
  INACTIVE   // Left or removed
}
```

### **GroupInvitation Model**

```prisma
model GroupInvitation {
  id        String           @id @default(cuid())
  groupId   String
  group     Group            @relation(fields: [groupId], references: [id], onDelete: Cascade)
  inviterId String
  inviter   User             @relation("SentInvitations", fields: [inviterId], references: [id])
  inviteeId String
  invitee   User             @relation("ReceivedInvitations", fields: [inviteeId], references: [id])
  status    InvitationStatus @default(PENDING)
  code      String           @unique
  createdAt DateTime         @default(now())
  expiresAt DateTime?
}
```

---

## 🧪 Testing

### **Test Cases**

#### **Join Endpoint**

```bash
# Test 1: Join PUBLIC group (success)
curl -X POST http://localhost:3000/api/Frontend/join \
  -H "Content-Type: application/json" \
  -d '{"groupId":"group-id-here"}'

# Test 2: Join INVITE_ONLY with code (success)
curl -X POST http://localhost:3000/api/Frontend/join \
  -H "Content-Type: application/json" \
  -d '{"groupId":"group-id-here","inviteCode":"ABC123"}'

# Test 3: Join PRIVATE group (error - should use request)
curl -X POST http://localhost:3000/api/Frontend/join \
  -H "Content-Type: application/json" \
  -d '{"groupId":"private-group-id"}'

# Test 4: Join without groupId (error)
curl -X POST http://localhost:3000/api/Frontend/join \
  -H "Content-Type: application/json" \
  -d '{}'

# Test 5: Join INVITE_ONLY without code (error)
curl -X POST http://localhost:3000/api/Frontend/join \
  -H "Content-Type: application/json" \
  -d '{"groupId":"invite-only-group-id"}'
```

#### **Request Endpoint**

```bash
# Test 1: Request PRIVATE group (success)
curl -X POST http://localhost:3000/api/Frontend/request \
  -H "Content-Type: application/json" \
  -d '{"groupId":"private-group-id","message":"Please let me join!"}'

# Test 2: Request PUBLIC group (error - should use join)
curl -X POST http://localhost:3000/api/Frontend/request \
  -H "Content-Type: application/json" \
  -d '{"groupId":"public-group-id"}'

# Test 3: Get pending requests
curl -X GET http://localhost:3000/api/Frontend/request

# Test 4: Request twice (error - already pending)
curl -X POST http://localhost:3000/api/Frontend/request \
  -H "Content-Type: application/json" \
  -d '{"groupId":"same-private-group-id"}'
```

---

## 📝 TODO / Future Enhancements

- [ ] Add notification system for admin when request is received
- [ ] Add webhook/email notification when request is approved/declined
- [ ] Add rate limiting for join/request endpoints
- [ ] Add analytics tracking for join success/failure
- [ ] Add ability to cancel pending request
- [ ] Add admin endpoint to approve/decline requests
- [ ] Add bulk invitation code generation
- [ ] Add invitation link sharing

---

## 📚 Related Documentation

- `GROUPS_API_DOCUMENTATION.md` - Groups browse API
- `GROUPS_IMPLEMENTATION_COMPLETE.md` - Full groups feature overview
- `SEED_GROUPS_README.md` - Sample data guide

---

**Created:** November 28, 2024  
**Status:** ✅ Production Ready  
**Version:** 1.0.0

