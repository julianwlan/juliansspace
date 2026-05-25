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
                const city = dataJSON.results[0].components.city;
                const suburb = dataJSON.results[0].components.suburb;

                resolve(`${city}, ${suburb}`);
            } catch (err) {
                reject(err);
            }
        }, reject);
    });
};

const run = async () => {
    const city = await getCity();
    console.log(city);
};

run();