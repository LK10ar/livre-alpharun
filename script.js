const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentSpread = 0; // index du spread

function goToSpread(spreadIndex) {
    const totalPages = pages.length;
    const maxSpread = Math.floor((totalPages - 2) / 2) + 1; // -2 pour couverture/dos

    if (spreadIndex < 0 || spreadIndex > maxSpread) return;
    currentSpread = spreadIndex;

    pages.forEach((page, index) => {
        page.style.display = 'none'; // cache tout par défaut

        // Couverture seule
        if (currentSpread === 0 && index === 0) {
            page.style.display = 'block';
            page.style.left = '0';
        }
        // Dos seule
        else if (currentSpread === maxSpread && index === totalPages - 1) {
            page.style.display = 'block';
            page.style.left = '0';
        }
        // Double-pages centrales
        else if (currentSpread > 0 && currentSpread < maxSpread) {
            const leftIndex = 1 + (currentSpread - 1) * 2; // Page de gauche
            const rightIndex = leftIndex + 1;             // Page de droite

            if (index === leftIndex) {
                page.style.display = 'block';
                page.style.left = '0'; // gauche
            }
            if (index === rightIndex) {
                page.style.display = 'block';
                page.style.left = '500px'; // droite
            }
        }
    });

    updateButtonState();
}

function turnPage(direction) {
    const totalPages = pages.length;
    const maxSpread = Math.floor((totalPages - 2) / 2) + 1;

    if (direction === 'next' && currentSpread < maxSpread) goToSpread(currentSpread + 1);
    else if (direction === 'prev' && currentSpread > 0) goToSpread(currentSpread - 1);
}

function updateButtonState() {
    const totalPages = pages.length;
    const maxSpread = Math.floor((totalPages - 2) / 2) + 1;

    prevBtn.disabled = currentSpread === 0;
    nextBtn.disabled = currentSpread === maxSpread;
}

// Boutons
nextBtn.addEventListener('click', () => turnPage('next'));
prevBtn.addEventListener('click', () => turnPage('prev'));

// Initialisation
goToSpread(0);
