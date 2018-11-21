import { Injectable, defineInjectable } from '@angular/core';
import { ReturnData, ESymbol, Operators } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class CalcService {

  constructor() { }

  Invoke(expression: string): number{

    let removeBrackets = this.HandleStringBrackets(expression);

    let taskCalculated = this.CalcTaskOrdered(removeBrackets);

    return taskCalculated;
  }

  HandleStringBrackets(expr: string): string
  {
    if (expr.includes('('))
    {
        let openParenthesesIndex = expr.lastIndexOf("(");
        let closeParenthesesIndex = (expr.substr(openParenthesesIndex, expr.length - openParenthesesIndex)).indexOf(")") + openParenthesesIndex;

        expr = `${expr.substr(0, openParenthesesIndex)}${this.CalcTaskOrdered(expr.substr(openParenthesesIndex + 1, closeParenthesesIndex - (openParenthesesIndex + 1)))}${expr.substr(closeParenthesesIndex + 1, (expr.length - closeParenthesesIndex) - 1)}`
        expr = this.HandleStringBrackets(expr);

    }
    return expr;
  }

  CalcTask(returnData: any): number
  {
    if(typeof returnData == 'string') returnData = this.DivideStringToObjectWithTwoArrays(returnData);

    let fullNumber = returnData.numbers[0];

      for (let i = 0; i < returnData.operators.length; i++)
      {
          switch (returnData.operators[i])
          {
              case Operators.plus:
                  fullNumber += returnData.numbers[i + 1];
                  break;

              case Operators.minus:
                  fullNumber -= returnData.numbers[i + 1];
                  break;

              case Operators.multiply:
                  fullNumber = fullNumber * returnData.numbers[i + 1];
                  break;

              case Operators.divide:
                  fullNumber = fullNumber / returnData.numbers[i + 1];
                  break;
          }
      }

      return fullNumber;
  }

  CalcTaskOrdered(returnData: any)
  {
    if(typeof returnData == 'string') returnData = this.DivideStringToObjectWithTwoArrays(returnData);

    let answare = 0;
    let containsItem = returnData.operators.find(item => item == Operators.multiply || item == Operators.divide);

    if (containsItem ==  undefined)
    {
        answare = this.CalcTask(returnData);
        return answare;
    }

    let tempReturnObj: ReturnData =  {numbers: [], operators: []}; 

    for (let i = 0; i < returnData.operators.length; i++)
    {
        if (returnData.operators[i] == Operators.multiply || returnData.operators[i] == Operators.divide)
        {
            for (let y = 0; y < returnData.numbers.length; y++)
            {
                if (y == i)
                {
                    if (returnData.operators[i] == Operators.multiply)
                        tempReturnObj.numbers.push(returnData.numbers[i] * returnData.numbers[i + 1]);
                    if (returnData.operators[i] == Operators.divide)
                        tempReturnObj.numbers.push(returnData.numbers[i] / returnData.numbers[i + 1]);
                    y++;
                }
                else if (y > i)
                {
                    tempReturnObj.numbers.push(returnData.numbers[y]);
                    tempReturnObj.operators.push(returnData.operators[y - 1]);
                }
                else
                {
                    tempReturnObj.numbers.push(returnData.numbers[y]);
                    tempReturnObj.operators.push(returnData.operators[y]);
                }
            }

            answare = this.CalcTaskOrdered(tempReturnObj);

            break;
        }

    };

    return answare;
  }

  HandleStringFunctions(expr: string, bool order): string
  {
      let contains = expr.includes("Sin") || expr.includes("Abs");

      if (!contains) return expr;


      let funcStringLastIndex = expr.includes("Sin") ? expr.lastIndexOf("Sin(") : expr.lastIndexOf("Abs("); 

      string str = expr.Substring(funcStringLastIndex + 4, expr.Length - (funcStringLastIndex + 4));
      string stringWithOutFunctions = HandleStringFunctions(str, order);
      string stringWithOutBrackets = HandleStringBrackets(stringWithOutFunctions, order);
      string myCosFunc = stringWithOutBrackets.Substring(0, stringWithOutBrackets.IndexOf(')'));
      double calcStringWithOutBrackets = InvokeCalcTasks(myCosFunc, order);

      double matchSinus = Regex.IsMatch(expr, @"\bSin\(\b") ? Math.Sin(calcStringWithOutBrackets) : Math.Abs(calcStringWithOutBrackets);

      expr = string.Format("{0}{1}{2}",
          expr.Substring(0, funcStringLastIndex),
          matchSinus,
          stringWithOutBrackets.IndexOf(')') != stringWithOutBrackets.Length -1 ? stringWithOutBrackets.Substring(stringWithOutBrackets.IndexOf(')') + 1, stringWithOutBrackets.Length - (stringWithOutBrackets.IndexOf(')') + 1)) : "");

      expr = HandleStringFunctions(expr, order);

      return expr;
  }

  private DivideStringToObjectWithTwoArrays(str: string): ReturnData {

    let returnData: ReturnData = {numbers: [], operators: []};
    let _checkSymbol: ESymbol;

    let numberStr = '';
    let startOfNumber = false;
    let startOfString = true;

    str = str.replace(/ /g,''); //remove spaces from string

    str.split('').forEach(element => {

      _checkSymbol = this.CheckSymbol(element);
      if(_checkSymbol === ESymbol.letter) throw new Error("Yous string not correct");

      if(_checkSymbol === ESymbol._number || 
         _checkSymbol === ESymbol.point || 
        (_checkSymbol === ESymbol.minus && startOfNumber == true) || 
        (_checkSymbol === ESymbol.minus && startOfString == true)){
          numberStr += element;
          startOfNumber = false;
      } else {
        returnData.operators.push(element);
        returnData.numbers.push(parseFloat(numberStr));

        numberStr = '';
        startOfNumber = true;
      }
      startOfString = false;
    });
    returnData.numbers.push(parseFloat(numberStr));

    return returnData;
  }

  private CheckSymbol(digit: string): ESymbol{

    if(!isNaN(parseFloat(digit))) return ESymbol._number;
    if(digit === '.') return ESymbol.point;
    if(digit === '-') return ESymbol.minus;
    if(digit.match(/[a-z]/i)) return ESymbol.letter;

    return ESymbol.operator;
  }

}
