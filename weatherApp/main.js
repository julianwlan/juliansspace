const getCity = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const position = {
                    lati: pos.coords.latitude,
                    longi: pos.coords.longitude
                };

                const response = await fetch(
                    `https://api.opencagedata.com/geocode/v1/json?key=6dd822cb65c648db99589b65edfb6a90&&q=${position.lati}+${position.longi}&pretty=1&no_annotations=1`
                );

                const dataJSON = await response.json();
                const city = dataJSON.results[0].components.city || dataJSON.results[0].components.village || dataJSON.results[0].components.suburb || "";

                resolve(city);
            } catch (err) {
                reject(err);
            }
        }, reject);
    });
};

const getWeather = async () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const position = {
                    lati: pos.coords.latitude,
                    longi: pos.coords.longitude
                };

                const response = await fetch(
                    `https://api.weatherapi.com/v1/forecast.json?days=4&key=ff76f32b6d9940a9b2674941262005&lang=en&q=${position.lati},${position.longi}`
                );

                const weather = await response.json();
                resolve(weather);
            } catch (err) {
                reject(err);
            }
        }, reject);
    });
}

const detailed = document.querySelector('#detailed');
const showButton = document.querySelector('#show-detailed');
const loadingEl = document.querySelector('#loading');
const weatherEl = document.querySelector('#weather');

showButton.addEventListener("click", (e) => {
    detailed.classList.toggle('hidden');
});

let loaded = false;

const showWeather = async () => {
    loadingEl.style.display = 'block';
    weatherEl.style.display = 'none';

    const retryTimeout = setTimeout(() => {
        if (!loaded) {
            console.log('Timeout - retrying...');
            showWeather();
        }
    }, 2000);

    try {
        const city = await getCity();
        document.querySelector('#location').innerHTML = city;
        
        const weather = await getWeather();
        const date = new Date();
        const month = date.getMonth();

        const temp = document.querySelector('#curr-temp');
        temp.innerHTML = `${weather.current.temp_c} °C <br> feels like ${weather.current.feelslike_c} °C`;

        const condi = document.querySelector('#curr-condition');
        condi.src = weather.current.condition.icon;

        const isWinter = month === 11 || month === 0 || month === 1;
        
        if(isWinter) {
            detailed.innerHTML = `
            Chance of Rain: ${weather.current.chance_of_rain} % <br>
            Chance of Snow: ${weather.current.chance_of_snow} % <br>
            Dewpoint:       ${weather.current.dewpoint_c} °C <br>
            Humidity:       ${weather.current.humidity} % <br>
            UV-Index:       ${weather.current.uv}
            `;
        } else {
            detailed.innerHTML = `
            Chance of Rain: ${weather.current.chance_of_rain} % <br>
            Dewpoint:       ${weather.current.dewpoint_c} °C <br>
            Humidity:       ${weather.current.humidity} % <br>
            UV-Index:       ${weather.current.uv}
            `;
        }

        const forecast = document.querySelector('#forecast');
        Array.from(forecast.children).forEach((day, i) => {
            day.innerHTML = `
                <div>${weather.forecast.forecastday[i].day.mintemp_c} °C - ${weather.forecast.forecastday[i].day.maxtemp_c} °C</div>
                <img src="${weather.forecast.forecastday[i].day.condition.icon}" alt="${weather.forecast.forecastday[i].day.condition.text}">
                <div>${weather.forecast.forecastday[i].day.daily_chance_of_rain} % Rain</div>
            `;
        });

        // TODO: do the forecast

        // TODO: manage the background vids

        // TODO: implement weather warnings with: https://warnungen.zamg.at/wsapp/api/getWarningsForCoords?lat=47.2627&lon=11.3945&lang=de

        const background = document.querySelector('#bg-video');
        const source = document.createElement('source');

        const condition_response = await fetch("https://www.weatherapi.com/docs/weather_conditions.json");
        const conditions = await condition_response.json();
        const texts = conditions.map(c => c.day);
        console.log(texts);
        
        switch(weather.current.condition.text) {
            case 'Sunny':
                source.src = '/videos/sunny.mp4';
                break;
            case 'Partly cloudy':
                source.src = '/videos/partlycloudy.mp4';
                break;
            case 'Cloudy':
                source.src = '/videos/cloudy.mp4';
                break;
            case 'Overcast':
                source.src = '/videos/cloudy.mp4';
                break;
            case 'Mist':
                source.src = '/videos/cloudy.mp4';
                break;
            case 'Patchy rain possible':
                source.src = '/videos/rain.mp4'
                break;
            case 'Patchy snow possible':
                source.src = '/videos/snowy.mp4';
                break;
            case 'Patchy sleet possible':
                source.src = '/videos/rain.mp4';
                break;
        }

        loaded = true;
        clearTimeout(retryTimeout);
        loadingEl.style.display = 'none';
        weatherEl.style.display = 'block';

        console.log(weather);
        console.log(city);
    } catch (err) {
        clearTimeout(retryTimeout);
        console.error('Fehler beim Laden:', err);
    }
};

showWeather();

// Implement a school hour time 