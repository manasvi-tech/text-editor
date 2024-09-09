let focusedElement = null;

const addTextButton = document.querySelector('.addText');
const canvas = document.querySelector('.canvas');

// Create a text element and add to canvas
addTextButton.addEventListener('click', function () {
    const textField = document.createElement('div');
    textField.classList.add('container');
    textField.innerText = 'Sample Text';
    
    // initiates the focus
    textField.setAttribute('tabindex', '0');
    canvas.appendChild(textField);

    // Make the new text element focusable and draggable
    textField.addEventListener('mousedown', onMouseDown);
    textField.addEventListener('click', () => {
        focusedElement = textField;  // Update the focused element on click
        updateButtonStates();  // Update button states based on focused element styles
    });

     // Save the state for undo/redo (use 'add' as the property)
     saveState(textField, 'add', null, textField);
});

function onMouseDown(e) {
    const container = e.target;

    // Get the initial position of the container before dragging
    const initialLeft = window.getComputedStyle(container).left;
    const initialTop = window.getComputedStyle(container).top;

    container.focus();  // Focus the container when clicked

    // Drag logic (keeping the container inside the canvas bounds)
    function onMouseDrag(event) {
        let getContainerStyle = window.getComputedStyle(container);
        let leftValue = parseInt(getContainerStyle.left) || 0;  // Fallback to 0 if 'left' is 'auto'
        let topValue = parseInt(getContainerStyle.top) || 0;    // Fallback to 0 if 'top' is 'auto'

        console.log("here")

        console.log(leftValue);
        console.log(topValue);

        const canvasRect = canvas.getBoundingClientRect();
        console.log(canvasRect.width);
        console.log(canvasRect.height);
        const containerRect = container.getBoundingClientRect();
        console.log(containerRect.width);
        console.log(containerRect.height);

        console.log("movement")
        console.log(event.movementX);
        // console.log(event.movementX);
        console.log(event.movementY);

        let newLeft = leftValue + event.movementX;
        let newTop = topValue + event.movementY;

        if (newLeft < 0) newLeft = 0;
        if (newTop < 0) newTop = 0;
        if (newLeft + containerRect.width > canvasRect.width) {
            newLeft = canvasRect.width - containerRect.width;
        }
        if (newTop + containerRect.height > canvasRect.height) {
            newTop = canvasRect.height - containerRect.height;
        }

        container.style.left = `${newLeft}px`;
        container.style.top = `${newTop}px`;
    }

    container.addEventListener("mousemove", onMouseDrag);
    document.addEventListener("mouseup", () => {
        container.removeEventListener("mousemove", onMouseDrag);

        // After dragging, save the new position for undo/redo
        const finalLeft = container.style.left;
        const finalTop = container.style.top;

        // Save both the left and top properties in the undo stack
        saveState(container, 'left', initialLeft, finalLeft);
        saveState(container, 'top', initialTop, finalTop);

        updateButtonStates();  // Update button states after the drag
    }, { once: true });
}


// Button element references
const font = document.getElementById("fontDropdown");
const fontSize = document.getElementById("fontSizeInput");
const boldButton = document.getElementById('bold');
const italicButton = document.getElementById('italic');
const underlineButton = document.getElementById('underline');
const alignButton = document.getElementById('align');
const alignControl = document.querySelector('.align-control'); 

// Function to update button states based on the focused element's styles
function updateButtonStates() {

    if (focusedElement && focusedElement.classList.contains('container')) {
        const computedStyle = window.getComputedStyle(focusedElement);

        // Update font size and value
        fontSize.value = parseFloat(computedStyle.fontSize);
        const firstFont = computedStyle.fontFamily.split(',')[0].trim();
        font.value = firstFont;

        // Update bold button state
        if (computedStyle.fontWeight === 'bold' || parseInt(computedStyle.fontWeight) >= 700) {
            boldButton.classList.add('active');
        } else {
            boldButton.classList.remove('active');
        }

        // Update italic button state
        if (computedStyle.fontStyle === 'italic') {
            italicButton.classList.add('active');
        } else {
            italicButton.classList.remove('active');
        }

        // Update underline button state
        if (computedStyle.textDecoration.includes('underline')) {
            underlineButton.classList.add('active');
        } else {
            underlineButton.classList.remove('active');
        }

        // Update alignment button state (assuming alignment is controlled via text-align)
        const alignValue = computedStyle.textAlign;
        alignButton.className = ''; // Reset
        if (alignValue === 'center') {
            alignButton.classList.add('center');
        } else if (alignValue === 'left') {
            alignButton.classList.add('left');
        } else if (alignValue === 'right') {
            alignButton.classList.add('right');
        }
    } else {
        // Clear all active button states if no element is focused
        boldButton.classList.remove('active');
        italicButton.classList.remove('active');
        underlineButton.classList.remove('active');
        alignButton.className = ''; // Reset alignment button state
        font.value = "Verdana";
        font.value = 10;
    }
}

// Button click event listeners to apply styles to the focused element
boldButton.addEventListener('click', () => {
    if (focusedElement && focusedElement.classList.contains('container')) {

        // focusedElement.style.fontWeight = focusedElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
        const oldValue = focusedElement.style.fontWeight || 'normal';
        const newValue = oldValue === 'bold' ? 'normal' : 'bold';

         // Save the current state before making the change
        saveState(focusedElement, 'fontWeight', oldValue, newValue);
        focusedElement.style.fontWeight = newValue;

        updateButtonStates();  // Update button states after applying the style
    }
});

// Similar click events should be added for italic, underline, and align buttons


italicButton.addEventListener('click', () => {
    if (focusedElement && focusedElement.classList.contains('container')) {
        // focusedElement.style.fontStyle = focusedElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
        const oldValue = focusedElement.style.fontStyle || 'normal';
        const newValue = oldValue === 'italic' ? 'normal' : 'italic';

        focusedElement.style.fontStyle = newValue;

        saveState(focusedElement,'fontStyle',oldValue,newValue);
        
        updateButtonStates();
    }
});

underlineButton.addEventListener('click', () => {
    if (focusedElement && focusedElement.classList.contains('container')) {
        const oldValue = focusedElement.style.textDecoration || 'none';
        const newValue = oldValue.includes('underline') ? 'none' : 'underline';

        // Save the current state before making the change
        saveState(focusedElement, 'textDecoration', oldValue, newValue);

        // Apply the new style
        focusedElement.style.textDecoration = newValue;
        updateButtonStates();  // Update button states after applying the style
    }
});

font.addEventListener('change', function () {
    const selectedFont = this.value;  // Get the selected font
    
    // Apply the font to the focused element, if any
    if (focusedElement && focusedElement.classList.contains('container')) {
        let oldFont = window.getComputedStyle(focusedElement).fontFamily;  // Get the old font value

        // Save the state before applying the change
        saveState(focusedElement, 'fontFamily', oldFont, selectedFont);

        focusedElement.style.fontFamily = selectedFont;
    }
});



const fontSizeInput = document.getElementById('fontSizeInput');

function increaseFontSize() {
    if (focusedElement && focusedElement.classList.contains('container')) {
        const oldFontSize = parseFloat(window.getComputedStyle(focusedElement).fontSize);
        const newFontSize = oldFontSize + 1;  // Increase the font size by 1

        // Save the state before applying the change
        saveState(focusedElement, 'fontSize', `${oldFontSize}px`, `${newFontSize}px`);

        focusedElement.style.fontSize = `${newFontSize}px`;
        fontSizeInput.value = newFontSize;  // Update the input field
    }
}

function decreaseFontSize() {
    if (focusedElement && focusedElement.classList.contains('container')) {
        const oldFontSize = parseFloat(window.getComputedStyle(focusedElement).fontSize);
        if (oldFontSize > parseInt(fontSizeInput.min)) {  // Ensure font size doesn't go below the minimum
            const newFontSize = oldFontSize - 1;  // Decrease the font size by 1

            // Save the state before applying the change
            saveState(focusedElement, 'fontSize', `${oldFontSize}px`, `${newFontSize}px`);

            focusedElement.style.fontSize = `${newFontSize}px`;
            fontSizeInput.value = newFontSize;  // Update the input field
        }
    }
}

function setFontSize() {
    if (focusedElement && focusedElement.classList.contains('container')) {
        const oldFontSize = parseFloat(window.getComputedStyle(focusedElement).fontSize);
        const newFontSize = parseFloat(fontSizeInput.value);
        if (newFontSize >= parseInt(fontSizeInput.min)) {  // Ensure the new font size is valid
            
            // Save the state before applying the change
            saveState(focusedElement, 'fontSize', `${oldFontSize}px`, `${newFontSize}px`);

            focusedElement.style.fontSize = `${newFontSize}px`;
        }
    }
}


function showControls() {
    const alignControl = document.querySelector('.align-control');  // Select the align control element

    if (alignControl.classList.contains('display')) {  // Check for the class 'display'
        alignControl.classList.remove('display');  // Remove 'display' class
        alignControl.classList.add('hidden');  // Add 'hidden' class
    } else {
        alignControl.classList.remove('hidden');  // Remove 'hidden' class
        alignControl.classList.add('display');  // Add 'display' class
    }
}

function setTextAlign(alignment) {
    if (focusedElement && focusedElement.classList.contains('container')) {
        // Get the old text alignment before changing it
        const oldAlignment = window.getComputedStyle(focusedElement).textAlign;

        // Save the state for undo/redo (property: 'textAlign')
        saveState(focusedElement, 'textAlign', oldAlignment, alignment);

        // Set the new text alignment
        focusedElement.style.textAlign = alignment;

        // Update the alignment buttons based on the new alignment
        updateAlignmentButtons(alignment);
        updateButtonStates();
    }
}

const undoStack = [];
const redoStack = [];

function saveState(element, property, oldValue, newValue) {
    undoStack.push({ element, property, oldValue, newValue });
    // Clear the redoStack since new changes are being made
    redoStack.length = 0;
}

function undo() {
    if (undoStack.length === 0) return;

    const lastAction = undoStack.pop();
    redoStack.push({ ...lastAction });

    // Revert the change
    if (lastAction.property === 'add') {
        // Remove the element from the DOM (undo add)
        lastAction.element.remove();
    } else if (lastAction.property === 'remove') {
        // Re-add the element to the DOM (undo remove)
        canvas.appendChild(lastAction.element);
    } else {
        // Handle style changes
        lastAction.element.style[lastAction.property] = lastAction.oldValue;
    }
    updateButtonStates();  // Update button states after undo
}

function redo() {
    if (redoStack.length === 0) return;

    const lastUndoneAction = redoStack.pop();
    undoStack.push({ ...lastUndoneAction });

    // Re-apply the change
    if (lastUndoneAction.property === 'add') {
        // Re-add the element to the DOM (redo add)
        canvas.appendChild(lastUndoneAction.element);
    } else if (lastUndoneAction.property === 'remove') {
        // Remove the element from the DOM (redo remove)
        lastUndoneAction.element.remove();
    } else {
        // Handle style changes
        lastUndoneAction.element.style[lastUndoneAction.property] = lastUndoneAction.newValue;
    }
    updateButtonStates();  // Update button states after redo
}


// Example of a potential remove function to handle state saving for element removal
function removeElement(element) {
    // Save the state before removing the element
    saveState(element, 'remove', element, null);
    element.remove();  // Remove the element from the DOM
}

