const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentPage = 0;

function showPage(index) {
    pages.forEach((page, i) => page.style.display = 'none');
    pages[index].style.display = 'block';

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === pages.length - 1;
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
        currentPage++;
        showPage(currentPage);
    }
});

// Initialisation
showPage(0);
