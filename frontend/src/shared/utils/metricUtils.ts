/** Format an impact factor value, usually 3 decimal places. */
export function formatImpactFactor(ifValue: number | undefined | null): string {
    if (ifValue === undefined || ifValue === null) return 'N/A';
    return ifValue.toFixed(3);
}

/** Format a quartile label (e.g., 'Q1'). */
export function quartileLabel(quartile: 'Q1' | 'Q2' | 'Q3' | 'Q4' | undefined | null): string {
    if (!quartile) return '';
    return quartile;
}

/** Format a CiteScore value, usually 1 decimal place. */
export function formatCiteScore(score: number | undefined | null): string {
    if (score === undefined || score === null) return 'N/A';
    return score.toFixed(1);
}
