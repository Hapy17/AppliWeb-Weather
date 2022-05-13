// Requete de la météo de Saint-Just-Saint'Rambert
function getWeather(coords) {
    let request = new XMLHttpRequest();
    request.open('GET', `https://www.prevision-meteo.ch/services/json/lat=${coords.lat}lng=${coords.lng}`);
    request.send();

    request.addEventListener('readystatechange', function () {

        if (this.readyState === 4) {
            if (this.status === 200) {
                const myResponse = JSON.parse(this.responseText);
                if (myResponse) insertValuesInDom(myResponse,coords);
            }
        }
    });
}

async function insertValuesInDom(weatherCity,coords) {
    const weather = document.getElementById(`weather`);
    weather.innerHTML = "";

    console.log(coords);
    let cityName = document.createElement(`h2`);
    cityName.textContent = "Chargement du nom de la ville..."
    

    weather.append(cityName);
    getCityName(coords);

    for (let property in weatherCity) {
        if (/fcst_day/.test(property)) {

            let newDiv = document.createElement(`div`);
            let date = document.createElement(`h3`);
            let iconCondition = document.createElement(`img`);
            let tempInterval = document.createElement(`p`);
            let separation = document.createElement(`hr`);

            date.innerHTML = weatherCity[property].day_long + ` ` + weatherCity[property].date;
            iconCondition.src = weatherCity[property].icon;
            tempInterval.innerHTML = `Interval de températures ` + weatherCity[property].tmax + ` °C` + ` | ` + weatherCity[property].tmin + ` °C`;

            weather.appendChild(newDiv);
            newDiv.append(date, iconCondition, tempInterval, separation);
        }
    }
}



//  set up de la map
function initMap() {
    var map = L.map('map').setView([45.5, 4.26], 8);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibmJhZG9pdCIsImEiOiJjbDJvc2d6M2MwMzc5M2RvMnhzandzeDJzIn0.XMhD9Mc17VJtUxraV4vlmg'
    }).addTo(map);

    map.on(`click`, function(e){
        let newMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);

        let coords = {
            lat : e.latlng.lat,
            lng : e.latlng.lng
        }
        
        getWeather(coords);
        newMarker.addEventListener(`click`,function(){
            this.remove();
        })
        
        
    })
}

initMap()

function getCityName(coords){
    let requestName = new XMLHttpRequest();
    requestName.open('GET', `http://api.openweathermap.org/geo/1.0/reverse?lat=${coords.lat}&lon=${coords.lng}&limit=1&appid=6d950262a17320046dbcb832cf9085a9
    `);
    requestName.send();
    requestName.addEventListener('readystatechange', function () {

        if (this.readyState === 4) {
            if (this.status === 200) {
                const myResponse = JSON.parse(this.responseText)[0];
                console.log(myResponse.name);
                if (myResponse) {
                    document.querySelector(`h2`).innerHTML = myResponse.name;

                }
            }
        }
    });

}



