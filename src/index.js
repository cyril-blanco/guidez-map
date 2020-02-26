import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
/* This code is needed to properly load the images in the Leaflet CSS */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const data = require('./data.clean.json');

var MapIcon = L.Icon.extend({
  options: {
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -7],
    tooltipAnchor: [0, 0]
  }
});
var leafletMapItems = {};
var overlayLayers = [];
var filterLayers = {};
function addMapItem(uniqueFilterBool, includeInFilterListBool, layerName, filterName, filterImageURL) {
  var filterCheckboxFormat = "<img src='" + filterImageURL + "' width='24px'> <b>" + layerName + "</b>";
  var leafletMapItem = {
    leafletLayerFilterName: filterName,
    leafletLayerName: layerName,
    leafletFilterCheckbox: filterCheckboxFormat,
    leafletLayerGroup: L.layerGroup(),
    leafletMapIcon: new MapIcon({iconUrl: filterImageURL}),
  };
  leafletMapItems[layerName] = leafletMapItem;
  if (includeInFilterListBool){
    filterLayers[leafletMapItems[layerName].leafletFilterCheckbox] = leafletMapItems[layerName].leafletLayerGroup;
  }
  overlayLayers.push(leafletMapItems[layerName].leafletLayerGroup);
}


// Base URL and background
var topLevelDomain = "https://escapefromtarkov.gamepedia.com";
var interactiveMapTableData = "Customs_Interactive_Map_Table";
var mapBackground = "https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/9/9a/Customs_map_glory4lyfe.png";
var scavPatrols = "https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/d/d7/Interactive_Map_customs_scav_patrols.png";
var mapExtracts = "https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/c/cb/Interactive_Map_Customs_Extracts.png";

// Define Map Filter Items/Layers/Icons
//Format: addMapItem(excludeMiniImageInFilterBool, includeInFilterListBool, Name in the filter/table, Filter category, icon image URL)
addMapItem(true, true, 'Ammo Box', 'AmmoBox', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/9/91/Interactive_map_ammo_box.png');
addMapItem(true, true, 'Boss Spawn', 'BossSpawn', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/6/6b/Interactive_map_boss_16x.png');
addMapItem(true, true, 'Cash Register', 'CashRegister', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/3/31/Interactive_map_register.png');
addMapItem(true, true, 'Computer', 'Computer', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/2/23/Interactive_map_computer.png');
addMapItem(true, true, 'Drawer', 'Drawer', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/b/bb/Interactive_map_file_cabinet.png');
addMapItem(false, true, 'Extracts', 'None', 'https://escapefromtarkov.gamepedia.com/media/9/9a/Interactive_map_pmc_extract_8x.png');
addMapItem(true, true, 'Grenade Box', 'GrenadeBox', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/8/8a/Interactive_map_grenade_box.png');
addMapItem(true, true, 'Jacket', 'Jacket', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/3/37/Interactive_map_jacket.png');
addMapItem(true, true, 'Key Spawn','KeySpawn', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/d/d9/Interactive_map_key_64x.png');
addMapItem(true, true, 'Keycard Spawn','KeycardSpawn', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/1/1e/Interactive_map_keycard.png');
addMapItem(true, true, 'Locked Door', 'LockedObject', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/f/f3/Interactive_map_lock_symbol_8x.png');
addMapItem(true, true, 'Loose Loot','LooseLoot', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/8/85/Interactive_map_loose_loot_8x.png');
addMapItem(true, true, 'Medical', 'Medical','https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/1/10/Interactive_map_medical_supplies_8x.png');
addMapItem(true, true, 'PMC Spawn', 'PMCSpawn', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/1/18/Interactive_map_PMC_Spawn.png');
addMapItem(true, true, 'Quest Related', 'QuestRelated', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/b/bc/Interactive_map-questitem_type_1.png');
addMapItem(false, false, 'Safari', 'QuestRelated', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/6/60/Interactive_Map_safari.png');
addMapItem(true, true, 'Safe', 'Safe', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/6/65/Interactive_map_safe.png');
addMapItem(true, true, 'Scav Spawn', 'ScavSpawn', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/8/8c/Interactive_map_ushanka.png');
addMapItem(false, true, 'Scav Patrols', 'None', 'https://escapefromtarkov.gamepedia.com/media/3/31/Interactable_Map_Scav_Patrols.png');
addMapItem(false, false, 'Scav Sniper', 'ScavSpawn', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/2/20/Interactive_map_sniper.png');
addMapItem(true, true, 'Sports Bag', 'SportsBag', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/b/b4/Interactive_map_sportbag_toolbox.png');
addMapItem(true, true, 'Stash', 'Stash', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/3/39/Interactive_map_stash_8x.png');
addMapItem(true, true, 'Toolbox', 'Toolbox', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/b/b1/CASE.png');
addMapItem(true, true, 'Unknown', 'Unknown', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/4/4d/Interactive_map_unknown_category_128x.png');
addMapItem(true, true, 'Weapon Box', 'WeaponBox', 'https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/1/1a/Interactive_map_weapon_box.png');


function turnLayerOn(){
  console.log(Object.keys(map._controlCorners));
  console.log(Object.keys(map._controlContainer));
  console.log(Object.keys(map._mapPane._leaflet_pos.x))
  for (var i = 0; i < overlayLayers.length; ++i) {
    map.addLayer(overlayLayers[i]);
  }
}
function turnLayerOff(){
  for (var i = 0; i < overlayLayers.length; ++i) {
    map.removeLayer(overlayLayers[i]);
  }
}

var dynamicPopUps = [];

// Load the data for the map.
// $.ajax({
//   type: 'GET',
//   url: topLevelDomain + '/api.php?action=parse&format=json&prop=text|​links&page=' + interactiveMapTableData,
//   contentType: 'application/json; charset=utf-8',
//   async: false,
//   dataType: 'json',
//   success: function(data) {
//     var html = data.parse.text['*'];
//     if (!html) {
//       return console.log('no HTML');
//     }
//     var $hiddenContent = $('<div/>').html(data.parse.text['*']).hide();
//     var mapData = $hiddenContent.find('table.sortable tr').map(function() {
//       return new Array($('td', this).map(function() {
//         return $(this).text().replace(/\n/g, '').trim()
//       }).slice(0, 9).get())
//     }).get();
//     $hiddenContent.remove();
//
//     for (var i in mapData) {
//       if (i == 0) {
//         continue;
//       }
//       var locationY = parseFloat(mapData[i][3]) || 0;
//       var locationX = parseFloat(mapData[i][4]) || 0;
//       var coordinatesXY = 'X: ' + locationX + ' Y: ' + locationY;
//       var popupContent = "<strong>" + mapData[i][1] + "</strong><BR>";
//       if (mapData[i][1] != "") {
//         popupContent = "<a href=\"https://escapefromtarkov.gamepedia.com/" + mapData[i][1] + "\" target=\"_blank\">" + popupContent + "</a>";
//       }
//       else{
//         popupContent = '<b>' + mapData[i][0] + '</b><br>';
//       }
//       if (mapData[i][2] != "") {
//         popupContent += mapData[i][2] + "<br>";
//       }
//       if (mapData[i][5] != "") {
//         popupContent += '<br><a href="' + mapData[i][5] + '" target="_blank"><img src="' + mapData[i][5] + '" width="150px"></a><br><font color="white">[' + coordinatesXY + ']</font>';
//       }
//       else {
//         popupContent += '<font color="white">[' + coordinatesXY + ']</font>';
//       }
//       currentPopUp = {
//         filterName: mapData[i][0],
//         popupX: locationX,
//         popupY: locationY,
//         popupContent: popupContent
//       };
//       dynamicPopUps.push(currentPopUp);
//     }
//   }, // End of success function AJAX
//   error: function() {
//     return console.log("error");
//   }
// });

dynamicPopUps = data;


// Define the map and options for it.
var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -3,
  maxZoom: 1,
  fullscreenControl: true,
  zoomDelta: 0.25,
  zoomSnap: 0.25,
  layers: overlayLayers
});

// Define the boundaries
var bounds = [[-2142, -4096],[2142, 4096]];

// Provide the full URL to the map image that has been uploaded.
var image = L.imageOverlay(mapBackground, bounds).addTo(map);
map.fitBounds(bounds);

var baseMaps = {};
var controlLayers = L.control.layers(baseMaps, filterLayers, {
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
    )

    leafletPopup.addTo(leafletMapItems[dynamicPopUps[i].filterName].leafletLayerGroup).bindPopup(dynamicPopUps[i].popupContent);
  }
}

//disable default scroll to use CTRL
map.scrollWheelZoom.disable();
map.on('click', function(e) {
  if (e.originalEvent.ctrlKey) {
    var locationX = e.latlng.lng;
    var locationY = e.latlng.lat;
    this.openTooltip("X: " + locationX.toFixed(0) + "<BR>Y: " + locationY.toFixed(0), e.latlng);
  }
});

$("#map").bind('mousewheel DOMMouseScroll', function(event) {
  event.stopPropagation();
  if (event.shiftKey == true) {
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
