import {
    ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import { Link, useLocation } from 'react-router';

export default function CambioBot () {

    const location = useLocation();
    const alignment = location.pathname === '/tabella' ? 'left' : 'right';
   
    return (
    <ToggleButtonGroup 
    value={alignment}
    exclusive 
    aria-label="switch"
    sx={{height:40, alignSelf:"center", 
        "& .Mui-selected": {
            backgroundColor: "#ff9800 !important",
            color: "white",
        },
    }}
    >
        <ToggleButton value="left" component= {Link} to="/tabella" aria-label='tabella'>
            <TableRowsRoundedIcon sx={{color:'white'}} />
        </ToggleButton>
        <ToggleButton value="right" component= {Link} to="/grafico" aria-label='grafico'>
            <AutoGraphRoundedIcon sx={{color:'white'}} />
        </ToggleButton>
    </ToggleButtonGroup>
    );
}