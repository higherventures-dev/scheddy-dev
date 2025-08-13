export function getBookingStatusInfo(status: number): { image?: string; name?: string; color?: string } {
  switch (status) {
    case 1:
      return {
        image: "/assets/images/progress-unconfirmed.png",
        name: "Unconfirmed",
        color: "#FF4C4C",
      };
    case 2:
      return {
        image: "/assets/images/progress-confirmed.png",
        name: "Confirmed",
        color: "#FFA500",
      };
    case 3:
      return {
        image: "/assets/images/progress-canceled.png",
        name: "Canceled",
        color: "#FFA500",
      };
    case 4:
      return {
        image: "/assets/images/progress-noshow.png",
        name: "No-show",
        color: "#007BFF",
      };
    case 5:
      return {
        image: "/assets/images/progress-completed.png",
        name: "Completed",
        color: "#28A745",
      };
    default:
      return {};  // all optional, so empty object is fine
  }
}