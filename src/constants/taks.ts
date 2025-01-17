export const TaskPriorities = {
    Urgent: 1,
    High: 2,
    Medium: 3,
    Low: 4,
    WithoutPriority: 5
}

export const TaskPriorityLabels = {
    [TaskPriorities.Urgent]: 'Urgente',
    [TaskPriorities.High]: 'Alta',
    [TaskPriorities.Medium]: 'Média',
    [TaskPriorities.Low]: 'Baixa',
    [TaskPriorities.WithoutPriority]: 'Sem Prioridade'
}

export const TaskPriorityColors = {
    [TaskPriorities.Urgent]: '#9333EA',
    [TaskPriorities.High]: '#4F46E5',
    [TaskPriorities.Medium]: '#A5B4FC',
    [TaskPriorities.Low]: '#E5E7EB',
    [TaskPriorities.WithoutPriority]: '#6B7280'
}

export const TaskStatus = {
    PENDING: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    LATE: 4,
    CANCELLED: 5,
}

export const TaskStatusLabels = {
    [TaskStatus.PENDING]: 'Pendente',
    [TaskStatus.IN_PROGRESS]: 'Em Andamento',
    [TaskStatus.COMPLETED]: 'Concluída',
    [TaskStatus.LATE]: 'Atrasada',
    [TaskStatus.CANCELLED]: 'Cancelada',
}