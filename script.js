const passwordDisplay = document.getElementById('password-display');
const refreshBtn = document.getElementById('refresh-btn');
const copyBtn = document.getElementById('copy-btn');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');
const upperToggle = document.getElementById('upper-toggle');
const lowerToggle = document.getElementById('lower-toggle');
const numToggle = document.getElementById('num-toggle');
const symToggle = document.getElementById('sym-toggle');
const nameInput = document.getElementById('name-input');
const extraCountSelect = document.getElementById('extra-count');
const strengthLabel = document.getElementById('strength-label');
const strengthSegments = document.querySelectorAll('.strength-segment');

const chars = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
};

function getCharset() {
    let charset = '';
    if (upperToggle.checked) charset += chars.upper;
    if (lowerToggle.checked) charset += chars.lower;
    if (numToggle.checked) charset += chars.numbers;
    if (symToggle.checked) charset += chars.symbols;
    return charset;
}

function sanitizeName(value) {
    const trimmed = (value || '').trim();
    if (!trimmed) return 'user';
    return trimmed.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
}

function getRandomSegment(count, charset) {
    let segment = '';
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        segment += charset[randomIndex];
    }
    return segment;
}

function generatePassword() {
    const charset = getCharset();
    const name = sanitizeName(nameInput.value);
    const extraCount = parseInt(extraCountSelect.value, 10);

    if (charset === '') {
        passwordDisplay.innerText = 'SELECT OPTIONS';
        passwordDisplay.classList.add('text-error');
        updateStrength(0);
        return;
    }

    passwordDisplay.classList.remove('text-error');
    const length = parseInt(lengthSlider.value);
    const password = `${name}${getRandomSegment(extraCount, charset)}`;
    
    passwordDisplay.innerText = password;
    
    // Adjust font size for very long passwords
    if (length > 40) {
        passwordDisplay.style.fontSize = '1.5rem';
    } else if (length > 24) {
        passwordDisplay.style.fontSize = '2.25rem';
    } else {
        passwordDisplay.style.fontSize = '';
    }

    calculateStrength(password);
}

function calculateStrength(pass) {
    let score = 0;
    if (pass.length > 12) score++;
    if (pass.length > 24) score++;
    
    let variety = 0;
    if (upperToggle.checked) variety++;
    if (lowerToggle.checked) variety++;
    if (numToggle.checked) variety++;
    if (symToggle.checked) variety++;
    
    if (variety >= 3) score++;
    if (variety === 4 && pass.length > 16) score++;

    updateStrength(score);
}

function updateStrength(score) {
    strengthSegments.forEach((seg, i) => {
        seg.className = 'strength-segment flex-1 rounded-sm ';
        if (i <= score) {
            if (score <= 1) {
                seg.classList.add('bg-error');
                strengthLabel.innerText = 'Weak / Vulnerable';
                strengthLabel.className = 'text-error uppercase';
            } else if (score === 2) {
                seg.classList.add('bg-tertiary');
                strengthLabel.innerText = 'Moderate Security';
                strengthLabel.className = 'text-tertiary uppercase';
            } else {
                seg.classList.add('bg-secondary');
                strengthLabel.innerText = 'Highly Secure';
                strengthLabel.className = 'text-secondary uppercase';
            }
        } else {
            seg.classList.add('bg-surface-container-highest');
        }
    });
}

function copyToClipboard() {
    const text = passwordDisplay.innerText;
    if (text === 'SELECT OPTIONS' || text === '************') return;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="material-symbols-outlined">done</span> Copied!';
        copyBtn.classList.remove('bg-secondary');
        copyBtn.classList.add('bg-secondary-container');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.add('bg-secondary');
            copyBtn.classList.remove('bg-secondary-container');
        }, 2000);
    });
}

lengthSlider.addEventListener('input', () => {
    lengthVal.innerText = lengthSlider.value;
    generatePassword();
});

[nameInput, extraCountSelect].forEach(el => {
    el.addEventListener('input', generatePassword);
    el.addEventListener('change', generatePassword);
});

[upperToggle, lowerToggle, numToggle, symToggle].forEach(t => {
    t.addEventListener('change', generatePassword);
});

refreshBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);

// Initial generation
setTimeout(generatePassword, 500);