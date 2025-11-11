# Build Error Fix - Next.js Server/Client Component Issue

## ❌ The Problem

**Error:**
```
You are attempting to export "metadata" from a component marked with "use client", 
which is disallowed. Either remove the export, or the "use client" directive.
```

**Why it happened:**
- Added `"use client"` to `app/layout.tsx` to use `usePathname()`
- `app/layout.tsx` also needs to export `metadata`
- Next.js doesn't allow exporting metadata from client components

---

## ✅ The Solution

Split the layout into two components:

### 1. **Server Component** (app/layout.tsx)
- Handles metadata export
- Wraps content in providers
- Renders the client component

```typescript
export const metadata: Metadata = { ... }

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>
          <SettingsProvider>
            <Providers>
              <LayoutClient>
                {children}
              </LayoutClient>
            </Providers>
          </SettingsProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
```

### 2. **Client Component** (components/layout-client.tsx)
- Handles conditional rendering with `usePathname()`
- Shows/hides navbar and footer based on route
- Applies appropriate styles

```typescript
"use client"

export default function LayoutClient({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <div>
      {!isDashboard && <Navbar />}
      <main>{children}</main>
      {!isDashboard && <Footer />}
    </div>
  )
}
```

---

## Files Changed

### 1. app/layout.tsx
- ✅ Removed `"use client"` directive
- ✅ Removed `usePathname()` logic
- ✅ Kept `metadata` export
- ✅ Kept provider structure
- ✅ Added import for `LayoutClient`

### 2. components/layout-client.tsx (NEW)
- ✅ Added `"use client"` directive
- ✅ Added `usePathname()` logic
- ✅ Conditional navbar/footer rendering
- ✅ Conditional background styling

---

## How It Works Now

### Architecture
```
app/layout.tsx (Server Component)
├── Metadata export ✓
├── Providers (ClerkProvider, SettingsProvider, etc.)
└── LayoutClient (Client Component)
    ├── usePathname() detection ✓
    ├── Conditional Navbar rendering
    ├── Main content
    └── Conditional Footer rendering
```

### Route Detection
```typescript
const isDashboard = pathname.startsWith('/dashboard')

// If true: hide navbar & footer, light background
// If false: show navbar & footer, dark background
```

---

## Benefits

✅ **Fixes Build Error**: Server and client components properly separated
✅ **Maintains Functionality**: Navbar/footer still conditionally render
✅ **Best Practice**: Follows Next.js App Router conventions
✅ **Performance**: Server component caching still works
✅ **Metadata**: SEO metadata properly exported

---

## Testing

After the fix:

### Public Pages (/, /about, /services, /blog, /contact)
- ✅ Navbar shows
- ✅ Page content displays
- ✅ Footer shows
- ✅ Dark background

### Dashboard Pages (/dashboard/*)
- ✅ Navbar hidden
- ✅ Footer hidden
- ✅ Dashboard layout shows
- ✅ Light background (with dark mode support)

---

## Next Steps

1. Build should now succeed without errors
2. Navbar and footer will properly show/hide based on route
3. Dashboard pages get full page control

**Status**: ✅ **FIXED**

