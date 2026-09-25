# Groups Feature - Quick Commands Reference

## 🚀 Common Commands

### **Start Development Server**
```bash
npm run dev
# Then visit: http://localhost:3000/Groups
```

### **Seed Sample Groups**
```bash
npx tsx prisma/seed-groups.ts
# Creates 13 sample groups for user: cmidbcgl00000s3bbkhqvbfr5
```

### **Re-seed (Fresh Data)**
```bash
# The seed file automatically cleans up old data
npx tsx prisma/seed-groups.ts
```

### **View Database**
```bash
npx prisma studio
# Opens database GUI at http://localhost:5555
```

### **Clear Next.js Cache**
```bash
rm -rf .next
npm run dev
```

## 🧪 API Testing Commands

### **Get All Groups**
```bash
curl http://localhost:3000/api/groups/browse | jq
```

### **Search Groups**
```bash
curl "http://localhost:3000/api/groups/browse?search=savings" | jq
```

### **Filter by Privacy**
```bash
# PUBLIC groups only
curl "http://localhost:3000/api/groups/browse?privacy=PUBLIC" | jq

# PRIVATE groups only
curl "http://localhost:3000/api/groups/browse?privacy=PRIVATE" | jq

# INVITE_ONLY groups only
curl "http://localhost:3000/api/groups/browse?privacy=INVITE_ONLY" | jq
```

### **Filter by Status**
```bash
# ACTIVE groups only
curl "http://localhost:3000/api/groups/browse?status=ACTIVE" | jq

# INACTIVE groups only
curl "http://localhost:3000/api/groups/browse?status=INACTIVE" | jq
```

### **Combined Filters**
```bash
curl "http://localhost:3000/api/groups/browse?privacy=PUBLIC&status=ACTIVE&search=fund" | jq
```

### **Count Groups**
```bash
curl -s http://localhost:3000/api/groups/browse | jq 'length'
```

## 🗄️ Database Commands

### **Check Seeded Groups**
```sql
-- In Prisma Studio or psql
SELECT 
  name, 
  privacy, 
  status, 
  "contributionAmount", 
  "contributionFrequency"
FROM "Group" 
WHERE "groupCode" LIKE 'GRP-%'
ORDER BY "createdAt" DESC;
```

### **Count Groups by Privacy**
```sql
SELECT 
  privacy,
  COUNT(*) as count
FROM "Group"
WHERE "groupCode" LIKE 'GRP-%'
GROUP BY privacy;
```

### **Count Groups by Status**
```sql
SELECT 
  status,
  COUNT(*) as count
FROM "Group"
WHERE "groupCode" LIKE 'GRP-%'
GROUP BY status;
```

### **Delete All Sample Groups**
```sql
-- Be careful! This deletes all GRP-* groups
DELETE FROM "Membership" 
WHERE "groupId" IN (
  SELECT id FROM "Group" WHERE "groupCode" LIKE 'GRP-%'
);

DELETE FROM "Group" WHERE "groupCode" LIKE 'GRP-%';
```

## 🐛 Troubleshooting Commands

### **Check if User Exists**
```bash
npx prisma studio
# Navigate to User model
# Search for ID: cmidbcgl00000s3bbkhqvbfr5
```

### **Regenerate Prisma Client**
```bash
npx prisma generate
```

### **Reset Database (Caution!)**
```bash
npx prisma migrate reset
# This will delete ALL data!
```

### **Check API Route Exists**
```bash
ls -la app/api/groups/browse/route.ts
# Should show the file
```

### **Test API Locally (No Browser)**
```bash
curl -v http://localhost:3000/api/groups/browse
# -v for verbose output to see headers
```

## 📊 Data Verification Commands

### **Count Total Groups**
```bash
curl -s http://localhost:3000/api/groups/browse | jq 'length'
# Should return: 12 (ACTIVE groups)
```

### **Get Group Names**
```bash
curl -s http://localhost:3000/api/groups/browse | jq '.[].name'
```

### **Get PUBLIC Groups Count**
```bash
curl -s http://localhost:3000/api/groups/browse?privacy=PUBLIC | jq 'length'
# Should return: 7
```

### **Get PRIVATE Groups Count**
```bash
curl -s http://localhost:3000/api/groups/browse?privacy=PRIVATE | jq 'length'
# Should return: 4
```

### **Get INVITE_ONLY Groups Count**
```bash
curl -s http://localhost:3000/api/groups/browse?privacy=INVITE_ONLY | jq 'length'
# Should return: 2
```

## 🔄 Update Commands

### **Update a Group**
```typescript
// In Prisma Studio or via API
await prisma.group.update({
  where: { id: "group-id" },
  data: { name: "New Name" }
})
```

### **Add More Sample Groups**
```bash
# 1. Edit prisma/seed-groups.ts
# 2. Add new group objects to sampleGroups array
# 3. Run seed
npx tsx prisma/seed-groups.ts
```

## 📱 Browser DevTools Commands

### **Check React Query Cache**
```javascript
// In browser console
window.__REACT_QUERY_DEVTOOLS__
```

### **Invalidate Query Cache**
```javascript
// In component or console
queryClient.invalidateQueries({ queryKey: ['groups', 'browse'] })
```

### **Check Network Requests**
```javascript
// DevTools → Network tab
// Filter: Fetch/XHR
// Look for: /api/groups/browse
```

## 🎯 Quick Tests

### **Test 1: Fresh Load**
```bash
# Clear cache
rm -rf .next
# Start server
npm run dev
# Visit /Groups
# ✅ Should see skeleton then 12 groups
```

### **Test 2: Cached Load**
```bash
# Visit /Groups
# Navigate to /dashboard
# Navigate back to /Groups
# ✅ Should load instantly (no skeleton)
```

### **Test 3: Search**
```bash
# Visit /Groups
# Type "fund" in search box
# ✅ Should instantly filter to 5 groups
```

### **Test 4: Filter**
```bash
# Visit /Groups
# Select "Public" from Privacy filter
# ✅ Should show 7 groups
```

## 🔍 Debug Commands

### **Check Logs**
```bash
# Server logs
# Look for:
# ✅ "GET /api/groups/browse 200"
# ✅ No 404 or 500 errors
```

### **Network Tab**
```bash
# Open DevTools → Network
# Reload /Groups page
# ✅ Should see /api/groups/browse request
# ✅ Status: 200
# ✅ Response: Array of groups
```

### **React Query DevTools**
```bash
# In browser, React Query DevTools should show:
# ✅ Query: ["groups", "browse", {...}]
# ✅ Status: success
# ✅ Data: Array[12]
```

## 📝 Maintenance Commands

### **Update Dependencies**
```bash
npm update @tanstack/react-query
```

### **Check for Issues**
```bash
npm run build
# Should complete without errors
```

### **Type Check**
```bash
npx tsc --noEmit
# Should show no type errors
```

## 🎉 Success Indicators

When everything is working:
- ✅ No errors in browser console
- ✅ No errors in server console
- ✅ `/api/groups/browse` returns 200
- ✅ 12 groups display on page
- ✅ Search/filter work instantly
- ✅ All text and colors visible
- ✅ Skeleton loaders smooth
- ✅ No linter errors

---

**Quick Reference Created:** November 28, 2024  
**For:** Pollen Groups Feature  
**Status:** Production Ready ✅

