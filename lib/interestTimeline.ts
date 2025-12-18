export function generateInterestTimeline({
  principal,
  rate,
  startDate,
  endDate,
}: {
  principal: number;
  rate: number;
  startDate: Date;
  endDate: Date;
}) {
  const timeline = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    const dailyInterest = (principal * rate) / (100 * 365);
    timeline.push({
      date: new Date(current),
      interest: Number(dailyInterest.toFixed(2)),
    });
    current.setDate(current.getDate() + 1);
  }

  return timeline;
}
