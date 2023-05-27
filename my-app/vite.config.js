export default {
  build: {
    //sourcemap: true,
    root:"",
    rollupOptions: {
      input: {
        index: './index.html',
        about: './about.html',
        help:'./help.html',
        legacy:'./legacy.html',
        list:'./list.html',
        map:'./map.html',
        sourcedata: './sourcedata.html',
        fr:'./lang/fr.json',
        en:'./lang/en.json',
      },
      /* output:{
        copyright: './js/copyright.js',
        main:'./js/main.js',
        pageTitiles:'./js/pageTitiles.js',
        readcsv:'./js/readcsv.js',
        translate: './js/translate.js',
        fr:'./lang/fr.json',
        en:'.lang.en.json',
      } */

      output: {
        dir: 'dist', // Spécifiez le répertoire de sortie global ici
      },
    }
  }
}
