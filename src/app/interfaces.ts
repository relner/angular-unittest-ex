export interface ReturnData {
    numbers: number[],
    operators: string[]
}

export enum ESymbol {
    operator,
    letter,
    _number,
    point,
    minus
}

export enum Operators {
    plus = '+',
    minus = '-',
    multiply = '*',
    divide = '/'
}