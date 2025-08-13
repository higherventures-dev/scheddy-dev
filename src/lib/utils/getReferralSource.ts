export function getReferralSource(referral_source: number): string {
  switch (referral_source) {
    case 1:
      return "Walk-in";
    default:
      return "--";
  }
}