function selectLang(){
    let langSelect = document.getElementById('language-select');
    const selectedLang = langSelect.options[langSelect.selectedIndex].value;
    //let selectedLang = langSelect.value;
    
        localStorage.removeItem("selectedLang");

    localStorage.setItem('language', selectedLang);

    setTimeout(() => {
        document.location.reload();
      }, 1000);
    
}

document.getElementById("language-select").addEventListener("change", selectLang);

// Fonction pour récupérer la langue enregistrée dans le localstorage ou utiliser la langue par défaut
function getLanguage() {
    if (localStorage.getItem('language')) {
        if(localStorage.getItem('language') === 'en'){
            let langSelect = document.getElementById('language-select');
            langSelect.options[1].setAttribute('selected', true);
        }
        return localStorage.getItem('language');
    } else {
      return 'fr'; // langue par défaut
    }
}

// Chargement des traductions
async function loadTranslations() {
    const lang = getLanguage();
    const response = await fetch(`./lang/${lang}.json`);
    const data = await response.json();
    return data;
}
  
// Fonction pour remplacer les clés de traduction dans le HTML
async function translate() {
    const translations = await loadTranslations();
    
    Object.keys(translations).forEach((key) => {
        const value = translations[key];
        const elements = document.querySelectorAll(`[data-translate=${key}]`);
        elements.forEach((element) => {
        element.innerHTML = value;
        });
    });
}

// Appeler la fonction de traduction au chargement de la page
document.addEventListener('DOMContentLoaded', translate());