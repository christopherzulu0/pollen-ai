# Fix for Server Rendering Error

## 🐛 **Error**

```
Switched to client rendering because the server rendering errored:
Failed to parse URL from /api/groups/browse
```

## ✅ **Fix Applied**

Updated `components/groups/groups-data.tsx` to use absolute URLs instead of relative URLs.

### **Before:**
```typescript
const url = `/api/groups/browse?${queryParams}`
```

### **After:**
```typescript
const baseUrl = typeof window !== 'undefined' 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

const url = `${baseUrl}/api/groups/browse?${queryParams}`
```

## 🔧 **How It Works**

- **Client-side (browser)**: Uses `window.location.origin` to get the current domain
- **Server-side (SSR)**: Uses `process.env.NEXT_PUBLIC_APP_URL` if set, otherwise defaults to `http://localhost:3000`

## 📝 **Optional: Set Environment Variable**

For production or custom domains, add to your `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Or for production:

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## ✅ **Testing**

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Visit the Groups page:
   ```
   http://localhost:3000/Groups
   ```

3. The error should be resolved ✅

## 📊 **What Changed**

- **File**: `components/groups/groups-data.tsx`
- **Function**: `fetchGroups()`
- **Change**: Added absolute URL construction
- **Impact**: Fixes server rendering error
- **Backwards Compatible**: Yes, works in both client and server contexts

---

**Fixed:** November 28, 2024  
**Status:** ✅ Ready to Test

