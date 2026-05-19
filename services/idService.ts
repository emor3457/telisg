/**
 * ID Üretim Servisi (v1.2.2)
 *
 * Format token'ları:
 *   {LOC}   → Lokasyon kodu (örn. "IST")
 *   {TYPE}  → Kayıt tipi ("SG" veya "DF")
 *   {YEAR}  → 2 haneli yıl (örn. "26")
 *   {MONTH} → 2 haneli ay (örn. "05")
 *   {SEQ}   → 4 haneli sıra numarası (örn. "0001")
 *
 * Örnek format: "{LOC}-{TYPE}{YEAR}-{SEQ}"  →  "IST-SG26-0001"
 */
export const generateDisplayID = (
  type: 'SG' | 'DF',
  sequence: number,
  year: string = new Date().getFullYear().toString().slice(-2),
  parentDisplayId?: string,
  subIndex?: number,
  format?: string,
  locationCode?: string,
): string => {
  const loc = locationCode || 'IST';
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const formattedSeq = sequence.toString().padStart(4, '0');

  if (!format) {
    // Eski davranış (geriye dönük uyumluluk)
    if (type === 'SG') {
      return `${loc}-SG${year}-${formattedSeq}`;
    } else {
      if (parentDisplayId) {
        const base = parentDisplayId.replace('-SG', '-DF');
        return `${base}-${subIndex || 1}`;
      }
      return `${loc}-DF${year}-${formattedSeq}-1`;
    }
  }

  // Dinamik format oluştur
  const baseId = format
    .replace('{LOC}', loc)
    .replace('{TYPE}', type)
    .replace('{YEAR}', year)
    .replace('{MONTH}', month)
    .replace('{SEQ}', formattedSeq);

  if (type === 'DF') {
    // Düzeltici faaliyetler ana ID'den türetilir
    if (parentDisplayId) {
      const base = parentDisplayId.replace(new RegExp('-SG', 'g'), '-DF');
      return `${base}-${subIndex || 1}`;
    }
    return `${baseId}-${subIndex || 1}`;
  }

  return baseId;
};
