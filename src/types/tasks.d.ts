export type Task = {
    id: number;
    title: string;
    deadline: string;
    createdat: string;
    status: {
        id: number;
        description: string;
    };
    priority: {
        id: number;
        description: string;
    };
    responsible?: {
        id: number;
        name: string;
    };
}