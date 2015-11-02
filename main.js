var data;
var index = 0;

var frame = d3.select('#map');
var quote = d3.select('#quote');
var source = d3.select('#source');
var address = d3.select('#location');

var hash = window.location.hash;

d3.csv('data.csv', function(_data) {
  loadTour(_data, 'Queer New York');

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
