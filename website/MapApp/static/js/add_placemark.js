export function add_placemark(map, coords, type = "") {
    var myPlacemark = new ymaps.Placemark(coords, {
        hintContent: 'Собственный значок метки',
        balloonContent: 'Это красивая метка'
    }, {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: 'default#image',
        // Своё изображение иконки метки.
        iconImageHref: '/static/icons/vtb_icon.png',
        // Размеры метки.
        iconImageSize: [48, 48],
        // Смещение левого верхнего угла иконки относительно
        iconImageOffset: [-24, -24],
        // Смещение слоя с содержимым относительно слоя с картинкой.
        iconContentOffset: [15, 15]
    });
    map.geoObjects.add(myPlacemark)
}

export function add_all_offices_placemarks(map) {
    const filePath = 'static/data/offices.json';
    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    const latitude = item.latitude;
                    const longitude = item.longitude;
                    add_placemark(map, [latitude, longitude])
                }
            } else {
                throw new Error('JSON data is not in the expected format');
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
    return objectManager
}