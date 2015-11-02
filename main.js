var data;
var index = 0;

var frame = d3.select('#map');
var quote = d3.select('#quote');
var source = d3.select('#source');
var address = d3.select('#location');

var hash = window.location.hash;

d3.csv('data-1.csv', function(_data) {
  loadTour(_data, 'Learning to Read New York');

  $('body').on('click', function(e) {
    nextPlace();
  });

  $(window).on('hashchange', function() {
    go(window.location.hash.substring(1));
  });

  go(window.location.hash.substring(1));
});

function loadTour(_data, theme) {
  data = _data.filter(function(d) {
    return d['Theme'] == theme;
  });

  data = data.map(function(d) {
    d.embed = d['Streetview Embed Code'].match(/src="(.*?)"/)[1];
    d.lat = d['Streetview Embed Code'].match(/1d(.*?)!/)[1];
    d.lng = d['Streetview Embed Code'].match(/2d(.*?)!/)[1];
    d['Quote'] = d['Quote'].replace('\n', '<br>');
    d['Source'] = d['Source'].replace('\n', '<br>');
    return d;
  });
}

function prevPlace() {
  index --;
  if (index < 0) {
    index = data.length - 1;
  }
  window.location.hash = '#' + index;
}

function nextPlace() {
  index ++;
  if (index > data.length - 1) {
    index = 0;
  }
  window.location.hash = '#' + index;
}

function go(i) {
  if (typeof i != 'number') i = +i;

  index = i;
  frame.attr('src', data[index].embed);
  quote.html(data[index]['Quote']);
  source.html(data[index]['Source']);
  address.text(data[index]['Location']);
}

// Tour map

var longitude = 40.7127;
var latitude = -74.0059;

// var tourMap = L.map('tour-map').setView([longitude, latitude], 13);

var tourMap = L.map('tour-map', {center: [longitude, latitude], zoom: 13});


L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(tourMap);

// L.marker([73.9597, 40.7903]).addTo(tourMap)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();
