import '../css/style.css';
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

// Centre carte sur centre de la France
const FRANCE_LAT = [1.52, 46.36];

const map = new Map({
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
  zoom: 6,
  projection: "EPSG:4326"
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
    console.log(BNVD);

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
                geometry: new Point(item.geometry.coordinates),
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
              ? new Polygon(item.geometry.coordinates) 
              : new MultiPolygon(item.geometry.coordinates)
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
          { valueMin: 201, valueMax: 800.9999, color: '255, 57, 57' },
          { valueMin: 801, valueMax: 3000.9999, color: '255, 198, 198' },
          { valueMin: 3001, valueMax: 20000, color: '255, 85, 85' }
        ];
    
        const findColor = colorByValue.find((obj) => value >= obj.valueMin && value <= obj.valueMax);
        const opacity = '0.5';
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
    const baseLayerElements = document.querySelectorAll('.main__content-panel1 > fieldset> div > label > input[type=checkbox]');
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
  const sidePanelElt = document.querySelector('.main__content-panel2');
  
  if (selectedFeature) {
    const properties = selectedFeature.getProperties(); // Récupère les propriétés de la feature
    console.log(properties);
    // Faites quelque chose avec les propriétés récupérées, par exemple :
    const infosDivElt = document.createElement('div');

    let content = `<h3> Informations sur la vente de la substance ${properties['subst_substance_name']} (cas: ${properties.BNVD_cas}) en ${properties.BNVD_annee} : </h3>`;
    content += "<ul>";
    const tableKeyBNVD = ['value', 'CP', 'NOM_COM', 'NOM_DEPT', 'NOM_REG', 'POPULATION', 'SUPERFICIE', 'subst_URL_for_deduct'];
    console.log(event);
    console.log(properties['subst_substance_name']);
  
    tableKeyBNVD.forEach((key) =>{
      //si c'est la valeur on rajoute l'unité
      if (key === 'value'){
        content += `<li>${key} en Kg: ${properties[key]} </li>`;
      }else{
        content += `<li>${key} : ${properties[key]} </li>`;
      }
    })
  
    content += "</ul>"
    infosDivElt.innerHTML = content; 
    sidePanelElt.appendChild(infosDivElt);
    console.log(properties);
  }
});


// animate the map
function animate() {
  map.render();
  window.requestAnimationFrame(animate);
}
animate();