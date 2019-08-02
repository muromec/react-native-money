import { AsyncStorage } from 'react-native';
import * as util from '../util';

function request(symbols, token) {
    return fetch(`https://cloud.iexapis.com/stable/tops/last?symbols=${symbols.join(',')}&token=${token}`);
}

function avg(min, max) {
    return (min + max) / 2;
}

function parse([{price}, {symbol, shares, buyPrice}]) {
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
    const token = await AsyncStorage.getItem('iex_token');
    const stocks  = (raw ? JSON.parse(raw) : [])
        .map(({symbol, shares, buyPrice})=> ({
            symbol, shares: Number(shares), buyPrice: Number(buyPrice)
        }));

    if (!token) {
        return [];
    }

    return request(stocks.map(({symbol})=> symbol), token)
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
