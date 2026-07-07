import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const fusOrario = "Europe/Rome";

export function formattaData(iso?: string | null): string {
    if (!iso) return '-';
    return dayjs(iso).tz(fusOrario).format("HH:mm - DD/MM/YYYY");
}

export function formattaOra(iso?: string | null): string {
    if (!iso) return '-';
    return dayjs(iso).tz(fusOrario).format("HH:mm");
}