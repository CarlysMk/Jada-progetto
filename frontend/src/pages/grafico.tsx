import { Stack, IconButton, Alert } from "@mui/material";
import SelezioneTempo from "../util/selezioneTempo";
import type { FrequenzaVisualizzazione } from "../util/selezioneTempo";
import BasicDatePicker from "../util/BasicDatePicker";
import StatoBot from "../util/statobot";
import CambioBot from "../util/cambiobot";
import EventIcon from '@mui/icons-material/Event';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import Char from "../util/char";
import BrushSlider from "../util/brushSlider";
import { useEffect, useMemo, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { AllarmiGrafico } from "./allarmiGrafico";
import AllarmiSidebar from "./allarmiSidebar";
import { getAllarmi, getProduzione } from "../api/client";
import type { Risoluzione } from "../api/types";
import type { Allarme, Livello } from "../types/allarme";
import type { Produzione } from "../types/produzione";

dayjs.extend(utc);
dayjs.extend(timezone);

const fusOrario = 'Europe/Rome';

const Frequenza_to_Risoluzione: Record<FrequenzaVisualizzazione, Risoluzione> = {
    giornaliero: 'day',
    settimanale: 'week',
};

function getAllarmiAtTime(allarmi: Allarme[], date: Dayjs, time: string) {
    const clickedDt = dayjs.tz(`${date.format('YYYY-MM-DD')}T${time}:00`, fusOrario);

    return allarmi.filter(a => {
        const start = dayjs(a.dataInizio).tz(fusOrario);
        const end = a.dataFine ? dayjs(a.dataFine).tz(fusOrario) : null;
        return start.isBefore(clickedDt) && (end === null || end.isAfter(clickedDt));
  });
}

export default function GraficoUtenti () {
    const [selectedDate, setSelectedDate] = useState <Dayjs | null> (dayjs());
    const [frequenza, setFrequenza] = useState<FrequenzaVisualizzazione>('giornaliero');

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [clickedTime, setClickedTime] = useState <string | null> (null);
    const [livelliFiltro, setLivelliFiltro] = useState<Livello[]>([]);

    const [allarmi, setAllarmi] = useState<Allarme[]>([]);
    const [allarmiSidebar, setAllarmiSidebar] = useState<Allarme[]>([]);

    const [produzione, setProduzione] = useState<Produzione[]>([]);
    const [erroreProduzione, setErroreProduzione] = useState<string | null>(null);

    const [zoomRange, setZoomRange] = useState<string | null>(null);

    // Allarmi: recuperati una volta sola
    useEffect(() => {
        let annullato = false;
        getAllarmi({ skip: 0, take: 500 })
            .then((risultato) => { if (!annullato) setAllarmi(risultato.items); })
            .catch((err) => { if (!annullato) console.error(err); });
        return () => {annullato = true; };
    }, []);

    // Produzione: dipende dal giono selezionato e dalla risoluzione
    useEffect(() => {
        if (!selectedDate) return;
        let annullato = false;

        const risoluzione = Frequenza_to_Risoluzione[frequenza];

        getProduzione(selectedDate.format('YYYY-MM-DD'), risoluzione)
            .then((dati) => { if (!annullato) setProduzione(dati); })
            .catch((err) => { if (!annullato) setErroreProduzione(err.message); })

        return () => {annullato = true; };
    }, [selectedDate, frequenza]);

    useEffect(() => {
        if (produzione.length > 0) {
            setZoomRange([0, produzione.length - 1]);
        } else {
            setZoomRange(null);
        }
    }, [produzione]);

    const zoomLabels = useMemo(
        () => produzione.map(p => dayjs(p.data).tz(fusOrario).format('HH:mm')),
        [produzione]
    );

    const zoomedProduzione = useMemo(() => {
        if (!zoomRange) return produzione;
        return produzione.slice(zoomRange[0], zoomRange[1] + 1);
    }, [produzione, zoomRange]);

    const windowStart = zoomRange && produzione[zoomRange[0]]
        ? dayjs(produzione[zoomRange[0]].data)
        : null;
    const windowEnd = zoomRange && produzione[zoomRange[1]]
        ? dayjs(produzione[zoomRange[1]].data)
        : null;

    const handlePointClick = (time: string) => {
        if (!selectedDate) return;
        setClickedTime(time);
        setAllarmiSidebar(getAllarmiAtTime(allarmi, selectedDate, time));
        setSidebarOpen(true);
    };

    return (
        <>

        <Stack direction='row'>
            <h1 className="text-white text-3xl pl-8 font-sans">Allarmi</h1>
            
            <Stack direction="row" spacing={2}
            sx={{ml:'auto', mr:3}}
            >
                
                <BasicDatePicker 
                value={selectedDate}
                onChange={setSelectedDate}
                />
            </Stack>
        </Stack>
        <Stack direction='row'
        sx={{mt:2.4}}
        >
            <StatoBot value={livelliFiltro} onChange={setLivelliFiltro}/>
            
            <Stack direction="row" spacing={2}
            sx={{ml:'auto', mr:4.9}}
            >
                <CambioBot />
                <IconButton aria-label='event' sx={{color:'white', height:40, alignSelf:"center"}}>
                    <EventIcon />
                </IconButton>
                <IconButton aria-label='download'sx={{color:'white', height:40, alignSelf:"center"}}>
                    <GetAppRoundedIcon />
                </IconButton>
            </Stack>
        </Stack>

        {erroreProduzione && (
            <Alert severity="error" sx={{ mx: 4, mt: 2}}>
                Impossibile caricare la produzione: {erroreProduzione}
            </Alert>
        )}

        <Char  data={zoomedProduzione} onPointClick={handlePointClick}/>

        {zoomRange && (
            <BrushSlider
                labels={zoomLabels}
                value={zoomRange}
                onChange={setZoomRange}
            />
        )}

        <AllarmiGrafico 
        allarmi={allarmi}
        selectedDate={selectedDate}
        livelliFiltro={livelliFiltro}
        windowStart={windowStart}
        windowEnd={windowEnd}
        onBarClick={handlePointClick}
        />
        
        <AllarmiSidebar 
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        allarmi={allarmiSidebar}
        selectedDate={selectedDate}
        clickedTime={clickedTime}
        />
        </>



    );

}