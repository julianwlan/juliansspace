// #region Weather App

const getWeather = async () => {
    const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?days=4&key=ff76f32b6d9940a9b2674941262005&lang=en&q=${weatherPos.lati},${weatherPos.longi}`
    );
    const weather = await response.json();
    return weather;
}

const getCurrentPositionAsync = () =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });

const getBackgroundVideoSrc = (conditionText = '', isDay = 1) => {
    const text = conditionText.toLowerCase();

    if (text.includes('thunder')) return 'videos/thunderstorm.mp4';
    if (text.includes('snow') || text.includes('blizzard') || text.includes('ice pellets')) return 'videos/snow.mp4';
    if (text.includes('rain') || text.includes('drizzle') || text.includes('sleet')) return 'videos/rain.mp4';
    if (text.includes('fog') || text.includes('mist')) return 'videos/fog.mp4';
    if (text.includes('cloud') || text.includes('overcast')) return 'videos/cloudy.mp4';
    if (isDay === 0) return 'videos/night.mp4';
    if (text.includes('sunny') || text.includes('clear')) return 'videos/sunny.mp4';

    return isDay === 0 ? 'videos/night.mp4' : 'videos/partlycloudy.mp4';
};

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
    loaded = false;
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
        const todayForecast = weather.forecast?.forecastday?.[0]?.day || {};
        const rainChance = weather.current.chance_of_rain ?? todayForecast.daily_chance_of_rain ?? 0;
        const snowChance = weather.current.chance_of_snow ?? todayForecast.daily_chance_of_snow ?? 0;

        temp.innerHTML = `${weather.current.temp_c}<sup>°C</sup> <br>`;
        feelslikeTemp.innerHTML = `feels like ${weather.current.feelslike_c}<sup>°C</sup>`

        condi.src = weather.current.condition.icon;

        const isWinter = month === 11 || month === 0 || month === 1;
        
        if(isWinter) {
            detailed.innerHTML = `
            Chance of Rain: ${rainChance} % <br>
            Chance of Snow: ${snowChance} % <br>
            Dewpoint:       ${weather.current.dewpoint_c}<sup>°C</sup> <br>
            Humidity:       ${weather.current.humidity} % <br>
            UV-Index:       ${weather.current.uv}
            `;
        } else {
            detailed.innerHTML = `
            Chance of Rain: ${rainChance} % <br>
            Dewpoint:       ${weather.current.dewpoint_c}<sup>°C</sup> <br>
            Humidity:       ${weather.current.humidity} % <br>
            UV-Index:       ${weather.current.uv}
            `;
        }

        fcDays.forEach((day, i) => {
            const date = new Date(weather.forecast.forecastday[i].date);
            day.innerHTML = `
                <div>${date.toLocaleDateString("en-US", {weekday: "long"})}</div> 
                <div>${weather.forecast.forecastday[i].day.mintemp_c}<sup>°C</sup> - ${weather.forecast.forecastday[i].day.maxtemp_c}<sup>°C</sup></div>
                <img src="${weather.forecast.forecastday[i].day.condition.icon}" alt="${weather.forecast.forecastday[i].day.condition.text}">
                <div>${weather.forecast.forecastday[i].day.daily_chance_of_rain} % Rain</div>
            `;
        });

        background.src = getBackgroundVideoSrc(weather.current?.condition?.text, weather.current?.is_day);
        background.load();
        background.play().catch(() => {
            console.log('Background video autoplay blocked.');
        });

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

document.addEventListener("click", async (e) => {
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
        let shouldRenderWeather = true;

        switch(location.id) {
            case 'curr-location':
                try {
                    const pos = await getCurrentPositionAsync();
                    weatherPos = {
                        lati: pos.coords.latitude,
                        longi: pos.coords.longitude
                    };
                } catch (err) {
                    shouldRenderWeather = false;
                    console.log(err);
                }
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

        if (shouldRenderWeather) {
            await showWeather();
        }
    }

    // Warning Banner / Modal Handler
    if (e.target.closest('#warning-summary')) {
        warningModal.classList.remove('hidden');
    }

    if (e.target.classList.contains('warning-modal-close') || e.target === warningModal) {
        warningModal.classList.add('hidden');
    }
});

warningModal.addEventListener('click', (e) => {
    if (e.target === warningModal) {
        warningModal.classList.add('hidden');
    }
});
// #endregion

// #region Home / site navigation

const LAST_NAV_PAGE_KEY = 'lastNavbarPage';
const NAV_PAGE_HOME = 'home';
const NAV_PAGE_WEATHER = 'weather';
const ISA_LOGIN_PASSWORD = 'nico';

const topBar = document.querySelector('#top-bar');
const loginBtn = document.querySelector('#login-btn');
const loginForm = document.querySelector('#login-form');
const loginPasswordInput = document.querySelector('#asisa');

const hideSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if(!section.classList.contains('hidden')) {
        section.classList.add('hidden');
    }
}

const applyBodyTheme = (sectionId) => {
    document.body.classList.remove('normal-body', 'legal-body', 'weather-body');

    if (sectionId === '#legal') {
        document.body.classList.add('legal-body');
        return;
    }

    if (sectionId === '#weatherApp') {
        document.body.classList.add('weather-body');
        return;
    }

    document.body.classList.add('normal-body');
}

const manageSections = (sectionId) => {
    const sections = ['#home', '#weatherApp', '#legal', '#isasspace'];
    sections.forEach(section => {
        hideSection(section);
    });

    document.querySelector(sectionId).classList.remove('hidden');
    applyBodyTheme(sectionId);
}

const showLoginOnly = () => {
    manageSections('#isasspace');
    topBar?.classList.add('hidden');
    loginPasswordInput?.focus();
};

const redirectToHome = () => {
    topBar?.classList.remove('hidden');
    manageSections('#home');
};

const saveLastNavbarPage = (page) => {
    try {
        localStorage.setItem(LAST_NAV_PAGE_KEY, page);
    } catch (err) {
        console.log('Could not persist last navbar page:', err);
    }
};

const getLastNavbarPage = () => {
    try {
        const saved = localStorage.getItem(LAST_NAV_PAGE_KEY);
        return saved === NAV_PAGE_WEATHER ? NAV_PAGE_WEATHER : NAV_PAGE_HOME;
    } catch (err) {
        console.log('Could not read last navbar page:', err);
        return NAV_PAGE_HOME;
    }
};

document.querySelector('#nav-bar').addEventListener('click', async e => {
    switch(e.target.id) {
        case 'home-btn':
            manageSections('#home');
            saveLastNavbarPage(NAV_PAGE_HOME);
            break;
        case 'weather-btn':
            manageSections('#weatherApp');
            saveLastNavbarPage(NAV_PAGE_WEATHER);
            await showWeather();
            break;
        default:
            manageSections('#home');
            break;
    }
});

document.querySelector('#legal-btn-home')?.addEventListener('click', () => {
    manageSections('#legal');
});

document.querySelector('#legal-btn-weather')?.addEventListener('click', () => {
    manageSections('#legal');
});

loginBtn?.addEventListener('click', () => {
    showLoginOnly();
});

loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredPassword = loginPasswordInput?.value || '';

    if (enteredPassword === ISA_LOGIN_PASSWORD) {
        window.location.href = 'https://isa.juliansspace.com';
        return;
    }

    if (loginPasswordInput) {
        loginPasswordInput.value = '';
    }

    redirectToHome();
});

const restoreLastNavbarPage = async () => {
    const lastPage = getLastNavbarPage();
    topBar?.classList.remove('hidden');

    if (lastPage === NAV_PAGE_WEATHER) {
        manageSections('#weatherApp');
        await showWeather();
        return;
    }

    manageSections('#home');
};

restoreLastNavbarPage();

// home clock/date panel
const clock = document.querySelector('#clock');
const displayDate = document.querySelector('#date');
const newDate = new Date();
displayDate.innerHTML = `${newDate.toLocaleDateString("en-UK",  {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
})}`;

setInterval(() => {
    const timeDate = new Date();
    clock.innerHTML = `${String(timeDate.getHours()).padStart(2, "0")}:${String(timeDate.getMinutes()).padStart(2, "0")}:${String(timeDate.getSeconds()).padStart(2, "0")}`;
}, 500);

// #endregion

// TODO: Implement a school hour time