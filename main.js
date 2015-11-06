$(document).ready(function() {

  var data;
  var tour = "Learning to Read New York";
  var index = 0;
  var hash = window.location.hash;

  $(document).on('change', '#select-tour', function(){
    console.log($('#select-tour').val());
    console.log("here is location:" + hash.substring(1));
  });

  d3.csv('data.csv', function(data) {
    var tourData = loadTour(data, tour);

    $('#forward').on('click', function(e) { nextPlace(); });
    $('#backward').on('click', function(e) { prevPlace(); });
    $('#read-more').on('click', function(e) { expand(); });

    $(window).on('hashchange', function() {
      go(window.location.hash.substring(1));
    });

    go(window.location.hash.substring(1));
  });

  initializeMap();

  function prevPlace() {
    index --;
    if (index < 0) {
      index = tourData.length - 1;
    }
    window.location.hash = '#' + index;
  }

  function nextPlace() {
    index ++;
    if (index > tourData.length - 1) {
      index = 0;
    }
    window.location.hash = '#' + index;
  }
});

function initializeMap() {
  var ctrLongitude = 40.759081;
  var ctrLatitude = -73.978492;

  var redCircleIcon = L.icon({ iconUrl: 'images/capital-red-circle-map.png',
                               iconSize: [18, 18]})
  var hereIcon = L.icon({ iconUrl: 'images/capital-walker.png',
                          iconSize: [100, 100]})


  var tourMap = L.map('tour-map').setView([ctrLongitude, ctrLatitude], 13);

  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  }).addTo(tourMap);

  L.marker([ctrLongitude, ctrLatitude], {icon: hereIcon, zIndexOffset: 1000}).addTo(tourMap);    

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
}

function loadTour(data, tour) {
  var tourIndex = 0;

  tourData = data.filter(function(d) {
    console.log(reformat(d['Tour']));
    return d['Tour'] == tour;
  });

  tourData = tourData.map(function(d) {
    d.embed = d['Streetview Embed Code'].match(/src="(.*?)"/)[1];
    d.lat = d['Streetview Embed Code'].match(/1d(.*?)!/)[1];
    d.lng = d['Streetview Embed Code'].match(/2d(.*?)!/)[1];
    d['Context'] = d['Context'].replace('\n', '<br>');
    d['Preview'] = d['Preview'].replace('\n', '<br>');
    d['Quote'] = d['Quote'].replace('\n', '<br>');
    d['Source'] = d['Source'].replace('\n', '<br>');
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

function reformat(title) {
  return title.replace(/\s+/g, '-').toLowerCase();
}