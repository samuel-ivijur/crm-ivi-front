export interface Communication {
    id: number;
    beneficiary: {
        id: number;
        name: string;
    };
    services: number;
    movements: number;
    secretariat: number;
    monitoringReminder: number;
    initalTrigger: number;
    total: number;
    date: string;
}