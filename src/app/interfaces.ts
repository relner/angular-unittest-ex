export interface ReturnData {
    numbers: number[],
    operators: string[]
}

type DecisionFunctionType = (param: number) => number;

export interface MatematicFunctionObject {
    name: string,
    decision: DecisionFunctionType
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