export interface Student {
    mtknr: string;
    nachname: string; 
    vorname: string;
    pversuch: string;
    pvermerk: string;
    sitzplatz: string;
    scores: { [task: string]: number }; // Les scores par exercice
    total: number; // Total des scores
    bewertung?: number | null;
    note?: string;
}
