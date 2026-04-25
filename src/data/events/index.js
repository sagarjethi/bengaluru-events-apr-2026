import { aprilEvents } from './april-2026';
import { mayEvents } from './may-2026';
import { otherEvents } from './other';

// All events, in startDate order. Add new entries to the appropriate
// per-month file; this combine layer stays untouched.
export const events = [...aprilEvents, ...mayEvents, ...otherEvents]
  .sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
