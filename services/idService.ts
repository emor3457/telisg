export const generateDisplayID = (
  type: 'SG' | 'DF',
  sequence: number,
  year: string = new Date().getFullYear().toString().slice(-2),
  parentDisplayId?: string,
  subIndex?: number
) => {
  const loc = "IST";
  const unit = "TT";
  const formattedSeq = sequence.toString().padStart(4, '0');
  
  if (type === 'SG') {
    return `${loc}-${unit}-SG${year}-${formattedSeq}`;
  } else {
    // If we have a parent SG ID, we derive DF from it
    if (parentDisplayId) {
      const base = parentDisplayId.replace('-SG', '-DF');
      return `${base}-${subIndex || 1}`;
    }
    return `${loc}-${unit}-DF${year}-${formattedSeq}-1`;
  }
};
