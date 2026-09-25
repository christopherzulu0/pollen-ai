# Docker Environment Variables Setup Guide

## Environment Variables Added to Docker Configuration

All environment variables from your `env.md` file have been successfully added to the Docker files.

### Updated Files:
1. **Dockerfile** - Added build-time arguments for public environment variables
2. **docker-compose.yml** - Added all runtime environment variables and volumes

## Required .env File

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgres://neondb_owner:npg_Ws1DhI2QRHlC@ep-billowing-mouse-a4jjjqoe-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_BpmzrBYpUy6Zt1w1Xd952g2GM8O9lTVy52iEmcEsIJ
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YWNlLXNoaW5lci03My5jbGVyay5hY2NvdW50cy5kZXYk

# VAPI (Voice AI Platform)
NEXT_PUBLIC_VAPI_ASSISTANT_ID=40ab1b50-f5a0-4b32-a7e3-1de3f79659ba
NEXT_PUBLIC_VAPI_API_KEY=2a80a959-809e-42ee-b778-0bbea0b5583e

# Knock Labs (Notifications)
NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY=pk_test_h7xBag5OHw3Dp1YLZv-6VsDKpWsJdqCMEA8Lq_M1P5U
KNOCK_SECRET_API_KEY=sk_test_YURQtIMHX_I2p3WUqw0dWBXivIzGnC07k3JThzPco28

# Uploadthing (File Upload Service)
UPLOADTHING_TOKEN=eyJhcGlLZXkiOiJza19saXZlXzY5YWVmZjRlYzE5MzZkNGY2NjJkNWFhYzM0YjVmZjkxMGM2ZWFmZjNmOWEzMDhlMGIxMzQ5ZWI1Y2Q5NzgwNzYiLCJhcHBJZCI6IjNvaDA4YWZ3cmQiLCJyZWdpb25zIjpbInNlYTEiXX0=

# Celo Blockchain Configuration
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
NEXT_PUBLIC_CELO_NETWORK=alfajores

# OpenAI API
OPENAI_API_KEY=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

# Support Configuration
SUPPORT_TEAM_EMAIL=christopherzulu04@gmail.com

# Zoom Integration
ZOOM_CLIENT_SECRET=J4KLMyMkRNZIC7fmail23MGW2y8VTqI5
ZOOM_CLIENT_ID=QpEVBej1T8ODYu2meYcbng
ZOOM_ACCOUNT_ID=J53pgTC8ShSPNf5VkFm91w

# Google Calendar Integration
ENABLE_GOOGLE_CALENDAR=true
GOOGLE_CALENDAR_ID=primary
GOOGLE_APPLICATION_CREDENTIALS=./pollenblockchain-firebase-adminsdk-fbsvc-731021d8f2.json
```

## Important Notes

1. **Google Calendar Credentials**: Make sure the file `pollenblockchain-firebase-adminsdk-fbsvc-731021d8f2.json` exists in your project root. It will be mounted as a read-only volume in the container.

2. **Neon Database**: Since you're using Neon's cloud PostgreSQL, you don't need `host.docker.internal` configuration.

3. **Running the Application**:
   ```bash
   # Build and start
   docker-compose up --build
   
   # Or run in detached mode
   docker-compose up -d --build
   
   # Stop the application
   docker-compose down
   ```

## Environment Variables by Category

### Build-time Variables (embedded in Next.js build):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY`
- `NEXT_PUBLIC_VAPI_ASSISTANT_ID`
- `NEXT_PUBLIC_VAPI_API_KEY`
- `NEXT_PUBLIC_CELO_NETWORK`

### Runtime Variables (loaded at container startup):
- All other environment variables including secrets

### Secret Variables (never expose in client-side code):
- `CLERK_SECRET_KEY`
- `KNOCK_SECRET_API_KEY`
- `UPLOADTHING_TOKEN`
- `OPENAI_API_KEY`
- `ZOOM_CLIENT_SECRET`
- All other non-NEXT_PUBLIC variables

