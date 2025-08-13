// src/components/ShowStatus.tsx
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const successStatuses = new Set([true, 'success', 1]);
const failureStatuses = new Set([false, 'fail', 0]);

export function ShowStatus({ status, text }: { status: unknown; text: string }) {
  let Icon = ExclamationCircleIcon; // default neutral icon
  let colorClass = 'text-gray-500';

  if (successStatuses.has(status)) {
    Icon = CheckCircleIcon;
    colorClass = 'text-green-500';
  } else if (failureStatuses.has(status)) {
    Icon = XCircleIcon;
    colorClass = 'text-red-500';
  }

  return (
    
    <span className={`inline-flex items-center ${colorClass}`}>
      <Icon className="w-4 h-4" />
      &nbsp;{text}
    </span>
  );
}
