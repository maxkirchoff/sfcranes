var hardHat = {
  mapCenterCoords: new google.maps.LatLng('37.7745659', '-122.4214918'),
  map: {},
  markerNewCrane: {
    path: 'M0-165c-27.618 0-50 21.966-50 49.054C-50-88.849 0 0 0 0s50-88.849 50-115.946C50-143.034 27.605-165 0-165z',
    fillColor: 'yellow',
    fillOpacity: 1,
    scale: .2
  },
  markerPhotodCrane: {
    path: 'M0-165c-27.618 0-50 21.966-50 49.054C-50-88.849 0 0 0 0s50-88.849 50-115.946C50-143.034 27.605-165 0-165z',
    fillColor: 'green',
    fillOpacity: 1,
    scale:.2
  },
  showState: function(state) {
    var $articleEl = $("article");
    $articleEl.find("section").hide();
    if (state !== undefined) {
      $articleEl.find("#"+state).slideToggle();
    } else {
      $articleEl.find("#mark-crane").slideToggle();
    }
  },
  placeLocation: function(position) {
    var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    hardHat.createMarker(coords);
  },
  createMarker: function(coords) {
    if (coords == undefined) {
      coords = hardHat.mapCenterCoords;
    }

    var marker = new google.maps.Marker({
      draggable: true,
      map: hardHat.map,
      position: coords,
      zIndex: 9,
      icon: hardHat.markerNewCrane,
      label: '<i class="map-icon-crane"></i>'
    });

    $("input[name=latitude]").val(coords.lat());
    $("input[name=longitude]").val(coords.lng());

    google.maps.event.addListener(marker, 'dragend', function (event) {
      $("input[name=latitude]").val(this.getPosition().lat());
      $("input[name=longitude]").val(this.getPosition().lng());
    });
  },
  initMap: function() {
    /**
     * Create the vanilla map
     */
    var options = {
      zoom: 12,
      center: hardHat.mapCenterCoords,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    hardHat.map = new google.maps.Map(document.getElementById("map-canvas"), options);

    var legend = document.createElement('div');
    legend.id = 'legend';
    var content = [];
    content.push('<div><div class="color yellow"></div>Reported Crane</div>');
    content.push('<div><div class="color green"></div>Photographed Crane</div>');
    legend.innerHTML = content.join('');
    legend.index = 1;
    hardHat.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
  },
  initButtons: function() {
    var $articleEl = $("article");
    $articleEl.find("#mark-crane").find("button[type=button]").each( function(index,el) {
      $(el).on('click', function(e){
        e.preventDefault();
        hardHat.showState('locate');
        hardHat.initMap();
        if ($(el).attr('data-use-geolocation')) {
          if (Modernizr.geolocation) {
            navigator.geolocation.getCurrentPosition(hardHat.placeLocation);
          }
        } else {
          hardHat.createMarker();
        }
      });
    });
    $articleEl.find("#locate").find("button[type=button]").each(function(index,el){
      $(el).on('click', function(e){
        e.preventDefault();
        $.ajax({
          type: "POST",
          url: "/cranes",
          data: {
            crane: {
              lat: $("input[name=latitude]").val(),
              lon: $("input[name=longitude]").val()
            }
          }
        })
          .fail(function(){
            alert("Sorry but something broke. Please try again.");
          })
          .done(function(crane) {
            hardHat.showState('edit-crane');
            $("#edit-crane").attr('data-crane-id', crane.id)
          });
      });
    });
    $articleEl.find("#edit-crane").find("form").each(function(index,el){
      $(el).on('submit', function(e){
        e.preventDefault();
        $.ajax({
          type: "PATCH",
          url: "/cranes/" + $("#edit-crane").attr('data-crane-id'),
          data: {
            crane: {
              title: $("input[name=title]").val(),
              notes: $("textarea[name=notes]").val(),
              reporter_email: $("input[name=reporter_email]").val()
            }
          }
        })
          .fail(function(){
            alert("Sorry but something broke. Please try again.");
          })
          .done(function() {
            hardHat.showState('thanks');
          });
      });
    });
    $articleEl.find("#thanks").find("button[type=button]").each(function(index,el){
      $(el).on('click', function(e){
        e.preventDefault();
        location.reload();
      });
    });
  },
  placeMarker: function(lat, lon, photod) {
    var craneCoords = new google.maps.LatLng(lat, lon);

    var markerPin = hardHat.markerNewCrane;
    if (photod !== undefined && !!photod) {
      markerPin = hardHat.markerPhotodCrane;
    }

    var marker = new google.maps.Marker({
      draggable: true,
      map: hardHat.map,
      position: craneCoords,
      zIndex: 9,
      icon: markerPin,
      label: '<i class="map-icon-crane"></i>'
    });
  }
};