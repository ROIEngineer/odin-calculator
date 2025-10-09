/* calculator script - data-driven + small id hooks
   Requires:
   - display element with id="display"
   - container element (keyboard) with class "keys" (or change selector)
   - digit buttons: <button data-num="7">7</button>
   - op buttons:    <button data-op="+">+</button>
   - special ops: clear, back, percent handled via data-op values
*/

(function () {
  // Arithmetic functions
  function add(a,b){return a+b;}
  function subtract(a,b){return a-b;}
  function multiply(a,b){return a*b;}
  function divide(a,b){return a/b;}
  function operate(operator,a,b){
    a = Number(a); b = Number(b);
    switch(operator){
      case '+': return add(a,b);
      case '-': return subtract(a,b);
      case '*': return multiply(a,b);
      case '/': return divide(a,b);
      default: return NaN;
    }
  }

  // UI hooks
  const displayEl = document.getElementById('display');
  const keys = document.querySelector('.keys'); // container for all buttons
  const dotBtn = document.querySelector('[data-num="."]'); // optional
  const MAX_DISPLAY_LENGTH = 14;
  const ROUND_DECIMALS = 10;

  // State
  let firstOperand = null;
  let waitingForSecond = false;
  let operator = null;
  let resultShown = false;

  // Helpers
  function displayValue(v){
    displayEl.textContent = String(v);
  }
  function getDisplay(){ return displayEl.textContent; }
  function formatResult(num){
    if(!isFinite(num)) return num;
    let rounded = Number(num.toFixed(ROUND_DECIMALS));
    let s = String(rounded);
    if (s.indexOf('.') >= 0) s = s.replace(/(?:\.0+|(\.\d+?)0+)$/, '$1');
    if (s.length > MAX_DISPLAY_LENGTH) {
      s = Number(rounded).toExponential(6);
    }
    return s;
  }
  function enableDot(){ if(dotBtn){ dotBtn.disabled = false; dotBtn.style.opacity = 1; } }
  function disableDot(){ if(dotBtn){ dotBtn.disabled = true; dotBtn.style.opacity = 0.6; } }
  function enableDotIfNeeded(){ getDisplay().includes('.') ? disableDot() : enableDot(); }

  function resetAll(){
    firstOperand = null;
    waitingForSecond = false;
    operator = null;
    resultShown = false;
    displayValue('0');
    enableDot();
  }

  function inputDigit(d){
    if(resultShown){
      // start fresh after result
      displayValue(d === '.' ? '0.' : d);
      resultShown = false;
      firstOperand = null;
      operator = null;
      waitingForSecond = false;
      enableDotIfNeeded();
      return;
    }
    if(waitingForSecond){
      // starting second operand
      displayValue(d === '.' ? '0.' : d);
      waitingForSecond = false;
      enableDotIfNeeded();
      return;
    }
    let cur = getDisplay();
    if(cur === '0' && d !== '.') {
      displayValue(d);
    } else {
      if (cur.replace('-', '').length >= MAX_DISPLAY_LENGTH) return; // clamp
      displayValue(cur + d);
    }
    enableDotIfNeeded();
  }

  function backspace(){
    if(resultShown){ resetAll(); return; }
    let s = getDisplay();
    if(s.length <= 1 || (s.length === 2 && s.startsWith('-'))) displayValue('0');
    else displayValue(s.slice(0,-1));
    enableDotIfNeeded();
  }

  function percent(){
    let val = Number(getDisplay()) / 100;
    displayValue(formatResult(val));
    resultShown = true;
    firstOperand = null;
    operator = null;
    waitingForSecond = false;
    enableDotIfNeeded();
  }

  function handleOperator(nextOp){
    // handle special ops
    if(nextOp === 'clear'){ resetAll(); return; }
    if(nextOp === 'back'){ backspace(); return; }
    if(nextOp === '%'){ percent(); return; }

    const inputValue = parseFloat(getDisplay());

    // if operator exists and user pressed operator twice, change operator only
    if(operator && waitingForSecond){
      operator = nextOp;
      return;
    }

    if(firstOperand === null){
      firstOperand = inputValue;
    } else if(operator){
      const result = operate(operator, firstOperand, inputValue);

      if(!isFinite(result)){
        displayValue("Nice try. Can't divide by 0.");
        setTimeout(resetAll, 1500);
        return;
      }
      const formatted = formatResult(result);
      displayValue(formatted);
      firstOperand = Number(formatted);
    }

    operator = nextOp;
    waitingForSecond = true;
    resultShown = false;
    enableDot();
  }

  function handleEquals(){
    const inputValue = parseFloat(getDisplay());
    if(operator === null || firstOperand === null) return;
    if(waitingForSecond) return; // operator then equals with no second number
    const result = operate(operator, firstOperand, inputValue);
    if(!isFinite(result)){
      displayValue("Nice try. Can't divide by 0.");
      setTimeout(resetAll, 1500);
      return;
    }
    const formatted = formatResult(result);
    displayValue(formatted);
    firstOperand = Number(formatted);
    operator = null;
    waitingForSecond = false;
    resultShown = true;
    enableDotIfNeeded();
  }

  // Event delegation for clicks
  keys.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if(!btn) return;
    if(btn.dataset.num !== undefined){
      inputDigit(btn.dataset.num);
      return;
    }
    if(btn.dataset.op !== undefined){
      const op = btn.dataset.op;
      if(op === '='){ handleEquals(); return; }
      handleOperator(op);
      return;
    }
  });

  // Keyboard support
  window.addEventListener('keydown', (ev) => {
    const k = ev.key;
    if((/^[0-9]$/).test(k)){ ev.preventDefault(); inputDigit(k); return; }
    if(k === '.' ){ ev.preventDefault(); inputDigit('.'); return; }
    if(k === 'Enter' || k === '='){ ev.preventDefault(); handleEquals(); return; }
    if(k === '+' || k === '-' || k === '*' || k === '/'){ ev.preventDefault(); handleOperator(k); return; }
    if(k === 'Backspace'){ ev.preventDefault(); backspace(); return; }
    if(k === 'Escape'){ ev.preventDefault(); resetAll(); return; }
    if(k === '%'){ ev.preventDefault(); percent(); return; }
  });

  // expose some functions for console testing if desired
  window.add = add;
  window.subtract = subtract;
  window.multiply = multiply;
  window.divide = divide;
  window.operate = operate;

  // init
  resetAll();
})();
