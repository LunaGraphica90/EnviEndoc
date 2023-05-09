import './style.css';
import {Map, View} from 'ol';
import LayerGroup from 'ol/layer/Group.js';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Select from 'ol/interaction/Select';
import SearchFeature from 'ol-ext/control/SearchFeature';
import {singleClick} from 'ol/events/condition';
//import {singleClick} from 'ol/events/condition.singleClick';
import SelectMulti from 'ol-ext/control/SelectMulti.js';
//import {SelectFulltext, SelectPopup, SelectCheck, SelectCondition} from 'ol-ext/control';
import SelectFulltext from 'ol-ext/control/SelectFulltext';
import SelectPopup from 'ol-ext/control/SelectPopup';
//import SelectCheck from 'ol-ext/control/SelectCheck';
import SelectCondition from 'ol-ext/control/SelectCondition';
import {unByKey} from 'ol/Observable';



//console.log(json_Diffusion_Donnes_Mesures_CNEP1_0.features);
// Centre carte sur centre de la France
const franceLat = [1.52, 46.36];
const franceWebMercator = fromLonLat(franceLat);
  

/// Import des données
//const datas = './datas/CNEP_test.json';

const datas = new VectorSource({
  format: new GeoJSON(),
  url: './datas/CNEP_test.json'
});

var dataslayer = new VectorLayer({
  /* source: new VectorSource({
    format: new GeoJSON(),
    url: './datas/CNEP_test.json'
  }), */
  source: datas,
  style: {
    //symbol: '/images/icon.png',
    'circle-radius': 8,
    'circle-fill-color': 'blue',
  },
  title: 'dataslayer'
});

var dataslayer2 = new VectorLayer({
  source: datas,
  style: {
    //symbol: '/images/icon.png',
    'circle-radius': 4,
    'circle-fill-color': 'red',
  },
  title: 'dataslayer2'
});

// Regroupement des calques de données
const baseLayerGroup = new LayerGroup({
  layers: [
    dataslayer, dataslayer2
  ]
})

const map = new Map({
  target: 'map',
  layers: [
    //fond carte openStreetMap :
    new TileLayer({
      source: new OSM()
    }), 
  ],
  view: new View({
    center: franceWebMercator,
    zoom: 6
  })
});

// Ajout des données sur la carte 
map.addLayer(baseLayerGroup);

// Affichage des données dans la colonne de droite au clic
var content_element = document.getElementById('content');

map.on('click', function (evt) {
  //console.log(evt);
  var feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature) {
      return feature;
    });

/*console.log(feature);
  console.log(feature.values_);
  console.log(feature.get('nom du site')) */
  if (feature) {
    var content = '<h3>' + feature.get('nom du site') + '</h3>';
    content += '<p>Culture dominante autour du site : ' + feature.get('culture dominante autour du site') + '</p>';
    
    content_element.innerHTML = content;    
    //console.info(feature.getProperties());
  } else {
      content = '<p> Aucune donnée à afficher </p>';
      content_element.innerHTML = content;
  }
});

// Layer switcher
const baseLayerElements = document.querySelectorAll('.sidebar-left > fieldset> div > input[type=checkbox]');
//console.log(baseLayerElements);
for (let baseLayerElement of baseLayerElements){
  //console.log(baseLayerElement);
    baseLayerElement.addEventListener('change', function(){
      //console.log(this.value);
      let baseLayerElementValue = this.value;

      baseLayerGroup.getLayers().forEach(function(element, index, array){
        let baselayerTitle = element.get('title');

        if(baselayerTitle === baseLayerElementValue){
          element.setVisible(!element.getVisible());
        }
      })
    })

}

// Test search
// Create a vector layer
/* const vectorSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: 'data.json'
});
const vectorLayer = new ol.layer.Vector({
  source: vectorSource
});
 */
// Create a select interaction
/* const select = new Select({
  layers: [baseLayerGroup]
});

// Add the select interaction to the map
map.addInteraction(select);

// Register a listener for the select event
select.on('select', function(event) {
  const selectedFeatures = event.selected;
  console.log(selectedFeatures);
}); */

// Control Select 
var select = new Select({});
map.addInteraction(select);

// Set the control grid reference
var search = new SearchFeature({
  target: document.querySelector('#options'),
  source: datas,
  property: document.querySelector('#options select').value,
  sort: function(f1,f2) {
    if (search.getSearchString(f1) < search.getSearchString(f2)) {
      return -1;
    } else if (search.getSearchString(f1) > search.getSearchString(f2)) {
      return 1;
    } else {
      return 0;
    }
  }
});
map.addControl (search);

var searchSelect = document.getElementById('searchSelect');

searchSelect.addEventListener('change', function() {
  search.set('property', this.value);
  search.search();
});

search.on('select', function(e) {
  select.getFeatures().clear();
  select.getFeatures().push(e.search);
  var p = e.search.getGeometry().getFirstCoordinate();
  map.getView().animate({ center: p, zoom : 12});
});


// Select control Multi
var selectCtrl = new SelectMulti({
  target: document.querySelector('#options2'),
  source: datas,
  controls: [
    new SelectFulltext({
      label: 'Text:',
      //property: 'text'
      property:document.querySelector('#options2 input'),
    }),
    /* new ol.control.SelectPopup({
      defaultLabel: 'all',
      label: 'Region:',
      property: 'region'
    }),
    new ol.control.SelectCheck({
      label: 'Author:',
      property: 'author',
      // type: 'radio',
      values: {
        'Opérateur D ; Brissy, Edouard': 'Brissy, Edouard',
        'Opérateur D ; Sélince': 'Sélince',
        'Opérateur Théta (code armée, photographe)': 'Théta'
      },
      sort: true 
    }),
    new ol.control.SelectCondition({
      label: 'before 1918',
      condition: { attr: 'date', op:'<', val:'1918' }
    }) */
  ]
});
// Add control
map.addControl (selectCtrl);