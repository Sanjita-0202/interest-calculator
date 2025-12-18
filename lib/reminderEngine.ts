export function getReminderType(dueDate: Date) {
  const today = new Date();
  const diffDays = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 3) return "UPCOMING_3_DAYS";
  if (diffDays === 1) return "UPCOMING_1_DAY";
  if (diffDays === 0) return "DUE_TODAY";
  if (diffDays < 0) return "OVERDUE";

  return null;
}
