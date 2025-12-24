
import React from 'react';
import { BarrierLevel } from './types';

export const CSV_DATA = `Principal, Margin,Credit Terms from Principals (Days),"Low Barrier of Entry/Easier Opening up Discussion/1,2,3",Revenue
Amedei,46%,60x,3," $ 43,678.17 "
Botter,48%,90,1," $ 11,693.82 "
Brown-Forman,25%,30,1," $ 794,017.19 "
Casa Cuervo,27%,90,1," $ 370,996.00 "
Cinco Spirits,33%,120,3," $ 7,791.74 "
Craft Spirits,21%,90,3," $ 2,158.64 "
Dalla Valle,31%,30x,3," $ 3,908.45 "
Fevertre,44%,45,1," $ 618,545.05 "
Fifth Generation,48%,30,2," $ 80,407.70 "
Fratelli Branca,36%,60,1," $ 107,036.88 "
Haromex,36%,90,1," $ 30,720.18 "
House of Hazelwood,14%,160,3," $ 8,761.82 "
JC Master,33%,45,2," $ 29,105.36 "
Kimbo,38%,90,2," $ 790,406.70 "
LAIBA,31%,30,3," $ 2,779.64 "
Frescobaldi,39%,90,3," $ 25,960.82 "
Martingale Cogna,100%,90,3, $ 236.36 
Milestone Beverages ,27%,COD,3," $ 3,124.09 "
Molinari,80%,90,2, $ 260.00 
Montenegro,55%,60,1," $ 47,096.06 "
Nestle Waters,49%,60,1," $ 2,099,306.27 "
Orion Breweries,52%,90,2," $ 1,144,766.88 "
Proximo Spirits,33%,90,2," $ 94,702.16 "
PTanamera,25%,60,1," $ 80,700.82 "
Scrappy's Bitters,73%,COD,1, $ 463.82 
Frapin,31%,90,3," $ 11,607.38 "
Snow Hong Kong,68%,45,3," $ 656,927.50 "
Anónima Damm,61%,120,3," $ 327,829.56 "
Stauning Whisk,29%,60,2," $ 4,145.09 "
The Gin Company,43%,90,2," $ 2,982.73 "
GlenAllachie,25%,90,1," $ 72,072.91 "
Nikka Whisky,49%,60,1," $ 676,993.91 "
Tokki Soju ,45%,COD,2," $ 9,216.55 "
Vincente,55%,PIA,2," $ 6,701.44 "
Pommery,38%,90,3," $ 13,691.21 "`;

export const BARRIER_COLORS: Record<number, string> = {
  [BarrierLevel.EASY]: '#22c55e', // green-500
  [BarrierLevel.MEDIUM]: '#eab308', // yellow-500
  [BarrierLevel.HARD]: '#ef4444' // red-500
};

// Map COD and PIA to specific numeric values beyond 120
// We also need to handle the 160 case in the chart mapping logic
export const TERMS_MAPPING: Record<string, number> = {
  'COD': 170,
  'PIA': 200
};

export const REVENUE_SCALE_FACTOR = 0.05;
