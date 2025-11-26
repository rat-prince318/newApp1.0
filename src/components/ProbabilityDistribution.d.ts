import React from 'react';

interface ProbabilityDistributionProps {
  data?: number[];
}

type DistributionType = 'normal' | 'uniform' | 'exponential' | 'binomial' | 'poisson';

interface DistributionParameters {
  mean?: number;
  stdDev?: number;
  min?: number;
  max?: number;
  lambda?: number;
  n?: number;
  p?: number;
}

interface DistributionDataPoint {
  x: number;
  pdf: number;
  cdf: number;
}

interface Range {
  min: number;
  max: number;
}

declare const ProbabilityDistribution: React.FC<ProbabilityDistributionProps>;

export default ProbabilityDistribution;
export type { DistributionType, DistributionParameters, DistributionDataPoint, Range };