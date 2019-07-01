import { AsyncStorage } from 'react-native';
import * as util from '../util';

function request(symbols) {
    return fetch(`https://api.iextrading.com/1.0/tops?symbols=${symbols.join(',')}`);
}

function avg(min, max) {
    return (min + max) / 2;
}

function parse([response, {symbol, shares, buyPrice}]) {
    const price = response.lastSalePrice;
    return {symbol, price, shares, buyPrice};
}

function zip(listA, listB) {
    const ret = [];
    listA.forEach((partA, idx)=> {
        const partB = listB[idx];
        ret.push([partA, partB]);
    });
    return ret;
}

export default async function getStocks() {
    const raw = await AsyncStorage.getItem('stocks');
    const stocks  = (raw ? JSON.parse(raw) : [])
        .map(({symbol, shares, buyPrice})=> ({
            symbol, shares: Number(shares), buyPrice: Number(buyPrice)
        }));

    return request(stocks.map(({symbol})=> symbol))
        .then((response)=> response.json())
        .then((response)=> zip(response, stocks))
        .then((data)=> data.map(parse))
        .then(data=> data.map(({symbol, price, buyPrice, shares})=> ({
            symbol,
            price,
            total: price * shares,
            diff: shares * (price - buyPrice),
        })));
}
