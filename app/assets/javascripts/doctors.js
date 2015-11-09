$(function() {
  var api_key = '9c6f158f207798d47ab9a94c95dfaabc';
  var resource_url = "https://api.betterdoctor.com/2015-01-27/doctors?specialty_uid=" + getSpecialty() + "&location=37.773%2C-122.413%2C100&user_location=37.773%2C-122.413&skip=0&limit=25&user_key=" + api_key;

  // Get request to server, using a call back function.
  function getLatLng() {
    return $.getJSON( resource_url, function(data) {
      var latLngInfo = new Object();
      data = latLngInfo;
    });
  }

  //Throwing the above function into a variable to use later to return a value
  var latlng = getLatLng();

  // I put this function inside of the Google Maps Initiliaze funciton so that
  // the latLngInfo variable is in scope.
  // latlng.success(function(data) {
  //   var latLngInfo = new Object();
  //   var list = data.data
  //   for (var i = 0; i < list.length; i++) {
  //     var practices = list[i].practices;
  //     practices.forEach(function(practice) {
  //       latLngInfo[practice.name] = {'lat': practice.lat, 'lon': practice.lon};
  //     });
  //   }
  //   console.log(latLngInfo);
  // });

  // GOOGLE MAPS API
  function initialize() {

    latlng.success(function(data) {
      var latLngInfo = new Object();
      var list = data.data
      for (var i = 0; i < list.length; i++) {
        var practices = list[i].practices;
        practices.forEach(function(practice) {
          latLngInfo[practice.name] = {'lat': practice.lat, 'lon': practice.lon};
        });
      }
      console.log(list);
      // Here we need to extract the lat and lon to use in the map
      for (var i = 0; i < 50; i++ ) {
        // locations.push ( {name:"BUG", latlng: new google.maps.LatLng(lat, lon)});
      }
    });

    var mapCanvas = document.getElementById('map');

    var mapOptions = {
      center: new google.maps.LatLng(37.773, -122.413),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
      }

    var map = new google.maps.Map(mapCanvas, mapOptions);

    var locations = [];

    // for (var i = 0; i < 50; i++ ) {
    //   locations.push ( {name:"BUG", latlng: new google.maps.LatLng(test, test2)})
    // }

    for(var i=0; i<locations.length; i++ ) {
      var marker = new google.maps.Marker({position: locations[i].latlng, map:map, title:locations[i].name});
    }


    // var point = new google.maps.LatLng(25.801579, -80.202176);

    // var marker = new google.maps.Marker({
    //     position:point,
    //     map:map,
    // })


    var contentstring = '<div> Doctor <br> hello <br> sup </div>';
    var infowindow = new google.maps.InfoWindow({
        content:contentstring
        })
    google.maps.event.addListener(marker,'click',function(){
      infowindow.open(map,marker);
    });
  }

  google.maps.event.addDomListener(window, 'load', initialize);

  function getSpecialty() {
    return $('select.specialty-dropdown').find('option:selected').val();
  }

  function getInsurance() {
    return $('select.insurance-dropdown').find('option:selected').val();
  }


  $( ".specialty-dropdown" ).change(initialize);
  $( ".insurance-dropdown" ).change(initialize);

  $('.doc-search').on('click', getDocProfile);
  $('.zip-validate').on('click', IsValidZipCode);

  //Used to get and put doc info list to the screen
  function getDocProfile() {
    $.getJSON( resource_url, function(data) {
      var list = data.data;
      for (var i = 0; i < list.length; i++) {
        var profile = list[i].profile;
        var specialties = list[i].specialties;
        var specialty = specialties[0].actor;
        $('.doc-index').append(template(profile.first_name, profile.last_name, specialty, profile.image_url));
      }
    });
  };

  function IsValidZipCode() {
    var zip = $('#zip').val();
    var isValid = /^[0-9]{5}?$/.test(zip);
    if (isValid){
      alert('We need to convert to lat lon here');
    } else {
      alert('Invalid ZipCode');
    }
  }

  //Template for indexing doctors
  function template(first_name, last_name, specialty, picture) {
    return ["<tr>",
    "<td>" + first_name + " " + last_name + "</td>",
    "<td>" + specialty + "</td>",
    "<td><img src=" + picture + "></td>",
    "</tr>"
    ].join();
  }
});

// Example of how to grab profile info and append to pages
// $.getJSON( resource_url, function(data) {
//   var list = data.data;
//   var profile = list[0];
//   console.log(list);
//   $('.doc-index').append(template(profile.profile.first_name, profile.profile.title, profile.profile.image_url));
// });
// function template(name, data, picture) {
//   return ["<tr>",
//             "<td>" + name + "</td>",
//             "<td>" + data + "</td>",
//             "<td>" + picture + "</td>",
//         "</tr>"
//         ].join();
// }
