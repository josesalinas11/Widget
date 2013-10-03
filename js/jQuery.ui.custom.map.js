(function ($)
{
    $.widget('custom.map', {
        options: {
            zoom: 15,
            latitude: 13.969709,
            longitude: -89.573845,
            mapTypeId: 'ROADMAP',
            panControl: true,
            zoomControl: false,
            scaleControl: true,
            home: function (event, elemnet)
            {                      
            }
        },
        _create: function ()
        {
            var self = this;
            var o = self.options;
            $(self.element).addClass('canvas');
            var el = self.element;
            var map;
            var mapOptions = {
                zoom: o.zoom,
                center: new google.maps.LatLng(o.latitude, o.longitude),
                panControl: o.panControl,
                zoomControl: o.zoomControl,
                scaleControl: o.scaleControl,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(el.get(0), mapOptions);

                      if(navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                          var pos = new google.maps.LatLng(position.coords.latitude,
                                                           position.coords.longitude);
                          map.setCenter(pos);
                        });
                      } 
         
            this._createControls(el, map);
        },
        _createControls: function (container, map)
        {
            var self = this;
            container.append('<div id="input-container"></div>');
            $('#input-container')
            .addClass('input-append search')
            .append('<input id="map-search"/>')
            .append('<button id="button-search"></button>')
            .append('<button id="button-home" class="btn">Home</button>');
            $('#button-home').on('click', function (event)
            {
                self.options.home(event, this);
            })
            $('#map-search').attr('type', 'search')
            .attr('placeholder', 'Search')
            .hide();
            $('#button-search')
            .addClass('btn')
            .append('<i class="icon-search"></i>')
            .click(this._toggle);

            map.controls[google.maps.ControlPosition.TOP_RIGHT].push($('#input-container').get(0));

            this._mapAutocomplete(map, $('#map-search'));
        },
        _toggle: function ()
        {
            $(this).data('clicked', !$(this).data('clicked'));
            if ($(this).data('clicked'))
            {
                (function ()
                {
                    $('#map-search').show(2000);
                })();
            }
            else
            {
                (function ()
                {
                    $('#map-search').hide("slow", function ()
                    {
                        $('#map-search').prev().hide("slow", arguments.callee);
                    });
                })();
            }
        },
        SetHome: function (latLng)
        {
            $('#input-container').detach();
            var self = this;
            var o = self.options;
            var el = self.element;
            var map;
            var mapOptions = {
                zoom: o.zoom,
                center: new google.maps.LatLng(latLng.latitude, latLng.longitude),
                panControl: o.panControl,
                zoomControl: o.zoomControl,
                scaleControl: o.scaleControl,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(el.get(0), mapOptions);
            this._createControls(el, map);
            $('#map-search').show(2000);
        },
        _mapAutocomplete: function (map, input)
        {

            var input = $('#map-search');
            var autocomplete = new google.maps.places.Autocomplete(input.get(0));

            autocomplete.bindTo('bounds', map);

            var infowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                map: map
            });
            google.maps.event.addListener(autocomplete, 'place_changed', function ()
            {
                infowindow.close();
                marker.setVisible(false);
                input.get(0).className = '';
                var place = autocomplete.getPlace();
                if (!place.geometry)
                {

                    input.get(0).className = 'notfound';
                    return;
                }


                if (place.geometry.viewport)
                {
                    map.fitBounds(place.geometry.viewport);
                } else
                {
                    map.setCenter(place.geometry.location);
                    map.setZoom(17);
                }
                marker.setIcon(({
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(35, 35)
                }));
                marker.setPosition(place.geometry.location);
                marker.setVisible(true);

                var address = '';
                if (place.address_components)
                {
                    address = [
			        (place.address_components[0] && place.address_components[0].short_name || ''),
			        (place.address_components[1] && place.address_components[1].short_name || ''),
			        (place.address_components[2] && place.address_components[2].short_name || '')
			      ].join(' ');
                }
            });
        }
    });
})(jQuery);