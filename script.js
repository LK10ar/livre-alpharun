// 1. Récupération des éléments HTML nécessaires
const book = document.getElementById('book');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Récupération de TOUTES les pages (cela récupère tes 52 pages)
const pages = document.querySelectorAll('.page'); 

// Variable pour suivre l'index de la page actuellement affichée sur la gauche (page impaire).
// L'index 0 correspond à la page 1 (Couverture).
let currentPageIndex = 0; 

// ----------------------------------------------------------------------
// Fonction principale pour gérer le tournage de page
// ----------------------------------------------------------------------
function turnPage(direction) {
    
    // --- Tourner en AVANT (vers la droite) ---
    if (direction === 'next') {
        
        // La condition vérifie si nous ne sommes pas déjà sur la dernière double-page
        if (currentPageIndex < pages.length - 2) { 
            
            // 1. On tourne la page impaire actuelle (celle de gauche)
            const pageToTurn = pages[currentPageIndex];
            pageToTurn.classList.add('turned');
            
            // 2. On cache la page paire suivante (face cachée) en la mettant derrière l'animation
            const nextPage = pages[currentPageIndex + 1];
            // On utilise setTimeout pour s'assurer que l'animation de rotation a commencé avant de changer le z-index
            setTimeout(() => {
                 nextPage.classList.add('hidden-page');
            }, 400); // 400ms est la moitié du temps de transition CSS (0.8s)
            
            // 3. On met à jour l'index pour afficher la double-page suivante
            currentPageIndex += 2;
        }

    // --- Tourner en ARRIÈRE (vers la gauche) ---
    } else if (direction === 'prev') {
        
        // La condition vérifie si nous ne sommes pas déjà sur la couverture (index 0)
        if (currentPageIndex > 0) {
            
            // 1. On recule l'index d'une double page
            currentPageIndex -= 2;
            
            // 2. On remet la page impaire précédente devant (visible)
            const prevPage = pages[currentPageIndex];
            // On retire la classe 'hidden-page' après un court délai pour synchroniser avec l'animation
            setTimeout(() => {
                prevPage.classList.remove('hidden-page');
            }, 400); 

            // 3. On retire la classe 'turned' de la page paire (celle qui est en train de revenir)
            const pageToUnturn = pages[currentPageIndex + 1];
            pageToUnturn.classList.remove('turned');
        }
    }
    
    // Met à jour l'état des boutons après l'action
    updateButtonState();
}

// ----------------------------------------------------------------------
// Fonction pour désactiver les boutons au début et à la fin du livre
// ----------------------------------------------------------------------
function updateButtonState() {
    // Si l'index est 0, on est sur la couverture : on ne peut pas aller en arrière
    prevBtn.disabled = currentPageIndex === 0; 
    
    // Si l'index est pages.length - 2 ou plus, la prochaine page visible est la dernière ou on l'a déjà tournée
    nextBtn.disabled = currentPageIndex >= pages.length - 2; 
}


// 2. On attache la fonction aux boutons au moment du clic
nextBtn.addEventListener('click', () => turnPage('next'));
prevBtn.addEventListener('click', () => turnPage('prev'));

// 3. Initialisation au chargement de la page
// On s'assure que le bouton "Précédent" est désactivé au début.
updateButtonState();