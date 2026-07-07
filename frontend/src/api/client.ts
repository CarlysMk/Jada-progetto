import type { Allarme } from "../types/allarme";
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

export function getAllarmi(): Promise<Allarme[]> {
    return fetchJson<Allarme[]> (`${api_base_url}/alarms`);
}

export function getProduzione(
    data: string,
    risoluzione: Risoluzione = 'day'
): Promise<Produzione[]> {
    const params = new URLSearchParams({date: data, resolution: risoluzione});
    return fetchJson<Produzione[]> (`${api_base_url}/production?${params}`);
}