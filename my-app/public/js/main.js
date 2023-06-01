import '../../css/style.css';
import {Map, View} from 'ol';
import {Stroke, Fill, Style} from 'ol/style'
import LayerGroup from 'ol/layer/Group.js';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';

import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';
import {Vector as VectorSource, OSM}  from 'ol/source.js';

import axios from 'axios';
import { MultiPolygon, Polygon } from 'ol/geom';
import Select from 'ol/interaction/Select.js';
import { fromLonLat } from 'ol/proj';
import {ScaleLine, defaults as defaultControls} from 'ol/control.js';

// Centre carte sur centre de la France
const FRANCE_LAT = fromLonLat([1.52, 46.36]);

const map = new Map({
  controls: defaultControls().extend([
    new ScaleLine({
      units: 'metric',
    })
  ]),
  target: 'map',
  layers: [
    //fond carte openStreetMap :
    new TileLayer({
      source: new OSM({
        attributions: "EnviEndoc"
      })
    })
  ],
  view: new View({
  center: FRANCE_LAT,
  zoom: 6
})
});

const groupLayer = [];

//gestion de l'api
const getSubstanceInMap = (urlTable, substanceCas, cnepDate) => {
  //clean groupLayer afin de ne pas additionner les couches
  groupLayer.length = 0;
  //supprime le groupe de calques
  map.removeLayer(map.getLayers().array_[1]);
  
  //on récupère la données
  Promise.all(urlTable.map((endPoint) => axios.get(endPoint)))
  .then((responses) => {
    const datas = responses.map(({ data }) => data);
    let [BNVD, CNEP, GEODAIR, CNEP_sites] = datas;

   

    //console.log(GEODAIR);
    //console.log(GEODAIR.filter((item) => item.properties.cas.includes(casSubstance)));
    //console.log(CNEP.filter((item) => item.properties.substance.includes('Prochloraz')));

    //filtre d'une substance et d'une année
    CNEP = CNEP.filter((item) => 
      item.properties.cas_number.includes(substanceCas) && item.properties['date de fin de prélèvement'].slice(0,4) === cnepDate
    );
    console.log("CNEP: ",CNEP);

    //prélèvement valide car avec une valeur
    BNVD = BNVD.filter((item) => item.properties.value !== null);
    console.log("BNVD: ", BNVD);

    //informe l'utilisateur du nombre de résultats par base de données
    const bnvdNbResultElt = document.querySelector('#nb-result-bnvd');
    const cnepNbResultElt = document.querySelector('#nb-result-cnep');
    bnvdNbResultElt.textContent = `${BNVD.length} résultat(s)`;
    cnepNbResultElt.textContent = `${CNEP.length} résultat(s)`;



    const sitesUtilise = [...new Set(CNEP.map((item) => item.properties['code site']))];
    CNEP_sites = CNEP_sites.filter((item) => sitesUtilise.find((codeSite) => codeSite === item.properties['code site']) );
    
    const CNEP_LAYER = new WebGLPointsLayer({
      source: new VectorSource({
      wrapX: true,
      features: CNEP_sites.map((item) => 
        { return new Feature({
          ...item.properties, 
          geometry: new Point(fromLonLat(item.geometry.coordinates)),
          samples: CNEP.filter((sample) => sample.properties['code site'] === item.properties['code site'])
        })
      })
      }),
      style: {
        "symbol": {
          "symbolType": "circle",
          "size": 15,
          "color": 'blue',
          "rotateWithView": true
        }
      },
      title: `CNEP`
    });

    const BNVD_LAYER = new VectorLayer({
      source: new VectorSource({
        features: BNVD.filter((item) => typeof item.properties.value === 'number').map((item) => { 
          return new Feature(
            {...item.properties, 
            geometry: item.geometry.type === 'Polygon' 
              ? new Polygon(item.geometry.coordinates.map((value) => value.map((coordinates) => fromLonLat(coordinates)))) 
              : new MultiPolygon(item.geometry.coordinates.map((value) => value.map((coordinates) => fromLonLat(coordinates))))
            }
        )})
      }),
      style: function(feature) {
        const value = feature.get('value');
    
        const colorByValue = [
          { valueMin: 0.0001, valueMax: 0.0099, color: '255, 255, 255' },
          { valueMin: 0.01, valueMax: 0.1999, color: '255, 227, 227' },
          { valueMin: 0.2, valueMax: 0.9999, color: '255, 198, 198' },
          { valueMin: 1, valueMax: 10.9999, color: '255, 170, 170' },
          { valueMin: 11, valueMax: 50.9999, color: '255, 142, 142' },
          { valueMin: 51, valueMax: 200.9999, color: '255, 113, 113' },
          { valueMin: 201, valueMax: 3000.9999, color: '255, 85, 85' },
          { valueMin: 3001, valueMax: 20000, color: '255, 57, 57' }
        ];
    
        const findColor = colorByValue.find((obj) => value >= obj.valueMin && value <= obj.valueMax);
        const opacity = '1';
        const color = `rgba(${findColor.color}, ${opacity})`;

        return [
          new Style({
            fill: new Fill({
              color: color
            }),
            stroke: new Stroke({
              color: '#000000',
              width: 1,
            }),
          }),
        ];
      },
      title: `BNVD`
    });

    groupLayer.push(BNVD_LAYER);
    groupLayer.push(CNEP_LAYER);
    
    
    
    // Regroupement des calques de données
    const baseLayerGroup = new LayerGroup({
      layers: groupLayer
    })
    
    // Ajout des données sur la carte 
    map.addLayer(baseLayerGroup);

    // Layer switcher
    const baseLayerElements = document.querySelectorAll('.formulaire > fieldset > div > label > input[type=checkbox]');
    for (let baseLayerElement of baseLayerElements){
      baseLayerElement.addEventListener('change', function(){
        let baseLayerElementValue = this.value;

        baseLayerGroup.getLayers().forEach(function(element, index, array){
          let baselayerTitle = element.get('title');
          
          if(baselayerTitle === baseLayerElementValue){
            console.log(element);
            element.setVisible(!element.getVisible());
          }
        })
      })
    }


})
};


//gestion du filtre
const formMapElt = document.querySelector('#form-map');
formMapElt.addEventListener('submit', (e) =>{
  e.preventDefault();
  const BASE_URL = './datas/';
  const BNVD_FIN_NOM_FICHER = '_lambert93.geojsonl.json'
  const substanceFiltreValue = formMapElt.querySelector('#substance-filtre').value;
  const bnvdDateValue = formMapElt.querySelector('#année-bnvd').value;
  const cnepDateValue = formMapElt.querySelector('#année-cnep').value;
  
  const BNVD_URL = `${BASE_URL}BNVD/${substanceFiltreValue}/${substanceFiltreValue}_${bnvdDateValue}${BNVD_FIN_NOM_FICHER}`;
  
  getSubstanceInMap([BNVD_URL, './datas/CNEP/CNEP.json', './datas/GEODAIR/geodair.json', './datas/CNEP/CNEP_site.json'], substanceFiltreValue, cnepDateValue);
});


const selectedStyle = new Style({
  fill: new Fill({
    color: 'rgba(139, 0, 0, 0.6)'
  }),
  stroke: new Stroke({
    color: 'rgba(255, 255, 255, 0.7)',
    width: 2,
  }),
});

// Créez une interaction de sélection pour la couche contenant les polygones
var selectInteraction = new Select({
  style: function (feature) {
    const color = feature.get('COLOR_BIO') || '#eeeeee';
    selectedStyle.getFill().setColor(color);
    return selectedStyle;
  },
});

// Ajoutez l'interaction de sélection à la carte
map.addInteraction(selectInteraction);

// Écoutez l'événement de sélection lorsqu'un polygone ou un point est cliqué
selectInteraction.on('select', function(event) {
  const selectedFeature = event.selected[0]; // Récupère la première feature sélectionnée
  const resultContentElt = document.querySelector('#content');
  if (selectedFeature) {
    const properties = selectedFeature.getProperties(); // Récupère les propriétés de la feature
    console.log(properties);

    //si l'utilisateur à cliquer sur une surface de la BNVD
    if (properties.BNVD_annee){
      getInfosBNVD(properties, resultContentElt);
    } else if (properties.samples){
      console.log("cnep fréro !");
      getInfosCNEP(properties, resultContentElt);
    }
    
  }
});

const getInfosCNEP = (properties, parentElt) => {

  const contentAlreadyExisting = parentElt.querySelector('#content-cnep');
  if (contentAlreadyExisting !== null){
    contentAlreadyExisting.remove();
  }

  const contentBnvdElt = document.createElement('div');
  contentBnvdElt.id = 'content-cnep';

  //permet de convertir les dates
  const getDate = (dateCurrent) => {
    return new Date(dateCurrent).toLocaleString('fr-FR');
  };

  const dateBeginning = getDate(properties.samples[0].properties['date de début de prélèvement']).slice(0,10);
  const dateEnd = getDate(properties.samples[properties.samples.length - 1].properties['date de fin de prélèvement']).slice(0,10);

  let content = `<h3> Prélèvement de la substance ${properties.samples[0].properties.substance} (cas: ${properties.samples[0].properties.cas_number}), 
  sur le site de ${properties['nom de la commune']} de la période ${dateBeginning} au ${dateEnd} : </h3>`;
  content += "<table>";

  const ignoredKeys = ['code INSEE de la commune', 'code site', 'latitude', 'longitude', 'substance_name', 'cas_number', 'value']

  properties.samples.forEach((item, iteration) => {
    //creation de la tête de tableau
    if (iteration === 0){
      Object.keys(item.properties).forEach((key, i) => {
        if (i === 0) content += `<thead><tr>`;
        if (key !== ignoredKeys.find((value) => value === key)){
          //on passe les valeurs tu tableau, sinon on créer le champ
          content += `<th>${key}</th>`;
        }
        if (i === item.properties.length) content += `</tr></thead>`;
      });

      content += `<tbody>`;
    }

    content += `<tr>`;
    Object.keys(item.properties).forEach((key, i) => {
      if (key === 'date de début de prélèvement' || key === 'date de fin de prélèvement'){
        content += `<td>${getDate(item.properties[key])}</td>`;
      }else if (key !== ignoredKeys.find((value) => value === key)){
        //on passe les valeurs tu tableau, sinon on créer le champ
        content += `<td>${item.properties[key]}</td>`;
      }
    }); 
    content += `</tr>`;

    if (iteration === properties.samples.length) content += `</tbody>`;
  });
  
  content += "</table>"
  contentBnvdElt.innerHTML = content; 
  parentElt.appendChild(contentBnvdElt);
};

const getInfosBNVD = (properties, parentElt) => {

  const contentAlreadyExisting = parentElt.querySelector('#content-bnvd');
  if (contentAlreadyExisting !== null){
    contentAlreadyExisting.remove();
  }

  const contentBnvdElt = document.createElement('div');
  contentBnvdElt.id = 'content-bnvd';
  
  let content = `<h3> Informations sur la vente de la substance ${properties['subst_substance_name']} (cas: ${properties.BNVD_cas}) en ${properties.BNVD_annee} : </h3>`;
  content += "<ul>";
  
  const tableKeyBNVD = [
    {key: 'value', name: 'Quantité'}, 
    {key: 'NOM_COM', name: 'Commune'},
    {key: 'NOM_DEPT', name: 'Département'}, 
    {key: 'NOM_REG', name: 'Région'}, 
    {key: 'CP', name: 'Code Postal'}, 
    {key: 'POPULATION', name: 'Population'}, 
    {key: 'SUPERFICIE', name: 'Superficie'}, 
    {key: 'subst_URL_for_deduct', name: 'Lien externe'}
  ];
  
  tableKeyBNVD.forEach((item) =>{
    //si c'est la valeur on rajoute l'unité
    if (item.key === 'value'){
      content += `<li>${item.name}: ${properties[item.key]} ${properties.unit}s </li>`;
    }else if (item.key === 'subst_URL_for_deduct'){
      content += `<li>${item.name}: <a target="_blank" href='${properties[item.key]}'>DEDuCT (s'ouvre dans une nouvelle fenêtre)</a> </li>`;
    }else if (item.key === 'SUPERFICIE'){
      content += `<li>${item.name}: ${properties[item.key]}m² </li>`;
    }else{
      content += `<li>${item.name} : ${properties[item.key]} </li>`;
    }
  })
  
  content += "</ul>"
  contentBnvdElt.innerHTML = content; 
  parentElt.appendChild(contentBnvdElt);
};


// animate the map
function animate() {
  map.render();
  window.requestAnimationFrame(animate);
}
animate();