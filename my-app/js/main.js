import '../css/style.css';
import {Map, View} from 'ol';
import {Stroke, Fill, Style} from 'ol/style'
import LayerGroup from 'ol/layer/Group.js';
import TileLayer from 'ol/layer/Tile';
import {Projection, fromLonLat} from 'ol/proj.js';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';

import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import Stamen from 'ol/source/Stamen.js';
import WebGLPointsLayer from 'ol/layer/WebGLPoints.js';
import {Vector as VectorSource, OSM}  from 'ol/source.js';

import axios from 'axios';
import { MultiPolygon, Polygon } from 'ol/geom';
//import WebGLVectorLayerRenderer from 'ol/render/webgl/VectorLayer';
import WebGLVectorLayerRenderer from 'ol/renderer/webgl/VectorLayer.js'
import Layer from 'ol/layer/Layer';
import {packColor} from 'ol/renderer/webgl/shaders.js';
import {
  Modify,
  Select,
  defaults as defaultInteractions,
} from 'ol/interaction.js';



// class WebGLLayer extends Layer {
//   createRenderer() {
//     return new WebGLVectorLayerRenderer(this, {
//       fill: {
//         attributes: {
//           color: function (feature) {
//             const value = feature.get('value');

//             const colorByValue = [
//               {valueMin: 0.0001, valueMax: 0.002, color: '#FFFFFF'},
//               {valueMin: 0.0021, valueMax: 0.0062, color: '#ffe3e3'},
//               {valueMin: 0.0063, valueMax: 0.02, color: '#ffc6c6'},
//               {valueMin: 0.021, valueMax: 0.0551, color: '#ffaaaa'},
//               {valueMin: 0.0552, valueMax: 0.1611, color: '#ff8e8e'},
//               {valueMin: 0.1612, valueMax: 0.3952, color: '#ff7171'},
//               {valueMin: 0.3953, valueMax: 0.9131, color: '#ff5555'},
//               {valueMin: 0.9132, valueMax: 2.2567, color: '#ff3939'},
//               {valueMin: 2.2568, valueMax: 6.5316, color: '#ff5555'},
//               {valueMin: 6.5317, valueMax: 20000, color: '#ffc6c6'},
//             ];

//             const findColor = colorByValue.find((obj) => value >= obj.valueMin && value <= obj.valueMax);
//             const color = findColor.color;
            
//             return packColor(color);
//           },
//           opacity: function () {
//             return 1;
//           },
//         },
//       },
//       stroke: {
//         attributes: {
//           color: function () {
//             const color = '#000000';
//             return color;
//           },
//           width: function () {
//             return 1;
//           },
//           opacity: function () {
//             return 1;
//           },
//         }
//       }
//     });
//   }
// }

class WebGLLayer extends Layer {
  constructor(options) {
    // Appel du constructeur de la classe parent (Layer)
    super(options);
    this.selectedFeatures = this.getSource().getFeatures();
    console.log(this.selectedFeatures);
  }

  createRenderer() {
    return new WebGLVectorLayerRenderer(this, {
      fill: {
        attributes: {
          color: function (feature) {
            const value = feature.get('value');
            const colorByValue = [
              {valueMin: 0.0001, valueMax: 0.002, color: '#FFFFFF'},
              {valueMin: 0.0021, valueMax: 0.0062, color: '#ffe3e3'},
              {valueMin: 0.0063, valueMax: 0.02, color: '#ffc6c6'},
              {valueMin: 0.021, valueMax: 0.0551, color: '#ffaaaa'},
              {valueMin: 0.0552, valueMax: 0.1611, color: '#ff8e8e'},
              {valueMin: 0.1612, valueMax: 0.3952, color: '#ff7171'},
              {valueMin: 0.3953, valueMax: 0.9131, color: '#ff5555'},
              {valueMin: 0.9132, valueMax: 2.2567, color: '#ff3939'},
              {valueMin: 2.2568, valueMax: 6.5316, color: '#ff5555'},
              {valueMin: 6.5317, valueMax: 20000, color: '#ffc6c6'},
            ];

            const findColor = colorByValue.find((obj) => value >= obj.valueMin && value <= obj.valueMax);
            const color = findColor.color;
            return packColor(color);
          },
          opacity: function () {
            return 1;
          },
        },
      },
      stroke: {
        attributes: {
          color: function () {
            const color = '#000000';
            return color;
          },
          width: function () {
            return 1;
          },
          opacity: function () {
            return 1;
          },
        }
      }
    });
  }

  // Méthode pour récupérer les entités sélectionnées
  getSelectedFeatures() {
    console.log("coucou la compagnie");
    return this.selectedFeatures;
  }
}




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
const getSubstanceInMap = (urlBNVD, urlCNEP, urlGeodAir, casSubstance) => {
  //clean groupLayer afin de ne pas additionner les couches
  groupLayer.length = 0;
  //supprime le groupe de calques
  map.removeLayer(map.getLayers().array_[1]);
  
  //on récupère la données
  Promise.all([urlBNVD, urlCNEP, urlGeodAir, './datas/CNEP/CNEP_site.json'].map((endPoint) => axios.get(endPoint)))
  .then((responses) => {
    const datas = responses.map(({ data }) => data);
    let [BNVD, CNEP, GEODAIR, CNEP_sites] = datas;

   

    //console.log(GEODAIR);
    //console.log(GEODAIR.filter((item) => item.properties.cas.includes(casSubstance)));
    //console.log(CNEP.filter((item) => item.properties.substance.includes('Prochloraz')));

    //filtre d'une substance en dure pour le test
    CNEP = CNEP.filter((item) => item.properties.substance.includes('Prochloraz'));



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

    const datasLayer2 = new WebGLLayer({
      source: new VectorSource({
        features: BNVD.filter((item) => typeof item.properties.value === 'number').map((item) => { 
          return new Feature({
            ...item.properties, 
            geometry: item.geometry.type === 'Polygon' 
              ? new Polygon(item.geometry.coordinates) 
              : new MultiPolygon(item.geometry.coordinates)
            }
        )})
      }),
      title: `BNVD`
    });

    // const datasLayer2 = new VectorLayer({
    //   source: new VectorSource({
    //     features: BNVD.filter((item) => typeof item.properties.value === 'number').map((item) => { 
    //       return new Feature(
    //         {...item.properties, 
    //         geometry: item.geometry.type === 'Polygon' 
    //           ? new Polygon(item.geometry.coordinates) 
    //           : new MultiPolygon(item.geometry.coordinates)
    //         }
    //     )})
    //   }),
    //   style: function(feature) {
    //     const value = feature.get('value');
    
    //     const colorByValue = [
    //       { valueMin: 0.0001, valueMax: 0.002, color: '#FFFFFF' },
    //       { valueMin: 0.0021, valueMax: 0.0062, color: '#ffe3e3' },
    //       { valueMin: 0.0063, valueMax: 0.02, color: '#ffc6c6' },
    //       { valueMin: 0.021, valueMax: 0.0551, color: '#ffaaaa' },
    //       { valueMin: 0.0552, valueMax: 0.1611, color: '#ff8e8e' },
    //       { valueMin: 0.1612, valueMax: 0.3952, color: '#ff7171' },
    //       { valueMin: 0.3953, valueMax: 0.9131, color: '#ff5555' },
    //       { valueMin: 0.9132, valueMax: 2.2567, color: '#ff3939' },
    //       { valueMin: 2.2568, valueMax: 6.5316, color: '#ff5555' },
    //       { valueMin: 6.5317, valueMax: 20000, color: '#ffc6c6' },
    //     ];
    
    //     const findColor = colorByValue.find((obj) => value >= obj.valueMin && value <= obj.valueMax);
    //     const color = findColor.color;
    
    //     return [
    //       new Style({
    //         fill: new Fill({
    //           color: color,
    //         }),
    //         stroke: new Stroke({
    //           color: '#000000',
    //           width: 1,
    //         }),
    //       }),
    //     ];
    //   },
    //   title: `BNVD`
    // });

    // const datasLayer2 = new WebGLLayer({
    //   source: new VectorSource({
    //     features: BNVD.map((item, i) => { 
    //       console.log(item.properties.value);
    //       return new Feature(
    //         {...item.properties, 
    //         geometry: item.geometry.type === 'Polygon' 
    //           ? new Polygon(item.geometry.coordinates) 
    //           : new MultiPolygon(item.geometry.coordinates)
    //         }
    //     )}) 
    //   }),
    //   title: `BNVD`
    // });
    
    // let datasLayer2 = new WebGLLayer({
    //   source: new VectorSource({
    //     wrapX: true,
    //     features: BNVD_2020_CAS70630_17_0.map((item) => { 
    //       return new Feature({...item.properties, geometry: new MultiPolygon(item.geometry.coordinates)}
    //     )})
    //   }),
    //   style: new Style({
    //     stroke: new Stroke({
    //       color: 'blue',
    //       width: 2
    //     }),
    //     fill: new Fill({
    //       color: 'rgba(0, 0, 255, 0.1)'
    //     })
    //   }),
    //   title: `BNVD`
    // });
    
    //console.log(CNEP_SITE_LAYER);

    groupLayer.push(datasLayer2);
    //groupLayer.push(datasLayer3);

    groupLayer.push(CNEP_LAYER);
    console.log(datasLayer2.getSelectedFeatures());
    
    const selectedStyle = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)',
      }),
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.7)',
        width: 2,
      }),
    });
    
    console.log(groupLayer);
    // Créez une interaction de sélection pour la couche contenant les polygones
    var selectInteraction = new Select({
      layers: [...groupLayer] ,
      style: function (feature) {
        const color = feature.get('COLOR_BIO') || '#eeeeee';
        selectedStyle.getFill().setColor(color);
        return selectedStyle;
      },
    });
    
    // Ajoutez l'interaction de sélection à la carte
    map.addInteraction(selectInteraction);
    
    // Écoutez l'événement de sélection lorsqu'un polygone est cliqué
    selectInteraction.on('select', function(event) {
      console.log("le select:", event.selected);
      var selectedFeature = event.selected[0]; // Récupère la première feature sélectionnée
    
      if (selectedFeature) {
        var properties = selectedFeature.getProperties(); // Récupère les propriétés de la feature
        // Faites quelque chose avec les propriétés récupérées, par exemple :
        console.log(properties);
      }
    });
    
    
    // Regroupement des calques de données
    const baseLayerGroup = new LayerGroup({
      layers: groupLayer
    })
    
    // Ajout des données sur la carte 
    map.addLayer(baseLayerGroup);
    
    map.on('click', (e) => {
      console.log("le click:", e);
      map.forEachFeatureAtPixel(e.pixel, (feature) => {
        const tableKeys = feature.getKeys();
        console.log(tableKeys);
      })
    })

    // Layer switcher
    const baseLayerElements = document.querySelectorAll('#form-map > fieldset> div > label > input[type=checkbox]');
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
  const dateFiltreValue = formMapElt.querySelector('#année-filtre').value;

  const BNVD_URL = `${BASE_URL}BNVD/${substanceFiltreValue}/${substanceFiltreValue}_${dateFiltreValue}${BNVD_FIN_NOM_FICHER}`;

  getSubstanceInMap(BNVD_URL, './datas/CNEP/CNEP.json', './datas/GEODAIR/geodair.json', substanceFiltreValue);
});




// animate the map
function animate() {
  map.render();
  window.requestAnimationFrame(animate);
}
animate();