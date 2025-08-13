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

export const STATUS_OPTIONS: StatusOption[] = [
  { value: 1, label: 'Unconfirmed', imageUrl: '/assets/icons/unconfirmed.png', color: '#969696' },
  { value: 2, label: 'Confirmed', imageUrl: '/assets/icons/confirmed.png', color: '#69AADE' },
  { value: 3, label: 'No-show', imageUrl: '/assets/icons/no-show.png', color: '#E5C26A' },
  { value: 4, label: 'Canceled', imageUrl: '/assets/icons/canceled.png', color: '#FF5C66'},
  { value: 5, label: 'Completed', imageUrl: '/assets/icons/completed.png', color: '#80CF93'},
];
