







// functions
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;


// variables
let operator, num1, num2;


// operation function
const operate = function(op, a, b) => {
	const x = Number(a);
	const y = Number(b);

	if (Number.isNaN(x) | Number.isNaN(y)) {
		throw new Error('operate: both operands must be numbers');
	}

	switch (op) {
		case '+':
    		case 'add':
      			return roundResult(add(x, y));
    		case '-':
    		case 'subtract':
      			return roundResult(subtract(x, y));
    		case '*':
    		case 'x':
    		case '×':
    		case 'multiply':
      			return roundResult(multiply(x, y));
    		case '/':
    		case '÷':
    		case 'divide':
      			if (y === 0) return 'Error'; // or return Infinity, or throw — choose what your UI expects
      			return roundResult(divide(x, y));
    		default:
      			throw new Error(`operate: unknown operator "${op}"`);
		}
}
