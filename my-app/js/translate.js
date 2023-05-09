/* function getSelectedLanguage() {
    //const langSelect = document.getElementById("language-select");
    const storedLang  = localStorage.getItem("lang");
    if (storedLang ) {
        return storedLang;
    } else {
        return "fr";
    }
}

function selectLang(){
    let langSelect = document.getElementById('language-select');
    const selectedLang = langSelect.options[langSelect.selectedIndex].value;
    //let selectedLang = langSelect.value;
    console.log("selectedLang:", selectedLang);
    localStorage.setItem('lang', selectedLang);
    location.reload();
}

console.log(localStorage.getItem('lang'))

// Fonction pour charger les traductions
async function loadTranslations() {
    const selectedLang = getSelectedLanguage();
    const response = await fetch(`../lang/${selectedLang}.json`);
    const data = await response.json();
    return data;
    console.log(data);
}

async function translatePage() {
    const translations = await loadTranslations();

    Object.keys(translations).forEach((key) => {
        const value = translations[key];
        const elements = document.querySelectorAll(`[data-translate=${key}]`);
        elements.forEach((element) => {
        element.innerHTML = value;
        });
    });
}

document.addEventListener('DOMContentLoaded', translatePage()); */


function selectLang(){
    let langSelect = document.getElementById('language-select');
    const selectedLang = langSelect.options[langSelect.selectedIndex].value;
    langSelect.options[langSelect.selectedIndex].setAttribute('selected', true);
    //let selectedLang = langSelect.value;
    localStorage.removeItem("selectedLang");
    console.log("selectedLang:", selectedLang);
    localStorage.setItem('language', selectedLang);
    console.log("localstorage selected", localStorage.getItem('language'))

    setTimeout(() => {
        document.location.reload();
      }, 1000);
    
}

// Fonction pour récupérer la langue enregistrée dans le localstorage ou utiliser la langue par défaut
function getLanguage() {
    if (localStorage.getItem('language')) {
        console.log('toto:', localStorage.getItem('language'))
        if(localStorage.getItem('language') === 'en'){
            let langSelect = document.getElementById('language-select');
            langSelect.options[1].setAttribute('selected', true);
        }
        return localStorage.getItem('language');
    } else {
      return 'fr'; // langue par défaut
    }
}
console.log("local lang:", localStorage.getItem('language'))
  // Fonction pour changer la langue
  /* function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    location.reload(); // recharger la page pour afficher la nouvelle langue
  } */
  
// Fonction pour traduire le texte dans la langue sélectionnée
function translate() {
    /* if(localStorage.getItem('language')){

    } */
    // Récupérer la langue actuelle
    const lang = getLanguage();
    console.log('lang:', lang);

    // Charger le fichier de langue approprié
    fetch(`lang/${lang}.json`)
        .then(response => response.json())
        .then(data => {
        // Sélectionner tous les éléments avec un attribut "data-translate"
        const elements = document.querySelectorAll('[data-translate]');
        console.log("datas:",data)
        console.log("elements:", elements)

        // Parcourir tous les éléments et remplacer leur texte par la traduction appropriée
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            console.log("key:",key)
            if (key in data) {
                element.textContent = data[key];
                console.log("element:",element.textContent)
            }
        });
    });
}

// Appeler la fonction de traduction au chargement de la page
document.addEventListener('DOMContentLoaded', translate());