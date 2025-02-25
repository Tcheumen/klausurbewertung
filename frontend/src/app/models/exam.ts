export interface Exam {
    title: string;
    date: string;
    thresholds: {
        pass: number;
        excellent: number;
    };
}
