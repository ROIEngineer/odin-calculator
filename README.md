# **Odin Calculator**

A small, accessible web calculator built with plain HTML/CSS/JavaScript.  
 Implements basic arithmetic, single-pair evaluation with chaining, decimal input, backspace, percent, clear, keyboard support, rounding for long decimals, and a friendly divide-by-zero message.

---

## **Live / Quick demo**

Open `index.html` in your browser (double-click or `Open File…`). Then use the UI or your keyboard to calculate.

---

## **Features**

* `add`, `subtract`, `multiply`, `divide` functions (exposed on `window` for console testing).

* `operate(operator, a, b)` dispatcher.

* Event-delegation driven UI using `data-num` / `data-op` attributes.

* Single-pair evaluation \+ chaining: pressing a second operator evaluates the previous pair (e.g., `12 + 7 - 1 =` produces `18`).

* Decimal input with prevention of multiple dots.

* Backspace (delete last character) and Clear (reset).

* Percent conversion (display /100).

* Keyboard support: digits, `.`, `+ - * /`, `Enter` (=), `Backspace`, `Esc` (clear), `%`.

* Responsive, accessible buttons and visible focus styles.

---

## **Project structure**

/ (project root)  
├─ index.html        ← markup (buttons with data-num / data-op). :contentReference\[oaicite:9\]{index=9}  
├─ styles.css        ← styles & responsive layout. :contentReference\[oaicite:10\]{index=10}  
└─ script.js         ← calculator logic (IIFE). :contentReference\[oaicite:11\]{index=11}

---

## **How it works (short)**

1. Buttons use `data-num` for digits/dot and `data-op` for operators/specials. Clicks are handled by a single listener on the `.keys` container (event delegation).

2. Main state variables:

   * `firstOperand` — stored number / prior result.

   * `operator` — stored operator.

   * `waitingForSecond` — next number starts second operand.

   * `resultShown` — display currently holds a computed result.  
      These are in `script.js` inside an IIFE so they don't leak globals.

3. `operate()` dispatches to the arithmetic functions and results get formatted by `formatResult()` to limit decimal noise and display overflow.

---

## **Usage & Examples**

### **Using the UI**

* Click digits, choose an operator, enter the second number, then press `=`.

* Press `C` to clear.

* Press `.` to enter decimals (only one allowed per number).

* Press the backspace button (if present) to delete the last character.

### **Keyboard**

* Type `0–9`, `.`

* `+ - * /` for operators

* `Enter` or `=` to evaluate

* `Backspace` deletes a digit

* `Esc` clears the calculator

* `%` converts current display to percent

### **Console testing**

Open DevTools → Console and try:

add(3,5)           // 8  
subtract(10,4)     // 6  
multiply(6,7)      // 42  
divide(10,2)       // 5  
operate('+',3,5)   // 8

These functions are attached to `window` by the script for quick testing.

### **Example sequence**

Input: `12` `+` `7` `-` `1` `=`  
 Behavior:

* `12 + 7` evaluates when `-` is pressed → display `19`.

* Then `19 - 1 =` → display `18`.  
   This matches the project requirement for single-pair evaluation & chaining.

---

## **Development / Run locally**

1. Clone or download this repo to your machine.

2. Open `index.html` in any modern browser (no build step required).

If you edit `script.js` or `styles.css`, refresh the page to see changes.

---

## **Known behaviors & gotchas**

* Pressing an operator twice changes the stored operator (it **does not** evaluate the operation twice).

* Pressing `=` too early (without both operands and an operator) does nothing.

* Divide-by-zero displays a snarky message ("Nice try. Can't divide by 0.") and resets after \~1.5s.

* Long decimal results are rounded to 10 decimal places and may be shown in exponential notation if they exceed the display width.

---

## **Possible improvements / TODO**

* Add memory buttons (M+, M-, MR).

* Add parentheses / full expression parsing (currently single-pair chaining only).

* Add unit tests (Jest \+ jsdom) for arithmetic and state transitions.

* Improve accessibility: ARIA labels for each button, better screen-reader announcements.

* Add animations or theming.

---

## **Contributing**

Feel free to open issues or submit PRs. Keep changes small and focused (e.g., one UI improvement or one logic fix per PR). Mention browser compatibility if your change needs it.

---

## **License**

This project is provided for learning/demo purposes. Use and modify freely — adding an explicit license (e.g., MIT) is recommended if you plan to publish widely.

---

If you’d like, I can:

* generate an `MIT` license file,

* add example unit tests for `script.js`, or

* create a short CONTRIBUTING.md to guide collaborators. Which one would you like next?

