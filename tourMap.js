var ctrLongitude = 40.759081;
var ctrLatitude = -73.978492;

var redCircleIcon = L.icon({
  iconUrl: 'images/capital-red-circle-map.png',
  iconSize: [18, 18]
})

// Initialize tour map

var tourMap = L.map('tour-map').setView([ctrLongitude, ctrLatitude], 13);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(tourMap);

// Populate map with pins - better way to deal with empty data?

d3.csv("data.csv", function (data) {
  var index = 0;

  data.map(function (d) {
    if (d['Streetview Embed Code']) {
      var lat = parseFloat(d['Streetview Embed Code'].match(/1d(.*?)!/)[1]);
      var lng = parseFloat(d['Streetview Embed Code'].match(/2d(.*?)!/)[1]);
      d['Index'] = index;

      if (lat && lng) {
        var marker = L.marker([lat, lng], {icon: redCircleIcon}).addTo(tourMap);
        marker.on('click', function() { go(d['Index'])});
      }
    }
    index += 1;
  });
});


