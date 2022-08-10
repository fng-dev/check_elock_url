const axios = require('axios');
const moment = require('moment');

const instance = axios.create({
    baseURL: "https://api.elock.cl/",
    headers: {
        'Content-type': 'application/json',
    }
});

const times = Array.from({
    length: 1000
}).map((_, index) => index);

const results = [];

const stressTest = async () => {
    try {
        const response = await instance.get('box/terminal/6KHZD3LX/availables');
        response.data = response.data;
        return response;
    } catch (e) {
        console.log('LOGGER', e.message);
        return Promise.reject(e);
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const loop = async () => {
    for (attempt of times) {
        await sleep(1000)
        const time_start = moment()
        const formated_start = time_start.format('DD/MM/YYYY hh:mm:ss') + ':' + time_start.milliseconds();
        try {
            await stressTest();
            const time_end = moment()
            const formated = time_end.format('DD/MM/YYYY hh:mm:ss') + ':' + time_end.milliseconds();
            const payload = {
                time_start: formated_start,
                time_end: formated,
                status: 'success',
            }
            results.push(payload);
        } catch (e) {
            const time_end = moment()
            const formated = time_end.format('DD/MM/YYYY hh:mm:ss') + ':' + time_end.milliseconds();
            const payload = {
                time_start: formated_start,
                time_end: formated,
                status: 'error',
            }
            results.push(payload);
        }
    }
    const csv = results.map((result) => {
        const line = []
        Object.keys(result).forEach((key) => {
            line.push(result[key]);
        })
        return line.join(';') + ';';
    })
    console.log(csv.join("\n"));
}

loop();