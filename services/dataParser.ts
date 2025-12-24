
import { CSV_DATA, TERMS_MAPPING } from '../constants';
import { PrincipalData } from '../types';

export const parsePrincipalCSV = (csv: string): PrincipalData[] => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const results: PrincipalData[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle quoted fields with commas (like currency)
    const regex = /(".*?"|[^,]+)/g;
    const matches = line.match(regex);
    if (!matches) continue;

    const [name, marginStr, termsStr, barrierStr, revenueStr] = matches.map(m => m.replace(/"/g, '').trim());

    const margin = parseFloat(marginStr.replace('%', ''));
    
    // Normalize terms: extract number, or use mapping for COD/PIA
    let termsNumeric = 0;
    const cleanTerms = termsStr.toUpperCase();
    if (TERMS_MAPPING[cleanTerms]) {
      termsNumeric = TERMS_MAPPING[cleanTerms];
    } else {
      const match = cleanTerms.match(/\d+/);
      termsNumeric = match ? parseInt(match[0]) : 0;
    }

    const revenue = parseFloat(revenueStr.replace(/[$,\s]/g, '')) || 0;
    const barrier = parseInt(barrierStr) || 1;

    results.push({
      id: `${name}-${i}`,
      name,
      margin,
      creditTerms: termsStr,
      creditTermsNumeric: termsNumeric,
      barrierToEntry: barrier,
      revenue
    });
  }

  return results;
};
