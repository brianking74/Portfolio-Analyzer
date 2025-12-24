
export interface PrincipalData {
  id: string;
  name: string;
  margin: number;
  creditTerms: string;
  creditTermsNumeric: number;
  barrierToEntry: number;
  revenue: number;
}

export interface ChartDataPoint {
  x: number;
  y: number;
  z: number;
  name: string;
  originalTerms: string;
  barrier: number;
  revenue: number;
  fill: string;
}

export enum BarrierLevel {
  EASY = 1,
  MEDIUM = 2,
  HARD = 3
}
