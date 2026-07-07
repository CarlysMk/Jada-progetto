import Box from '@mui/material/Box';
import type { Allarme, Livello } from '../types/allarme';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const fusOrario = 'Europe/Rome';

type Props = {
    allarmi: Allarme[];
    selectedDate: Dayjs | null;
    livelliFiltro: Livello[];
};

const puntiTotali = 288;

type AlarmSegment = {
    startIndex: number;
    endIndex: number;
    livello: Livello;
};

type AlarmRow = {
    dispositivo: string;
    segments: AlarmSegment[];
};

function extractDateTime (value: string) {
    return dayjs(value);
}

function timeToIndex(time: string): number {
    const [hh, mm] = time.split(':').map(Number);
    return Math.floor((hh * 60 + mm) / 5);
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

export function AllarmiGrafico({ allarmi, selectedDate, livelliFiltro }: Props) {

    const allarmiFiltered = livelliFiltro.length === 0
    ? allarmi
    : allarmi.filter(a => livelliFiltro.includes(a.livello))

    if (!allarmiFiltered.length || !selectedDate) {
        return (
            <Box sx={{ textAlign: 'center', mt: 1, color: 'white'}}>
                Nessun allarme per il giorno selezionato
            </Box>
        );
    }
    const rows: AlarmRow[] = Object.values(
        allarmiFiltered.reduce<Record<string, AlarmRow>>((acc, a) => {
            const start = extractDateTime(a.dataInizio);
            const end = a.dataFine
            ? extractDateTime(a.dataFine)
            : dayjs();

            const dayStart = selectedDate.startOf('day');
            const dayEnd = selectedDate.endOf('day');

            if (end.isBefore(dayStart) || start.isAfter(dayEnd)) {
                return acc;
            }

            const effectiveStart = start.isBefore(dayStart)
            ? dayStart
            : start;

            const effectiveEnd = end.isAfter(dayEnd)
            ? dayEnd
            : end;

            let startIndex = timeToIndex(effectiveStart.tz(fusOrario).format("HH:mm"));
            let endIndex = timeToIndex(effectiveEnd.tz(fusOrario).format("HH:mm"));

            startIndex = Math.max(0, Math.min(startIndex, puntiTotali - 1));
            endIndex = Math.max(0, Math.min(endIndex, puntiTotali - 1));

            if (!acc[a.dispositivo]) {
                acc[a.dispositivo] = {
                    dispositivo: a.dispositivo, segments: [],
                };
            }

            acc[a.dispositivo].segments.push({
                startIndex, endIndex, livello: a.livello,
            });

            return acc;
            
        }, {})
    );
    
    return (
        <Box sx={{ mt: 2 }}>
            {rows.map(row => (
                <Box
                key={row.dispositivo}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                >
                    <Box sx={{ width: 100, fontSize: 12 }}>
                        {row.dispositivo}
                    </Box>
                    <Box
                    sx={{
                        position: 'relative',
                        flex: 1,
                        height: 14,
                        backgroundColor: '#223244',
                        borderRadius: 1,
                        overflow: 'hidden',
                        ml: '-30px',  // uguale a yAxis width
                        mr: '24px',
                    }}
                    >
                        {row.segments.map((s, i) => {
                            const left = (s.startIndex / puntiTotali) * 100;
                            const width = Math.max (
                                ((s.endIndex - s.startIndex + 1) / puntiTotali) * 100, 0.5
                            );
                            
                            return (
                                <Box
                                key={i}
                                sx={{
                                    position: 'absolute',
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    height: '100%',
                                    backgroundColor: alarmColor(s.livello),
                                }}
                                />
                            );
                        })}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}