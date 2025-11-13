# Flutterwave Payment Integration Setup Guide

## Overview
The preorder system now supports both **Flutterwave** (primary) and **Stripe** payment methods. Users can choose their preferred payment gateway before checkout. The default payment method is Flutterwave, but Stripe remains available as an alternative option.

## Flutterwave Setup Steps

### 1. Create a Flutterwave Account
1. Go to [https://flutterwave.com](https://flutterwave.com) and create an account
2. Complete your business profile and KYC verification
3. Enable test mode for development

### 2. Get Your API Keys
1. Go to Flutterwave Dashboard → Settings → API
2. Copy your **Public Key** (starts with `FLWPUBK_TEST-` for test mode)
3. Copy your **Secret Key** (starts with `FLWSECK_TEST-` for test mode)
4. Add them to your `.env.local` file:

```env
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your_key_here
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your_key_here
```

### 3. Set Up Webhook for Payment Verification
1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Enter your webhook URL: `https://yourdomain.com/api/flutterwave-webhook`
3. Copy the **Secret Hash** provided
4. Add it to your `.env.local`:

```env
FLUTTERWAVE_WEBHOOK_SECRET=your_secret_hash_here
```

### 4. Test the Webhook Locally (Development)
For local testing, you can use ngrok or similar tools:

```bash
# Install ngrok
# Windows: choco install ngrok
# Mac: brew install ngrok

# Start your Next.js dev server
npm run dev

# In another terminal, expose your local server
ngrok http 3000

# Use the ngrok URL for webhook: https://your-ngrok-url.ngrok.io/api/flutterwave-webhook
```

### 5. Test Payment Flow

#### Test Card Numbers (Flutterwave Test Mode):
- **Successful Payment**: 
  - Card: `5531886652142950`
  - CVV: `564`
  - Expiry: Any future date
  - PIN: `3310`
  - OTP: `12345`

- **Mastercard**:
  - Card: `5438898014560229`
  - CVV: `564`
  - Expiry: Any future date
  - PIN: `3310`
  - OTP: `12345`

- **Verve Card**:
  - Card: `5061020000000000094`
  - CVV: `347`
  - Expiry: Any future date
  - PIN: `1111`
  - OTP: `12345`

### 6. Pricing Configuration
Current pricing is set in both payment routes:
- `/api/create-flutterwave-payment/route.ts`: `$250 per device`
- `/api/create-checkout/route.ts`: `$250 per device` (Stripe)

To change the price, update the `amount` calculation in both files.

## How It Works

### User Flow:
1. User fills out the preorder form (name, email, quantity)
2. Selects payment method (Flutterwave or Stripe)
3. Clicks "Proceed to Payment - $250/device"
4. Redirected to chosen payment gateway
5. Completes payment
6. Redirected to success page with confetti 🎉
7. Receives confirmation email

### Backend Flow (Flutterwave):
1. Form submission creates Flutterwave payment link via `/api/create-flutterwave-payment`
2. User completes payment on Flutterwave
3. Flutterwave sends webhook to `/api/flutterwave-webhook`
4. Webhook handler:
   - Verifies webhook signature
   - Verifies transaction with Flutterwave API
   - Adds user to Notion database with "Waiting" status
   - Sends confirmation email via Resend
5. User is now on the official waitlist

### Backend Flow (Stripe):
1. Form submission creates Stripe checkout session via `/api/create-checkout`
2. User completes payment on Stripe
3. Stripe sends webhook to `/api/webhook`
4. Webhook handler processes payment and adds to waitlist
5. User receives confirmation email

## Supported Payment Methods

### Flutterwave Supports:
- Credit/Debit Cards (Visa, Mastercard, Verve)
- Bank Transfer
- USSD
- Mobile Money (for African countries)
- Bank Accounts

### Stripe Supports:
- Credit/Debit Cards (Visa, Mastercard, Amex, etc.)
- Apple Pay
- Google Pay

## Production Checklist

Before going live with Flutterwave:

- [ ] Switch to Flutterwave live mode keys (remove `_TEST`)
- [ ] Update webhook endpoint to production URL
- [ ] Test the complete flow with a real card
- [ ] Update product logo URL in payment payload
- [ ] Verify Resend email domain is configured
- [ ] Test webhook is receiving events
- [ ] Configure settlement account in Flutterwave dashboard
- [ ] Enable desired payment methods in Flutterwave settings

Before going live with Stripe (if using):

- [ ] Switch to Stripe live mode keys (remove `_test_`)
- [ ] Update webhook endpoint to production URL
- [ ] Test with real payment methods
- [ ] Configure tax collection if needed

## Switching Default Payment Method

To change the default payment method in the form, edit `src/components/form.tsx`:

```typescript
// Change this line:
const [paymentMethod, setPaymentMethod] = useState<"stripe" | "flutterwave">("flutterwave");

// To use Stripe as default:
const [paymentMethod, setPaymentMethod] = useState<"stripe" | "flutterwave">("stripe");
```

## Troubleshooting

### Flutterwave Webhook Not Receiving Events
- Check webhook URL is publicly accessible
- Verify webhook secret hash is correct
- Check Flutterwave Dashboard → Settings → Webhooks → Logs
- Ensure your server is responding with 200 status

### Payment Succeeds But User Not Added
- Check webhook logs in Flutterwave Dashboard
- Verify Notion API key and database ID
- Check server logs for errors
- Ensure transaction verification succeeds

### Email Not Sending
- Verify Resend API key is correct
- Check Resend dashboard for delivery status
- Ensure "from" email is verified in Resend

### Transaction Verification Fails
- Ensure you're using the correct secret key
- Check that the transaction ID is valid
- Verify your Flutterwave account is active

## Currency Support

Flutterwave supports multiple currencies:
- USD (United States Dollar)
- NGN (Nigerian Naira)
- GHS (Ghanaian Cedi)
- KES (Kenyan Shilling)
- ZAR (South African Rand)
- And many more...

To change currency, update the `currency` field in `/api/create-flutterwave-payment/route.ts`:

```typescript
currency: "NGN", // Change from "USD" to your preferred currency
```

## Support

- **Flutterwave**: [https://support.flutterwave.com](https://support.flutterwave.com)
- **Stripe**: [https://support.stripe.com](https://support.stripe.com)
- **Notion API**: [https://developers.notion.com](https://developers.notion.com)
- **Resend**: [https://resend.com/docs](https://resend.com/docs)

## API Endpoints

### Flutterwave Endpoints:
- **Payment Initialization**: `POST /api/create-flutterwave-payment`
- **Webhook Handler**: `POST /api/flutterwave-webhook`

### Stripe Endpoints (Legacy):
- **Checkout Session**: `POST /api/create-checkout`
- **Webhook Handler**: `POST /api/webhook`

## Security Notes

1. **Never commit API keys** to version control
2. Always use environment variables for sensitive data
3. Verify webhook signatures to prevent fraud
4. Use HTTPS in production for webhook endpoints
5. Implement rate limiting on payment endpoints
6. Log all payment transactions for audit purposes
