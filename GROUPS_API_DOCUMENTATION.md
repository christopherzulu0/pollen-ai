# Groups API with React Query, Suspense & Skeleton Loaders

## 📚 Overview

The Groups feature has been completely refactored to use:
- ✅ **API Routes** - Server-side data fetching
- ✅ **React Query** - Powerful data fetching and caching
- ✅ **Suspense** - Built-in loading states
- ✅ **Skeleton Loaders** - Beautiful loading UI
- ✅ **Error Boundaries** - Graceful error handling

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│  /Groups Page (Server Component)                    │
│  ├─ Suspense Boundary                               │
│  │  └─ GroupsData (Client Component)                │
│  │     ├─ QueryErrorResetBoundary                   │
│  │     │  └─ ErrorBoundary                          │
│  │     │     └─ GroupsDataInner                     │
│  │     │        └─ useSuspenseQuery                 │
│  │     │           └─ GroupsClient                  │
│  │     │              └─ GroupCard (multiple)       │
│  │     └─ Fallback: GroupsPageSkeleton              │
│  └─ Error Fallback: GroupsError                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  API: /api/groups/browse                            │
│  ├─ GET with query params                           │
│  ├─ Fetches from Prisma database                    │
│  ├─ Transforms to GroupWithDetails type             │
│  └─ Returns JSON array                              │
└─────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
app/
├── Groups/
│   ├── page.tsx          # Main page with Suspense
│   └── error.tsx         # Error boundary page
│
├── api/
│   └── groups/
│       └── browse/
│           └── route.ts  # Browse groups API endpoint
│
components/
└── groups/
    ├── groups-data.tsx      # React Query data fetching
    ├── groups-client.tsx    # Client component with UI logic
    ├── groups-skeleton.tsx  # All skeleton loader components
    ├── groups-error.tsx     # Error display component
    ├── group-card.tsx       # Individual group card
    └── group-filters.tsx    # Filter sidebar
```

## 🔧 API Endpoint

### **GET `/api/groups/browse`**

Fetches all available groups (public browse endpoint).

#### **Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | `""` | Search by name/description |
| `privacy` | string | `"all"` | Filter by privacy (PUBLIC/PRIVATE/INVITE_ONLY) |
| `status` | string | `"all"` | Filter by status (ACTIVE/INACTIVE) |

#### **Example Requests:**

```bash
# Get all groups
GET /api/groups/browse

# Search for groups
GET /api/groups/browse?search=savings

# Filter by privacy
GET /api/groups/browse?privacy=PUBLIC

# Combined filters
GET /api/groups/browse?search=community&privacy=PUBLIC&status=ACTIVE
```

#### **Response:**

```typescript
type GroupWithDetails = {
  id: string
  name: string
  description: string
  logo: string
  privacy: "PUBLIC" | "PRIVATE" | "INVITE_ONLY"
  status: "ACTIVE" | "INACTIVE"
  contributionAmount: number
  contributionFrequency: string
  interestRate: number
  maxMembers: number | null
  memberCount: number
  depositGoal: number | null
  groupRules: string
  bylaws: string
  adminName: string
  adminEmail: string
  adminPhone: string | null
  createdAt: Date
  updatedAt: Date
}[]
```

## 🎨 Components

### **1. GroupsData**

Main data fetching component using React Query.

```tsx
<GroupsData
  initialParams={{
    search: "savings",
    privacy: "PUBLIC",
    status: "ACTIVE"
  }}
/>
```

**Features:**
- Uses `useSuspenseQuery` for automatic Suspense integration
- Implements `QueryErrorResetBoundary` for error recovery
- Wraps in `ErrorBoundary` for graceful error handling
- Automatic retry with exponential backoff
- 5-minute stale time, 10-minute cache time

### **2. GroupsPageSkeleton**

Complete page skeleton loader.

```tsx
<GroupsPageSkeleton />
```

**Includes:**
- Header skeleton with stats cards
- Toolbar skeleton with filters
- Grid/List skeleton cards (6 by default)
- Responsive design

### **3. GroupCardSkeleton**

Individual card skeleton.

```tsx
<GroupCardSkeleton viewMode="grid" />
<GroupCardSkeleton viewMode="list" />
```

**Features:**
- Supports both grid and list view modes
- Animated pulse effect
- Staggered animation delays

### **4. GroupsError**

Error display component.

```tsx
<GroupsError error={error} reset={resetFn} />
```

**Features:**
- Displays error message
- Try Again button (resets query)
- Go to Dashboard fallback
- User-friendly error messages

## 🔍 React Query Configuration

### **Query Key Structure:**

```typescript
["groups", "browse", initialParams]
```

Benefits:
- ✅ Automatic cache invalidation when params change
- ✅ Separate cache for different filter combinations
- ✅ Easy to invalidate specific queries

### **Query Options:**

```typescript
{
  staleTime: 1000 * 60 * 5,      // 5 minutes - data stays fresh
  gcTime: 1000 * 60 * 10,         // 10 minutes - cache retention
  retry: 2,                        // Retry failed requests twice
  retryDelay: (attempt) =>         // Exponential backoff
    Math.min(1000 * 2 ** attempt, 30000),
}
```

## 🎭 Loading States

### **Server-Side (Initial Load):**

```tsx
<Suspense fallback={<GroupsPageSkeleton />}>
  <GroupsData initialParams={params} />
</Suspense>
```

Shows full-page skeleton on:
- Initial page load
- Hard refresh
- Navigation to the page

### **Client-Side (Refetch):**

React Query handles:
- Background refetches (shows cached data)
- Mutation updates
- Window refocus refetches

## 🚨 Error Handling

### **Error Boundary Flow:**

```
API Error
    ↓
useSuspenseQuery throws
    ↓
ErrorBoundary catches
    ↓
GroupsError displays
    ↓
User clicks "Try Again"
    ↓
reset() triggers
    ↓
Query retries
```

### **Error Types Handled:**

1. **Network Errors** - Connection issues
2. **API Errors** - Server-side failures
3. **Parsing Errors** - Invalid response data
4. **Auth Errors** - Unauthorized access

### **User Actions:**

- **Try Again** - Resets error and refetches
- **Go to Dashboard** - Fallback navigation

## 📊 Performance Optimizations

### **1. Caching:**
```typescript
staleTime: 5 minutes  // Don't refetch for 5 min
gcTime: 10 minutes    // Keep in cache for 10 min
```

### **2. Retry Strategy:**
```typescript
retry: 2  // Retry twice before failing
retryDelay: exponential  // 1s, 2s, 4s...
```

### **3. Suspense:**
- Automatic code splitting
- Progressive rendering
- Better UX with skeleton loaders

### **4. Prefetching (Future Enhancement):**
```typescript
// In a parent component
queryClient.prefetchQuery({
  queryKey: ["groups", "browse"],
  queryFn: () => fetchGroups(),
})
```

## 🔄 Data Flow Examples

### **Example 1: Initial Page Load**

```
1. User navigates to /Groups
2. Page.tsx renders with Suspense
3. Suspense shows GroupsPageSkeleton
4. GroupsData mounts
5. useSuspenseQuery fetches from /api/groups/browse
6. API queries database
7. Data returned and cached
8. GroupsClient renders with data
9. Skeleton replaced with actual content
```

### **Example 2: Search Filter Applied**

```
1. User types in search box (client-side)
2. GroupsClient filters locally (instant)
3. No API call needed (client-side filtering)
```

### **Example 3: Refetch After 5 Minutes**

```
1. User returns to page after 6 minutes
2. Data is stale (> 5 min staleTime)
3. Shows cached data immediately
4. Triggers background refetch
5. Updates UI when new data arrives
```

### **Example 4: Error and Recovery**

```
1. API fails (network error)
2. Query retries automatically (2x)
3. All retries fail
4. ErrorBoundary catches error
5. GroupsError displays with message
6. User clicks "Try Again"
7. reset() clears error state
8. Query refetches successfully
9. Content displays normally
```

## 🧪 Testing Scenarios

### **Test 1: Loading State**
```bash
# Slow down network in DevTools
# Navigate to /Groups
# Verify skeleton loader displays
```

### **Test 2: Error Handling**
```bash
# Stop API server
# Navigate to /Groups
# Verify error message displays
# Click "Try Again"
# Start API server
# Verify data loads successfully
```

### **Test 3: Caching**
```bash
# Load /Groups page
# Navigate away
# Navigate back within 5 minutes
# Verify instant load (from cache)
```

### **Test 4: Search/Filter**
```bash
# Load /Groups page
# Type in search box
# Verify instant filtering (no API call)
# Check Network tab to confirm
```

## 🔐 Security Considerations

### **API Route:**
- ✅ No authentication required (public browse)
- ✅ Safe to expose publicly
- ❌ Does not expose private group details
- ❌ Does not expose member information

### **Future: Protected Endpoints**

For user-specific data:
```typescript
// Require authentication
const { userId } = await auth()
if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

## 📈 Future Enhancements

### **1. Pagination:**
```typescript
GET /api/groups/browse?page=1&limit=20
```

### **2. Sorting:**
```typescript
GET /api/groups/browse?sortBy=members&order=desc
```

### **3. Infinite Scroll:**
```typescript
useInfiniteQuery({
  queryKey: ["groups", "browse"],
  queryFn: ({ pageParam = 1 }) => fetchGroups(pageParam),
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
})
```

### **4. Optimistic Updates:**
```typescript
// When joining a group
mutate(groupId, {
  onMutate: async (groupId) => {
    // Optimistically update UI
    queryClient.setQueryData(["groups", "browse"], (old) => {
      // Update memberCount immediately
    })
  },
})
```

### **5. Real-time Updates:**
```typescript
// WebSocket or polling
useEffect(() => {
  const interval = setInterval(() => {
    queryClient.invalidateQueries({ queryKey: ["groups", "browse"] })
  }, 30000) // Refetch every 30 seconds
  
  return () => clearInterval(interval)
}, [])
```

## 🐛 Troubleshooting

### **Issue: Skeleton never disappears**
**Solution:** Check browser console for API errors

### **Issue: Error message shows immediately**
**Solution:** Check if API server is running

### **Issue: Data doesn't update**
**Solution:** Check staleTime/cacheTime settings

### **Issue: "Failed to fetch" error**
**Solution:** Verify API endpoint URL is correct

## 📝 Summary

The Groups feature now uses:
- ✅ Modern data fetching with React Query
- ✅ Automatic loading states with Suspense
- ✅ Beautiful skeleton loaders
- ✅ Robust error handling with boundaries
- ✅ Intelligent caching and retry logic
- ✅ Type-safe API integration
- ✅ Optimized performance
- ✅ Great user experience

All while maintaining clean, maintainable code! 🎉

