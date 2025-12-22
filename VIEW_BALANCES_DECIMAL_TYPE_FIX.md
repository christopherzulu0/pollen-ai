# ViewBalances Decimal Type Conversion Fix

## Issue

**Error**: `TypeError: balanceData.walletBalance.toFixed is not a function`

**Location**: `components/ViewBalances.tsx:178` in the `handleContribution` function

**Trigger**: When user tries to make a contribution and the client-side balance check runs

## Root Cause

The `walletBalance` returned from the API is a Prisma `Decimal` type (or converted to a string in JSON), not a JavaScript `number`. Therefore, it doesn't have the `.toFixed()` method.

```typescript
// ❌ WRONG - walletBalance is not a number
if (balanceData?.walletBalance && amount > balanceData.walletBalance) {
  toast.error('Insufficient Balance', {
    description: `You need K ${amount.toFixed(2)} but only have K ${balanceData.walletBalance.toFixed(2)} in your wallet.`
    //                                                                                        ^^^^^^^ Error!
  })
}
```

## Prisma Decimal Type

From `prisma/schema.prisma`:

```prisma
model Wallet {
  id        String   @id @default(cuid())
  balance   Decimal  @default(0) @db.Decimal(10, 2)
  // ...
}
```

When Prisma returns a `Decimal` field through an API:
- It's serialized as a **string** or **Decimal object**
- It's NOT a native JavaScript number
- Methods like `.toFixed()` don't exist on it

## Solution Applied

### Before (Incorrect)
```typescript
// Assuming walletBalance is already a number
if (balanceData?.walletBalance && amount > balanceData.walletBalance) {
  toast.error('Insufficient Balance', {
    description: `You need K ${amount.toFixed(2)} but only have K ${balanceData.walletBalance.toFixed(2)} in your wallet.`
    //                                                              ❌ TypeError!
  })
  return
}
```

### After (Correct)
```typescript
// Convert to number before comparison and formatting
if (balanceData?.walletBalance && amount > Number(balanceData.walletBalance)) {
  toast.error('Insufficient Balance', {
    description: `You need K ${amount.toFixed(2)} but only have K ${Number(balanceData.walletBalance).toFixed(2)} in your wallet.`
    //                                                              ✅ Works!
  })
  return
}
```

## Changes Made

**File**: `components/ViewBalances.tsx` (Line 176-181)

1. ✅ Added `Number()` conversion in comparison: `amount > Number(balanceData.walletBalance)`
2. ✅ Added `Number()` conversion before `.toFixed()`: `Number(balanceData.walletBalance).toFixed(2)`

## Why This Works

### The `Number()` Constructor
```typescript
Number("123.45")    // → 123.45 (number)
Number(123.45)      // → 123.45 (number)
Number(null)        // → 0
Number(undefined)   // → NaN

// Works with Prisma Decimal strings
Number("500.00")    // → 500 (number)
```

### Safe Type Conversion
The optional chaining (`?.`) already ensures `walletBalance` exists before the conversion:
```typescript
if (balanceData?.walletBalance && amount > Number(balanceData.walletBalance)) {
  //               ^^^^^^^^^^^^^ Exists check
  //                                         ^^^^^^^ Safe to convert
}
```

## Type Definitions

The `BalanceData` interface:

```typescript
interface BalanceData {
  walletBalance: number | null  // Actually comes as Decimal/string from Prisma
  savingsBalance: number | null
  groups: Group[]
}
```

**Note**: The type says `number | null`, but at runtime it's a Prisma Decimal (serialized as string). This is a common pattern with Prisma.

## Related Code Using Same Pattern

The component already handles this correctly in other places:

```typescript
// Line 292 - Display wallet balance
<p className="text-3xl font-bold tracking-tight">
  K {Number(balanceData?.walletBalance ?? 0).toFixed(2)}
  //  ^^^^^^^ Already converted!
</p>

// Line 505 - Display user balance
<p className="text-2xl font-bold text-teal-900 dark:text-teal-200">
  K {selectedGroup ? Number(selectedGroup.userBalance).toFixed(2) : "0.00"}
  //                 ^^^^^^^ Converted
</p>
```

## Testing

### Test Case 1: Valid Balance Check
```typescript
balanceData.walletBalance = "100.50" (Prisma Decimal as string)
amount = 150

// Comparison
150 > Number("100.50")  // → 150 > 100.5 → true ✅

// Toast message
`You need K ${150.toFixed(2)} but only have K ${Number("100.50").toFixed(2)} in your wallet.`
// → "You need K 150.00 but only have K 100.50 in your wallet." ✅
```

### Test Case 2: Sufficient Balance
```typescript
balanceData.walletBalance = "200.00"
amount = 150

// Comparison
150 > Number("200.00")  // → 150 > 200 → false ✅

// Toast does not show, contribution proceeds ✅
```

### Test Case 3: Null Balance
```typescript
balanceData.walletBalance = null
amount = 150

// Check fails early
if (balanceData?.walletBalance && ...) 
//                               ^^^^^ false, condition stops here ✅

// Toast does not show, but API will handle the error ✅
```

## Impact

### Before Fix ❌
```
User clicks "Contribute"
→ Runtime Error: walletBalance.toFixed is not a function
→ App crashes
→ User sees error screen
→ Contribution never attempted
```

### After Fix ✅
```
User clicks "Contribute" with insufficient funds
→ Client-side check runs successfully
→ Toast appears: "Insufficient Balance
   You need K 150.00 but only have K 100.50 in your wallet."
→ App continues working
→ User knows exact shortfall
```

## Alternative Solutions Considered

### Option 1: Type Guard
```typescript
const walletBalance = typeof balanceData.walletBalance === 'number' 
  ? balanceData.walletBalance 
  : Number(balanceData.walletBalance)

if (balanceData?.walletBalance && amount > walletBalance) {
  toast.error('Insufficient Balance', {
    description: `You need K ${amount.toFixed(2)} but only have K ${walletBalance.toFixed(2)} in your wallet.`
  })
}
```
**Verdict**: More verbose, unnecessary for this use case

### Option 2: Parse Float
```typescript
if (balanceData?.walletBalance && amount > parseFloat(balanceData.walletBalance)) {
  toast.error('Insufficient Balance', {
    description: `You need K ${amount.toFixed(2)} but only have K ${parseFloat(balanceData.walletBalance).toFixed(2)} in your wallet.`
  })
}
```
**Verdict**: Works, but `Number()` is more consistent with rest of codebase

### Option 3: Update Type Definition (Selected ✅)
Use `Number()` consistently as the codebase already does, and accept that Prisma Decimals need conversion.

## Lessons Learned

1. **Prisma Decimals**: Always convert Prisma Decimal types to numbers before using number methods
2. **Consistent Conversion**: The codebase already uses `Number()` in display logic—extend to validation
3. **Runtime vs Types**: TypeScript types may say `number`, but runtime value could be Decimal/string
4. **Check Other Places**: Ensure all uses of Prisma Decimal fields include conversion

## Files Modified

- ✅ `components/ViewBalances.tsx` (Lines 176, 178)

## Status

- ✅ Fixed type conversion error
- ✅ Added `Number()` to comparison
- ✅ Added `Number()` before `.toFixed()`
- ✅ No linter errors
- ✅ Consistent with existing code patterns

---

**Fixed Date**: December 2024  
**Error Type**: Runtime TypeError  
**File**: `components/ViewBalances.tsx`  
**Lines**: 176-181  
**Status**: ✅ Fixed and Working

