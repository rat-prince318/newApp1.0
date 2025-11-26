import React, { useState, useEffect } from 'react';
import { Box, Text, FormControl, FormLabel, Select, Card, CardBody } from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { normalDistribution } from '../utils/statistics';

interface ProbabilityDistributionProps {
  data?: number[];
}

const ProbabilityDistribution: React.FC<ProbabilityDistributionProps> = ({ data = [] }) => {
  const [distributionType, setDistributionType] = useState('normal');
  const [mean, setMean] = useState(0);
  const [std, setStd] = useState(1);
  const [distributionData, setDistributionData] = useState<Array<{x: number; pdf: number; cdf: number}>>([]);

  // Generate normal distribution data (simplified version)
  useEffect(() => {
    const points = [];
    for (let x = -5; x <= 5; x += 0.1) {
      const pdf = normalDistribution(x, mean, std);
      // 简化的CDF近似计算
      let cdf = 0;
      for (let i = -5; i <= x; i += 0.1) {
        cdf += normalDistribution(i, mean, std) * 0.1;
      }
      points.push({ x, pdf, cdf: Math.min(cdf, 1) });
    }
    setDistributionData(points);
  }, [mean, std]);

  const handleDistributionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistributionType(e.target.value);
  };

  const handleMeanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMean(Number(e.target.value));
  };

  const handleStdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStd(Number(e.target.value));
  };

  // 创建均值选项数组
  const meanOptions = [-3, -2, -1, 0, 1, 2, 3];
  // 创建标准差选项数组
  const stdOptions = [0.5, 1, 2, 3, 5, 10];

  return (
    <Card mb={6} shadow="md">
      <CardBody>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Probability Distribution Analysis
        </Text>
        
        <FormControl mb={4}>
          <FormLabel>Distribution Type</FormLabel>
          <Select
            value={distributionType}
            onChange={handleDistributionChange}
            w="full"
          >
            <option value="normal">Normal Distribution</option>
            <option value="uniform">Uniform Distribution</option>
            <option value="exponential">Exponential Distribution</option>
            <option value="binomial">Binomial Distribution</option>
            <option value="poisson">Poisson Distribution</option>
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Mean (μ)</FormLabel>
          <Select value={mean} onChange={handleMeanChange}>
            {meanOptions.map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Standard Deviation (σ)</FormLabel>
          <Select value={std} onChange={handleStdChange}>
            {stdOptions.map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>
        </FormControl>

        <Box mt={6} height={400}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="pdf" 
                name="Probability Density Function" 
                stroke="#3182ce" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="cdf" 
                name="Cumulative Distribution Function" 
                stroke="#38a169" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardBody>
    </Card>
  );
};

export default ProbabilityDistribution;