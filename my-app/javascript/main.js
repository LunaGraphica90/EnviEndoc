import '../../my-app/style.css';
import {Map, View} from 'ol';
import LayerGroup from 'ol/layer/Group.js';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {fromLonLat} from 'ol/proj.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

//console.log(json_Diffusion_Donnes_Mesures_CNEP1_0.features);
// Centre carte sur centre de la France
const franceLat = [1.52, 46.36];
const franceWebMercator = fromLonLat(franceLat);

/// Import des données
const datas = './datas/CNEP_test.json';


var dataslayer = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: datas
  }),
  style: {
    //symbol: '/images/icon.png',
    'circle-radius': 8,
    'circle-fill-color': 'blue',
  },
  title: 'dataslayer'
});

console.log(dataslayer)

var dataslayer2 = new VectorLayer({
  source: new VectorSource({
    format: new GeoJSON(),
    url: datas
  }),
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

  //console.log(feature.values_);
  //console.log(feature.get('nom du site'))
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