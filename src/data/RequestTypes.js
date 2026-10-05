export const requestCategories = [
  'IT',
  'HR',
  'PURCHASING',
  'FINANCE',
  'INFRASTRUCTURE',
]

export const requestCategoryLabels = {
  IT: 'Tecnologia',
  HR: 'Recursos Humanos',
  PURCHASING: 'Compras',
  FINANCE: 'Financeiro',
  INFRASTRUCTURE: 'Infraestrutura',
}

export const cardDefinitions = [
    {
        id: "total",
        title: "Total de solicitações",
        dataKey: "qntTotalRequest",
    },
    {
        id: "open",
        title: "Solicitações abertas",
        dataKey: "qntStatusOpen",
    },
    {
        id: "in-progress",
        title: "Solicitações em andamento",
        dataKey: "qntInProgress",
    },
    {
        id: "completed",
        title: "Solicitações concluídas",
        dataKey: "qntCompleted",
    },
];

export const requestStatus = [
  'OPEN',
  'IN_PROGRESS',
  'COMPLETED',
]

export const requestStatusLabels = {
  OPEN: 'Aberta',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluída',
}

export const requestCategoryOptions = requestCategories.map((value) => ({
  value,
  label: requestCategoryLabels[value],
}))

export const requestStatusOptions = requestStatus.map((value) => ({
  value,
  label: requestStatusLabels[value],
}))


