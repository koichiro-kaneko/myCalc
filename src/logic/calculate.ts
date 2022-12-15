export type Operator = "+" | "-";
export type NumberCode =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9";
export type ButtonCode = NumberCode | Operator | "." | "D" | "AC" | "=";

export function calculate(button: ButtonCode, state: State): State {
  // 数値かどうか
  if (isNumberButton(button)) {
    return handleNumberButton(button, state);
  }
  // オペレーターかどうか
  if (isOperatorButton(button)) {
    return handleOperatorButton(button, state);
  }
  // .かどうか
  if (isDotButton(button)) {
    return handleDotButton(state);
  }
  // 削除ボタンかどうか
  if (isDeleteButton(button)) {
    return handleDeleteButton(state);
  }
  // ACかどうか
  if (isAllClearButton(button)) {
    return handleAllClearButton();
  }
  // = かどうか
  if (isEqualButton(button)) {
    return handleEqualButton(state);
  }
  return state;
}

export interface State {
  current: string; // 現在表示している内容
  operand: number; // 計算に使用する数値
  operator: string | null; // 現在どの計算をしようとしているか(足し算か引き算か)
  isNextClear: boolean; // 次にクリアすべきかどうか
}
function isNumberButton(button: string): button is NumberCode {
  // button is NumberCode の部分は型ガード(trueを返すと引数のbuttonはNumberCodeであると伝えることができる)
  return (
    button === "0" ||
    button === "1" ||
    button === "2" ||
    button === "3" ||
    button === "4" ||
    button === "5" ||
    button === "6" ||
    button === "7" ||
    button === "8" ||
    button === "9"
  );
}
function handleNumberButton(button: NumberCode, state: State): State {
  if (state.isNextClear) {
    return {
      current: button,
      operand: state.operand,
      operator: state.operator,
      isNextClear: false,
    };
  }
  // 表示が0の場合、そのまま0を返す
  if (state.current === "0") {
    return {
      current: button,
      operand: state.operand,
      operator: state.operator,
      isNextClear: false,
    };
  }
  // 0以外の場合、後ろの数値を付け足していく
  return {
    current: state.current + button,
    operand: state.operand,
    operator: state.operator,
    isNextClear: false,
  };
}
function isOperatorButton(button: string): button is Operator {
  return button === "+" || button === "-";
}
function handleOperatorButton(button: Operator, state: State): State {
  if (state.operator === null) {
    return {
      current: state.current,
      operand: parseFloat(state.current),
      operator: button,
      isNextClear: true, // +キーや-キーを入力した後は数字を消してほしいので、trueをセット
    };
  }
  // +キーや-キーが押された状態でもう一回それらが押された場合、計算する必要がある
  const nextValue = operate(state);
  return {
    current: `${nextValue}`,
    operand: nextValue,
    operator: button,
    isNextClear: true,
  };
}
function isDotButton(button: string) {
  return button === ".";
}
function handleDotButton(state: State): State {
  // 何度もドットボタンを連打した際、ドッドが繋がるのを防止するため、今ドットがあるかを調べる
  if (state.current.indexOf(".") !== -1) {
    return state;
  }
  return {
    current: state.current + ".",
    operand: state.operand,
    operator: state.operator,
    isNextClear: false,
  };
}
function isDeleteButton(button: string) {
  return button === "D";
}
function handleDeleteButton(state: State): State {
  // すでに1文字しか無い場合は0に戻す
  if (state.current.length === 1) {
    return {
      current: "0",
      operand: state.operand,
      operator: state.operator,
      isNextClear: false,
    };
  }
  return {
    current: state.current.substring(0, state.current.length - 1),
    operand: state.operand,
    operator: state.operator,
    isNextClear: false,
  };
}
function isAllClearButton(button: string) {
  return button === "AC";
}
function handleAllClearButton(): State {
  return {
    current: "0",
    operand: 0,
    operator: null,
    isNextClear: false,
  };
}
function isEqualButton(button: string) {
  return button === "=";
}
function handleEqualButton(state: State): State {
  // +キーや-キーが押されていない状態で=を押した時は何もしない
  if (state.operator === null) {
    return state;
  }
  const nextValue = operate(state);
  return {
    current: `${nextValue}`,
    operand: 0,
    operator: null,
    isNextClear: true,
  };
}

function operate(state: State): number {
  // const current = parseFloat(state.current);
  const current = parseFloat(state.current);
  // 足し算の場合
  if (state.operator === "+") {
    return state.operand + current;
  }
  // 引き算の場合
  if (state.operator === "-") {
    return state.operand - current;
  }
  return current;
}
