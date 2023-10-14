let userStatus = null;
let havQueue = false;

const buttonEnter = document.querySelector('.button--enter');
const buttonQueue = document.querySelector('.button--queue');
const buttonSingLeg = document.querySelector('.button__sing-up--legal');
const buttonSingInd = document.querySelector('.button__sing-up--individual');
const buttonExit = document.querySelector('.button--exit');

function start() {
    buttonEnter.classList.add('active');
}

start();

buttonEnter.onclick = () => {
	userStatus = "F";
	buttonEnter.classList.remove('active');
	buttonQueue.classList.add('active')
	buttonExit.classList.add('active');
	if (userStatus == "L"){
		buttonSingLeg.classList.add('active');
	}
	if (userStatus == "F") {
		buttonSingInd.classList.add('active');
	}
}

buttonExit.onclick = () => {
	userStatus = null;
	buttonEnter.classList.add('active');
	buttonQueue.classList.remove('active')
	buttonExit.classList.remove('active');
	buttonSingLeg.classList.remove('active');
	buttonSingInd.classList.remove('active');


	filterBlock.classList.remove('active');
	singIndiv = false;

	document.querySelector('.info__form--legal').classList.remove('active');
	document.querySelector('.info__form--individual').classList.remove('active');

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

document.querySelector('.point__item--example').onclick = () => {
	if (!infoBlock.classList.contains('active')){
		infoBlock.classList.add('active');
		document.querySelector('.info__form--legal').classList.remove('active');
		document.querySelector('.info__form--individual').classList.remove('active');
		if (singIndiv) {
			document.querySelector('.info__form--individual').classList.add('active');
		}
		if (singLegal) {
			document.querySelector('.info__form--legal').classList.add('active');
		}
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
        let image_num = 2
        point_list.insertAdjacentHTML("beforeend", `<li class="point__item"><img class="point__item-work" src="static/images/work/`+image_num+`.svg" alt=""><p class="point__item-text">` + object['object'].address + `</p><p class="point__item-distance">`+object['distance_from_user']+`м</p></li>`)
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
            update_point__list(myMap, objectsInRectangle, position)
        }
    });
    var geolocationControl = new ymaps.control.GeolocationControl({
        options: {noPlacemark: false}
    });
    geolocationControl.events.add('locationchange', function (event) {
        position = event.get('position')
        myMap.panTo(position);
    });
    myMap.controls.add(geolocationControl);
}

function get_user_coords(geolocationControl) {
    return geolocationControl.events.add('locationchange', function (event) {
        let position = event.get('position')
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


//физики

let singIndiv = false;


const filterBlock = document.querySelector('.filter');

buttonSingInd.onclick = () => {
	if (havQueue){
		queueBlock.classList.add('active');
		return
	}
	if (!filterBlock.classList.contains('active')){
		singIndiv = true;
		filterBlock.classList.add('active');
		pointBlock.classList.remove('active');
		pointArrow.classList.remove('active');
		pointArrow.classList.add('rotate');
		infoBlock.classList.remove('active');
	}
}

const buttonPoint = document.querySelector('.button--point');
const crossFilter = document.querySelector('.cross--filter');
const buttonFilter = document.querySelector('.button--filter');

crossFilter.onclick = () => {
	filterBlock.classList.remove('active');
	singIndiv = false;
}

buttonFilter.onclick = () => { //buttonOtherLegal
	filterBlock.classList.remove('active');
	pointBlock.classList.add('active');
	pointArrow.classList.add('active');
	pointArrow.classList.remove('rotate');
	buttonPoint.classList.add('active')
}

buttonPoint.onclick = () => {
	if (singIndiv) {
		filterBlock.classList.add('active');
		pointBlock.classList.remove('active');
		pointArrow.classList.remove('active');
		pointArrow.classList.add('rotate');
		infoBlock.classList.remove('active');
	}
	if (singLegal) {
		legalBlock.classList.add('active');
		pointBlock.classList.remove('active');
		pointArrow.classList.remove('active');
		pointArrow.classList.add('rotate');
		infoBlock.classList.remove('active');
	}
}

//юрлица


let singLegal = false;

const legalBlock = document.querySelector('.legal');

buttonSingLeg.onclick = () =>{
	if (havQueue){
		queueBlock.classList.add('active');
		return
	}
	if (!legalBlock.classList.contains('active')){
		singLegal = true;
		legalBlock.classList.add('active');
		pointBlock.classList.remove('active');
		pointArrow.classList.remove('active');
		pointArrow.classList.add('rotate');
		infoBlock.classList.remove('active');
	}
}

const crossLegal = document.querySelector('.cross--legal');
const buttonSingLegal = document.querySelector('.button--legal-sing')
const buttonOtherLegal = document.querySelector('.button--legal-other')

crossLegal.onclick = () => {
	legalBlock.classList.remove('active');
	singIndiv = false;
}

buttonSingLegal.onclick = () => {
	legalBlock.classList.remove('active');
	havQueue = true;
	queueBlock.classList.add('active');
}

buttonOtherLegal.onclick = () => {
	legalBlock.classList.remove('active');
	pointBlock.classList.add('active');
	pointArrow.classList.add('active');
	pointArrow.classList.remove('rotate');
	buttonPoint.classList.add('active')
}

//запись физ лиц

const beforeIndivBlock = document.querySelector('.indiv');
const buttonBeforeIndiv = document.querySelector('.button--individual-before');
const buttonStandIndiv = document.querySelector('.buttop--individual-stand');
const arrowIndiv = document.querySelector('.indiv__title-svg');
const crossIndiv = document.querySelector('.cross--indiv');
const buttonIndiv = document.querySelector('.button--indiv');

buttonBeforeIndiv.onclick = () => {
	pointBlock.classList.remove('active');
	pointArrow.classList.remove('active');
	pointArrow.classList.add('rotate');
	infoBlock.classList.remove('active');
	beforeIndivBlock.classList.add('active');
}

arrowIndiv.onclick = () => {
	pointBlock.classList.add('active');
	pointArrow.classList.add('active');
	pointArrow.classList.remove('rotate');
	infoBlock.classList.add('active');
	beforeIndivBlock.classList.remove('active');
}

crossIndiv.onclick = () => {
	beforeIndivBlock.classList.remove('active');
	singIndiv = false;
}
buttonIndiv.onclick = () => {
	beforeIndivBlock.classList.remove('active');
	havQueue = true;
	queueBlock.classList.add('active');
}

buttonStandIndiv.onclick = () => {
	pointBlock.classList.remove('active');
	pointArrow.classList.remove('active');
	pointArrow.classList.add('rotate');
	infoBlock.classList.remove('active');
	havQueue = true;
	queueBlock.classList.add('active');
}


//запись юрлица

const legalOtherBlock = document.querySelector('.legal-other');
const buttonLegal = document.querySelector('.button--legal');
const arrowLegalOther = document.querySelector('.legal-other__title-svg');
const crossLegalOther = document.querySelector('.cross--legal-other');
const buttonLegalOther = document.querySelector('.button--legal-other-sing');

buttonLegal.onclick = () => {
	pointBlock.classList.remove('active');
	pointArrow.classList.remove('active');
	pointArrow.classList.add('rotate');
	infoBlock.classList.remove('active');
	legalOtherBlock.classList.add('active');
}

arrowLegalOther.onclick = () => {
	pointBlock.classList.add('active');
	pointArrow.classList.add('active');
	pointArrow.classList.remove('rotate');
	infoBlock.classList.add('active');
	legalOtherBlock.classList.remove('active');
}

crossLegalOther.onclick = () => {
	legalOtherBlock.classList.remove('active');
	singIndiv = false;
}

buttonLegalOther.onclick = () => {
	legalOtherBlock.classList.remove('active');
	havQueue = true;
	queueBlock.classList.add('active');
}


//очередь

const queueBlock = document.querySelector('.queue');
const crossQueue = document.querySelector('.cross--queue')

buttonQueue.onclick = () => {
	queueBlock.classList.add('active');
}

crossQueue.onclick = () => {
	queueBlock.classList.remove('active');
}