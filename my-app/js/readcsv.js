import Papa from 'papaparse';

const parseCSV = () => {
    const lang = getLanguage();
    const csvFile = lang === 'fr' ? '../documents/csv/listeFR.csv' : '../documents/csv/listeENG.csv';

    return new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        download: true,
        delimiter: "",
        header: true,
        complete: function(results) {
          resolve(results.data);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  };
  
parseCSV()
    .then(csvData => {
        const tableContainer = document.getElementById('table-container');

        // Création de l'élément <table>
        const table = document.createElement('table');

        // Création de l'élément <thead> pour l'en-tête du tableau
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Création de l'en-tête du tableau à partir des noms de colonnes
        const columnNames = Object.keys(csvData[0]);
        //console.log(columnNames);
        columnNames.forEach(columnName => {
            const th = document.createElement('th');
            th.textContent = columnName;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Création de l'élément <tbody> pour les données du tableau
        const tbody = document.createElement('tbody');

        // Création des lignes du tableau avec les données
        Object.values(csvData).forEach(rowData => {
            const isEmptyRow = Object.values(rowData).every(value => value === '');

            if (!isEmptyRow) {

                const row = document.createElement('tr');
                // Création des cellules pour chaque colonne
                columnNames.forEach(columnName => {
                    //console.log(columnIndex)
                    const cell = document.createElement('td');
                    const value = rowData[columnName];
                    console.log(value);
            
                    // Vérifie si la colonne correspond à la colonne contenant les liens
                    if (columnName === 'URL vers la fiche DEDuCT' || columnName === 'URL to the DEDuCT page') {
                        const link = document.createElement('a');
                        link.href = value; // Définit l'URL du lien
                        link.target = '_blank',
                        link.classList.add('external');
                        link.textContent = value; // Définit le texte du lien
            
                        cell.appendChild(link);
                    } else {
                        cell.textContent = value;
                    }
            
                    row.appendChild(cell);
                });

                tbody.appendChild(row);
            }
        });

        // Ajout du corps du tableau au tableau principal
        table.appendChild(tbody);

        // Ajout du tableau au conteneur
        tableContainer.appendChild(table);
    })
    .catch(error => {
        // Gérer les erreurs de parsing du CSV
        console.error(error);
    });