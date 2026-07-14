import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

type Props = {
    labels: string[];
    value: [number, number];
    onChange: (value: [number, number]) => void;
};

export default function BrushSlider({ labels, value, onChange }: Props) {
    if (labels.length < 2) return null;

    return (
        <Box sx={{  pl: '70px', pr: '24px', mt: -1, mb: 2 }}>
            <Slider
                value={value}
                onChange={(_e, v) => {
                    const [start, end] = v as number[];
                    if (end > start) onChange([start, end]);
                }}
                min={0}
                max={labels.length - 1}
                step={1}
                disableSwap
                valueLabelDisplay="auto"
                valueLabelFormat={(idx) => labels[idx] ?? ''}
                sx={{
                    color: '#4fc3f7',
                    '& .MuiSlider-thumb': {
                        height: 14,
                        width: 14,
                        backgroundColor: '#4fc3f7',
                    },
                    '& .MuiSlider-track': { height: 3},
                    '& .MuiSlider-rail': { height: 3, opacity: 0.3, backgroundColor: 'white' },
                    '& .MuiSlider-valueLabel': { backgroundColor: '#223244'},
                }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -0.5 }}>
                <Typography variant="caption" sx={{ color: 'white' }}>
                    {labels[value[0]]}
                </Typography>
                <Typography variant="caption" sx={{ color: 'white' }}>
                    {labels[value[1]]}
                </Typography>
            </Box>
        </Box>
    );
}