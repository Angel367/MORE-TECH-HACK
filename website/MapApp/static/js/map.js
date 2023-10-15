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

buttonEnter.onclick = () => {
    userStatus = "L";
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
    userStatus = null;
    buttonEnter.classList.add('active');
    buttonQueue.classList.remove('active')
    buttonExit.classList.remove('active');
    buttonSingLeg.classList.remove('active');
    buttonSingInd.classList.remove('active');


	indivObject.closeForm();
	indivObject.setFlag(false);

	legalObject.closeForm();
	legalObject.setFlag(false);

    document.querySelector('.info__form--legal').classList.remove('active');
    document.querySelector('.info__form--individual').classList.remove('active');
    buttonPoint.remove();

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


let pointsList;

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
        if (distance_from_mapCenter < 50000)
            objects_to_point__list.push({'object': object, 'distance_from_user': distance_from_user})
    }
    objects_to_point__list.sort(function (a, b) {
        return a.distance_from_user - b.distance_from_user;
    });

    for (let object of objects_to_point__list) {
        let image_num = 2
        point_list.insertAdjacentHTML("beforeend", `<li class="point__item" data-id=` + object['object'].id + `><img class="point__item-work" src="static/images/work/` + image_num + `.svg" alt=""><p class="point__item-text">` + object['object'].address + `</p><p class="point__item-distance">` + object['distance_from_user'] + `м</p></li>`)
    }

    pointsList = document.querySelectorAll('.point__item');
    pointsList.forEach(a => a.onclick = (e => {
        let td = e.target.closest('.point__item');
        if (!td) return;
        createInfo(td.dataset.id, objects_to_point__list, null)
    }));
}


async function createInfo(id, array, obj) {
    request_url = 'http://127.0.0.1:5001/get_office?BankID=15&FunctionList=1&Time=3&Day=1'
    let neuro_data = await fetch(request_url)
        .then((response) => response.json())
        .then((data) => {
            return data
        })
    console.log(neuro_data)
    pointBlock.classList.add('active');
    infoBlock.classList.add('active');
    create_info_div(id, array, obj);
    let infoArrow = document.querySelector('.info__title-svg');
    infoArrow.onclick = () => {
        infoBlock.classList.remove('active');
    }
    infoBlock.classList.add('active');
    document.querySelector('.info__form--legal').classList.remove('active');
    document.querySelector('.info__form--individual').classList.remove('active');
    if (indivObject.getFlag()) {
        document.querySelector('.info__form--individual').classList.add('active');
        entryQueueIndiv();
    }
    if (legalObject.getFlag()) {
        document.querySelector('.info__form--legal').classList.add('active');
        entryQueueLegal();
    }
}

function createContentInfo(object) {
    let contentTitel = `
		<div class="info__title">
			<svg class="arrow info__title-svg" width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M0.93934 10.9393C0.353553 11.5251 0.353553 12.4749 0.93934 13.0607L10.4853 22.6066C11.0711 23.1924 12.0208 23.1924 12.6066 22.6066C13.1924 22.0208 13.1924 21.0711 12.6066 20.4853L4.12132 12L12.6066 3.51472C13.1924 2.92893 13.1924 1.97919 12.6066 1.3934C12.0208 0.807613 11.0711 0.807613 10.4853 1.3934L0.93934 10.9393ZM28 10.5L2 10.5L2 13.5L28 13.5L28 10.5Z"/>
			</svg>
			<h3 class="info__name">` + object['object'].name + `</h3>
		</div>
		<button class="button button--distance" type="button">Проложить маршрут</button>`;
    let contentTable1 = ``;
    let contentTable2 = ``;
    let contentInfoSecond = ``;
    let contentForm = ``;

    if (!object['object'].isATM) {
        contentTable1 = `<li class="info__item info__item--big">
			<p class="info__item-title info__item-title--table">Юридические лица:</p>
			<ul class="info__table">`;
		for (let item of object['object'].open_hours) {
			contentTable1 += `
				<li class="info__table-row">
					<p class="info__table-title">` + item['days'] + `</p>
					<p class="info__table-text">` + item['hours'] + `</p>
				</li>`;
		}
		contentTable1 += `</ul></li>`;
		contentTable2 = `<li class="info__item info__item--big">
			<p class="info__item-title info__item-title--table">Физические лица:</p>
			<ul class="info__table">`;
        for (let item of object['object'].open_hours_individual) {
            contentTable2 += `
				<li class="info__table-row">
					<p class="info__table-title">` + item['days'] + `</p>
					<p class="info__table-text">` + item['hours'] + `</p>
				</li>`;
        }
        contentTable2 += `</ul></li>`;


		contentInfoSecond = `
			<li class="info__item">
				<p class="info__item-title">РКО:</p>
				<p class="info__item-text">` + (object['object'].isRKO ? "Да" : "Нет") + `</p>
			</li>
			<li class="info__item">
				<p class="info__item-title">Тип офиса:</p>
				<p class="info__item-text">` + (object['object'].office_type) + `</p>
			</li>		
			<li class="info__item">
				<p class="info__item-title">Наличие пандуса:</p>
				<p class="info__item-text">` + (object['object'].services.includes("hasRamp") ? "Да" : "Нет") + `</p>
			</li></ul>`;
		contentForm = `
			<form class="info__form info__form--individual">
				<h2 class="title title--margin-bottom">Хотите встать в очередь?</h2>
				<button class="button button--individual-before" type="button">Предзапись</button>
				<button class="button buttop--individual-stand" type="button">Встать в очередь</button>
			</form>
			<form class="info__form info__form--legal">
				<button class="button button--legal" type="button">Менеджеры этого отделения</button>
			</form>`;
	} else {
		contentTable2 = `<li class="info__item info__item--big">
			<p class="info__item-title info__item-title--table">Услуги:</p>
			<ul class="info__table">`;
        for (let item of object['object'].services) {
            contentTable2 += `
				<li class="info__table-row">
					<p class="info__table-text">` + item + `</p>
				</li>`;
		}
		contentTable2 += `</ul></li>`;
	}
	let arrayWork = [
		{
			'hour' : 9,
			'work' : 0,
		},
		{
			'hour' : 10,
			'work' : 0,
		},
		{
			'hour' : 11,
			'work' : 0,
		},
		{
			'hour' : 12,
			'work' : 0,
		},
		{
			'hour' : 13,
			'work' : 1,
		},
		{
			'hour' : 14,
			'work' : 2,
		},
		{
			'hour' : 15,
			'work' : 2,
		},
		{
			'hour' : 16,
			'work' : 2,
		},
		{
			'hour' : 17,
			'work' : 1,
		},
	]
	let image_num = 0;
	let contentWork = `
		<div class="point__work">
			<h4 class="point__work-title">Загруженность</h4>
			<ul class="point__work-list">`;
	for (let item of arrayWork) {
		contentWork+=`
			<li class="point__work-item">
				<img class="point__work-svg" src="static/images/work-item/` + item.work + `.svg" alt="">
				<p class="point__work-text">`+item.hour+`</p>
			</li>`;
	}
	contentWork += `</ul></div>`;

    let contentInfoFirst = `
		<li class="info__item">
			<p class="info__item-title">Адрес:</p>
			<p class="info__item-text">` + object['object'].address + `</p>
		</li>`;


    let contenInfo = `<ul class="info__list scroll">`;
    contenInfo += contentInfoFirst + contentTable1 + contentTable2 + contentInfoSecond;

	let contentAll = contentTitel + contentWork + contenInfo + contentForm;
	return contentAll;
}


function create_info_div(id, array, myObject = null) {

    let block = document.querySelector('.info');
    if (myObject != null) {
        myObject = {'object': myObject}
        block.innerHTML = createContentInfo(myObject);
        f(myObject['object'].geometry.coordinates)
        return
    }
    block.innerHTML = ''
    let object;
    for (let item of array) {
        if (item['object'].id == id) {
            object = item;
            break;
        }
    }
    block.innerHTML = createContentInfo(object);
    f(object['object'].geometry.coordinates)

    function f(object_coords) {
        let route_button = document.querySelector('.button--distance')
        route_button.addEventListener('click', function () {
            console.log("w")
            console.log(control)
            let next_route_type
            if (control.routePanel.state.get('type') === 'auto')
                next_route_type = 'masstransit'
            else
                next_route_type = 'auto'
            control.routePanel.state.set({
                // Тип маршрутизации.
                type: next_route_type,
                // Выключим возможность задавать пункт отправления в поле ввода.
                //fromEnabled: false,
                // Адрес или координаты пункта отправления.
                from: position,
                to: object_coords,
                // Включим возможность задавать пункт назначения в поле ввода.
                toEnabled: true,
                // Адрес или координаты пункта назначения.
                //to: 'Петербург'
            });
            control.routePanel.options.set({
                visible: true
            });
        });
    }
}


let control;
let position = [55.753215, 37.622504];
ymaps.ready(init)

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
        // console.log(obj)
        createInfo(null, null, obj);
    })
    myMap.geoObjects.add(objectManager);

    atm_radio_handler(objectManager)
    office_radio_handler(objectManager)

    let activeZone = null
    myMap.events.add('boundschange', t)
    function t(event) {
        if (event == null) {
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
        } else if (event.get('newZoom') !== event.get('oldZoom') || event.get('oldCenter') !== event.get('newCenter')) {
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
    };
    var geolocationControl = new ymaps.control.GeolocationControl({
        options: {noPlacemark: false}
    });
    geolocationControl.events.add('locationchange', function (event) {
        position = event.get('position')
        myMap.panTo(position);
    });
    myMap.controls.add(geolocationControl);
    myMap.controls.add('routePanelControl', {
        maxWidth: 160,
        float: "right",
        visible: false

    });
    control = myMap.controls.get('routePanelControl');
    control.routePanel.options.set({
        // Запрещаем показ кнопки, позволяющей менять местами начальную и конечную точки маршрута.
        allowSwitch: false,
        //from: 'Москва, Льва Толстого 16',
        // Включим определение адреса по координатам клика.
        // Адрес будет автоматически подставляться в поле ввода на панели, а также в подпись метки маршрута.
        reverseGeocoding: true,
        // Зададим виды маршрутизации, которые будут доступны пользователям для выбора.
        types: {auto: true, masstransit: true, pedestrian: true, taxi: true}
    });


    control.routePanel.state.set({
        // Тип маршрутизации.
        type: 'masstransit',
        // Выключим возможность задавать пункт отправления в поле ввода.
        //fromEnabled: false,
        // Адрес или координаты пункта отправления.
        //from: 'Москва, Льва Толстого 16',
        // Включим возможность задавать пункт назначения в поле ввода.
        toEnabled: true
        // Адрес или координаты пункта назначения.
        //to: 'Петербург'
    });
    const point_button_el = document.querySelector('.point__button')
    point_button_el.addEventListener('click', async function () {
        address = document.querySelector('.input-text--point').value
        t = await getCoordinatesByAddress(address)
        console.log(t)
        myMap.setCenter(t, 15)
    });

    function atm_radio_handler(objectManager) {
        radioAtms.onchange = () => {
            if (infoBlock != null)
                infoBlock.classList.remove('active');
            t()
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
            if (infoBlock != null)
                infoBlock.classList.remove('active');
            t()
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
}

function getCoordinatesByAddress(address) {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const firstResult = data[0];
                const latitude = parseFloat(firstResult.lat);
                const longitude = parseFloat(firstResult.lon);
                return [latitude, longitude];
            } else {
                throw new Error(`Адрес не найден: ${address}`);
            }
        });
}


function get_user_coords(geolocationControl) {
    return geolocationControl.events.add('locationchange', function (event) {
        let position = event.get('position')
        myMap.panTo(position);
        return position
    });
}


//физики

class GetBlock {
	constructor(button, form, cross) {
		this.button = button;
		this.form = form;
		this.cross = cross;
		this.flag = false;
		this.init();
	}
	init(){
		this.openFormBtn();
		this.closeFormCross();
	}
	setFlag(flag){
		this.flag = flag;
	}

	getFlag() {
		return this.flag;
	}

	openFormBtn(){
		const buttonBlock = document.querySelector(this.button);
		const formBlock = document.querySelector(this.form);
		buttonBlock.onclick = () => {
			if (queueObject.getHaveQueue()) {
				queueObject.openQueue();
				return;
			}
			if (!formBlock.classList.contains('active')) {

				this.setFlag(true);
				queueObject.closeQueue();
				formBlock.classList.add('active');
				pointBlock.classList.remove('active');
				pointArrow.classList.remove('active');
				pointArrow.classList.add('rotate');
				infoBlock.classList.remove('active');
			}
		}
	}
	closeFormCross(){
		const crossBlock = document.querySelector(this.cross);
		const formBlock = document.querySelector(this.form);
		crossBlock.onclick = () => {
			formBlock.classList.remove('active');
			this.setFlag(false);
		}
	}
	openForm() {
		const formBlock = document.querySelector(this.form);
		formBlock.classList.add("active")
	}
	closeForm() {
		const formBlock = document.querySelector(this.form);
		formBlock.classList.remove("active")
	}

}

const indivObject = new GetBlock('.button__sing-up--individual','.filter', '.cross--filter');
const legalObject = new GetBlock('.button__sing-up--legal', '.legal','.cross--legal' );


const buttonPoint = document.querySelector('.button--point');
const buttonFilter = document.querySelector('.button--filter');


buttonFilter.onclick = () => { //buttonOtherLegal
	indivObject.closeForm();
	pointBlock.classList.add('active');
	pointArrow.classList.add('active');
	pointArrow.classList.remove('rotate');
	buttonPoint.classList.add('active')
}

buttonPoint.onclick = () => {
	if (indivObject.getFlag()) {
		indivObject.openForm();
	}
	if (legalObject.getFlag()) {
		legalObject.openForm();
	}
	pointBlock.classList.remove('active');
	pointArrow.classList.remove('active');
	pointArrow.classList.add('rotate');
	infoBlock.classList.remove('active');
}


const buttonSingLegalPrime = document.querySelector('.button--legal-sing')
const buttonOtherLegal = document.querySelector('.button--legal-other')

buttonSingLegalPrime.onclick = () => {
	legalObject.closeForm();
	queueObject.setStatus("legal");
	queueObject.openQueue()
}

buttonOtherLegal.onclick = () => {
	legalObject.closeForm();
	pointBlock.classList.add('active');
	pointArrow.classList.add('active');
	pointArrow.classList.remove('rotate');
	buttonPoint.classList.add('active')
}

//запись физ лиц

function entryQueueIndiv() {
    let beforeIndivBlock = document.querySelector('.indiv');
    let buttonBeforeIndiv = document.querySelector('.button--individual-before');
    let buttonStandIndiv = document.querySelector('.buttop--individual-stand');
    let arrowIndiv = document.querySelector('.indiv__title-svg');
    let crossIndiv = document.querySelector('.cross--indiv');
    let buttonIndiv = document.querySelector('.button--indiv');

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
		indivObject.setFlag(false);
	}
	buttonIndiv.onclick = () => {
		beforeIndivBlock.classList.remove('active');
		queueObject.setStatus("indiv");
		queueObject.openQueue();
	}

	buttonStandIndiv.onclick = () => {
		pointBlock.classList.remove('active');
		pointArrow.classList.remove('active');
		pointArrow.classList.add('rotate');
		infoBlock.classList.remove('active');
		queueObject.setStatus("indiv");
		queueObject.openQueue()
	}
}

//запись юрлица
function entryQueueLegal() {
    let legalOtherBlock = document.querySelector('.legal-other');
    let buttonLegal = document.querySelector('.button--legal');
    let arrowLegalOther = document.querySelector('.legal-other__title-svg');
    let crossLegalOther = document.querySelector('.cross--legal-other');
    let buttonLegalOther = document.querySelector('.button--legal-other-sing');

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
		legalObject.setFlag(false);
	}

	buttonLegalOther.onclick = () => {
		legalOtherBlock.classList.remove('active');
		queueObject.setStatus("legal");
		queueObject.openQueue()
	}

}

class Queue {
	constructor(button, block, cross, status) {
		this.button = button;
		this.block = block;
		this.cross = cross;
		this.status = status;
		this.init();
	}
	init(){
		this.openQueueBtn();
		this.closeQueueCross();
		this.setStatus("");
	}
	openQueueBtn(){
		const buttonBlock = document.querySelector(this.button);
		const queueBlock = document.querySelector(this.block);
		buttonBlock.onclick = () => {
			queueBlock.classList.add('active');
		}
	}
	closeQueueCross(){
		const crossBlock = document.querySelector(this.cross);
		const queueBlock = document.querySelector(this.block);
		crossBlock.onclick = () => {
			queueBlock.classList.remove('active');
		}
	}
	openQueue(){
		const queueBlock = document.querySelector(this.block);
		queueBlock.classList.add('active');
	}
	closeQueue(){
		const queueBlock = document.querySelector(this.block);
		queueBlock.classList.remove('active');
	}
	setStatus(status){
		this.status = status;
		const queueNone = document.querySelector(".queue__none"); //нет очередей
		const queueDone = document.querySelector(".queue__done"); //после скана qr
		const queueHave = document.querySelector(".queue__have"); //в очереди
		const queueIndiv = document.querySelector(".queue__have-indiv"); //в очереди физик
		const queueLegal = document.querySelector(".queue__have-legal") //заранее
		queueNone.classList.remove("active")
		queueDone.classList.remove("active")
		queueHave.classList.remove("active")
		queueIndiv.classList.remove("active")
		queueLegal.classList.remove("active")
		if (status === "") {
			queueNone.classList.add("active")
		} else if (status === "legal"){
			queueHave.classList.add("active");
			queueLegal.classList.add("active");
		} else if (status === "indiv") {
			queueHave.classList.add("active");
			queueIndiv.classList.add("active");
			this.getDoneQueue()
		} else if (status === "done") {
			queueDone.classList.add("active");
		}
	}

	getDoneQueue(btn){
		let button = document.querySelector(".queue__photo");
		button.onclick = () => {
			this.setStatus("done")
		}
	}
	getHaveQueue(){
		return this.status !== "";
	}

}

const queueObject = new Queue('.button--queue', '.queue', '.cross--queue', "");



