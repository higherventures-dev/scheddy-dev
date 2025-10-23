// e.g. in sendBookingRequestEmail.ts
const APP_BASE_URL = (process.env.APP_BASE_URL || 'https://scheddy.us').replace(/\/+$/, '')
const SIGNUP_URL = process.env.SIGNUP_URL || `${APP_BASE_URL}/signup`
const signupCtaUrl = `${SIGNUP_URL}?email=${encodeURIComponent(toEmail)}`

// Use signupCtaUrl in the button + plaintext fallback
