import {add_all_offices_placemarks, add_placemark} from "./add_placemark.js";

ymaps.ready(init);

function init() {
    var geolocation = ymaps.geolocation,
        myMap = new ymaps.Map('map', {
            center: [55.753215, 37.622504],
            zoom: 10,
        }, {
            searchControlProvider: 'yandex#search'
        }),
        clusterer = new ymaps.Clusterer({
            clusterIconContentLayout: null
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 64,
        });
    objectManager.objects.options.set("iconLayout", 'default#imageWithContent')
    objectManager.objects.options.set("iconImageHref", "static/icons/vtb_icon.png")
    objectManager.objects.options.set("iconImageSize", [48, 48])
    objectManager.objects.options.set("iconImageOffset", [-24, -24])
    objectManager.objects.options.set("iconContentOffset", [15, 15])
    objectManager.objects.events.add('click', function () {
        //alert("w")
        // какой-нибудь адский div выплывает с информацией, div можно генерировать по шаблону
    })
    // либо
    // objectManager.events.add('click', function () {
    //     alert("w")
    // })
    myMap.geoObjects.add(objectManager);

    document.getElementById("office_selector").onchange = function (){
        objectManager.removeAll()
        $.ajax({
            url: "static/data/offices_data.json"
        }).done(function(data) {
            objectManager.add(data);
        });
    }
    document.getElementById("atm_selector").onchange = function (){
        objectManager.removeAll()
        $.ajax({
            url: "static/data/atms_data.json"
        }).done(function(data) {
            objectManager.add(data);
        });
    }
    let activeZone = null
    myMap.events.add('boundschange', function (event) {
    if (event.get('newZoom') !== event.get('oldZoom') || event.get('oldCenter') !== event.get('newCenter')) {
        myMap.geoObjects.remove(activeZone)
            activeZone = new ymaps.GeoObject({
                geometry: {
                    type: "Rectangle",
                    coordinates: myMap.getBounds(),
                },
                properties: {
                }
            }, {
                opacity: 0,
                strokeWidth: 0
            });
            myMap.geoObjects.add(activeZone);
            let allObjects = objectManager.objects.getAll();
            console.log(allObjects)

            var objectsInRectangle = [];

            for (var i = 0; i < allObjects.length; i++) {
                var object = allObjects[i];
                if (activeZone.geometry.contains(object.geometry.coordinates)) {
                    objectsInRectangle.push(object);
                }
            }
            console.log(objectsInRectangle)
    }

});
}