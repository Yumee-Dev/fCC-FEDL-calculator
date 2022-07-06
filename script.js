// Redux
const ADD_ZERO = "ADD_ZERO";
const ADD_DIGIT = "ADD_DIGIT";
const ADD_SIGN = "ADD_SIGN";
const ADD_DECIMAL = "ADD_DECIMAL";
const CALCULATE = "CALCULATE";
const CLEAR_INPUT = "CLEAR_INPUT";

const addZero = () => {
  return {
    type: ADD_ZERO
  };
};

const addDigit = (digit) => {
  return {
    type: ADD_DIGIT,
    digit: digit
  };
};

const addSign = (sign) => {
  return {
    type: ADD_SIGN,
    sign: sign
  };
};

const addDecimal = () => {
  return {
    type: ADD_DECIMAL
  };
};

const calculate = () => {
  return {
    type: CALCULATE
  };
};

const clearInput = () => {
  return {
    type: CLEAR_INPUT
  };
};

const calculatorReducer = (
  state = { formula: "", input: "0", calculated: false },
  action
) => {
  switch (action.type) {
    case ADD_ZERO:
      if (state.calculated) {
        return { formula: "", input: "0", calculated: false };
      } else {
        if (/^\+|-|\*|\/$/.test(state.input)) {
          return {
            formula: state.formula + "0",
            input: "0",
            calculated: false
          };
        } else if (state.input === "0") {
          if (state.formula.endsWith("0")) {
            return { formula: state.formula, input: "0", calculated: false };
          } else {
            return {
              formula: state.formula + "0",
              input: "0",
              calculated: false
            };
          }
        } else {
          return {
            formula:
              state.input.length < 20 ? state.formula + "0" : state.formula,
            input: state.input.length < 20 ? state.input + "0" : state.input,
            calculated: false
          };
        }
      }
    case ADD_DIGIT:
      if (state.calculated) {
        return {
          formula: action.digit,
          input: action.digit,
          calculated: false
        };
      } else {
        if (/^\+|-|\*|\/$/.test(state.input)) {
          return {
            formula: state.formula + action.digit,
            input: action.digit,
            calculated: false
          };
        } else if (state.input === "0") {
          if (state.formula.endsWith("0")) {
            return {
              formula:
                state.formula.slice(0, state.formula.length - 1) + action.digit,
              input: action.digit,
              calculated: false
            };
          } else {
            return {
              formula: state.formula + action.digit,
              input: action.digit,
              calculated: false
            };
          }
        } else {
          return {
            formula:
              state.input.length < 20
                ? state.formula + action.digit
                : state.formula,
            input:
              state.input.length < 20
                ? state.input + action.digit
                : state.input,
            calculated: false
          };
        }
      }
    case ADD_SIGN:
      if (state.calculated) {
        return {
          formula: state.input + action.sign,
          input: action.sign,
          calculated: false
        };
      } else {
        if (state.formula.length === 0) {
          return {
            formula: action.sign,
            input: action.sign,
            calculated: false
          };
        } else if (state.formula.length === 1) {
          if (/\d/.test(state.formula)) {
            return {
              formula: state.formula + action.sign,
              input: action.sign,
              calculated: false
            };
          } else {
            return {
              formula: action.sign,
              input: action.sign,
              calculated: false
            };
          }
        } else {
          const c_2 = /\d|\./.test(state.formula.at(-2))
            ? "d"
            : state.formula.at(-2) === "-"
            ? "-"
            : "s";
          const c_1 = /\d|\./.test(state.formula.at(-1))
            ? "d"
            : state.formula.at(-1) === "-"
            ? "-"
            : "s";
          if (action.sign === "-") {
            switch (c_2 + c_1) {
              case "dd":
              case "-d":
              case "sd":
              case "d-":
              case "ds":
                return {
                  formula: state.formula + action.sign,
                  input: action.sign,
                  calculated: false
                };
              case "--":
                return state;
              case "s-":
                return state;
            }
          } else {
            switch (c_2 + c_1) {
              case "dd":
              case "-d":
              case "sd":
                return {
                  formula: state.formula + action.sign,
                  input: action.sign,
                  calculated: false
                };
              case "d-":
              case "ds":
                return {
                  formula:
                    state.formula.slice(0, state.formula.length - 1) +
                    action.sign,
                  input: action.sign,
                  calculated: false
                };
              case "--":
              case "s-":
                return {
                  formula:
                    state.formula.slice(0, state.formula.length - 2) +
                    action.sign,
                  input: action.sign,
                  calculated: false
                };
            }
          }
        }
      }
    case ADD_DECIMAL:
      if (state.calculated || state.formula === "") {
        return { formula: "0.", input: "0.", calculated: false };
      } else {
        if (state.input === ".") {
          return state;
        } else if (/\d/.test(state.input)) {
          // check if there is decimal in the number already
          for (let i = state.formula.length - 1; i > 0; i--) {
            if (/^\+|-|\*|\/$/.test(state.formula[i])) {
              break;
            } else if (state.formula[i] === ".") {
              return state;
            }
          }
          return {
            formula: state.formula + ".",
            input: state.input + ".",
            calculated: false
          };
        } else {
          return {
            formula: state.formula + "0.",
            input: "0.",
            calculated: false
          };
        }
      }
    case CALCULATE:
      if (state.calculated) {
        return state;
      } else {
        const result = eval(state.formula);
        return {
          formula: state.formula + "=" + result,
          input: result,
          calculated: true
        };
      }
    case CLEAR_INPUT:
      return { formula: "", input: "0", calculated: false };
    default:
      return state;
  }
};

const store = Redux.createStore(calculatorReducer);

// React

class Presentational extends React.Component {
  constructor(props) {
    super(props);
  }

  addZero = () => {
    this.props.addZero();
  };

  addDigit = (event) => {
    this.props.addDigit(event.target.dataset.digit);
  };

  addSign = (event) => {
    this.props.addSign(event.target.dataset.sign);
  };

  addDecimal = () => {
    this.props.addDecimal();
  };

  calculate = () => {
    this.props.calculate();
  };

  clearInput = () => {
    this.props.clearInput();
  };

  render() {
    return (
      <div id="column">
        <div></div>
        <div id="calculator">
          <div id="display-container">
            <div id="display-top-row">{this.props.formula}</div>
            <div id="display">{this.props.input}</div>
          </div>
          <div id="buttons">
            <button id="clear" className="btn" onClick={this.clearInput}>
              C
            </button>
            <button
              id="seven"
              className="btn"
              onClick={this.addDigit}
              data-digit="7"
            >
              7
            </button>
            <button
              id="eight"
              className="btn"
              onClick={this.addDigit}
              data-digit="8"
            >
              8
            </button>
            <button
              id="nine"
              className="btn"
              onClick={this.addDigit}
              data-digit="9"
            >
              9
            </button>
            <button
              id="subtract"
              className="btn"
              onClick={this.addSign}
              data-sign="-"
            >
              -
            </button>
            <button
              id="four"
              className="btn"
              onClick={this.addDigit}
              data-digit="4"
            >
              4
            </button>
            <button
              id="five"
              className="btn"
              onClick={this.addDigit}
              data-digit="5"
            >
              5
            </button>
            <button
              id="six"
              className="btn"
              onClick={this.addDigit}
              data-digit="6"
            >
              6
            </button>
            <button
              id="divide"
              className="btn"
              onClick={this.addSign}
              data-sign="/"
            >
              ÷
            </button>
            <button
              id="one"
              className="btn"
              onClick={this.addDigit}
              data-digit="1"
            >
              1
            </button>
            <button
              id="two"
              className="btn"
              onClick={this.addDigit}
              data-digit="2"
            >
              2
            </button>
            <button
              id="three"
              className="btn"
              onClick={this.addDigit}
              data-digit="3"
            >
              3
            </button>
            <button
              id="multiply"
              className="btn"
              onClick={this.addSign}
              data-sign="*"
            >
              ×
            </button>
            <button id="zero" className="btn" onClick={this.addZero}>
              0
            </button>
            <button id="decimal" className="btn" onClick={this.addDecimal}>
              .
            </button>
            <button id="equals" className="btn" onClick={this.calculate}>
              =
            </button>
            <button
              id="add"
              className="btn"
              onClick={this.addSign}
              data-sign="+"
            >
              +
            </button>
          </div>
        </div>
        <div></div>
      </div>
    );
  }
}

// React Redux

const Provider = ReactRedux.Provider;
const connect = ReactRedux.connect;

const mapStateToProps = (state) => {
  return { ...state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addZero: () => {
      dispatch(addZero());
    },
    addDigit: (digit) => {
      dispatch(addDigit(digit));
    },
    addSign: (sign) => {
      dispatch(addSign(sign));
    },
    addDecimal: () => {
      dispatch(addDecimal());
    },
    calculate: () => {
      dispatch(calculate());
    },
    clearInput: () => {
      dispatch(clearInput());
    }
  };
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

const calculatorApp = (
  <Provider store={store}>
    <Container />
  </Provider>
);

ReactDOM.render(calculatorApp, document.getElementById("app"));
