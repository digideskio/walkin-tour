var tour = "Learning to Read New York";
var filename = filename(tour); 

$(document).ready(function() {

  var data;
  var index = 0;
  window.location.hash = '#' + index;
  var tourMap = initializeMap();
  loadFile();

  $(document).on('change', '#select-tour', function(){
    filename = 'data/' + $('#select-tour').val() + '.csv';
    console.log(filename);
    loadFile();
  });
  
  function loadFile() { 
    d3.csv(filename, function(data) {
      var tourData = loadTour(data);
      populateMap(tourMap, tourData);

      $('#forward').on('click', function(e) { nextPlace(); });
      $('#backward').on('click', function(e) { prevPlace(); });
      $('#read-more').on('click', function(e) { expand(); });

      $(window).on('hashchange', function() {
        var locationNumber = parseInt(window.location.hash.substring(1));
        var currentLocation = L.latLng(tourData[locationNumber].lat, tourData[locationNumber].lng);
        tourMap.setView(currentLocation);
        $('.hereIcon').hide();
        setHereMarker(tourMap, tourData);
        go(window.location.hash.substring(1));
      });

      go(window.location.hash.substring(1));
    });
  
    function prevPlace() {
      index --;
      if (index < 0) { index = tourData.length - 1; }
      window.location.hash = '#' + index;
    }

    function nextPlace() {
      index ++;
      if (index > tourData.length - 1) { index = 0; }
      window.location.hash = '#' + index;
    }
  }
});

function initializeMap() {
  var ctrLat = 40.759081;
  var ctrLng = -73.978492;
  var tourMap = L.map('tour-map').setView([ctrLat, ctrLng], 13);

  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  }).addTo(tourMap);    

  return tourMap;
}

function populateMap(tourMap, tourData) {
  var redCircleIcon = L.icon({ iconUrl: 'images/capital-red-circle-map.png',
                               iconSize: [18, 18],
                               iconAnchor: [18, 18],
                               className: 'locationIcon'});

  tourData.map(function (d) {
    if (d['Streetview Embed Code']) {
      var lat = parseFloat(d['Streetview Embed Code'].match(/1d(.*?)!/)[1]);
      var lng = parseFloat(d['Streetview Embed Code'].match(/2d(.*?)!/)[1]);

      if (lat && lng) {
        var marker = L.marker([lat, lng], {icon: redCircleIcon}).addTo(tourMap);
        marker.on('click', function() { go(d['Index'])});
      }     
    }
  });

  setHereMarker(tourMap, tourData);
}

function setHereMarker(tourMap, tourData) {
  var locationNumber = parseInt(window.location.hash.substring(1));
  var currentLocation = L.latLng(tourData[locationNumber].lat, tourData[locationNumber].lng);
  var hereIcon = L.icon({ iconUrl: 'images/capital-walker.png',
                        iconSize: [95, 95],
                        iconAnchor: [80, 80],
                        className: 'hereIcon'});

  L.marker(currentLocation, {icon: hereIcon, zIndexOffset: 1000}).addTo(tourMap);
}

function loadTour(data) {
  var tourIndex = 0;

  tourData = data.map(function(d) {
    d.embed = d['Streetview Embed Code'].match(/src="(.*?)"/)[1];
    d.lat = d['Streetview Embed Code'].match(/1d(.*?)!/)[1];
    d.lng = d['Streetview Embed Code'].match(/2d(.*?)!/)[1];
    d['Context'] = d['Context'].replace('\n', '<br>');
    d['Preview'] = d['Preview'].replace('\n', '<br>');
    d['Quote'] = d['Quote'].replace('\n', '<br>');
    d['Source'] = d['Source'].replace('\n', '<br>');
    d['Index'] = tourIndex;
    tourIndex ++;
    return d;
  });

  return tourData;
}

function go(i) {
  if (typeof i != 'number') i = +i;
  index = i;
  
  $("#map").attr('src', tourData[index].embed);
  $("#quote").html(tourData[index]['Quote']);
  $("#preview").html(tourData[index]['Preview']);
  $("#context").html(tourData[index]['Context']);
  $("#source").html(tourData[index]['Source']);
  $("#location").html(tourData[index]['Location']);
  
  $("#quote").hide();
  $("#preview").show();
  $("#read-more").html("Read More");
  ($("#quote").html() == '') ? $("#read-more").hide() : $("#read-more").show();
  
  window.location.hash = '#' + index;
}

function expand() {
  if ($("#quote").text() != "") {
    $("#read-more").show();
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
}

function filename(title) {
  return "data/" + title.replace(/\s+/g, '-').toLowerCase() + ".csv";
}