export const calculateTargetDate = (riskLevel: string, startDate: Date = new Date()): string => {
  const targetDate = new Date(startDate);
  
  switch (riskLevel) {
    case 'CRITICAL':
      targetDate.setDate(targetDate.getDate() + 1);
      break;
    case 'HIGH':
      targetDate.setDate(targetDate.getDate() + 7);
      break;
    case 'MEDIUM':
      targetDate.setMonth(targetDate.getMonth() + 1);
      break;
    case 'LOW':
    default:
      targetDate.setMonth(targetDate.getMonth() + 2);
      break;
  }
  
  return targetDate.toISOString();
};

export const getDaysRemaining = (targetDateStr: string): number => {
  const targetDate = new Date(targetDateStr);
  const now = new Date();
  
  // Reset times to midnight for accurate day calculation
  targetDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
};
