function getLanguage() {
  if (localStorage.getItem('language')) {
    if (localStorage.getItem('language') === 'en') {
      let langSelect = document.getElementById('language-select')
      langSelect.options[1].setAttribute('selected', true)
    }
    return localStorage.getItem('language')
  } else {
    return 'fr' // langue par défaut
  }
}

function setPageTitle() {
  var fileName = location.pathname.split('/').pop() // Récupère le nom du fichier de la page actuelle

  var title
  var lang = getLanguage() // Utilise votre fonction pour récupérer la langue

  // Utilise des conditions pour déterminer le titre de la page en français
  if (lang === 'fr') {
    if (fileName === 'index.html') {
      title =
        "EnviEndoc - Faciliter l'accès aux données sur les perturbateurs endocriniens présents dans notre environnement"
    } else if (fileName === 'about.html') {
      title = 'EnviEndoc - À propos'
    } else if (fileName === 'help.html') {
      title = 'EnviEndoc - Aide'
    } else if (fileName === 'legacy.html') {
      title = 'EnviEndoc - Mentions Légales'
    } else if (fileName === 'list.html') {
      title = 'EnviEndoc - Liste des perturbateurs endocriniens'
    } else if (fileName === 'map.html') {
      title = 'EnviEndoc - Cartographie des perturbateurs endocriniens'
    } else if (fileName === 'sourcedata.html') {
      title = 'EnviEndoc - sources des données'
    } else {
      title =
        "EnviEndoc - Faciliter l'accès aux données sur les perturbateurs endocriniens présents dans notre environnement"
    }
  } else {
    title = 'EnviEndoc'
  }

  document.title = title // Définit le titre de la page
}

setPageTitle()
