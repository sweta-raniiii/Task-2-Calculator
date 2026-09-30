// Get elements from HTML

const currentDisplay =
    document.getElementById("current-display");

const previousDisplay =
    document.getElementById("previous-display");


// Calculator variables

let current = "0";
let previous = "";
let operation = null;

let resetScreen = false;


// Update calculator display

function updateDisplay() {

    currentDisplay.textContent = current;

    if (operation && previous !== "") {

        previousDisplay.textContent =
            `${previous} ${operation}`;

    } else {

        previousDisplay.textContent = "";

    }
}


// Add number to display

function appendNumber(number) {

    // After pressing equals,
    // start a new number

    if (resetScreen) {

        current =
            number === "."
                ? "0."
                : number;

        resetScreen = false;

    }

    // Don't allow two decimal points

    else if (
        number === "." &&
        current.includes(".")
    ) {

        return;

    }

    // Replace initial zero

    else if (
        current === "0" &&
        number !== "."
    ) {

        current = number;

    }

    // Add number normally

    else {

        current += number;

    }


    updateDisplay();
}


// Select an operation

function chooseOperation(nextOperation) {

    // If there is already an operation,
    // calculate it first

    if (
        operation !== null &&
        !resetScreen
    ) {

        calculate();

    }


    previous = current;

    operation = nextOperation;

    resetScreen = true;

    updateDisplay();
}


// Calculate result

function calculate() {

    // Nothing to calculate

    if (
        operation === null ||
        previous === ""
    ) {

        return;

    }


    const first =
        parseFloat(previous);

    const second =
        parseFloat(current);

    let result;


    // Perform calculation

    switch (operation) {

        case "+":

            result =
                first + second;

            break;


        case "-":

            result =
                first - second;

            break;


        case "×":

            result =
                first * second;

            break;


        case "÷":

            // Prevent division by zero

            if (second === 0) {

                current = "Error";

                previous = "";

                operation = null;

                resetScreen = true;

                updateDisplay();

                return;
            }


            result =
                first / second;

            break;
    }


    // Remove unnecessary decimal places

    current =
        Number.isInteger(result)
            ? String(result)
            : String(
                parseFloat(
                    result.toFixed(10)
                )
            );


    previous = "";

    operation = null;

    resetScreen = true;

    updateDisplay();
}


// Clear calculator

function clearCalculator() {

    current = "0";

    previous = "";

    operation = null;

    resetScreen = false;

    updateDisplay();
}


// Delete last number

function deleteNumber() {

    if (
        resetScreen ||
        current === "Error"
    ) {

        clearCalculator();

        return;
    }


    if (current.length > 1) {

        current =
            current.slice(0, -1);

    } else {

        current = "0";

    }


    updateDisplay();
}


// Number button clicks

document
    .querySelectorAll("[data-number]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                appendNumber(
                    button.dataset.number
                );

            }
        );

    });


// Operator button clicks

document
    .querySelectorAll("[data-operation]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                chooseOperation(
                    button.dataset.operation
                );

            }
        );

    });


// Equals button

document
    .querySelector(
        '[data-action="equals"]'
    )
    .addEventListener(
        "click",
        calculate
    );


// Clear button

document
    .querySelector(
        '[data-action="clear"]'
    )
    .addEventListener(
        "click",
        clearCalculator
    );


// Delete button

document
    .querySelector(
        '[data-action="delete"]'
    )
    .addEventListener(
        "click",
        deleteNumber
    );


// Keyboard support

document.addEventListener(
    "keydown",
    event => {

        const key = event.key;


        // Numbers and decimal

        if (/^[0-9.]$/.test(key)) {

            appendNumber(key);

        }


        // Addition and subtraction

        else if (
            key === "+" ||
            key === "-"
        ) {

            chooseOperation(key);

        }


        // Multiplication

        else if (
            key === "*" ||
            key.toLowerCase() === "x"
        ) {

            chooseOperation("×");

        }


        // Division

        else if (key === "/") {

            event.preventDefault();

            chooseOperation("÷");

        }


        // Enter or equals

        else if (
            key === "Enter" ||
            key === "="
        ) {

            calculate();

        }


        // Backspace

        else if (key === "Backspace") {

            deleteNumber();

        }


        // Escape or C

        else if (
            key === "Escape" ||
            key.toLowerCase() === "c"
        ) {

            clearCalculator();

        }

    }
);