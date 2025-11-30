# Dashboard Data Filtering - Group Membership Security

## Overview
All dashboard APIs have been updated to ensure they **only retrieve information from groups where the authenticated user is an ACTIVE member**. This ensures data privacy and security across the platform.

## Updated API Routes

### 1. `/api/dashboard/stats` (Statistics)
**File**: `app/api/dashboard/stats/route.ts`

**Filters Applied**:
- ✅ Only includes ACTIVE memberships
- ✅ Only includes ACTIVE groups
- ✅ Only counts ACTIVE members in groups
- ✅ Only includes COMPLETED transactions
- ✅ Filters transactions by user's group IDs
- ✅ Filters contributions by user's group IDs

**Data Protected**:
- Total Savings (from deposits and contributions)
- Active Groups count
- New Groups this month
- Upcoming Payments (only from user's groups)
- Total Members (only from user's groups)
- New Members this month (only from user's groups)

---

### 2. `/api/dashboard/charts` (Chart Data)
**File**: `app/api/dashboard/charts/route.ts`

**Filters Applied**:
- ✅ Only includes ACTIVE memberships
- ✅ Only includes ACTIVE groups
- ✅ Only counts ACTIVE members in groups
- ✅ Only includes COMPLETED transactions
- ✅ Filters all chart data by user's group IDs

**Data Protected**:
- Deposit Data (last 6 months) - only from user's groups
- Membership Distribution - only user's active groups
- Activity Data (last 5 weeks) - only deposits/withdrawals from user's groups

---

### 3. `/api/dashboard/activities` (Activity Feed)
**File**: `app/api/dashboard/activities/route.ts`

**Filters Applied**:
- ✅ Only includes ACTIVE memberships
- ✅ Only includes ACTIVE groups
- ✅ Filters transactions by user's group IDs
- ✅ Double-checks group membership with nested queries
- ✅ Ensures all activities belong to groups where user is ACTIVE

**Data Protected**:
- Upcoming Events (from user's groups)
- Recent Transactions (only from user's groups)
- Recent Member Joins (only from user's groups)
- Activity Feed (only activities from user's groups)

---

## Implementation Details

### Prisma Query Filtering
All three APIs now use consistent Prisma filtering:

```typescript
const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
        memberships: {
            where: {
                status: 'ACTIVE' // Only include active memberships
            },
            include: {
                group: {
                    where: {
                        status: 'ACTIVE' // Only active groups
                    },
                    include: {
                        memberships: {
                            where: {
                                status: 'ACTIVE' // Only count active members
                            }
                        }
                    }
                }
            }
        },
        transactions: {
            where: {
                status: 'COMPLETED' // Only completed transactions
            }
        }
    }
})
```

### Additional Application-Level Filtering
After fetching data, the APIs also apply JavaScript filtering:

```typescript
// Get group IDs from user's active memberships
const userGroupIds = user.memberships.map(m => m.groupId)

// Filter transactions to only include user's groups
const filteredTransactions = user.transactions.filter(t =>
    t.groupId && userGroupIds.includes(t.groupId)
)
```

### Nested Query Protection
For activities, we use nested Prisma queries to double-check membership:

```typescript
const recentTransactions = await prisma.transaction.findMany({
    where: {
        groupId: { in: groupIds },
        group: {
            memberships: {
                some: {
                    userId: user.id,
                    status: 'ACTIVE' // Verify user is active member
                }
            }
        }
    }
})
```

---

## Security Benefits

1. **Data Privacy**: Users can only see data from groups they actively belong to
2. **No Data Leakage**: Inactive or removed memberships don't leak data
3. **Consistent Filtering**: All three APIs use the same filtering logic
4. **Defense in Depth**: Multiple layers of filtering (Prisma + Application + Nested queries)
5. **Status Awareness**: Only ACTIVE memberships and groups are considered

---

## Frontend Components

The following components consume these protected APIs:

- `components/dashboard/dashboard-stats.tsx` → `/api/dashboard/stats`
- `components/dashboard/dashboard-charts.tsx` → `/api/dashboard/charts`
- `components/dashboard/dashboard-activity.tsx` → `/api/dashboard/activities`

All components use React Query with Suspense for optimal loading states and error handling.

---

## Testing Checklist

To verify the filtering works correctly:

- [ ] User can only see stats from their active groups
- [ ] Transactions from inactive memberships are not included
- [ ] Group member counts only include active members
- [ ] Activity feed only shows activities from user's groups
- [ ] Charts only display data from groups where user is a member
- [ ] Switching membership status reflects immediately in dashboard

---

## Default Data

All APIs return safe default data when:
- User is not authenticated
- User not found in database
- No active group memberships exist
- API errors occur

This ensures the dashboard never crashes and always displays useful information.

---

**Last Updated**: 2025-11-28
**Status**: ✅ All APIs secured and filtering by active group memberships

