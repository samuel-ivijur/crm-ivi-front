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
    [TaskPriorities.Urgent]: '#EF4444', // Tailwind red-500
    [TaskPriorities.High]: '#F97316', // Tailwind orange-500
    [TaskPriorities.Medium]: '#F59E0B', // Tailwind yellow-500
    [TaskPriorities.Low]: '#10B981', // Tailwind green-500
    [TaskPriorities.WithoutPriority]: '#6B7280' // Tailwind gray-500
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

export const TaskStatusColors = {
    [TaskStatus.PENDING]: '#F59E0B', // Tailwind yellow-500
    [TaskStatus.IN_PROGRESS]: '#3B82F6', // Tailwind blue-500
    [TaskStatus.COMPLETED]: '#10B981', // Tailwind green-500
    [TaskStatus.LATE]: '#FBBF24', // Tailwind yellow-400
    [TaskStatus.CANCELLED]: '#EF4444', // Tailwind red-500
}