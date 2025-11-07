// Helper to map a total score (raw) to a severity label and styling.
// Thresholds are chosen to match existing admin logic:
// 0-9: None, 10-22: Very mild/questionable, 23-45: Mild, 46-67: Moderate, 68+: Severe
export function getSeverityForScore(score) {
  const s = Number(score) || 0;
  if (s <= 9) return { label: 'None', className: 'bg-green-100 text-green-800 border border-green-200', color: 'green' };
  if (s <= 22) return { label: 'Very mild', className: 'bg-yellow-100 text-yellow-800 border border-yellow-200', color: 'yellow' };
  if (s <= 45) return { label: 'Mild', className: 'bg-orange-100 text-orange-800 border border-orange-200', color: 'orange' };
  if (s <= 67) return { label: 'Moderate', className: 'bg-red-100 text-red-800 border border-red-200', color: 'red' };
  return { label: 'Severe', className: 'bg-red-800 text-white border border-red-900', color: 'red' };
}

export default getSeverityForScore;
