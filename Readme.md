#Changes
1. Logo
   - Either
      1. Pig Bank
      2.  Hand Clenzing
      3. Coin

2. Demo page explaining how the product works
    Hero section picture


3. About Us
   - The problem
   * Traditional Barrier
   *


   Services
   1. Digital Loans
     * Normal Loans
     * Crypto Loans

4. Village Banking on Blockchaiin
   * Individual Loans
   * Institution Loans



   #MetaMask
   1. tragic 
2. sadness 
3.penalty 
4.come 
5.expand 
6.inject 
7.siren 
8.exit 
9.champion 
10.meadow 
11.beef 
12. already


#Localhost backup
pg_dump -Fc -v -h localhost -p 5432 -U postgres -d Pollen -f "C:\Users\TAZAMA.CO.ZM\Documents\Pollen.dump"

#Restore
pg_restore -v --no-owner --no-acl -d postgres://neondb_owner:npg_Ws1DhI2QRHlC@ep-billowing-mouse-a4jjjqoe-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require  C:\Users\TAZAMA.CO.ZM\Documents\backup1.dump

# Knock Labs Integration
## Overview
Knock Labs is integrated into the application to provide a robust notification system. This integration allows for real-time notifications to users about various events such as new members joining groups, payment reminders, successful deposits, and more.

## Setup
1. Create an account on [Knock](https://knock.app/)
2. Create a new project in Knock
3. Set up the following environment variables in your `.env` file:
   ```
   NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY=your_public_api_key
   KNOCK_SECRET_API_KEY=your_secret_api_key
   ```

## Usage
The Knock integration is used in the following ways:
1. **Notification Feed**: The `/dashboard/notifications` page displays notifications from Knock
2. **Real-time Updates**: Users receive real-time notifications about important events
3. **Mark as Read**: Users can mark notifications as read individually or all at once

## Implementation Details
- The Knock client is initialized in `/lib/knock.ts`
- The client provides methods for:
  - Identifying users
  - Fetching notifications
  - Marking notifications as read
- The notifications page uses these methods to display and manage notifications

## Adding New Notification Types
To add a new notification type:
1. Create a new workflow in the Knock dashboard
2. Trigger the workflow from your application code
3. Update the notification display logic in the notifications page if needed

For more information, refer to the [Knock documentation](https://docs.knock.app/).
