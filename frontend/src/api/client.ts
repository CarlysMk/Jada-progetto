import type { Allarme, Livello } from "../types/allarme";
import type { Produzione } from "../types/produzione";
import type { Risoluzione } from "./types";

const api_base_url = 'http://localhost:8000';

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Errore chiamando ${url}: ${response.status} ${response.statusText}`
        );
    }

    return response.json() as Promise<T>;
}

export interface AllarmiFiltri {
    skip: number;
    take: number;
    stato?: 'on' | 'off';
    livello?: Livello;
    impianto?: string;
    azienda?: string;
    gruppo?: string;
    dispositivo?: string;
    descrizione?: string;
    ricerca?: string;
    dataInizio?: string;
    dataFine?: string;
}

export interface AllarmiPaginati {
    items: Allarme[];
    total: number;
}

export function getAllarmi(filtri: AllarmiFiltri): Promise<AllarmiPaginati> {
    const params = new URLSearchParams();
    params.set('skip', String(filtri.skip));
    params.set('take', String(filtri.take));

    if (filtri.stato) params.set('stato', filtri.stato);
    if (filtri.livello) params.set('livello', filtri.livello);
    if (filtri.impianto) params.set('impianto', filtri.impianto);
    if (filtri.azienda) params.set('azienda', filtri.azienda);
    if (filtri.gruppo) params.set('gruppo', filtri.gruppo);
    if (filtri.dispositivo) params.set('dispositivo', filtri.dispositivo);
    if (filtri.descrizione) params.set('descrizione', filtri.descrizione);
    if (filtri.ricerca) params.set('ricerca', filtri.ricerca);
    if (filtri.dataInizio) params.set('dataInizio', filtri.dataInizio);
    if (filtri.dataFine) params.set('dataFine', filtri.dataFine);

    return fetchJson<AllarmiPaginati> (`${api_base_url}/alarms?${params}`);
}

export function getProduzione(
    data: string,
    risoluzione: Risoluzione = 'day'
): Promise<Produzione[]> {
    const params = new URLSearchParams({date: data, resolution: risoluzione});
    return fetchJson<Produzione[]> (`${api_base_url}/production?${params}`);
}