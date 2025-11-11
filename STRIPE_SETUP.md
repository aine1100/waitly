# Stripe Payment Integration Setup Guide

## Overview
The preorder system now requires payment via Stripe before users are added to the waitlist. Users pay $399 per device (20% early bird discount from $499 retail price).

## Setup Steps

### 1. Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com) and create an account
2. Complete your business profile
3. Enable test mode for development

### 2. Get Your API Keys
1. Go to Stripe Dashboard → Developers → API keys
2. Copy your **Secret key** (starts with `sk_test_` for test mode)
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Add them to your `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 3. Set Up Webhook for Payment Confirmation
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to your `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

### 4. Test the Webhook Locally (Development)
For local testing, use Stripe CLI:

```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Linux: Download from https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhook
```

This will give you a webhook signing secret for local testing (starts with `whsec_`).

### 5. Update Notion Database
Add a new property to your Notion database:
- **Name**: `Status`
- **Type**: Select
- **Options**: `Paid`, `Pending`, `Cancelled`

Add another property:
- **Name**: `Payment ID`
- **Type**: Text

### 6. Test Payment Flow

#### Test Card Numbers (Stripe Test Mode):
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any ZIP code.

### 7. Pricing Configuration
Current pricing is set in `/api/create-checkout/route.ts`:

```typescript
unit_amount: 39900, // $399.00 per device
```

To change the price, update this value (amount in cents).

## How It Works

### User Flow:
1. User fills out the preorder form (name, email, quantity)
2. Clicks "Proceed to Payment - $399/device"
3. Redirected to Stripe Checkout page
4. Completes payment with credit card
5. Redirected to success page with confetti 🎉
6. Receives confirmation email

### Backend Flow:
1. Form submission creates Stripe checkout session
2. User completes payment on Stripe
3. Stripe sends webhook to `/api/webhook`
4. Webhook handler:
   - Verifies payment
   - Adds user to Notion database with "Paid" status
   - Sends confirmation email via Resend
5. User is now on the official waitlist

## Production Checklist

Before going live:

- [ ] Switch to Stripe live mode keys (remove `_test_`)
- [ ] Update webhook endpoint to production URL
- [ ] Test the complete flow with a real card
- [ ] Update product images URL in checkout session
- [ ] Verify Resend email domain is configured
- [ ] Test webhook is receiving events
- [ ] Set up Stripe email receipts (optional)
- [ ] Configure tax collection if needed (Stripe Tax)

## Troubleshooting

### Webhook Not Receiving Events
- Check webhook URL is publicly accessible
- Verify webhook secret is correct
- Check Stripe Dashboard → Webhooks → Recent deliveries for errors
- Use `stripe listen` for local testing

### Payment Succeeds But User Not Added
- Check webhook logs in Stripe Dashboard
- Verify Notion API key and database ID
- Check server logs for errors
- Ensure all metadata fields are present

### Email Not Sending
- Verify Resend API key is correct
- Check Resend dashboard for delivery status
- Ensure "from" email is verified in Resend

## Support

For Stripe issues: [https://support.stripe.com](https://support.stripe.com)
For Notion API: [https://developers.notion.com](https://developers.notion.com)
For Resend: [https://resend.com/docs](https://resend.com/docs)
