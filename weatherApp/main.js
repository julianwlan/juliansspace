const getWeather = async () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                 currPosition = {
                    lati: pos.coords.latitude,
                    longi: pos.coords.longitude
                };

                const response = await fetch(
                    `https://api.weatherapi.com/v1/forecast.json?days=4&key=ff76f32b6d9940a9b2674941262005&lang=en&q=${weatherPos.lati},${weatherPos.longi}`
                );

                const weather = await response.json();
                resolve(weather);
            } catch (err) {
                reject(err);
            }
        }, reject);
    });
}

const showHourlyFc = (day) => {
    const forecast = weather.forecast.forecastday;
    const rthour = date.getHours();
    
    
    switch(day) {
        case 'day1':
            detailedFc.innerHTML = '';
            forecast[0].hour
                .filter((hour) => {
                    const hourTime = new Date(hour.time).getHours();
                    return hourTime >= rthour;
                })
                .forEach((hour) => {
                    const hourFcElmnt = document.createElement('div');
                    hourFcElmnt.innerHTML = `
                        <div>${new Date(hour.time).getHours()}:00</div>
                        <img src="${hour.condition.icon}" alt="${hour.condition.text}">
                        <div>${hour.temp_c} <sup>°C</sup></div>
                        <div>${hour.chance_of_rain}% Rain</div>
                    `;
                    detailedFc.appendChild(hourFcElmnt);
                });    
            break;
        case 'day2':
            detailedFc.innerHTML = '';
            forecast[1].hour.forEach((hour) => {
                const hourFcElmnt = document.createElement('div');
                hourFcElmnt.innerHTML = `
                    <div>${new Date(hour.time).getHours()}:00</div>
                    <img src="${hour.condition.icon}" alt="${hour.condition.text}">
                    <div>${hour.temp_c} <sup>°C</sup></div>
                    <div>${hour.chance_of_rain}% Rain</div>
                `;
                detailedFc.appendChild(hourFcElmnt);
            });
            break;
        case 'day3':
            detailedFc.innerHTML = '';
            forecast[2].hour.forEach((hour) => {
                const hourFcElmnt = document.createElement('div');
                hourFcElmnt.innerHTML = `
                    <div>${new Date(hour.time).getHours()}:00</div>
                    <img src="${hour.condition.icon}" alt="${hour.condition.text}">
                    <div>${hour.temp_c} <sup>°C</sup></div>
                    <div>${hour.chance_of_rain}% Rain</div>
                `;
                detailedFc.appendChild(hourFcElmnt);
            });
            break;
        default:
            hourlyFcContainer.innerHTML = 'No hourly forecast available :(';
    }
}

const showWeatherWarnings = async (pos) => {
    try {
        const response = await fetch(`https://warnungen.zamg.at/wsapp/api/getWarningsForCoords?lat=${pos.lati}&lon=${pos.longi}&lang=de`);
        weatherWarnings = await response.json();
        console.log(weatherWarnings);

        // TODO: Implement weather warnings with: https://warnungen.zamg.at/wsapp/api/getWarningsForCoords?lat=47.2627&lon=11.3945&lang=de
    } catch(err) {
        console.log(err);
    }

    if(weatherWarnings.properties.warnings.length) {
        weWaBanner.classList.toggle('hidden');
    }
}

const date = new Date();
const defaultLocationsAustria = [
    {name: 'Innsbruck', lati: 47.259659, longi: 11.400375},
    {name: 'Bregenz', lati: 47.50075, longi: 9.74231},
    {name: 'Salzburg', lati: 47.80000, longi: 13.04500},
    {name: 'Linz', lati: 48.30639, longi: 14.28639},
    {name: 'St. Pölten', lati: 48.2044, longi: 15.6229},
    {name: 'Wien', lati: 48.210033, longi: 16.363449},
    {name: 'Eisenstadt', lati: 47.850, longi: 16.517},
    {name: 'Graz', lati: 47.07083, longi: 15.43861},
    {name: 'Klagenfurt', lati: 46.6357, longi: 14.3118},
    {name: 'Lienz', lati: 46.82972, longi: 12.76972}
];
const weWaBanner = document.querySelector('#wthr-warning-banner');
const locationText = document.querySelector('#location');
const detailedFc = document.querySelector('#detailed-fc');
const hourlyFcContainer = document.querySelector('#detailed-fc-container');
const detailed = document.querySelector('#detailed');
const showButton = document.querySelector('#show-detailed');
const loadingEl = document.querySelector('#loading');
const weatherEl = document.querySelector('#weather');
const temp = document.querySelector('#curr-temp');
const feelslikeTemp = document.querySelector('#feelslike-temp');
const condi = document.querySelector('#curr-condition');
const forecast = document.querySelector('#forecast');
const fcDays = forecast.querySelectorAll('.fc-day');
const background = document.querySelector('#bg-video');
let loaded = false;
let weather = null;
let weatherWarnings = null;
let currPosition = null;
let weatherPos = defaultLocationsAustria[0];


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
        weather = await getWeather();
        locationText.innerHTML = `${weather.location.name || ''}, ${weather.location.region}`;
        const date = new Date();
        const month = date.getMonth();

        temp.innerHTML = `${weather.current.temp_c}<sup>°C</sup> <br>`;
        feelslikeTemp.innerHTML = `feels like ${weather.current.feelslike_c}<sup>°C</sup>`

        condi.src = weather.current.condition.icon;

        const isWinter = month === 11 || month === 0 || month === 1;
        
        if(isWinter) {
            detailed.innerHTML = `
            Chance of Rain: ${weather.current.chance_of_rain} % <br>
            Chance of Snow: ${weather.current.chance_of_snow} % <br>
            Dewpoint:       ${weather.current.dewpoint_c}<sup>°C</sup> <br>
            Humidity:       ${weather.current.humidity} % <br>
            UV-Index:       ${weather.current.uv}
            `;
        } else {
            detailed.innerHTML = `
            Chance of Rain: ${weather.current.chance_of_rain} % <br>
            Dewpoint:       ${weather.current.dewpoint_c}<sup>°C</sup> <br>
            Humidity:       ${weather.current.humidity} % <br>
            UV-Index:       ${weather.current.uv}
            `;
        }

        fcDays.forEach((day, i) => {
            const date = new Date(weather.forecast.forecastday[i].date);
            day.innerHTML = `
                <div>${date.toLocaleDateString("de-DE", {weekday: "long"})}</div> 
                <div>${weather.forecast.forecastday[i].day.mintemp_c}<sup>°C</sup> - ${weather.forecast.forecastday[i].day.maxtemp_c}<sup>°C</sup></div>
                <img src="${weather.forecast.forecastday[i].day.condition.icon}" alt="${weather.forecast.forecastday[i].day.condition.text}">
                <div>${weather.forecast.forecastday[i].day.daily_chance_of_rain} % Rain</div>
            `;
        });

        const source = document.createElement('source');
        source.type = 'video/mp4';

        const condition_response = await fetch("https://www.weatherapi.com/docs/weather_conditions.json");
        const conditions = await condition_response.json();
        const texts = conditions.map(c => c.day);
        
        switch(weather.current.condition.text) {
            case texts[0]:  // Sunny
                source.src = '/videos/sunny.mp4';
                break;
            case texts[1]:  // Partly cloudy
                source.src = '/videos/partlycloudy.mp4';
                break;
            case texts[2]:  // Cloudy
            case texts[3]:  // Overcast
                source.src = '/videos/cloudy.mp4';
                break;
            case texts[4]:  // Mist
            case texts[12]: // Fog
            case texts[13]: // Freezing fog
                source.src = '/videos/fog.mp4';
                break;
            case texts[5]:  // Patchy rain possible
            case texts[7]:  // Patchy sleet possible
            case texts[8]:  // Patchy freezing drizzle possible
            case texts[14]: // Patchy light drizzle
            case texts[15]: // Light drizzle
            case texts[16]: // Freezing drizzle
            case texts[17]: // Heavy freezing drizzle
            case texts[18]: // Patchy light rain
            case texts[19]: // Light rain
            case texts[20]: // Moderate rain at times
            case texts[21]: // Moderate rain
            case texts[22]: // Heavy rain at times
            case texts[23]: // Heavy rain
            case texts[24]: // Light freezing rain
            case texts[25]: // Moderate or heavy freezing rain
            case texts[26]: // Light sleet
            case texts[27]: // Moderate or heavy sleet
            case texts[35]: // Light rain shower
            case texts[36]: // Moderate or heavy rain shower
            case texts[37]: // Torrential rain shower
            case texts[38]: // Light sleet showers
            case texts[39]: // Moderate or heavy sleet showers
                source.src = '/videos/rain.mp4';
                break;
            case texts[6]:  // Patchy snow possible
            case texts[10]: // Blowing snow
            case texts[11]: // Blizzard
            case texts[28]: // Patchy light snow
            case texts[29]: // Light snow
            case texts[30]: // Patchy moderate snow
            case texts[31]: // Moderate snow
            case texts[32]: // Patchy heavy snow
            case texts[33]: // Heavy snow
            case texts[34]: // Ice pellets
            case texts[40]: // Light snow showers
            case texts[41]: // Moderate or heavy snow showers
            case texts[42]: // Light showers of ice pellets
            case texts[43]: // Moderate or heavy showers of ice pellets
                source.src = '/videos/snow.mp4';
                break;
            case texts[9]:  // Thundery outbreaks possible
            case texts[44]: // Patchy light rain with thunder
            case texts[45]: // Moderate or heavy rain with thunder
            case texts[46]: // Patchy light snow with thunder
            case texts[47]: // Moderate or heavy snow with thunder
                source.src = '/videos/thunderstorm.mp4';
                break;
            default:
                source.src = '/videos/sunny.mp4';
                break;
        }

        background.appendChild(source);

        loaded = true;
        clearTimeout(retryTimeout);
        loadingEl.style.display = 'none';
        weatherEl.style.display = 'block';

        await showWeatherWarnings(weatherPos);
        console.log(weather);
    } catch (err) {
        clearTimeout(retryTimeout);
        console.error('Fehler beim Laden:', err);
    }
};

showWeather();

document.addEventListener("click", (e) => {
    if (e.target.id === 'show-detailed') {
        detailed.classList.toggle('hidden');
    }
    
    const day = e.target.closest('.fc-day');
    if (day) {
        // console.log("Day clicked:", day.id);
        showHourlyFc(day.id);
        hourlyFcContainer.classList.toggle('hidden');
    }
});

// TODO: Implement a school hour time 