import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import type { Livello } from "../types/allarme";

type Props = {
    value: Livello[];
    onChange: (livelli: Livello[]) => void;
};

export default function StatoBot({ value, onChange }: Props) {
    const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: Livello | "all") => {
        if (newValue.includes("all")) {
            onChange([]);
        } else {
            onChange(newValue as unknown as Livello[]);            
        }
    };

    return (
        <>
        <ToggleButtonGroup
        value={value}
        onChange={handleChange}
        sx={{height:40, alignSelf:"center",
            "& .MuiToggleButton-root": {
                color:"white",
                backgroundColor:"#red !important"
            },
            "& .Mui-selected": {
                backgroundColor: "#ff9800 !important",
                
            },
        }}
        >
            <ToggleButton value="all" selected={value.length === 0}>
                <ReportProblemRoundedIcon /> TUTTI
            </ToggleButton>
            <ToggleButton value="Major">
                <ReportProblemRoundedIcon /> Major
            </ToggleButton>
            <ToggleButton value="Warning">
                <ReportProblemRoundedIcon /> Warning
            </ToggleButton>
            <ToggleButton value="Minor">
                <ReportProblemRoundedIcon /> Minor
            </ToggleButton>
        </ToggleButtonGroup>
        </>
    );
}