var data;
var index = 0;

var frame = d3.select('#map');
var preview = d3.select('#preview');
var quote = d3.select('#quote');
var context = d3.select('#context');
var source = d3.select('#source');
var address = d3.select('#location');

var hash = window.location.hash;

d3.csv('data.csv', function(_data) {
  loadTour(_data, 'Learning to Read New York');

  $('#forward').on('click', function(e) {
    nextPlace();
  });

  $('#backward').on('click', function(e) {
    prevPlace();
  });

  $('#read-more').on('click', function(e) {
    expand();
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
    d['Context'] = d['Context'].replace('\n', '<br>');
    d['Preview'] = d['Preview'].replace('\n', '<br>');
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
  preview.html(data[index]['Preview']);
  context.html(data[index]['Context']);
  source.html(data[index]['Source']);
  address.text(data[index]['Location']);
  window.location.hash = '#' + index;
}

function expand() {
  if ($("#read-more").html() == "Read More") {
    $("#preview").hide();
    $("#quote").show();
    $("#read-more").html("Read Less");
  } else {
    $("#quote").hide();
    $("#preview").show();
    $("#read-more").html("Read More");
  }
}