const getWeather = async () => {
    const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?days=4&key=ff76f32b6d9940a9b2674941262005&lang=en&q=${weatherPos.lati},${weatherPos.longi}`
    );
    const weather = await response.json();
    return weather;
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

        // Zeige Warnungen im Banner und Modal
        const warnings = weatherWarnings.properties?.warnings || [];
        
        if(warnings.length > 0) {
            weWaBanner.classList.remove('hidden');
            
            // Banner Summary
            const summaryText = warnings.length === 1 
                ? warnings[0].properties.text 
                : `${warnings.length} Wetterwarnungen aktiv`;
            
            warningSummary.innerHTML = `
                ⚠️ <strong>${summaryText}</strong>
                <span class="warning-badge">Klick für Details</span>
            `;
            
            // Modal Details
            const detailsHtml = warnings.map((warning, index) => {
                const props = warning.properties;
                const startDate = new Date(props.begin);
                const endDate = new Date(props.end);
                const timeRange = `${startDate.toLocaleString('de-DE')} - ${endDate.toLocaleString('de-DE')}`;
                
                return `
                    <div class="warning-item">
                        <div class="warning-header">
                            <div class="warning-type">
                                ⚠️ ${props.text}
                            </div>
                            <div class="warning-time">${timeRange}</div>
                        </div>
                        
                        <div class="warning-description">
                            ${props.meteotext}
                        </div>
                        
                        <div class="warning-section">
                            <div class="warning-section-title">📋 Auswirkungen:</div>
                            <div class="warning-section-content">${props.auswirkungen}</div>
                        </div>
                        
                        <div class="warning-section">
                            <div class="warning-section-title">💡 Empfehlungen:</div>
                            <div class="warning-section-content">${props.empfehlungen}</div>
                        </div>
                    </div>
                `;
            }).join('');
            
            warningDetailsContainer.innerHTML = detailsHtml;
        } else {
            weWaBanner.classList.add('hidden');
        }
    } catch(err) {
        console.log('Fehler beim Laden der Wetterwarnungen:', err);
    }
}

const date = new Date();
const defaultLocationsAustria = [
    {name: 'Bregenz', lati: 47.503395, longi: 9.738808},
    {name: 'Innsbruck', lati: 47.259659, longi: 11.400375},
    {name: 'Salzburg', lati: 47.80000, longi: 13.04500},
    {name: 'Linz', lati: 48.30639, longi: 14.28639},
    {name: 'St. Pölten', lati: 48.204437, longi: 15.630731},
    {name: 'Wien', lati: 48.210033, longi: 16.363449},
    {name: 'Eisenstadt', lati: 47.850, longi: 16.517},
    {name: 'Graz', lati: 47.067683, longi: 15.441893},
    {name: 'Klagenfurt', lati: 46.624238, longi: 14.308111},
    {name: 'Lienz', lati: 46.82972, longi: 12.76972}
];
const usefulLocationsAustria = [
    {name: 'Andritz', lati: 47.117345, longi: 15.433779},
    {name: 'Kaindorf an der Sulm', lati: 46.800976, longi: 15.541158},
    {name: 'Allerheiligen bei Wildon', lati: 46.916144, longi: 15.551369}
];
const weWaBanner = document.querySelector('#wthr-warning-banner');
const warningSummary = document.querySelector('#warning-summary');
const warningModal = document.querySelector('#warning-modal');
const warningDetailsContainer = document.querySelector('#warning-details-container');
const warningModalClose = document.querySelector('.warning-modal-close');
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
let weatherPos = defaultLocationsAustria[7];


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
        locationText.innerHTML = `${weather.location.name || ''}, ${weather.location.region || ''}`;
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
        // console.log(weather);
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
        showHourlyFc(day.id);
        hourlyFcContainer.classList.toggle('hidden');
    }

    const location = e.target.closest('.location-btn');
    if(location) {
        switch(location.id) {
            case 'curr-location':
                navigator.geolocation.getCurrentPosition(pos => {
                    weatherPos = {
                        lati: pos.coords.latitude,
                        longi: pos.coords.longitude
                    };
                }, err => console.log(err));
                break;
            case 'location-bregenz':
                weatherPos = defaultLocationsAustria[0];
                break;
            case 'location-innsbruck':
                weatherPos = defaultLocationsAustria[1];
                break;
            case 'location-salzburg':
                weatherPos = defaultLocationsAustria[2];
                break;
            case 'location-linz':
                weatherPos = defaultLocationsAustria[3];
                break;
            case 'location-stpölten':
                weatherPos = defaultLocationsAustria[4];
                break;
            case 'location-wien':
                weatherPos = defaultLocationsAustria[5];
                break;
            case 'location-eisenstadt':
                weatherPos = defaultLocationsAustria[6];
                break;
            case 'location-graz':
                weatherPos = defaultLocationsAustria[7];
                break;
            case 'location-klagenfurt':
                weatherPos = defaultLocationsAustria[8];
                break;
            case 'location-lienz':
                weatherPos = defaultLocationsAustria[9];
                break;
            case 'location-andritz':
                weatherPos = usefulLocationsAustria[0];
                break;
            case 'location-kaindorf':
                weatherPos = usefulLocationsAustria[1];
                break;
            case 'location-ahbwildon':
                weatherPos = usefulLocationsAustria[2];
                break;
        }

        showWeather();
    }

    // Warning Banner / Modal Handler
    if (e.target.closest('#warning-summary')) {
        warningModal.classList.remove('hidden');
    }

    if (e.target.classList.contains('warning-modal-close') || e.target === warningModal) {
        warningModal.classList.add('hidden');
    }
});

// Close modal wenn man außerhalb klickt
warningModal.addEventListener('click', (e) => {
    if (e.target === warningModal) {
        warningModal.classList.add('hidden');
    }
});

// TODO: Implement a school hour time