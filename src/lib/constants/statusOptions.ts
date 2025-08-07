export type StatusOption = {
  value: number;
  label: string;
  imageUrl: string;
  color: string;
};

export const STATUS_OPTIONS: StatusOption[] = [
  { value: 1, label: 'Unconfirmed', imageUrl: '/assets/icons/unconfirmed.png', color: '#969696' },
  { value: 2, label: 'Confirmed', imageUrl: '/assets/icons/confirmed.png', color: '#69AADE' },
  { value: 3, label: 'No-show', imageUrl: '/assets/icons/no-show.png', color: '#E5C26A' },
  { value: 4, label: 'Canceled', imageUrl: '/assets/icons/canceled.png', color: '#FF5C66'},
  { value: 5, label: 'Completed', imageUrl: '/assets/icons/completed.png', color: '#80CF93'},
];
