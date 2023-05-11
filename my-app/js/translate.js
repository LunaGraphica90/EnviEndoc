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

// Fonctions pour traduire le texte dans la langue sélectionnée
/* function translate() {
    // Récupérer la langue actuelle
    const lang = getLanguage();

    // Charger le fichier de langue appropriée
    fetch(`lang/${lang}.json`)
        .then(response => response.json())
        .then(data => {
        // Sélectionner tous les éléments avec un attribut "data-translate"
        const elements = document.querySelectorAll('[data-translate]');
        

        // Parcourir tous les éléments et remplacer leur texte par la traduction appropriée
        elements.forEach(element => {
            console.log(element);
            const key = element.getAttribute('data-translate');
            console.log(key);
            if (key in data) {
                //element.textContent = data[key];
                element.innerHtml = data[key];

                //element.innerText = data[key];

                console.log(element);
                console.log(data[key]);
            }
        });
    });
}
 */

// Chargement des traductions
async function loadTranslations() {
    const lang = getLanguage();
    const response = await fetch(`lang/${lang}.json`);
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