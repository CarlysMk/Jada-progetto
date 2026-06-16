import { Stack, IconButton } from "@mui/material";
import SelezioneTempo from "../util/selezioneTempo";
import BasicDatePicker from "../util/BasicDatePicker";
import StatoBot from "../util/statobot";
import CambioBot from "../util/cambiobot";
import EventIcon from '@mui/icons-material/Event';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import Char from "../util/char";
import { produzioneMock } from "../data/mockproduzionev2";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AllarmiGrafico } from "./allarmiGrafico";
import { allarmiMock } from "../data/mock";
import AllarmiSidebar from "./allarmiSidebar";
import type { Livello } from "../types/allarme";


function parseAlarmDateTime(value: string) {
    const [time, date] = value.split(' - ');
    return dayjs(`${date} ${time}`, 'DD/MM/YYYY HH:mm');
}

function getAllarmiAtTime(date: Dayjs, time: string) {
    const clickedDt = dayjs(`${date.format('DD/MM/YYYY')} ${time}`, 'DD/MM/YYYY HH:mm');
    return allarmiMock.filter(a => {
        const start = parseAlarmDateTime(a.dataInizio);
        const end = a.dataFine ? parseAlarmDateTime(a.dataFine) : null;
        return start.isBefore(clickedDt) && (end === null || end.isAfter(clickedDt));
  });
}

export default function GraficoUtenti () {
    const [selectedDate, setSelectedDate] = useState <Dayjs | null> (dayjs());
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [clickedTime, setClickedTime] = useState <string | null> (null);
    const [allarmiSidebar, setAllarmiSidebar] = useState <typeof allarmiMock> ([]);
    const [livelliFiltro, setLivelliFiltro] = useState<Livello[]>([]);

    const extractDate = (fullString: string) => {
        return fullString.split(' - ')[1];
    };
    const filteredData = produzioneMock.filter(item => {
        if (!selectedDate) return false;

        const itemDate = extractDate(item.data);
        return dayjs(itemDate, "DD/MM/YYYY")
        .format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");
    });

    const nextDay = selectedDate ? selectedDate.add(1, 'day') : null;
    const nextDayMidnight = nextDay ? produzioneMock.find(item => 
        item.data === `00:00 - ${nextDay.format("DD/MM/YYYY")}`
    )
    :null;

    const chartData = nextDayMidnight 
    ? [...filteredData, { ...nextDayMidnight, data: `24:00 - ${selectedDate!.format("DD/MM/YYYY")}`}]
    : filteredData;

    const handlePointClick = (time: string) => {
        if (!selectedDate) return;
        setClickedTime(time);
        setAllarmiSidebar(getAllarmiAtTime(selectedDate, time));
        setSidebarOpen(true);
    };

    return (
        <>

        <Stack direction='row'>
            <h1 className="text-white text-3xl pl-8 font-sans">Allarmi</h1>
            
            <Stack direction="row" spacing={2}
            sx={{ml:'auto', mr:3}}
            >
                <SelezioneTempo />
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

        <Char  data={chartData} onPointClick={handlePointClick}/>

        <AllarmiGrafico 
        allarmi={allarmiMock}
        selectedDate={selectedDate}
        livelliFiltro={livelliFiltro}
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