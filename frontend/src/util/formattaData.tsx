import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const fusOrario = "Europe/Rome";

export function formattaData(iso: string): string {
    return dayjs(iso).tz(fusOrario).format("HH:mm - DD/MM/YYYY");
}

export function formattaOra(iso: string): string {
    return dayjs(iso).tz(fusOrario).format("HH:mm");
}