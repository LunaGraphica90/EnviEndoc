export default {
  base: './',
  build: {
    sourcemap: true,
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
        /* copyright: './public/js/copyright.js',
        main:'./js/main.js',
        pageTitles:'./public/js/pageTitles.js',
        readcsv:'./public/js/readcsv.js',
        translate: './public/js/translate.js',
        fr:'./lang/fr.json',
        en:'./lang/en.json', */
      },
      /* export:{
        copyright: './public/js/copyright.js',
        main:'./js/main.js',
        pageTitiles:'./js/pageTitiles.js',
        readcsv:'./public/js/readcsv.js',
        translate: './public/js/translate.js',
        fr:'./lang/fr.json',
        en:'./lang/en.json',
      }, */
      output: {
        dir: 'dist', // Spécifiez le répertoire de sortie global ici
      },
    }
  }
}
