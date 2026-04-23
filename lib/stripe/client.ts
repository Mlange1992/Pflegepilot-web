// @ts-ignore — stripe wird zur Laufzeit auf dem Server verfügbar sein
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Stripe = require('stripe')

// Stripe-Instanz — nur serverseitig verwenden (nie im Client-Bundle)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe: any = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-06-20',
})

export const STRIPE_PRICES = {
  single: process.env.STRIPE_PRICE_SINGLE_ID ?? '',
  familie: process.env.STRIPE_PRICE_FAMILIE_ID ?? '',
}
