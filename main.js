var tour = "Landmarks";
var filename = filename(tour);

$(document).ready(function () {

  var data;
  var tourMap = initializeMap();
  loadFile();

  $(document).on('change', '#select-tour', function () {
    filename = 'data/' + $('#select-tour').val() + '.csv';
    console.log(filename);
    window.location.hash = '#' + 0;
    loadFile();
  });

  function loadFile() {
    d3.csv(filename, function (data) {
      var tourData = loadTour(data);
      populateMap(tourMap, tourData);
      go(window.location.hash.substring(1));

      $(window).on('hashchange', function () {
        var locationNumber = parseInt(window.location.hash.substring(1));
        var currentLocation = L.latLng(tourData[locationNumber].lat, tourData[locationNumber].lng);
        tourMap.setView(currentLocation);
        $('.hereIcon').hide();
        setHereMarker(tourMap, tourData);
        go(window.location.hash.substring(1));
      });
    });
  }

  $('#forward').on('click', function (e) {
    nextPlace();
  });
  $('#backward').on('click', function (e) {
    prevPlace();
  });
  $('#read-more').on('click', function (e) {
    expand();
  });

  function prevPlace() {
    var prev = parseInt(window.location.hash.substring(1)) - 1;
    if (prev < 0) {
      prev = tourData.length - 1;
    }
    go(prev);
  }

  function nextPlace() {
    var next = parseInt(window.location.hash.substring(1)) + 1;
    if (next > tourData.length - 1) {
      next = 0;
    }
    go(next);
  }
});

function initializeMap() {
  var ctrLat = 40.768243;
  var ctrLng = -73.975664;
  var tourMap = L.map('tour-map').setView([ctrLat, ctrLng], 13);

  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  }).addTo(tourMap);

  return tourMap;
}

function populateMap(tourMap, tourData) {
  var redCircleIcon = L.icon({
    iconUrl: '../images/capital-red-circle-map.png',
    iconSize: [18, 18],
    className: 'locationIcon'
  });

  tourData.map(function (d) {
    if (d['Streetview Embed Code']) {
      var lat = parseFloat(d['Streetview Embed Code'].match(/1d(.*?)!/)[1]);
      var lng = parseFloat(d['Streetview Embed Code'].match(/2d(.*?)!/)[1]);

      if (lat && lng) {
        var marker = L.marker([lat, lng], {icon: redCircleIcon}).addTo(tourMap);
        marker.on('click', function () {
          go(d['Index'])
        });
      }
    }
  });

  setHereMarker(tourMap, tourData);
}

function setHereMarker(tourMap, tourData) {
  var locationNumber = parseInt(window.location.hash.substring(1));
  var currentLocation = L.latLng(tourData[locationNumber].lat, tourData[locationNumber].lng);
  var hereIcon = L.icon({
    iconUrl: '../images/capital-walker.png',
    iconSize: [30, 30],
    className: 'hereIcon'
  });

  L.marker(currentLocation, {icon: hereIcon, zIndexOffset: 1000}).addTo(tourMap);
}

function loadTour(data) {
  var tourIndex = 0;

  tourData = data.map(function (d) {
    d.embed = d['Streetview Embed Code'].match(/src="(.*?)"/)[1];
    d.lat = d['Streetview Embed Code'].match(/1d(.*?)!/)[1];
    d.lng = d['Streetview Embed Code'].match(/2d(.*?)!/)[1];
    d['Context'] = d['Context'].replace('\n', '<br>');
    d['Preview'] = d['Preview'].replace('\n', '<br>');
    d['Quote'] = d['Quote'].replace('\n', '<br>');
    d['Source'] = d['Source'].replace('\n', '<br>');
    d['Index'] = tourIndex;
    tourIndex++;
    return d;
  });

  return tourData;
}

function go(i) {
  if (typeof i != 'number') i = +i;
  index = i;

  var link = "http://capital-newyork.com/" + fileize(tourData[index]['Tour']) + "/tour.html#" + i;
  var encoded = "http%3A%2F%2Fcapital-newyork.com%2F" + fileize(tourData[index]['Tour']) + "%2Ftour.html%23" + i;
  var location = tourData[index]['Location'] + " via";
  var source = tourData[index]['Source'];
  var preview = tourData[index]['Preview'];

  $("#map").attr('src', tourData[index].embed);
  $("#tour-title").html(tourData[index]['Tour']);
  $("#quote").html(tourData[index]['Quote']);
  $("#preview").html(tourData[index]['Preview'] + '...');
  $("#context").html(tourData[index]['Context']);
  $("#source").html(tourData[index]['Source']);
  $("#location").html(tourData[index]['Location']);
  $("#location-link").attr("href", link);

  $("#tweet").attr("href", "https://twitter.com/intent/tweet?text="+ location + "&url=" + encoded);
  $("#tumblr").attr("href", "https://www.tumblr.com/widgets/share/tool?shareSource=legacy&canonicalUrl=&url=" + encoded + "&posttype=quote&caption=" + encodeURIComponent(source) + "&content=" + encodeURI(preview));
  $("#facebook").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + encoded);

  $("#quote").hide();
  $("#preview").show();
  $("#read-more").html("Read more");
  ($("#quote").html() == '') ? $("#read-more").hide() : $("#read-more").show();

  window.location.hash = '#' + index;
}

function expand() {
  if ($("#quote").text() != "") {
    $("#read-more").show();
    if ($("#read-more").html() == "Read more") {
      $("#preview").hide();
      $("#quote").show();
      $("#read-more").html("Read less");
    } else {
      $("#quote").hide();
      $("#preview").show();
      $("#read-more").html("Read more");
    }
  }
}

function fileize(title) {
  return title.replace(/\s+/g, '-').toLowerCase();
}
function filename(title) {
  return "../data/" + fileize(title) + ".csv";
}