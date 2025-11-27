# Installation Steps for Meeting Integration

## 📦 Required Package Installation

Run this command to install the required Google Calendar API package:

```bash
npm install googleapis
```

If you encounter npm errors, try:

```bash
# Clear npm cache
npm cache clean --force

# Then install
npm install googleapis
```

Or manually add to `package.json`:

```json
{
  "dependencies": {
    "googleapis": "^140.0.0"
  }
}
```

Then run:
```bash
npm install
```

## ✅ Verification

After installation, verify the package is installed:

```bash
npm list googleapis
```

You should see output like:
```
pollen-web@0.1.0 /path/to/project
└── googleapis@140.0.0
```

## 🔍 If Installation Fails

1. **Check Node.js version**:
   ```bash
   node --version  # Should be 18.x or higher
   npm --version   # Should be 9.x or higher
   ```

2. **Delete node_modules and package-lock.json**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm install googleapis
   ```

3. **Use Yarn instead** (alternative):
   ```bash
   yarn add googleapis
   ```

## 📋 Full Dependency List

The meeting integration requires these packages (may already be installed):

- ✅ `googleapis` - Google Calendar API client
- ✅ `@knocklabs/node` - Knock notifications (should already be installed)
- ✅ `prisma` - Database ORM (should already be installed)
- ✅ `zod` - Schema validation (should already be installed)

## 🚀 Next Steps

After installation:
1. Follow `GOOGLE_CALENDAR_SETUP.md` for Google API configuration
2. Configure environment variables in `.env`
3. Test the integration by scheduling a meeting

## 💡 Alternative: Manual Setup

If automatic installation doesn't work, you can use the Google APIs REST endpoints directly without the Node.js client library. However, using the `googleapis` package is strongly recommended as it handles authentication, retries, and API versioning automatically.

