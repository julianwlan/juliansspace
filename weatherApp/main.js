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
                const city = dataJSON.results[0].components.city || dataJSON.results[0].components.village;
                const suburb = dataJSON.results[0].components.suburb || "";

                resolve(`${city}, ${suburb}`);
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

const showWeather = async () => {
    const city = await getCity();
    const weather = await getWeather();

    const temp = document.querySelector('#curr-temp');
    temp.innerHTML = weather.current.temp_c;

    const condi = document.querySelector('#curr-condition');
    condi.src = weather.current.condition.icon;


    console.log(weather);
    console.log(city);
};

showWeather();