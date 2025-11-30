# Setup Guide: AI Credit Scoring

This guide will help you set up the AI Credit Scoring feature for personal savings goals.

## Prerequisites

- OpenAI API account
- OpenAI API key with credits

## Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign in or create an account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (it starts with `sk-...`)
6. **Important**: Save it securely - you won't be able to see it again!

## Step 2: Add API Key to Environment Variables

Add the following to your `.env` file:

```bash
# OpenAI API (for AI Credit Scoring)
OPENAI_API_KEY=sk-proj-...your-actual-key-here...
```

## Step 3: Verify Installation

The following files have been created/updated:

### New Files:
- ✅ `app/api/savings-goals/[goalId]/ai-analysis/route.ts` - API endpoint
- ✅ `AI_CREDIT_SCORING.md` - Feature documentation
- ✅ `SETUP_AI_CREDIT_SCORING.md` - This setup guide

### Updated Files:
- ✅ `components/dashboard/features/personal-savings/personal-savings-tab.tsx` - UI integration

## Step 4: Install Dependencies (if needed)

The OpenAI package should already be installed, but if not:

```bash
npm install openai
# or
yarn add openai
# or
pnpm add openai
```

## Step 5: Test the Feature

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to Personal Savings Dashboard:
   ```
   http://localhost:3000/dashboard/personal-savings
   ```

3. Create a savings goal (if you don't have one)

4. Add some transactions to the goal (at least 2-3 deposits)

5. Click the **"AI Credit Score"** button on the goal card

6. Wait for the AI analysis (should take 2-5 seconds)

7. Review the results in the dialog

## Expected Output

When successful, you should see:

- **Credit Score**: 0-100 with color-coded badge
- **Score Category**: Excellent, Good, Fair, or Poor
- **Risk Level**: Low, Medium, or High
- **Analysis**: 2-3 sentences explaining the assessment
- **Metrics Grid**: Progress, days remaining, contributions
- **Predicted Completion Date**: When the goal will be achieved
- **Recommendations**: 3 actionable steps to improve savings

## Troubleshooting

### Error: "Failed to generate AI analysis"

**Possible Causes**:
1. Invalid or missing API key
2. API key has no credits
3. OpenAI service is down

**Solutions**:
- Verify your API key in `.env` file
- Check your OpenAI account has sufficient credits
- Visit [OpenAI Status](https://status.openai.com) to check service status

### Error: "Goal not found"

**Cause**: Trying to analyze a goal that doesn't exist or doesn't belong to you

**Solution**: Ensure you're analyzing your own goals

### Error: "Unauthorized"

**Cause**: Not logged in

**Solution**: Sign in to your account

### Analysis Taking Too Long

**Normal Duration**: 2-5 seconds

**If longer**:
- Check your internet connection
- OpenAI API might be experiencing high load
- Try again in a few moments

## Cost Information

### Pricing (as of Nov 2025)
- **Model**: `gpt-4o-mini`
- **Cost per analysis**: ~$0.001 - $0.003 (very cheap!)
- **Input tokens**: ~500-700 tokens
- **Output tokens**: ~400-600 tokens

### Estimated Monthly Costs

| Usage | Analyses/Month | Estimated Cost |
|-------|----------------|----------------|
| Light | 10-50 | $0.01 - $0.15 |
| Medium | 50-200 | $0.15 - $0.60 |
| Heavy | 200-1000 | $0.60 - $3.00 |

**Note**: These are approximate costs. Actual costs may vary based on OpenAI pricing changes.

### Cost Optimization Tips

1. **Cache results**: Don't analyze the same goal repeatedly
2. **Rate limiting**: Implement cooldown between analyses (e.g., once per day per goal)
3. **Batch processing**: Analyze multiple goals in one request (future feature)

## API Rate Limits

OpenAI has rate limits based on your account tier:

### Free Tier
- 3 requests per minute
- 200 requests per day

### Paid Tier
- 60+ requests per minute
- Higher daily limits

If you hit rate limits, you'll see an error. Wait a moment and try again.

## Security Best Practices

✅ **Never commit** your `.env` file to git
✅ **Never share** your OpenAI API key publicly
✅ **Use environment variables** for all sensitive data
✅ **Rotate keys** periodically for security
✅ **Monitor usage** in OpenAI dashboard to detect unusual activity

## Feature Usage Tips

### For Best Results:
1. **Add transaction history**: The AI analyzes patterns, so more data = better insights
2. **Set realistic deadlines**: The AI can tell if goals are unrealistic
3. **Regular updates**: Analyze goals periodically to track improvements
4. **Follow recommendations**: The AI provides actionable advice based on your behavior

### What the AI Analyzes:
- Savings consistency (regular vs. irregular deposits)
- Progress rate vs. time remaining
- Required contribution vs. current contribution
- Historical patterns and trends
- Goal feasibility and risk factors

## Next Steps

After setup is complete:

1. ✅ Test the feature with a sample goal
2. ✅ Review the AI analysis output
3. ✅ Adjust your savings based on recommendations
4. ✅ Monitor your progress over time
5. ✅ (Optional) Implement periodic re-analysis

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review `AI_CREDIT_SCORING.md` for detailed documentation
3. Check the console for detailed error messages
4. Verify all environment variables are set correctly

## Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [OpenAI Status Page](https://status.openai.com)
- [OpenAI Community Forum](https://community.openai.com)

---

**Setup Complete!** 🎉

You're now ready to use AI-powered credit scoring for your personal savings goals!

