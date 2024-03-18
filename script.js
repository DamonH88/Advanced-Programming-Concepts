
// const currentWeatherItemsElement = document.getElementById('current-weather-items');
// const timezone = document.getElementById('time-zone');
// const countryElement = document.getElementById('country');
// const weatherForecastElement = document.getElementById('weather-forecast');
// const currentTempElement = document.getElementById('current-temp');


getLocation()

setInterval(() => {
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = ('0' + time.getMinutes()).slice(-2);
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeElement.innerHTML = hoursIn12HrFormat + ':' + minutes + '' + `<span id="am-pm">${ampm}</span>`

    dateElement.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000);

// From this point down I'm having trouble getting the API to populate to the Forecast Window

function getLocation(){
    navigator.geolocation.getCurrentPosition((success) => {
        let {latitude, longitude } = success.coords;
        console.log(latitude)
        fetch(`https://api.weather.gov/points/${latitude},${longitude}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            getWeather(data.properties.gridId, data.properties.gridX,data.properties.gridY,
                data.properties.relativeLocation.properties.city, data.properties.relativeLocation.properties.state);
            console.log(data);

        })
        .catch(function(error) {
            console.log(error);
        });
    })
}

function getWeather(office,gridX,gridY, city, state) {
    var url = 'https://api.weather.gov/gridpoints/' + office + '/' + gridX + "," + gridY + "/forecast";
    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            displayLocation(data, city, state);
            displayWeather(data);
            
        })
        .catch(function(error) {
            console.log(error);
        });
}
// may need work...
function displayLocation(data, city, state) {
    let locationInfo = document.getElementById('location');
    locationInfo.innerHTML = '';
    if (data.type === "Feature") {
        let locationHtml = city + ' / ' + state;
        locationInfo.innerHTML = locationHtml;
    } else {
        locationInfo.innerHTML = 'Failed to retrieve location information.';
    }
    
}

function displayWeather(data) {
    let weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = '';
    if (data.type === "Feature") {
        let period = data.properties.periods[0].name;
        let temperature = data.properties.periods[0].temperature;
        let humidity = data.properties.periods[0].relativeHumidity.value;
        let windSpeed = data.properties.periods[0].windSpeed;
        let direction = data.properties.periods[0].windDirection;
        let forecast = data.properties.periods[0].detailedForecast;
        let weatherHtml =  '<h2>'+ period +'&#8217' + 's Weather:</h2>' +
            '<p>Temperature: ' + temperature + ' &#8457;</p>' +
            '<p>Humidity: ' + humidity + '%</p>' +
            '<p>Wind Speed: ' + windSpeed + ' m/s ' + direction + '</p>' +
            '<p>Forecast: <br>' + forecast + '</p>';

        weatherInfo.innerHTML = weatherHtml;
    } else {
        weatherInfo.innerHTML = '<p>Failed to retrieve weather information.</p>';
    }
}

