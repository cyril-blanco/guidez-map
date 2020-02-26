const fs = require('fs');
const cheerio = require('cheerio');
const data = require('./data.wiki.json');
const $ = cheerio.load(data.parse.text['*']);

var mapData = $('table.sortable tr').map(function() {
    return new Array($('td', this).map(function() {
        return $(this).text().replace(/\n/g, '').trim()
    }).slice(0, 9).get())
}).get();

let dynamicPopUps = [];
for (var i in mapData) {
    if (i == 0) {
        continue;
    }
    var locationY = parseFloat(mapData[i][3]) || 0;
    var locationX = parseFloat(mapData[i][4]) || 0;
    var coordinatesXY = 'X: ' + locationX + ' Y: ' + locationY;
    var popupContent = "<strong>" + mapData[i][1] + "</strong><BR>";
    if (mapData[i][1] != "") {
        popupContent = "<a href=\"https://escapefromtarkov.gamepedia.com/" + mapData[i][1] + "\" target=\"_blank\">" + popupContent + "</a>";
    }
    else{
        popupContent = '<b>' + mapData[i][0] + '</b><br>';
    }
    if (mapData[i][2] != "") {
        popupContent += mapData[i][2] + "<br>";
    }
    if (mapData[i][5] != "") {
        popupContent += '<br><a href="' + mapData[i][5] + '" target="_blank"><img src="' + mapData[i][5] + '" width="150px"></a><br><font color="white">[' + coordinatesXY + ']</font>';
    }
    else {
        popupContent += '<font color="white">[' + coordinatesXY + ']</font>';
    }
    currentPopUp = {
        filterName: mapData[i][0],
        popupX: locationX,
        popupY: locationY,
        popupContent: popupContent
    };
    dynamicPopUps.push(currentPopUp);
}

console.log(dynamicPopUps);

fs.writeFileSync('data.clean.json', JSON.stringify(dynamicPopUps, null, 2));

