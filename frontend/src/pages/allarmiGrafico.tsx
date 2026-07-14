import Box from '@mui/material/Box';
import type { Allarme, Livello } from '../types/allarme';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { MouseEvent } from 'react';

dayjs.extend(utc);
dayjs.extend(timezone);

const fusOrario = 'Europe/Rome';

const Dispositivi_Impianto = [ 
    'Inverter 1', 'Inverter 2', 'Inverter 3', 'Inverter 4', 'Inverter 5',
]

type Props = {
    allarmi: Allarme[];
    selectedDate: Dayjs | null;
    livelliFiltro: Livello[];
    windowStart?: Dayjs | null;
    windowEnd?: Dayjs | null;
    onBarClick?: (time: string) => void;
};

type AlarmSegment = {
    startPct: number;
    widthPct: number;
    livello: Livello;
};

type AlarmRow = {
    dispositivo: string;
    segments: AlarmSegment[];
};

const ROW_HEIGHT = 14;
const ROW_MARGIN_BOTTOM = 8;
const VISIBLE_ROWS = 5;

function extractDateTime (value: string) {
    return dayjs(value);
}

function alarmColor(livello: Livello) {
    switch (livello) {
        case 'Minor':
            return 'yellow';
        case 'Warning':
            return 'orange';
        case 'Major':
            return 'red';
        default:
            return '#223244';
    }
}

export function AllarmiGrafico({ allarmi, selectedDate, livelliFiltro, windowStart, windowEnd, onBarClick }: Props) {

    if (!selectedDate) {
        return (
            <Box sx={{ textAlign: 'center', mt: 1, color: 'white'}}>
                Nessun periodo selezionato
            </Box>
        );
    }

    const allarmiFiltered = livelliFiltro.length === 0
        ? allarmi
        : allarmi.filter(a => livelliFiltro.includes(a.livello));

    const rangeStart = (windowStart ?? selectedDate.startOf('day')).tz(fusOrario);
    const rangeEnd = (windowEnd ?? selectedDate.endOf('day')).tz(fusOrario);
    const rangeMs = rangeEnd.diff(rangeStart);

    if (rangeMs <= 0){
        return null;
    }

    const mappaRighe: Record<string, AlarmRow> = Object.fromEntries(
        Dispositivi_Impianto.map(d => [d, { dispositivo: d, segments: [] as AlarmSegment[] }])
    );
 
        allarmiFiltered.forEach(a => {
            const start = extractDateTime(a.dataInizio);
            const end = a.dataFine
                ? extractDateTime(a.dataFine)
                : dayjs();

            if (end.isBefore(rangeStart) || start.isAfter(rangeEnd)) {
                return;
            }

            const effectiveStart = start.isBefore(rangeStart)
                ? rangeStart
                : start;

            const effectiveEnd = end.isAfter(rangeEnd)
                ? rangeEnd
                : end;

            const startPct = (effectiveStart.diff(rangeStart) / rangeMs) * 100;
            const widthPct = Math.max(
                (effectiveEnd.diff(effectiveStart) / rangeMs) * 100, 0.3
            );

            if (!mappaRighe[a.dispositivo]) {
                mappaRighe[a.dispositivo] = {
                    dispositivo: a.dispositivo, segments: [],
                };
            }

            mappaRighe[a.dispositivo].segments.push({
                startPct, widthPct, livello: a.livello,
            });
            
        });

        const dispositiviExtra = Object.keys(mappaRighe).filter(
            d => !Dispositivi_Impianto.includes(d)
        );
        const rows: AlarmRow[] = [...Dispositivi_Impianto, ...dispositiviExtra].map(
            d => mappaRighe[d]
        );

        const handleTrackClick = (event: MouseEvent<HTMLDivElement>) => {
            if (!onBarClick) return;
            const rect = event.currentTarget.getBoundingClientRect();
            const frazione = Math.max(0, Math.min((event.clientX - rect.left) / rect.width, 1));
            const istanteCliccato = rangeStart.add(rangeMs * frazione, 'millisecond');
            onBarClick(istanteCliccato.tz(fusOrario).format('HH:mm'));
        }
    
    return (
        <Box sx={{
            mt: 2,
            maxHeight: VISIBLE_ROWS * (ROW_HEIGHT + ROW_MARGIN_BOTTOM) + ROW_MARGIN_BOTTOM,
            overflow: rows.length > VISIBLE_ROWS ? 'auto' : 'visible',
            pr: rows.length > VISIBLE_ROWS ? 0.5 : 0, 
            }}
        >
            {rows.map(row => (
                <Box
                key={row.dispositivo}
                sx={{ display: 'flex', alignItems: 'center', mb: 1,
                    '.MuiBox-root':{
                        color: 'white'
                    }
                 }}
                >
                    <Box sx={{ width: 100, fontSize: 12, flexShrink: 0, px: 1.2}}>
                        {row.dispositivo}
                    </Box>
                    <Box
                    onClick={handleTrackClick}
                    sx={{
                        position: 'relative',
                        flex: 1,
                        height: ROW_HEIGHT,
                        backgroundColor: '#223244',
                        borderRadius: 1,
                        overflow: 'hidden',
                        ml: '-30px',  // uguale a yAxis width
                        mr: '24px',
                        cursor: onBarClick ? 'pointer' : 'default'
                    }}
                    >
                        {row.segments.map((s, i) => (
                            <Box
                                key={i}
                                sx={{
                                    position: 'absolute',
                                    left: `${s.startPct}%`,
                                    width: `${s.widthPct}%`,
                                    height: '100%',
                                    backgroundColor: alarmColor(s.livello),
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}