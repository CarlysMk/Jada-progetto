import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import type { Produzione } from '../types/produzione';


type Props = { 
  data: Produzione[];
  onPointClick?: (time: string) => void;
};

export default function Char({ data, onPointClick }: Props) {
  
  const xLabels = data.map(i => {
    const [timePart] = i.data.split(' - ');
    return timePart;
  });

  const produzione = data.map(i => i.produzione);

  const produzioneStimata = data.map(i => i.produzionestima);

  return (
  <Box sx={{ width: '100%', height: 450 }}>
    <LineChart
      series={[
        { data: produzione, label: 'Reale' },
        { data: produzioneStimata, label: 'Stima', color: 'red'}
      ]}
      xAxis={[
        { scaleType: 'point', data: xLabels, height: 28 },]}
        yAxis={[{ width: 50 }]}
        margin={{ right: 24 }}
        onAxisClick={(_e, axisData) => {
          if (onPointClick && axisData?.axisValue) {
            onPointClick(String(axisData.axisValue));
          }
        }}
        sx={{ 
          cursor: 'pointer',
          '& .MuiChartsAxis-tickLabel': {
            fill: 'white !important'
          },
          '& .MuiChartsAxis-line': {
            stroke: 'white !important'
          },
          '& .MuiChartsAxis-tick': {
            stroke: 'white !important'
          },

        

        }}

      />
    </Box>
  );
}
