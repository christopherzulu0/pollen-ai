# Frontend Join API - Quick Start Guide

## 🚀 Quick Reference

### **Endpoints Created**

1. **`POST /api/Frontend/join`** - Join PUBLIC or INVITE_ONLY groups
2. **`POST /api/Frontend/request`** - Request to join PRIVATE groups
3. **`GET /api/Frontend/request`** - View your pending requests

---

## 📍 When to Use Which Endpoint

| Group Privacy | User Action | Endpoint to Use | Result |
|--------------|-------------|-----------------|--------|
| PUBLIC | "Join Now" | `/api/Frontend/join` | Instant ACTIVE membership |
| PRIVATE | "Request" | `/api/Frontend/request` | PENDING membership (awaits approval) |
| INVITE_ONLY | "Join" + Code | `/api/Frontend/join` | Instant ACTIVE membership (with valid code) |

---

## 💻 Code Examples

### **1. Join a PUBLIC Group**

```typescript
const joinPublicGroup = async (groupId: string) => {
  const response = await fetch('/api/Frontend/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ groupId }),
  })
  
  const result = await response.json()
  
  if (result.success) {
    console.log('✅ Joined:', result.membership.groupName)
  } else {
    console.error('❌ Error:', result.error)
  }
}

// Usage
await joinPublicGroup('group-123')
```

### **2. Request to Join PRIVATE Group**

```typescript
const requestPrivateGroup = async (groupId: string) => {
  const response = await fetch('/api/Frontend/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      groupId,
      message: 'I would love to be part of this group!' // Optional
    }),
  })
  
  const result = await response.json()
  
  if (result.success) {
    console.log('📤 Request sent to:', result.membership.adminName)
  } else {
    console.error('❌ Error:', result.error)
  }
}

// Usage
await requestPrivateGroup('group-456')
```

### **3. Join INVITE_ONLY Group with Code**

```typescript
const joinWithInvite = async (groupId: string, inviteCode: string) => {
  const response = await fetch('/api/Frontend/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ groupId, inviteCode }),
  })
  
  const result = await response.json()
  
  if (result.success) {
    console.log('✅ Joined with invite:', result.membership.groupName)
  } else {
    console.error('❌ Error:', result.error)
  }
}

// Usage
await joinWithInvite('group-789', 'ABC123XYZ')
```

### **4. View Pending Requests**

```typescript
const getPendingRequests = async () => {
  const response = await fetch('/api/Frontend/request', {
    method: 'GET',
  })
  
  const result = await response.json()
  
  console.log(`You have ${result.count} pending requests`)
  result.pendingRequests.forEach(req => {
    console.log(`- ${req.groupName} (${req.requestedAt})`)
  })
}

// Usage
await getPendingRequests()
```

---

## 🎨 React Component Example

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function GroupJoinButton({ group }: { group: GroupWithDetails }) {
  const [isJoining, setIsJoining] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const { toast } = useToast()

  const handleJoin = async () => {
    if (group.privacy === 'INVITE_ONLY') {
      setShowInviteDialog(true)
      return
    }

    setIsJoining(true)
    try {
      const endpoint = 
        group.privacy === 'PUBLIC' 
          ? '/api/Frontend/join' 
          : '/api/Frontend/request'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: group.id }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        })
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleInviteSubmit = async () => {
    setIsJoining(true)
    try {
      const response = await fetch('/api/Frontend/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: group.id, inviteCode }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        })
        setShowInviteDialog(false)
        setInviteCode('')
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <>
      <Button onClick={handleJoin} disabled={isJoining}>
        {isJoining 
          ? 'Joining...' 
          : group.privacy === 'PUBLIC' 
            ? 'Join Now' 
            : 'Request to Join'}
      </Button>

      {/* Invite Dialog for INVITE_ONLY groups */}
      {showInviteDialog && (
        <InviteCodeDialog
          onSubmit={handleInviteSubmit}
          onClose={() => setShowInviteDialog(false)}
          inviteCode={inviteCode}
          setInviteCode={setInviteCode}
          isLoading={isJoining}
        />
      )}
    </>
  )
}
```

---

## ✅ Success Responses

### **Join Success (PUBLIC/INVITE_ONLY)**
```json
{
  "success": true,
  "message": "Successfully joined Weekend Savers Club!",
  "membership": {
    "id": "mem_123",
    "groupId": "grp_456",
    "role": "MEMBER",
    "status": "ACTIVE",
    "joinedAt": "2024-11-28T12:00:00Z",
    "groupName": "Weekend Savers Club"
  }
}
```

### **Request Success (PRIVATE)**
```json
{
  "success": true,
  "message": "Your request to join Professional Growth Fund has been sent to the group admin for review",
  "membership": {
    "id": "mem_789",
    "groupId": "grp_012",
    "role": "MEMBER",
    "status": "PENDING",
    "joinedAt": "2024-11-28T12:00:00Z",
    "groupName": "Professional Growth Fund",
    "adminName": "John Doe",
    "adminEmail": "john@example.com"
  }
}
```

---

## ❌ Common Errors

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Unauthorized" | Not logged in | Sign in with Clerk |
| "Group ID is required" | Missing `groupId` | Include `groupId` in request body |
| "Group not found" | Invalid group ID | Check group exists |
| "This is a private group..." | Wrong endpoint | Use `/api/Frontend/request` for PRIVATE |
| "This is a public group..." | Wrong endpoint | Use `/api/Frontend/join` for PUBLIC |
| "Invitation code is required..." | Missing code | Include `inviteCode` in request |
| "Invalid or expired invitation code" | Bad code | Check code validity |
| "You are already a member..." | Already joined | No action needed |
| "You have a pending request..." | Already requested | Wait for approval |
| "This group is at full capacity" | Group full | Try another group |
| "Your membership has been suspended" | Suspended | Contact admin |

---

## 🧪 Quick Test

### **Test with cURL**

```bash
# 1. Join a PUBLIC group (from seed data)
curl -X POST http://localhost:3000/api/Frontend/join \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "YOUR_PUBLIC_GROUP_ID_HERE"
  }'

# 2. Request a PRIVATE group
curl -X POST http://localhost:3000/api/Frontend/request \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "YOUR_PRIVATE_GROUP_ID_HERE",
    "message": "Test request"
  }'

# 3. View pending requests
curl -X GET http://localhost:3000/api/Frontend/request
```

### **Test with Browser Console**

```javascript
// Join PUBLIC group
fetch('/api/Frontend/join', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ groupId: 'group-id-here' })
})
  .then(r => r.json())
  .then(console.log)

// Request PRIVATE group
fetch('/api/Frontend/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ groupId: 'group-id-here' })
})
  .then(r => r.json())
  .then(console.log)

// View pending
fetch('/api/Frontend/request')
  .then(r => r.json())
  .then(console.log)
```

---

## 📊 Flow Summary

```
┌─────────────────────────────────────────────────┐
│         User Sees Group Card                     │
└─────────────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Check Group Privacy  │
         └───────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    ┌─────────┐           ┌──────────┐
    │ PUBLIC  │           │ PRIVATE  │
    └─────────┘           └──────────┘
         │                       │
         ▼                       ▼
  POST /api/         POST /api/Frontend/
  Frontend/join            request
         │                       │
         ▼                       ▼
   ACTIVE Member          PENDING Request
                              │
                              ▼
                         Admin Approval
                              │
                              ▼
                        ACTIVE Member
```

---

## 📚 Full Documentation

For complete API reference, see:
- **`FRONTEND_JOIN_API_DOCUMENTATION.md`** - Full technical docs
- **`GROUPS_API_DOCUMENTATION.md`** - Browse groups API
- **`GROUPS_IMPLEMENTATION_COMPLETE.md`** - Complete feature overview

---

**Quick Start Created:** November 28, 2024  
**Status:** Ready to Use ✅

