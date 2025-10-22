// ====================================================================
// GESTION GLOBALE DES ÉLÉMENTS ET DES VARIABLES D'ÉTAT
// ====================================================================

// --- Éléments du son/entrée (déplacés depuis le HTML) ---
const audio = document.getElementById('background-audio');
const coverPage = document.getElementById('cover-page');
const volumeMuteToggle = document.getElementById('volume-mute-toggle'); 
const volumeSlider = document.getElementById('volume-slider');

// Chemins des icônes
const ICON_ON = 'image/icons8-son-50.png';
const ICON_MUTE = 'image/icons8-mute-50.png';

// Variables de contrôle du son
audio.volume = 0.5; 
let lastVolume = 0.5;

// 🚨 Pour contourner les restrictions d'autoplay : commencer en muet
audio.muted = true; 


// --- Éléments du livre ---
const pages = document.querySelectorAll('.page');
const totalPages = pages.length; // 53 pages
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// NOTE : La page 1 est la couverture (pages[0]). La page actuelle est indexée à 1 pour être intuitive.
let currentPageIndex = 1; 

// ====================================================================
// 1. GESTION DE L'ENTRÉE, DU SON ET DU MUTE
// ====================================================================

function enterPage() {
    // 1. Démarrer la musique grâce au clic utilisateur
    audio.play().then(() => {
        // Le son est démarré, on peut retirer le mute car l'utilisateur a interagi
        audio.muted = false; 
    }).catch(error => {
        console.error("Échec du lancement audio après le clic.", error);
    });
    
    // 2. Masquer la page de couverture
    coverPage.style.opacity = '0';
    setTimeout(() => {
        coverPage.style.display = 'none';
        // Mettre à jour l'état initial des boutons
        updateNavButtons();
    }, 500);

    // 3. Retirer les écouteurs de la page de couverture
    coverPage.removeEventListener('click', enterPage);
    coverPage.removeEventListener('touchstart', enterPage);
}

// Écouteurs pour la page de couverture
coverPage.addEventListener('click', enterPage);
coverPage.addEventListener('touchstart', enterPage);


// --- GESTION DU VOLUME ET DU MUTE ---

volumeSlider.addEventListener('input', (e) => {
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    
    audio.muted = false;
    
    volumeMuteToggle.src = newVolume > 0 ? ICON_ON : ICON_MUTE;
    
    if (newVolume > 0) {
        lastVolume = newVolume;
    }
});

volumeMuteToggle.addEventListener('click', () => {
    if (audio.muted) {
        audio.volume = lastVolume > 0 ? lastVolume : 0.5;
        volumeSlider.value = audio.volume;
        audio.muted = false;
        volumeMuteToggle.src = ICON_ON;
    } else {
        lastVolume = audio.volume; 
        audio.muted = true;
        volumeSlider.value = 0;
        volumeMuteToggle.src = ICON_MUTE;
    }
});


// ====================================================================
// 2. LOGIQUE DE ROTATION DU LIVRE 3D
// ====================================================================

/**
 * Met à jour l'état de désactivation des boutons de navigation.
 */
function updateNavButtons() {
    // Si on est sur la page 1 (couverture), le bouton 'prev' est désactivé.
    prevBtn.disabled = currentPageIndex === 1;
    
    // Si on est sur la dernière page, le bouton 'next' est désactivé.
    nextBtn.disabled = currentPageIndex === totalPages;
}


/**
 * Tourne une page vers l'avant (Next).
 */
function turnPageNext() {
    if (currentPageIndex < totalPages) {
        // La page à tourner est pages[currentPageIndex - 1]
        const pageToTurn = pages[currentPageIndex - 1];
        
        // 1. Ajouter la classe de rotation (rotateY(-180deg))
        pageToTurn.classList.add('turned');

        // 2. Une fois la rotation finie, ajouter la classe de "cachette" (z-index: -1)
        // La transition est de 0.8s dans le CSS
        setTimeout(() => {
            pageToTurn.classList.add('hidden-page');
        }, 800); 

        // 3. Mettre à jour la page actuelle
        currentPageIndex++;
        updateNavButtons();
    }
}

/**
 * Tourne une page vers l'arrière (Prev).
 */
function turnPagePrev() {
    if (currentPageIndex > 1) {
        // La page à "détourner" est celle qui vient d'être lue (pages[currentPageIndex - 2])
        const pageToUnturn = pages[currentPageIndex - 2]; 

        // 1. Mettre à jour la page actuelle AVANT de commencer la transition inverse
        currentPageIndex--;
        updateNavButtons();
        
        // 2. Retirer la classe de "cachette" (z-index: 1 ou plus)
        pageToUnturn.classList.remove('hidden-page');
        
        // 3. Retirer la classe de rotation (revenir à 0deg)
        // La transition est immédiate
        pageToUnturn.classList.remove('turned');
    }
}


// --- ÉCOUTEURS DES BOUTONS DU LIVRE ---

nextBtn.addEventListener('click', turnPageNext);
prevBtn.addEventListener('click', turnPagePrev);

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // La page de couverture doit initialement cacher les boutons.
    // L'état réel sera mis à jour après le clic d'entrée dans enterPage().
    updateNavButtons(); 
});
