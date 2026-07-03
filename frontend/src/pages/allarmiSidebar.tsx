import type { Dayjs } from "dayjs";
import type { Allarme } from "../types/allarme";
import { Box, Drawer, IconButton, Stack, Typography } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';

type Props = {
    open: boolean;
    onClose: () => void;
    allarmi: Allarme [];
    selectedDate: Dayjs | null;
    clickedTime: string | null;
};

const livelloColore = (livello: string) => {
    if (livello === 'Major') return 'red';
    if (livello === 'Warning') return 'orange';
    return 'yellow';
};

export default function AllarmiSidebar ({ open, onClose, allarmi, selectedDate, clickedTime }: Props) {
    return (
        <Drawer anchor="right" open={open} onClose={onClose}
        slotProps={{
            paper: {
                sx: { width: 300, backgroundColor: '#1f2937', borderLeft: '1px solid #374151' }
            }
        }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                <Stack direction="row" 
                sx={{ justifyContent: "space-between", alignItems:"center",
                    px: 2.5, py: 2, borderBottom: '1px solid #374151' }}
                >
                    <Box>
                        <Typography sx={{ color: 'white', fontWeight: 500 }}>Allarmi attivi</Typography>
                        <Typography sx={{ color: '#9ca3af', fontSize: 12 }}>
                            {selectedDate?.format('DD/MM/YYYY')} {clickedTime && `${clickedTime}`}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: '#9ca3af' }}>
                        <CloseRoundedIcon fontSize="small" />
                    </IconButton>
                </Stack>

                <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    {allarmi.length === 0
                    ? <Typography sx={{ color: '#6b7280', fontSize: 13, textAlign: 'center', mt: 4 }}>
                        Nessun allarme attivo
                    </Typography>
                    : allarmi.map(a => (
                        <Box key={a.id} sx={{
                            backgroundColor: '#111827',
                            border: '1px solid #374151',
                            borderLeft: `3px solid ${livelloColore(a.livello)}`,
                            borderRadius: '10px',
                            p: '12px 14px',
                        }}
                        >
                            <Stack direction="row"
                            sx={{ justifyContent:"space-between", mb: 0.75 }}
                            
                            >
                                <Typography sx={{ color: 'white',fontWeight: 500, fontSize:13 }}>
                                    {a.dispositivo}
                                </Typography>
                                <Stack direction="row"
                                sx={{ alignItems:"center", gap:0.5,
                                    fontSize: 11, color: livelloColore(a.livello) }}
                                >
                                    <ReportProblemRoundedIcon sx={{ fontSize: 13 }} />
                                    <span>{a.livello}</span>
                                </Stack>
                            </Stack>
                            <Typography sx={{ color: '#9ca3af', fontSize: 12, mb: 0.5 }}>{a.descrizione}</Typography>
                            <Typography sx={{ color: '#6b7280', fontSize: 11}}>
                                {a.dataInizio}{a.dataFine ? ` ${a.dataFine}` : ' in corso'}
                            </Typography>
                        </Box>
                    ))
                    }
                </Box>

                <Typography sx={{ color: '#6b7280', fontSize: 12, px: 2.5, py: 1.5, borderTop: '1px solid #374151' }}>
                    {allarmi.length} allarmi attivi
                </Typography>

            </Box>
        </Drawer>
    );
}