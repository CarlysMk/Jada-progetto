export type Livello = 'Minor' | 'Warning' | 'Major';

export interface Allarme {
    id: number;
    stato: boolean;
    impianto: string;
    azienda: string;
    gruppo: string;
    dispositivo: string;
    livello: Livello;
    dataInizio: string;
    dataFine?: string | null;
    durata?: string | null;
    descrizione: string;
}