function pad(str) {
    let ret = str.toString();
    return (ret.length === 2) ? ret : '0' + ret;
}

function getDate() {
    const d = new Date();
    return [
        (d.getYear() + 1900),
        pad(d.getMonth() + 1),
        pad(d.getDay())
    ].join('');
}

const api = (currency='USD') => ()=> {

    return fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&json`)
        .then((response)=> response.json())
        .then((response)=> response[0].rate);
}

export default api;
