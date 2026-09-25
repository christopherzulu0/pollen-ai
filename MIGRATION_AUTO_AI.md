# Database Migration for Automatic AI Analysis

## Overview
This migration adds the `AIGoalAnalysis` table to store AI credit scoring results for savings goals.

## ⚠️ Important: Run This Migration

Before using the new automatic AI analysis feature, you **MUST** run the database migration.

## Step 1: Create Migration

Run the following command in your terminal:

```bash
npx prisma migrate dev --name add-ai-goal-analysis
```

This will:
- Create the `AIGoalAnalysis` table
- Add indexes for performance
- Update the Prisma client

## Step 2: Generate Prisma Client

```bash
npx prisma generate
```

This regenerates the Prisma client with the new `AIGoalAnalysis` model.

## Step 3: Verify Migration

Check that the migration was successful:

```bash
npx prisma studio
```

You should see the new `AIGoalAnalysis` table in Prisma Studio.

## What's New

### New Table: `AIGoalAnalysis`

Stores AI analysis results for each savings goal:

| Column | Type | Description |
|--------|------|-------------|
| `id` | String | Unique identifier |
| `savingsGoalId` | String | References SavingsGoal |
| `creditScore` | Int | Score 0-100 |
| `scoreCategory` | String | Excellent/Good/Fair/Poor |
| `riskLevel` | String | Low/Medium/High |
| `analysis` | Text | AI analysis text |
| `recommendations` | String[] | Array of recommendations |
| `predictedCompletionDate` | DateTime | When goal will be completed |
| `onTrack` | Boolean | Whether goal is achievable |
| `confidence` | Int | AI confidence 0-100 |
| `progressPercentage` | Decimal | Current progress % |
| `avgMonthlyContribution` | Decimal | Average monthly amount |
| `requiredMonthlyContribution` | Decimal | Required monthly amount |
| `daysUntilDeadline` | Int | Days remaining |
| `remainingAmount` | Decimal | Amount still needed |
| `createdAt` | DateTime | When analysis was run |

### Updated: `SavingsGoal` Model

Added relationship to `AIGoalAnalysis`:

```prisma
model SavingsGoal {
  // ... existing fields
  aiAnalyses AIGoalAnalysis[]
}
```

## Rollback (if needed)

If you encounter issues, you can rollback:

```bash
npx prisma migrate reset
```

**⚠️ WARNING**: This will delete all data in your database!

For production, use:

```bash
npx prisma migrate resolve --rolled-back add-ai-goal-analysis
```

## Production Deployment

When deploying to production:

1. **Backup your database** first!
2. Run the migration:
   ```bash
   npx prisma migrate deploy
   ```
3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```
4. Restart your application

## Troubleshooting

### Error: "Column already exists"

If you get this error, the migration might have partially run. Try:

```bash
npx prisma migrate resolve --applied add-ai-goal-analysis
npx prisma generate
```

### Error: "Cannot connect to database"

Verify your `DATABASE_URL` in `.env`:

```bash
echo $DATABASE_URL
```

### Error: "Prisma client not generated"

Run:

```bash
npx prisma generate
```

## After Migration

1. ✅ Restart your development server
2. ✅ Create a new savings goal
3. ✅ Check console for: `🤖 AI analysis triggered...`
4. ✅ Wait 5 seconds
5. ✅ Click "AI Credit Score" button
6. ✅ Should see instant results!

## Migration SQL (for reference)

The migration creates this SQL:

```sql
-- CreateTable
CREATE TABLE "AIGoalAnalysis" (
    "id" TEXT NOT NULL,
    "savingsGoalId" TEXT NOT NULL,
    "creditScore" INTEGER NOT NULL,
    "scoreCategory" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "recommendations" TEXT[],
    "predictedCompletionDate" TIMESTAMP(3) NOT NULL,
    "onTrack" BOOLEAN NOT NULL,
    "confidence" INTEGER NOT NULL,
    "progressPercentage" DECIMAL(65,30) NOT NULL,
    "avgMonthlyContribution" DECIMAL(65,30) NOT NULL,
    "requiredMonthlyContribution" DECIMAL(65,30) NOT NULL,
    "daysUntilDeadline" INTEGER NOT NULL,
    "remainingAmount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIGoalAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIGoalAnalysis_savingsGoalId_idx" ON "AIGoalAnalysis"("savingsGoalId");

-- CreateIndex
CREATE INDEX "AIGoalAnalysis_createdAt_idx" ON "AIGoalAnalysis"("createdAt");

-- AddForeignKey
ALTER TABLE "AIGoalAnalysis" ADD CONSTRAINT "AIGoalAnalysis_savingsGoalId_fkey" 
  FOREIGN KEY ("savingsGoalId") REFERENCES "SavingsGoal"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;
```

## Questions?

If you encounter issues:

1. Check the console logs for detailed errors
2. Review `AUTO_AI_ANALYSIS.md` for feature documentation
3. Verify your OpenAI API key is set correctly
4. Ensure PostgreSQL is running

---

**Migration Name**: `add-ai-goal-analysis`  
**Created**: November 28, 2025  
**Status**: Ready to apply  
**Breaking Changes**: None (additive only)

