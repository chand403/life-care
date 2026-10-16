import React from 'react';

export function StatusBadge({ status, size = 'sm' }) {
  const norm = (status || '').toLowerCase();

  let dotColor = 'bg-slate-400';
  let textColor = 'text-slate-700';
  let bgColor = 'bg-slate-100';

  if (norm === 'confirmed' || norm === 'received' || norm === 'active' || norm === 'completed') {
    dotColor = 'bg-rose-600';
    textColor = 'text-rose-900';
    bgColor = 'bg-rose-50 border border-rose-200/60';
  } else if (norm === 'pending' || norm === 'submitted' || norm === 'draft') {
    dotColor = 'bg-amber-500';
    textColor = 'text-amber-900';
    bgColor = 'bg-amber-50 border border-amber-200/60';
  } else if (norm === 'cancelled' || norm === 'inactive' || norm === 'no-show') {
    dotColor = 'bg-rose-500';
    textColor = 'text-rose-900';
    bgColor = 'bg-rose-50 border border-rose-200/60';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium ${padding} ${bgColor} ${textColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
