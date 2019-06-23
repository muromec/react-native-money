const api = (currency='USD') => ()=> {
    return fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&json`)
        .then((response)=> response.json())
        .then((response)=> response[0].rate);
}

export default api;
