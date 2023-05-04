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
import {singleClick} from 'ol/events/condition.js';
import SelectMulti from 'ol-ext/control/SelectMulti';
//import {SelectFulltext, SelectPopup, SelectCheck, SelectCondition} from 'ol-ext/control';
import SelectFulltext from 'ol-ext/control/SelectFulltext';
import SelectPopup from 'ol-ext/control/SelectPopup';
import SelectCheck from 'ol-ext/control/SelectCheck';
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
    url: datas
  }), */
  source: datas,
  style: {
    //symbol: '/images/icon.png',
    'circle-radius': 8,
    'circle-fill-color': 'blue',
  },
  title: 'dataslayer'
});

console.log(dataslayer)

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
// Select  interaction
var selecti = new Select({
  hitTolerance: 5,
  //condition: ol.events.condition.singleClick
  //condition: new ol.events.condition.singleClick()
  condition: singleClick

});
map.addInteraction(selecti);
// Select feature when click on the reference index
selecti.on('select', function(e) {
  var f = e.selected[0];
  if (f) {
    var prop = f.getProperties();
    //var ul = $('.options ul').html('');
    var ul = document.querySelector('.options ul').innerHTML('');
    /*
    for (var p in prop) if (p!=='geometry') {
      if (p==='img') $('<li>').appendTo(ul).append($('<img>').attr('src', prop[p]));
      else $('<li>').text(p+': '+prop[p]).appendTo(ul);
    }
    */
    for (var p in prop) if (p!=='geometry') {
      if (p==='img') document.querySelector('li').append(document.querySelector('ul')).append(document.querySelector('img').setAttribute('src', prop[p]));
      else document.querySelector('li').textContent(p+': '+prop[p]).append(document.querySelector('ul'));
    }
  }
});

// Select control
const options = document.getElementById('options');

var selectCtrl = new SelectMulti({
  //target: $('.options').get(0),
  target: options,
  controls: [
    new SelectFulltext({
      label: 'Text:',
      property: 'text'
    }),
    new SelectPopup({
      defaultLabel: 'all',
      label: 'Region:',
      property: 'region'
    }),
    new SelectCheck({
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
    new SelectCondition({
      label: 'before 1918',
      condition: { attr: 'date', op:'<', val:'1918' }
    })
  ]
});
// Add control
map.addControl (selectCtrl);

// Do something on select
selectCtrl.on('select', function(e) {
  selecti.getFeatures().clear();
  //if ($('#select').prop('checked')) {
  if (document.getElementById('select').checked) {
    // Select features
    e.features.forEach(function(f) {
      selecti.getFeatures().push(f);
    });
  } else {
    // Hide features
    dataslayer.getFeatures().forEach(function(f) {
      f.setStyle([]);
    });
    // Show current
    e.features.forEach(function(f) {
      f.setStyle(null);
    });
  }
});
// Show all features
function reset() {
  selecti.getFeatures().clear();
  dataslayer.getFeatures().forEach(function(f) {
    f.setStyle(null);
  });
  selectCtrl.doSelect();
}
// Set values when loaded
var listenerKey = dataslayer.on('change',function(e){
  if (datas.getState() === 'ready') {
    //ol.Observable.unByKey(listenerKey);
    new unByKey(listenerKey);
    // Fill the popup with the features values
    selectCtrl.getControls()[1].setValues({ sort: true });
  }
});