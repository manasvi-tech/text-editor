const size = document.getElementById("fontSizeInput")
const font = document.getElementById('fontDropdown');
const bold = document.getElementById('bold');
const italic = document.getElementById('italic');
const align = document.getElementById('align');
const underline = document.getElementById('underline');

// Get button elements
const boldButton = document.getElementById('bold');
const italicButton = document.getElementById('italic');
const alignButton = document.getElementById('align');
const underlineButton = document.getElementById('underline');

// Function to update button states based on the focused element's styles
function updateButtonStates() {
    
    // Get the currently focused element
    const focusedElement = document.activeElement;

    console.log(focusedElement);
    
    if (focusedElement.classList.contains('container')) {
        const computedStyle = window.getComputedStyle(focusedElement);

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
        alignButton.className = 'active'; // Reset
        if (alignValue === 'center') {
            alignButton.classList.add('center');
        } else if (alignValue === 'left') {
            alignButton.classList.add('left');
        } else if (alignValue === 'right') {
            alignButton.classList.add('right');
        }
    }
}

// Add focus and blur event listeners to all container elements


// Button event listeners to apply styles to the focused element
boldButton.addEventListener('click', () => {
    const focusedElement = document.activeElement;
    if (focusedElement.classList.contains('container')) {
        focusedElement.style.fontWeight = focusedElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
    }
});

italicButton.addEventListener('click', () => {
    const focusedElement = document.activeElement;
    if (focusedElement.classList.contains('container')) {
        focusedElement.style.fontStyle = focusedElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
    }
});

underlineButton.addEventListener('click', () => {
    const focusedElement = document.activeElement;
    if (focusedElement.classList.contains('container')) {
        focusedElement.style.textDecoration = focusedElement.style.textDecoration.includes('underline') ? 'none' : 'underline';
    }
});

alignButton.addEventListener('click', () => {
    const focusedElement = document.activeElement;
    if (focusedElement.classList.contains('container')) {
        const currentAlignment = window.getComputedStyle(focusedElement).textAlign;
        if (currentAlignment === 'center') {
            focusedElement.style.textAlign = 'left';
        } else if (currentAlignment === 'left') {
            focusedElement.style.textAlign = 'right';
        } else if (currentAlignment === 'right') {
            focusedElement.style.textAlign = 'center';
        } else {
            focusedElement.style.textAlign = 'left';
        }
    }
});