let userStatus = null;

const buttonEnter = document.querySelector('.button--enter');
const buttonQueue = document.querySelector('.button--queue');
const buttonSingLeg = document.querySelector('.button__sing-up--legal');
const buttonSingInd = document.querySelector('.button__sing-up--individual');
const buttonExit = document.querySelector('.button--exit');

function start() {
    buttonEnter.classList.add('active');
}

start();

const buttonPoint = document.querySelector('.button--point');

buttonEnter.onclick = () => {
    userStatus = "F";
    buttonEnter.classList.remove('active');
    buttonQueue.classList.add('active')
    buttonExit.classList.add('active');
    if (userStatus == "L") {
        buttonSingLeg.classList.add('active');
    }
    if (userStatus == "F") {
        buttonSingInd.classList.add('active');
    }
}

buttonExit.onclick = () => {
    userStatus = "F";
    buttonEnter.classList.add('active');
    buttonQueue.classList.remove('active')
    buttonExit.classList.remove('active');
    buttonSingLeg.classList.remove('active');
    buttonSingInd.classList.remove('active');
}

const radioAtms = document.querySelector('.header__radio-real--atms');
const radioOffice = document.querySelector('.header__radio-real--office');
const pointBlock = document.querySelector('.point');
const pointArrow = document.querySelector('.point__arrow');

pointArrow.onclick = () => {
    if (pointBlock.classList.contains('active')) {
        pointBlock.classList.remove('active');
        pointArrow.classList.add('rotate');
    } else {
        pointBlock.classList.add('active');
        pointArrow.classList.remove('rotate');
    }
}

const infoBlock = document.querySelector('.info');
const infoArrow = document.querySelector('.info__title-svg')

document.querySelector('.point__item--example').onclick = () => {
    if (!infoBlock.classList.contains('active')) {
        infoBlock.classList.add('active');
    }
}

infoArrow.onclick = () => {
    infoBlock.classList.remove('active');
}

function update_info_block_parameters(params) {
    document.querySelector('.info__name').textContent = params.name
}

function update_point__list(map, objects, userCoords) {
    let point_list = document.querySelector('.point__list')
    if (userCoords == null) userCoords = [55.753215, 37.622504]
    point_list.innerHTML = ''
    console.log(("WW" + userCoords))
    let objects_to_point__list = []
    for (let object of objects) {
        let distance_from_mapCenter = Math.round(ymaps.coordSystem.geo.getDistance(object.geometry.coordinates, map.getCenter()))
        let distance_from_user = Math.round(ymaps.coordSystem.geo.getDistance(object.geometry.coordinates, userCoords))
        if (distance_from_mapCenter < 5000)
            objects_to_point__list.push({'object': object, 'distance_from_user': distance_from_user})
    }
    objects_to_point__list.sort(function (a, b) {
    return a.distance_from_user - b.distance_from_user;
    });
    console.log(objects_to_point__list)
    for (let object of objects_to_point__list) {
        point_list.innerHTML += `<li class="point__item"><img class="point__item-work" src={% static "images/work/0.svg" %} alt=""><p class="point__item-text">` + object['object'].address + `</p><p class="point__item-distance">`+object['distance_from_user']+`'м</p></li>'`
    }
}

ymaps.ready(init);

function init() {
    var geolocation = ymaps.geolocation,
        myMap = new ymaps.Map('map', {
            center: [55.753215, 37.622504],
            zoom: 9,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            clusterize: true,
            gridSize: 64,
        });
    objectManager.objects.options.set("iconLayout", 'default#imageWithContent')
    objectManager.objects.options.set("iconImageHref", "static/images/vtb_icon.png")
    objectManager.objects.options.set("iconImageSize", [48, 48])
    objectManager.objects.options.set("iconImageOffset", [-24, -24])
    objectManager.objects.options.set("iconContentOffset", [15, 15])
    objectManager.objects.events.add('click', function (event) {
        let obj = objectManager.objects.getById(event.get('objectId'))
        console.log("obj" + obj)
    })
    myMap.geoObjects.add(objectManager);

    atm_radio_handler(objectManager)
    office_radio_handler(objectManager)

    let activeZone = null
    let position;
    myMap.events.add('boundschange', function (event) {
        if (event.get('newZoom') !== event.get('oldZoom') || event.get('oldCenter') !== event.get('newCenter')) {
            myMap.geoObjects.remove(activeZone)
            activeZone = new ymaps.GeoObject({
                geometry: {
                    type: "Rectangle",
                    coordinates: myMap.getBounds(),
                },
                properties: {}
            }, {
                opacity: 0,
                strokeWidth: 0
            });
            myMap.geoObjects.add(activeZone);
            let allObjects = objectManager.objects.getAll();

            var objectsInRectangle = [];

            for (var i = 0; i < allObjects.length; i++) {
                var object = allObjects[i];
                if (activeZone.geometry.contains(object.geometry.coordinates)) {
                    objectsInRectangle.push(object);
                }
            }
            console.log(objectsInRectangle)
            console.log(myMap.getBounds())
            update_point__list(myMap, objectsInRectangle, position)
        }
    });
    var geolocationControl = new ymaps.control.GeolocationControl({
        options: {noPlacemark: false}
    });
    geolocationControl.events.add('locationchange', function (event) {
        position = event.get('position')
        console.log(position)
        myMap.panTo(position);
    });
    myMap.controls.add(geolocationControl);
}

function get_user_coords(geolocationControl) {
    return geolocationControl.events.add('locationchange', function (event) {
        let position = event.get('position')
        console.log(position)
        myMap.panTo(position);
        return position
    });
}

function atm_radio_handler(objectManager) {
    radioAtms.onchange = () => {
        pointBlock.classList.add('active');
        pointArrow.classList.add('active');
        pointArrow.classList.remove('rotate');
        objectManager.removeAll()
        $.ajax({
            url: "static/data/atms_data.json"
        }).done(function (data) {
            objectManager.add(data);
        });
    }
}

function office_radio_handler(objectManager) {
    radioOffice.onchange = () => {
        pointBlock.classList.add('active');
        pointArrow.classList.add('active');
        pointArrow.classList.remove('rotate');
        objectManager.removeAll()
        $.ajax({
            url: "static/data/offices_data.json"
        }).done(function (data) {
            objectManager.add(data);
        });
    }
}
