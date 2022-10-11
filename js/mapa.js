var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {});

var baselayers = {
    "Open streep map": osm,
};

var map = L.map(document.getElementById('map'), {
    center: [-20.287, -40.315],
    zoom: 13,
    zoomControl: false,
    layers: [osm]
});

var layerControl = L.control.layers(baselayers, {}, {collapsed: false}).addTo(map);

var zoom_bar = new L.Control.ZoomBar({position: 'topleft'}).addTo(map);

var scale = L.control.scale();
scale.addTo(map);

var btnCreateLayer = document.getElementById("btn_create_layer");
var cpNameLayer = document.getElementById("cp_name_layer");

btnCreateLayer.addEventListener('click', function(ev){
    var newLayer = new L.FeatureGroup();
    layerControl.addOverlay(newLayer, cpNameLayer.value);
    map.addLayer(newLayer);

    cpNameLayer.value = '';
});

var LeafIcon = L.Icon.extend({
    options: {
        shadowUrl: 
            'http://leafletjs.com/docs/images/leaf-shadow.png',
        iconSize:     [38, 95],
        shadowSize:   [50, 64],
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
    }
});

var greenIcon = new LeafIcon({
    iconUrl: 'http://leafletjs.com/docs/images/leaf-green.png'
    });

var drawControl = ''
var selectedLayer = new L.FeatureGroup();

map.on('draw:created', function (e) {
    selectedLayer.addLayer(e.layer);
});

map.on('overlayadd', function(e){
    selectedLayer = e.layer;

    if(drawControl !== ''){
        map.removeControl(drawControl);
    }

    drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
            polygon: {
                shapeOptions: {
                    color: 'purple'
                },
                allowIntersection: false,
                drawError: {
                    color: 'orange',
                    timeout: 1000
                },
                showArea: true,
                metric: false,
                repeatMode: true
            },
            polyline: {
                shapeOptions: {
                    color: 'red'
                },
            },
            rect: {
                shapeOptions: {
                    color: 'green'
                },
            },
            circle: {
                shapeOptions: {
                    color: 'steelblue'
                },
            },
            marker: {
                icon: greenIcon
            },
        }
        ,edit: {
            featureGroup: selectedLayer
        }
    });


    map.addControl(drawControl);
});

map.on('mousemove', function(e){
    var lat = e.latlng.lat.toFixed(3);
    var lon = e.latlng.lng.toFixed(3);
    document.getElementById('mapCoordDIV').innerHTML = lat + ' , ' + lon;
});