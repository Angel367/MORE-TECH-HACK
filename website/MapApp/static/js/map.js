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

document.querySelectorAll('.point__item').forEach(a => a.onclick = () => {
    if (!infoBlock.classList.contains('active')) {
        infoBlock.classList.add('active');
		create_info_div()
    }


document.querySelector('.point__item').onclick = () => {
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
        point_list.insertAdjacentHTML("beforeend", `<li class="point__item" data-set=`+object['object'].id+`><img class="point__item-work" src="static/images/work/`+image_num+`.svg" alt=""><p class="point__item-text">` + object['object'].address + `</p><p class="point__item-distance">`+object['distance_from_user']+`м</p></li>`)
    }
}

function create_info_div(params) {
	/*
	* params:
	* 	- name
	*	- id
	*
	* */
	let div = document.querySelector('.info');
	div.innerHTML = ''
	content = `
	<div class="info__title">
            <svg class="arrow info__title-svg" width="28" height="24" viewBox="0 0 28 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M0.93934 10.9393C0.353553 11.5251 0.353553 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807613 11.0711 0.807613 10.4853 1.3934L0.93934 10.9393ZM28 10.5L2 10.5L2 13.5L28 13.5L28 10.5Z"/>
            </svg>
            <h3 class="info__name">ДО «Солнечногорский» Филиала № 7701 Банка ВТБ (ПАО)</h3>
        </div>
        <button class="button button--distance" type="button">Проложить маршрут</button>
        <div class="point__work">
            <h4 class="point__work-title">Загруженность</h4>
            <ul class="point__work-list">
                <li class="point__work-item">
                    <img class="point__work-svg" src={% static '/images/work-item/0.svg' %} alt="">
                    <p class="point__work-text">9</p>
                </li>
                <li class="point__work-item">
                    <img class="point__work-svg" src={% static '/images/work-item/0.svg' %} alt="">
                    <p class="point__work-text">10</p>
                </li>
                <li class="point__work-item">
                    <img class="point__work-svg" src={% static '/images/work-item/0.svg' %} alt="">
                    <p class="point__work-text">11</p>
                </li>
                <li class="point__work-item">
                    <img class="point__work-svg" src={% static '/images/work-item/0.svg' %} alt="">
                    <p class="point__work-text">12</p>
                </li>
                <li class="point__work-item">
                    <img class="point__work-svg" src={% static '/images/work-item/1.svg' %} alt="">
                    <p class="point__work-text">13</p>
                </li>
                <li class="point__work-item">
                    <img class="point__work-svg" src={% static '/images/work-item/2.svg' %} alt="">
                    <p class="point__work-text">14</p>
                </li>
                <li class="point__work-item">
                    <img class="point__work-svg" src={% static '/images/work-item/2.svg' %} alt="">
                    <p class="point__work-text">15</p>
                </li>
                <li class="point__work-item">
                    <img class="point__work-svg" src={% static '/images/work-item/2.svg' %} alt="">
                    <p class="point__work-text">16</p>
                </li>
                <li class="point__work-item">
                    <img class="point__work-svg" src={% static '/images/work-item/2.svg' %} alt="">
                    <p class="point__work-text">17</p>
                </li>
                <li class="point__work-item">
                    <img class="point__work-svg" src={% static '/images/work-item/2.svg' %} alt="">
                    <p class="point__work-text">18</p>
                </li>
            </ul>
        </div>
        <ul class="info__list scroll">
            <li class="info__item">
                <p class="info__item-title">Адрес:</p>
                <p class="info__item-text">141506, Московская область, г. Солнечногорск, ул. Красная, д. 60</p>
            </li>
            <li class="info__item">
                <p class="info__item-title">Метро:</p>
                <p class="info__item-text">МЦД-1 Белорусско-Савёловский диаметр, станция Лобня</p>
            </li>
            <li class="info__item info__item--big">
                <p class="info__item-title info__item-title--table">Юридические лица:</p>
                <ul class="info__table">
                    <li class="info__table-row">
                        <p class="info__table-title">пн:</p>
                        <p class="info__table-text">09:00-18:00</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">вт:</p>
                        <p class="info__table-text">09:00-18:00</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">ср:</p>
                        <p class="info__table-text">09:00-18:00</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">чт:</p>
                        <p class="info__table-text">09:00-18:00</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">пт:</p>
                        <p class="info__table-text">09:00-18:00</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">сб:</p>
                        <p class="info__table-text">выходной</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">вс:</p>
                        <p class="info__table-text">выходной</p>
                    </li>
                </ul>
            </li>
            <li class="info__item info__item--big">
                <p class="info__item-title info__item-title--table">Физические лица:</p>
                <ul class="info__table">
                    <li class="info__table-row">
                        <p class="info__table-title">пн:</p>
                        <p class="info__table-text">09:00-18:00</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">вт:</p>
                        <p class="info__table-text">09:00-18:00</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">ср:</p>
                        <p class="info__table-text">09:00-18:00</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">чт:</p>
                        <p class="info__table-text">09:00-18:00</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">пт:</p>
                        <p class="info__table-text">09:00-18:00</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">сб:</p>
                        <p class="info__table-text">выходной</p>
                    </li>
                    <li class="info__table-row">
                        <p class="info__table-title">вс:</p>
                        <p class="info__table-text">выходной</p>
                    </li>
                </ul>
            </li>
            <li class="info__item">
                <p class="info__item-title">РКО:</p>
                <p class="info__item-text">Есть РКО</p>
            </li>
            <li class="info__item">
                <p class="info__item-title">Тип офиса:</p>
                <p class="info__item-text">Универсальный</p>
            </li>
            <li class="info__item">
                <p class="info__item-title">Наличие СУО:</p>
                <!-- = (поле == 'Y')? Да : Нет -->
                <p class="info__item-text">Да</p>
            </li>
            <li class="info__item">
                <p class="info__item-title">Наличие пандуса:</p>
                <p class="info__item-text">Да</p>
            </li>
        </ul>
        <form class="info__form info__form--individual">
            <h2 class="title title--margin-bottom">Хотите встать в очередь?</h2>
            <button class="button button--individual-before" type="button">Предзапись</button>
            <button class="button buttop--individual-stand" type="button">Встать в очередь</button>
        </form>
        <form class="info__form info__form--legal">
            <button class="button button--legal" type="button">Менеджеры этого отделения</button>
        </form>
	`
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