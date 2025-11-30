# Seed Groups - Documentation

## 📚 Overview

This seed file populates the database with **13 diverse sample groups** for testing and development purposes.

## 👤 User ID

All groups are owned by user: `cmidbcgl00000s3bbkhqvbfr5`

**Important:** Make sure this user exists in your database before running the seed!

## 🎯 Sample Groups Included

### 1. **Weekend Savers Club** 🏖️
- **Privacy:** PUBLIC
- **Frequency:** WEEKLY
- **Amount:** ZMW 5,000/week
- **Interest:** 2.5%
- **Max Members:** 50
- **Purpose:** Small, regular savings for weekend goals

### 2. **Professional Growth Fund** 💼
- **Privacy:** PRIVATE
- **Frequency:** MONTHLY
- **Amount:** ZMW 25,000/month
- **Interest:** 5.0%
- **Max Members:** 30
- **Purpose:** Career development and business investments

### 3. **University Students Savings Circle** 🎓
- **Privacy:** INVITE_ONLY
- **Frequency:** BI_WEEKLY
- **Amount:** ZMW 3,000/bi-weekly
- **Interest:** 1.5%
- **Max Members:** 25
- **Purpose:** Student financial discipline

### 4. **Family Emergency Fund** 🏠
- **Privacy:** PUBLIC
- **Frequency:** MONTHLY
- **Amount:** ZMW 15,000/month
- **Interest:** 3.0%
- **Max Members:** 40
- **Purpose:** Emergency family expenses

### 5. **Entrepreneur Investment Pool** 🚀
- **Privacy:** PRIVATE
- **Frequency:** MONTHLY
- **Amount:** ZMW 50,000/month
- **Interest:** 7.5%
- **Max Members:** 20
- **Purpose:** Business ventures and startup investments

### 6. **Women Empowerment Savings** 💪
- **Privacy:** PUBLIC
- **Frequency:** MONTHLY
- **Amount:** ZMW 10,000/month
- **Interest:** 4.0%
- **Max Members:** 60
- **Purpose:** Women's financial independence

### 7. **Youth Dream Builders** ✨
- **Privacy:** PUBLIC
- **Frequency:** WEEKLY
- **Amount:** ZMW 7,500/week
- **Interest:** 3.5%
- **Max Members:** 100
- **Purpose:** Young people's dreams and goals

### 8. **Housing & Property Fund** 🏘️
- **Privacy:** PRIVATE
- **Frequency:** MONTHLY
- **Amount:** ZMW 100,000/month
- **Interest:** 6.0%
- **Max Members:** 15
- **Purpose:** Property investment and home ownership

### 9. **Retirement Planning Group** 👴
- **Privacy:** PUBLIC
- **Frequency:** MONTHLY
- **Amount:** ZMW 30,000/month
- **Interest:** 5.5%
- **Max Members:** 35
- **Purpose:** Long-term retirement savings

### 10. **Tech Innovators Fund** 💻
- **Privacy:** INVITE_ONLY
- **Frequency:** MONTHLY
- **Amount:** ZMW 20,000/month
- **Interest:** 4.5%
- **Max Members:** 25
- **Purpose:** Technology investments and courses

### 11. **Community Health Fund** 🏥
- **Privacy:** PUBLIC
- **Frequency:** MONTHLY
- **Amount:** ZMW 12,000/month
- **Interest:** 2.0%
- **Max Members:** 80
- **Purpose:** Medical emergencies and health insurance

### 12. **Education Excellence Fund** 📚
- **Privacy:** PUBLIC
- **Frequency:** MONTHLY
- **Amount:** ZMW 18,000/month
- **Interest:** 3.0%
- **Max Members:** 50
- **Purpose:** School fees and educational materials

### 13. **Small Business Boost** 📉
- **Privacy:** PRIVATE
- **Frequency:** MONTHLY
- **Amount:** ZMW 35,000/month
- **Interest:** 6.5%
- **Status:** INACTIVE (archived group)
- **Purpose:** Small business growth (archived example)

## 📊 Statistics

- **Total Groups:** 13
- **PUBLIC:** 7 groups
- **PRIVATE:** 4 groups
- **INVITE_ONLY:** 2 groups
- **ACTIVE:** 12 groups
- **INACTIVE:** 1 group (for testing)

## 🚀 How to Run

### Method 1: Using ts-node (Recommended)

```bash
npx ts-node prisma/seed-groups.ts
```

### Method 2: Using tsx

```bash
npx tsx prisma/seed-groups.ts
```

### Method 3: Add to package.json

Add this script to your `package.json`:

```json
{
  "scripts": {
    "seed:groups": "ts-node prisma/seed-groups.ts"
  }
}
```

Then run:

```bash
npm run seed:groups
```

## ⚠️ Important Notes

### 1. **Prerequisites**

Make sure the user exists before running:

```sql
SELECT * FROM "User" WHERE id = 'cmidbcgl00000s3bbkhqvbfr5';
```

If the user doesn't exist, you'll get an error. Either:
- Create the user first
- Change the `USER_ID` constant in the seed file to an existing user ID

### 2. **Clean-up Behavior**

The seed file will:
- ✅ Delete existing groups with codes starting with `GRP-`
- ✅ Delete associated memberships
- ✅ Create fresh sample groups
- ✅ Create owner memberships for each group

**This means it's safe to run multiple times!**

### 3. **Data Safety**

The clean-up only affects groups with codes starting with `GRP-`, so:
- ✅ Real user-created groups are safe
- ✅ Only sample/seed groups are removed
- ✅ No user data is deleted

## 🔍 Verification

After running the seed, verify the data:

### In Prisma Studio:

```bash
npx prisma studio
```

Navigate to the `Group` model and you should see 13 groups.

### Using SQL:

```sql
-- Count groups
SELECT COUNT(*) FROM "Group" WHERE "groupCode" LIKE 'GRP-%';

-- View all sample groups
SELECT 
  name, 
  privacy, 
  status, 
  "contributionAmount", 
  "contributionFrequency",
  "memberCount"
FROM "Group" 
WHERE "groupCode" LIKE 'GRP-%'
ORDER BY "createdAt" DESC;

-- Verify memberships
SELECT 
  g.name,
  m.role,
  m.status
FROM "Membership" m
JOIN "Group" g ON m."groupId" = g.id
WHERE g."groupCode" LIKE 'GRP-%';
```

### In the App:

Visit: `http://localhost:3000/Groups`

You should see all 12 ACTIVE groups displayed (1 is INACTIVE for testing).

## 🎨 Customization

### Change User ID:

Edit line 5 in `prisma/seed-groups.ts`:

```typescript
const USER_ID = "your-user-id-here"
```

### Add More Groups:

Add objects to the `sampleGroups` array in the seed file.

### Modify Existing Groups:

Edit any group in the `sampleGroups` array.

### Skip Clean-up:

Comment out lines 35-47 in the seed file to keep existing data.

## 🐛 Troubleshooting

### Error: "User not found"

```
❌ User with ID cmidbcgl00000s3bbkhqvbfr5 not found.
```

**Solution:** Update the `USER_ID` constant to match an existing user in your database.

### Error: "Unique constraint failed"

```
Unique constraint failed on the fields: (`groupCode`)
```

**Solution:** The clean-up didn't work. Manually delete groups or change the `groupCode` values.

### Error: "Cannot find module"

```
Cannot find module '@prisma/client'
```

**Solution:** Run `npm install` to install dependencies.

## 📝 Sample Data Features

Each group includes:
- ✅ Unique name and description
- ✅ Custom logo (using DiceBear API)
- ✅ Unique group code (GRP-XXX##)
- ✅ Varied privacy settings
- ✅ Different governance types
- ✅ Realistic contribution amounts
- ✅ Various frequencies (WEEKLY, BI_WEEKLY, MONTHLY, QUARTERLY)
- ✅ Interest rates (1.5% - 7.5%)
- ✅ Max member limits
- ✅ Group rules and bylaws
- ✅ Tags for categorization
- ✅ Mix of active and inactive statuses

## 🔄 Integration with Browse API

The seed data works perfectly with the `/api/groups/browse` endpoint:

```bash
# Get all groups
curl http://localhost:3000/api/groups/browse

# Filter by privacy
curl http://localhost:3000/api/groups/browse?privacy=PUBLIC

# Search
curl http://localhost:3000/api/groups/browse?search=savings

# Combined
curl http://localhost:3000/api/groups/browse?privacy=PUBLIC&status=ACTIVE
```

## 🎯 Testing Scenarios

The seed data is designed to test:

1. **Privacy Filtering**
   - PUBLIC groups (7)
   - PRIVATE groups (4)
   - INVITE_ONLY groups (2)

2. **Status Filtering**
   - ACTIVE groups (12)
   - INACTIVE groups (1)

3. **Contribution Frequencies**
   - WEEKLY
   - BI_WEEKLY
   - MONTHLY
   - QUARTERLY

4. **Governance Types**
   - ADMIN
   - DEMOCRATIC
   - COMMITTEE

5. **Search Functionality**
   - Search by name
   - Search by description
   - Search by tags

6. **Display Variations**
   - Different contribution amounts (ZMW 3,000 - 100,000)
   - Various interest rates (1.5% - 7.5%)
   - Different member limits (15 - 100)
   - Multiple durations (9 - 120 months)

## 🚀 Quick Start

```bash
# 1. Ensure user exists
# 2. Run the seed
npx ts-node prisma/seed-groups.ts

# 3. Start your dev server
npm run dev

# 4. Visit the groups page
# http://localhost:3000/Groups

# 5. Test filtering and search!
```

## 📊 Expected Output

```
🌱 Starting seed process for sample groups...
✅ Found user: CHRISTOPHER ZULU (christopherzulu04@gmail.com)

🗑️  Cleaning up existing sample groups...
   Deleted 13 memberships
   Deleted 13 groups

📦 Creating sample groups...
   ✅ Created: Weekend Savers Club
   ✅ Created: Professional Growth Fund
   ✅ Created: University Students Savings Circle
   ... (all 13 groups)

🎉 Successfully created 13 groups!

📊 Summary:
   - Total groups: 13
   - PUBLIC: 7
   - PRIVATE: 4
   - INVITE_ONLY: 2
   - ACTIVE: 12
   - INACTIVE: 1
```

---

**Happy Testing! 🎉**

