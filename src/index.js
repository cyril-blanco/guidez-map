import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
/* This code is needed to properly load the images in the Leaflet CSS */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const mapName = 'customs';
const settings = require('../data/settings');
const data = require('./data.clean');
const translations = require('../data/translations/en.json');

/* Custom map icon definition */
const MapIcon = L.Icon.extend({
  options: {
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -7],
    tooltipAnchor: [0, 0]
  }
});

const leafletMapItems = {};
const overlayLayers = [];
const filterLayers = {};

const addMapItem = (item) => {
  const { includeInFilterListBool, filterName: leafletLayerFilterName, layerName: leafletLayerName, iconUrl } = item;
  const leafletFilterCheckbox = `<img src="${iconUrl}" alt="${leafletLayerName}" width="24px"> <b>${leafletLayerName}</b>`;
  leafletMapItems[leafletLayerName] = {
    leafletLayerFilterName,
    leafletLayerName,
    leafletFilterCheckbox,
    leafletLayerGroup: L.layerGroup(),
    leafletMapIcon: new MapIcon({ iconUrl }),
  };
  if (includeInFilterListBool){
    filterLayers[leafletMapItems[leafletLayerName].leafletFilterCheckbox] = leafletMapItems[leafletLayerName].leafletLayerGroup;
  }
  overlayLayers.push(leafletMapItems[leafletLayerName].leafletLayerGroup);
};

for (const item of settings.markerTypes) {
  addMapItem(item);
}

function turnLayerOn(){
  console.log(Object.keys(map._controlCorners));
  console.log(Object.keys(map._controlContainer));
  console.log(Object.keys(map._mapPane._leaflet_pos.x));
  for (var i = 0; i < overlayLayers.length; ++i) {
    map.addLayer(overlayLayers[i]);
  }
}
function turnLayerOff(){
  for (var i = 0; i < overlayLayers.length; ++i) {
    map.removeLayer(overlayLayers[i]);
  }
}

const dynamicPopUps = data;

// Define the map and options for it.
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -3,
  maxZoom: 1,
  fullscreenControl: true,
  zoomDelta: 0.25,
  zoomSnap: 0.25,
  layers: overlayLayers
});

// Define the boundaries
const bounds = settings.maps[mapName].bounds;

// Provide the full URL to the map image that has been uploaded.
L.imageOverlay(settings.maps[mapName].background, bounds).addTo(map);
map.fitBounds(bounds);

L.control.layers({}, filterLayers, {
  "sortLayers": false,
  "collapsed": false,
  position: 'topleft'
}).addTo(map);
map.setView([0, 0], -2.0);

// Build the Popups
for (var i = 0; i < dynamicPopUps.length; ++i){
  if (leafletMapItems.hasOwnProperty(dynamicPopUps[i].filterName)){
    var leafletPopup = L.marker(
        [dynamicPopUps[i].popupX, dynamicPopUps[i].popupY],
        {icon: leafletMapItems[dynamicPopUps[i].filterName].leafletMapIcon}
    );

    leafletPopup.addTo(leafletMapItems[dynamicPopUps[i].filterName].leafletLayerGroup).bindPopup(dynamicPopUps[i].popupContent);
  }
}

// Disable default scroll to use CTRL
map.scrollWheelZoom.disable();
map.on('click', function(e) {
  if (e.originalEvent.ctrlKey) {
    // Opens a popup with coordinates when user CTRL-clicks on map
    // It seems to be a tool for editors, maybe we could disable it in "production" mode. And maybe we don't care...
    this.openTooltip(`X: ${e.latlng.lng.toFixed(0)}<br>Y: ${e.latlng.lng.toFixed(0)}`, e.latlng);
  }
});

/*
 * NOT WORKING YET
 * Could be great if we could translate this to vanilla JS to get rid of jQuery dependency. It would speed up loading
 * time and make it easier to integrate.
 */
$("#map").bind('mousewheel DOMMouseScroll', function(event) {
  event.stopPropagation();
  if (event.shiftKey === true) {
    event.preventDefault();
    map.scrollWheelZoom.enable();
    $('#map').removeClass('map-scroll');
    setTimeout(function() {
      map.scrollWheelZoom.disable();
    }, 1000);
  }
  else {
    map.scrollWheelZoom.disable();
    $('#map').addClass('map-scroll');
  }
});
$(window).bind('mousewheel DOMMouseScroll', function(event) {
  $('#map').removeClass('map-scroll');
});
