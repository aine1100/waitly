# Webhook Troubleshooting Guide

## Problem: Users not being saved to Notion database after payment

### Common Causes:

## 1. ⚠️ Testing Locally (Most Common Issue)

**Problem**: Stripe webhooks cannot reach `localhost` - they need a public URL.

**Solution**: Use Stripe CLI to forward webhooks to your local server:

```bash
# Install Stripe CLI
# Windows (using Scoop):
scoop install stripe

# Mac:
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server (keep this running)
stripe listen --forward-to localhost:3000/api/webhook
```

This will give you a webhook signing secret like `whsec_xxxxx`. Add it to your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Important**: Keep the `stripe listen` command running while testing!

---

## 2. 🔑 Missing Environment Variables

Check that ALL these variables are in your `.env.local` file:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Notion
NOTION_API_KEY=secret_xxxxx
NOTION_DATABASE_ID=xxxxx

# Resend (for emails)
RESEND_API_KEY=re_xxxxx
```

**How to check**:
1. Open `.env.local` file
2. Verify all variables are present
3. Restart your dev server after adding variables

---

## 3. 🗄️ Wrong Notion Database ID

**Problem**: Using `NOTION_DB` instead of `NOTION_DATABASE_ID`

**Solution**: Make sure your `.env.local` has:

```env
NOTION_DATABASE_ID=your_database_id_here
```

NOT:
```env
NOTION_DB=your_database_id_here  # ❌ Wrong variable name
```

---

## 4. 📊 Notion Database Schema Mismatch

Your Notion database MUST have these exact properties:

| Property Name | Type   | Notes                          |
|---------------|--------|--------------------------------|
| Name          | Title  | Customer's name                |
| Email         | Email  | Customer's email               |
| PreOrders     | Number | Number of devices (not "Preorders") |
| Status        | Select | Must have "Waiting" option     |
| amount        | Number | Total payment amount           |

**How to fix**:
1. Go to your Notion database
2. Click the "..." menu → "Properties"
3. Verify each property name matches EXACTLY (case-sensitive!)
4. Add missing properties if needed

---

## 5. 🌐 Webhook Not Configured in Stripe Dashboard

**For Production** (when deployed):

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter URL: `https://yourdomain.com/api/webhook`
4. Select event: `checkout.session.completed`
5. Copy the signing secret
6. Add to production environment variables

---

## How to Debug

### Step 1: Check Server Logs

After making a test payment, check your terminal/console for these logs:

✅ **Good logs** (webhook working):
```
🔔 Webhook received!
✅ Webhook signature verified. Event type: checkout.session.completed
💳 Processing checkout.session.completed event
📋 Metadata: { customer_name: 'John Doe', customer_email: 'john@example.com', device_quantity: '2' }
💾 Adding to Notion database...
✅ Added to Notion: page-id-here
📧 Sending confirmation email...
✅ Email sent to: john@example.com
🎉 Successfully processed payment and added to waitlist: john@example.com
```

❌ **Bad logs** (webhook not working):
```
# No logs at all = webhook not reaching your server
# Use Stripe CLI!
```

### Step 2: Check Stripe Dashboard

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click on your webhook endpoint
3. Check "Recent deliveries" tab
4. Look for errors or failed deliveries

### Step 3: Test with Stripe CLI

```bash
# Trigger a test webhook
stripe trigger checkout.session.completed
```

This will send a test event to your local server.

---

## Quick Fix Checklist

- [ ] Stripe CLI is installed and running (`stripe listen`)
- [ ] All environment variables are in `.env.local`
- [ ] Dev server was restarted after adding env variables
- [ ] Notion database has all required properties with correct names
- [ ] `NOTION_DATABASE_ID` (not `NOTION_DB`) is used
- [ ] Webhook secret from Stripe CLI is in `.env.local`
- [ ] Server logs show webhook is being received

---

## Still Not Working?

### Check Notion API Key Permissions

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Find your integration
3. Make sure it has "Insert content" permission
4. Share your database with the integration:
   - Open your Notion database
   - Click "..." → "Connections"
   - Add your integration

### Check Notion Database ID

Get the correct database ID:
1. Open your Notion database in browser
2. URL looks like: `https://notion.so/workspace/DATABASE_ID?v=...`
3. Copy the `DATABASE_ID` part (32 characters, no dashes)
4. Add to `.env.local`:
   ```env
   NOTION_DATABASE_ID=abc123def456...
   ```

---

## Testing Flow

1. **Start Stripe CLI**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

2. **Copy the webhook secret** and add to `.env.local`

3. **Restart your dev server**:
   ```bash
   pnpm dev
   ```

4. **Make a test payment**:
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry, any CVC, any ZIP

5. **Check logs** in both:
   - Your terminal (Next.js server)
   - Stripe CLI terminal

6. **Verify in Notion** that the entry was created

---

## Need More Help?

If you're still having issues, check:
- Server console logs for error messages
- Stripe webhook delivery logs
- Notion API response errors
- Network tab in browser dev tools
