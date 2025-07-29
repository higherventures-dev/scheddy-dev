export function getBookingStatusImage(status: number): string {
  switch (status) {
    case 0:
      return "/assets/images/progress-canceled.png";
    case 1:
      return "/assets/images/progress-unconfirmed.png";
    case 2:
      return "/assets/images/progress-confirmed.png";
    case 3:
      return "/assets/images/progress-completed.png";
    default:
      return "";
  }
}