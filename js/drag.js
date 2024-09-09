
let focusedElement = null;
const addTextButton = document.querySelector('.addText');
const canvas = document.querySelector('.canvas');
const font = document.getElementById("fontDropdown");
const fontSize = document.getElementById("fontSizeInput");
const boldButton = document.getElementById('bold');
const italicButton = document.getElementById('italic');
const underlineButton = document.getElementById('underline');
const alignButton = document.getElementById('align');
const alignControl = document.querySelector('.align-control');

const undoStack = [];
const redoStack = [];

// Create a text element and add to canvas
addTextButton.addEventListener('click', () => {
    const textField = document.createElement('div');
    textField.classList.add('container');
    textField.innerText = 'Sample Text';
    textField.contentEditable = true;
    textField.setAttribute('tabindex', '0');
    canvas.appendChild(textField);

    textField.addEventListener('mousedown', onMouseDown);
    textField.addEventListener('click', () => {
        focusedElement = textField;
        updateButtonStates();
    });

    saveState(textField, 'add', null, textField);
});

// Handle drag

function onMouseDown(e) {
    const container = e.target;
    container.focus();

    // Get initial positions
    const startX = e.clientX;
    const startY = e.clientY;
    const initialLeft = parseFloat(getComputedStyle(container).left) || 0;
    const initialTop = parseFloat(getComputedStyle(container).top) || 0;

    // Get canvas dimensions
    const { width: canvasWidth, height: canvasHeight } = canvas.getBoundingClientRect();
    
    // Save the initial state for undo
    saveState(container, 'left', `${initialLeft}px`, null);
    saveState(container, 'top', `${initialTop}px`, null);

    // Function to handle dragging
    const onMouseDrag = (event) => {
        let newLeft = initialLeft + event.clientX - startX;
        let newTop = initialTop + event.clientY - startY;

        // Get container dimensions
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();

        // Constrain dragging within canvas bounds
        newLeft = Math.min(Math.max(newLeft, 0), canvasWidth - containerWidth);
        newTop = Math.min(Math.max(newTop, 0), canvasHeight - containerHeight);

        // Apply the new position
        container.style.left = `${newLeft}px`;
        container.style.top = `${newTop}px`;
    };

    // Function to handle mouse up
    const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseDrag);
        document.removeEventListener('mouseup', onMouseUp);

        // Get final positions after dragging
        const finalLeft = parseFloat(getComputedStyle(container).left);
        const finalTop = parseFloat(getComputedStyle(container).top);

        // Only save the final state if it has changed
        if (finalLeft !== initialLeft || finalTop !== initialTop) {
            saveState(container, 'left', `${initialLeft}px`, `${finalLeft}px`);
            saveState(container, 'top', `${initialTop}px`, `${finalTop}px`);
        }
    };

    // Attach event listeners
    document.addEventListener('mousemove', onMouseDrag);
    document.addEventListener('mouseup', onMouseUp);
}


document.querySelectorAll('.container').forEach(container => {
    container.addEventListener('mousedown', onMouseDown);
});



// Update button states based on the focused element's styles
function updateButtonStates() {
    if (focusedElement?.classList.contains('container')) {
        const style = window.getComputedStyle(focusedElement);
        fontSize.value = parseFloat(style.fontSize);
        font.value = style.fontFamily.split(',')[0].trim();

        toggleButtonState(boldButton, style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 700);
        toggleButtonState(italicButton, style.fontStyle === 'italic');
        toggleButtonState(underlineButton, style.textDecoration.includes('underline'));

        alignButton.className = '';  // Reset
        const alignClass = { center: 'center', left: 'left', right: 'right' }[style.textAlign];
        if (alignClass) alignButton.classList.add(alignClass);
    } else {
        resetButtonStates();
    }
}

function toggleButtonState(button, condition) {
    button.classList.toggle('active', condition);
}

function resetButtonStates() {
    boldButton.classList.remove('active');
    italicButton.classList.remove('active');
    underlineButton.classList.remove('active');
    alignButton.className = '';
    font.value = "Verdana";
    fontSize.value = 10;
}


// Apply styles to the focused element
function applyStyle(property, oldValue, newValue) {
    //saving the state for undo-redo
    saveState(focusedElement, property, oldValue, newValue);
    focusedElement.style[property] = newValue;
    updateButtonStates();
}

boldButton.addEventListener('click', () => {
    if (focusedElement?.classList.contains('container')) {
        const oldValue = focusedElement.style.fontWeight || 'normal';
        applyStyle('fontWeight', oldValue, oldValue === 'bold' ? 'normal' : 'bold');
    }
});

italicButton.addEventListener('click', () => {
    if (focusedElement?.classList.contains('container')) {
        const oldValue = focusedElement.style.fontStyle || 'normal';
        applyStyle('fontStyle', oldValue, oldValue === 'italic' ? 'normal' : 'italic');
    }
});

underlineButton.addEventListener('click', () => {
    if (focusedElement?.classList.contains('container')) {
        const oldValue = focusedElement.style.textDecoration || 'none';
        applyStyle('textDecoration', oldValue, oldValue.includes('underline') ? 'none' : 'underline');
    }
});

font.addEventListener('change', function () {
    const selectedFont = this.value;  // Get the selected font

    // Apply the font to the focused element, if any
    if (focusedElement && focusedElement.classList.contains('container')) {
        const oldFont = window.getComputedStyle(focusedElement).fontFamily;  // Get the old font value

        // Save the state before applying the change
        saveState(focusedElement, 'fontFamily', oldFont, selectedFont);

        focusedElement.style.fontFamily = selectedFont;

        // Traverse all child elements and apply the font family
        focusedElement.querySelectorAll('*').forEach(child => {
            child.style.fontFamily = selectedFont;
        });
    }
});


// font functionalities
fontSizeInput.addEventListener('change', () => setFontSize());

function setFontSize() {
    if (focusedElement?.classList.contains('container')) {
        applyStyle('fontSize', `${parseFloat(window.getComputedStyle(focusedElement).fontSize)}px`, `${fontSizeInput.value}px`);
    }
}

function decreaseFontSize() { changeFontSize(-1) }
function increaseFontSize() { changeFontSize(1) }

function changeFontSize(increment) {
    if (focusedElement?.classList.contains('container')) {
        const oldFontSize = parseFloat(window.getComputedStyle(focusedElement).fontSize);
        const newFontSize = oldFontSize + increment;
        applyStyle('fontSize', `${oldFontSize}px`, `${newFontSize}px`);
        fontSizeInput.value = newFontSize;
    }
}

//alignment functionalities

function showControls() {
    alignControl.classList.toggle('display');
    alignControl.classList.toggle('hidden');
}

function setTextAlign(alignment) {
    if (focusedElement?.classList.contains('container')) {
        applyStyle('textAlign', window.getComputedStyle(focusedElement).textAlign, alignment);
    }
}


//undo-redo functionalities

function saveState(element, property, oldValue, newValue) {
    undoStack.push({ element, property, oldValue, newValue });
    redoStack.length = 0;  // Clear redo stack
}

function undo() {
    if (undoStack.length === 0) return;
    const action = undoStack.pop();
    redoStack.push({ ...action });

    if (action.property === 'add') {
        action.element.remove();
    } else if (action.property === 'remove') {
        canvas.appendChild(action.element);
    } else if (action.property === 'left' || action.property === 'top') {
        // Apply the change for dragging (left and top positions)
        action.element.style[action.property] = action.oldValue;
    } else {
        // Apply the change to the container and its child elements
        applyStyleToElementAndChildren(action.element, action.property, action.oldValue);
    }

    updateButtonStates();
}

function redo() {
    if (redoStack.length === 0) return;
    const action = redoStack.pop();
    undoStack.push({ ...action });

    if (action.property === 'add') {
        canvas.appendChild(action.element);
    } else if (action.property === 'remove') {
        action.element.remove();
    } else if (action.property === 'left' || action.property === 'top') {
        // Apply the change for dragging (left and top positions)
        action.element.style[action.property] = action.newValue;
    } else {
        // Apply the change to the container and its child elements
        applyStyleToElementAndChildren(action.element, action.property, action.newValue);
    }

    updateButtonStates();
}

// makes sure all children elements are served
function applyStyleToElementAndChildren(element, property, value) {
    element.style[property] = value;

    element.querySelectorAll('*').forEach(child => {
        child.style[property] = value;
    });
}

function removeElement(element) {
    saveState(element, 'remove', element, null);
    element.remove();
}

