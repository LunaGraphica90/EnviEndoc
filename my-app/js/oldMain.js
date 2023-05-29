import '../css/style.css';
import {Map, View} from 'ol';
import {Stroke, Fill, Style} from 'ol/style'
import LayerGroup from 'ol/layer/Group.js';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat} from 'ol/proj.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';

import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import Stamen from 'ol/source/Stamen.js';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';
import {Vector as VectorSource, OSM}  from 'ol/source.js';

import axios from 'axios';
import { MultiPolygon } from 'ol/geom';

// Centre carte sur centre de la France
const FRANCE_LAT = fromLonLat([1.52, 46.36]);

const map = new Map({
  target: 'map',
  layers: [
    //fond carte openStreetMap :
    new TileLayer({
      source: new OSM({
        attributions: "EnviEndoc"
      })
    }), 
    /*
    new WebGLPointsLayer({
      style: webGlStyle,
      source: vectorSource,
      disableHitDetection: false
    })
    */
],
view: new View({
  center: FRANCE_LAT,
  zoom: 6
})
});

const BASE_URL = './datas/';
const URL_DATA_TABLE = [
  `${BASE_URL}BNVD_code_postal_cas-x_anne-y.geojson`, 
  `${BASE_URL}BNVD_substances.geojson`, 
  `${BASE_URL}CNEP_mesure_2695.geojson`, 
  `${BASE_URL}CNEP_site_mesures.geojson`, 
  `${BASE_URL}Commune_IGN_2026_36571.geojson`,
  `${BASE_URL}Geode_air.geojson`
];

const groupLayer = [];

Promise.all(URL_DATA_TABLE.map((endPoint) => axios.get(endPoint)))
  //.then(( [{data: BNVD_code_postal}, {data: BNVD_substances}, {data: CNEP_mesure}, {data: CNEP_site_mesures}, {data: Commune_IGN}, {data: Geode_air}] ) => {
  .then((responses) => {
    const datas = responses.map(({ data }) => data.features);
    let [BNVD_code_postal, BNVD_substances, CNEP_mesure, CNEP_site_mesures, Commune_IGN, Geode_air] = datas;
    console.log(CNEP_mesure[0]);
    console.log(CNEP_mesure);

    const CNEP_SITE_LAYER = new WebGLPointsLayer({
      source: new VectorSource({
        wrapX: true,
        features: CNEP_site_mesures.map((item) => 
          { return new Feature({
              ...item.properties, 
              geometry: new Point(fromLonLat(item.geometry.coordinates)),
              samples: CNEP_mesure.filter((sample) => sample.properties.code_site === item.properties['code site'])
            })
          })
      }),
      style: {
          "symbol": {
            "symbolType": "circle",
            "size": 10,
            "color": 'blue',
            "rotateWithView": true
          }
      },
      title: `CNEP`
    });

    /*
    let datasLayer2 = new VectorLayer({
      source: new VectorSource({
        wrapX: true,
        features: BNVD_code_postal.map((item) => { 
          return new Feature({...item.properties, geometry: new MultiPolygon(item.geometry.coordinates)}
        )})
      }),
      style: new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      }),
      title: `BNVD`
    });
    
    console.log(datasLayer, datasLayer2);
    groupLayer.push(datasLayer2);
    */
   groupLayer.push(CNEP_SITE_LAYER);
    
    
    // Regroupement des calques de données
    const baseLayerGroup = new LayerGroup({
      layers: groupLayer
    })


    // Ajout des données sur la carte 
    map.addLayer(baseLayerGroup);

    // Layer switcher
    const baseLayerElements = document.querySelectorAll('.main__content-panel1 > fieldset> div > label > input[type=checkbox]');
    for (let baseLayerElement of baseLayerElements){
      baseLayerElement.addEventListener('change', function(){
        let baseLayerElementValue = this.value;
        
        baseLayerGroup.getLayers().forEach(function(element, index, array){
          console.log(element.get('title'));
          let baselayerTitle = element.get('title');
          
          if(baselayerTitle === baseLayerElementValue){
            element.setVisible(!element.getVisible());
          }
        })
      })
    }


  })

/*
  
// handle input values & events
const minYearInput = document.getElementById('min-year');
const maxYearInput = document.getElementById('max-year');

function updateStatusText() {
  const div = document.getElementById('status');
  div.querySelector('span.min-year').textContent = minYearInput.value;
  div.querySelector('span.max-year').textContent = maxYearInput.value;
}

minYearInput.addEventListener('input', function () {
  webGlStyle.variables.minYear = parseInt(minYearInput.value);
  updateStatusText();
});
maxYearInput.addEventListener('input', function () {
  webGlStyle.variables.maxYear = parseInt(maxYearInput.value);
  updateStatusText();
});
updateStatusText();



// load data;
const features = [];
for (let item of CNEP.features){
  const coords = fromLonLat(item.geometry.coordinates);
  features.push(
    new Feature({
      ...item.properties,
      geometry: new Point(coords)
    })
  );
}
vectorSource.addFeatures(features);


const searchBarElt = document.querySelector('#search-bar');
searchBarElt.addEventListener('change', (e) => {
  console.log(e.target.value);
  console.log(CNEP.features[0]);
});

*/
//gestion du hover
let selected = null;

map.on('pointermove', function (e) {
  if (selected !== null) {
    selected.set('hover', 0);
    selected = null;
  }
  
  map.forEachFeatureAtPixel(e.pixel, function (feature) {
    feature.set('hover', 1);
    selected = feature;
    return true;
  });
});
//fin gestion du hover

// Affichage des données dans la colonne de droite au clic
const contentElt = document.getElementById('content');

//Va générer des boutons correspondant aux années, afin de filtrer les prélèvements.
const dropDown = (obj) => {
  const containerElt = document.createElement('div');
  containerElt.id = 'container-list';
  console.log(obj.get('samples'));

  const tableYearCNEP = ['2018', '2019'];
  //Pour les deux années, créer un bouton pour chaque année avec les prélèvements correspondants.
  tableYearCNEP.forEach((year) => {
    const buttonElt = document.createElement('button');
    const divElt = document.createElement('div');

    buttonElt.textContent = year;
    buttonElt.classList.add('list-samples');
    buttonElt.classList.add('hide-list');
    divElt.appendChild(buttonElt);
    containerElt.appendChild(divElt);

    //au click sur le bouton, affiche la liste des prélèvements
    //si re-clike la liste est supprimer
    buttonElt.addEventListener('click', () => {
      if (buttonElt.classList.contains('show-list')){
        buttonElt.classList.replace('show-list', 'hide-list')
        divElt.removeChild(divElt.querySelector('ul'));
      }else{
        buttonElt.classList.replace('hide-list', 'show-list')
        const listElt = document.createElement('ul');
  
        obj.get('samples').filter((sample) => sample.properties.date_fin_prélèvement.slice(6, 10) === year)
          .forEach((item) => {
            console.log(item.properties);
            const liElt = document.createElement('li');
            liElt.classList.add('elt-list');
            const particule = item.properties['4-D 2-ETHY'].slice(2,4) === 'DB' ? '4-DB-2-ETHYLHEXYL' : '4-D 2-ETHYLHEXYL';
            console.log(item.properties['4-D 2-ETHY'].slice(2,4));
            liElt.textContent = `${particule}: ${item.properties.date_fin_prélèvement}`;
            listElt.appendChild(liElt);

            liElt.addEventListener('click', () => {
              const panelMapElt = document.querySelector('.main__content-panelmap');
              const infosDivElt = document.createElement('div');

              let content = `<h3> Prélèvement du ${item.properties.date_début_prélèvement} au ${item.properties.date_fin_prélèvement} </h3>`;
              content += "<ul>";

              Object.keys(item.properties).forEach((key) =>{
                content += `<li>${key} : ${item.properties[key]} </li>`;
              })

              content += "</ul>"
              infosDivElt.innerHTML = content; 
              panelMapElt.appendChild(infosDivElt);
            })
        });
  
        divElt.appendChild(listElt);
      }
    })
  });
  
  contentElt.appendChild(containerElt);



};

map.on('click', (e) => {
  map.forEachFeatureAtPixel(e.pixel, (feature) => {
    const tableKeys = feature.getKeys();
    let content = `<h3> ${feature.get('nom du site')} </h3>`;
    content += "<ul>";

    tableKeys.forEach(key => {
      if (key !== 'geometry' && key !== 'hover' && key !== 'samples'){
        content += `<li>${key} : ${feature.get(key)} </li>`;
      }
    });
    
    content += "</ul>"
    contentElt.innerHTML = content; 

    dropDown(feature);
  })
})


// animate the map
function animate() {
  map.render();
  window.requestAnimationFrame(animate);
}
animate();