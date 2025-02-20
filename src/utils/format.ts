
export const formatCurrency = (value: string) => {
    const numbers = String(value).replace(/\D/g, '')
    const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    }).format(Number(numbers) / 100)
    return formatted
}

export const toPhone = (value: string) => {
    let numbers = String(value).replace(/\D/g, '')
    if ([13, 12].includes(numbers.length) && numbers.slice(0, 2) === '55') {
        numbers = numbers.slice(2)
    }
    if (numbers.length === 11) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
    if (numbers.length === 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`
    }
    return numbers
}