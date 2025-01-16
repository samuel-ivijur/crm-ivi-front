
export const formatCurrency = (value: string) => {
    const numbers = String(value).replace(/\D/g, '')
    const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    }).format(Number(numbers) / 100)
    return formatted
}