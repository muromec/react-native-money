import { AsyncStorage } from 'react-native';
import * as util from '../util';

const symbolMap = {
    BTC: 'XXBTZUSD',
    BCH: 'BCHUSD',
    ETH: 'XETHZUSD',
};

function getKey(symbol) {
    return symbolMap[symbol] || symbol;
}

function request(symbols) {
    return fetch(`https://api.kraken.com/0/public/Ticker?pair=${symbols}`);
}


export default async function getBits() {
    const raw = await AsyncStorage.getItem('bits');
    const bits  = (raw ? JSON.parse(raw) : [])
        .map(({symbol, shares, buyPrice})=> ({
            symbol, shares: Number(shares), buyPrice: Number(buyPrice)
        }));
    const symbols = bits.map(({symbol})=> getKey(symbol));

    return request(symbols)
        .then((response)=> response.json())
        .then((response)=> (
            bits.map(function({symbol, shares, buyPrice}) {
                const price = Number(response.result[getKey(symbol)]['c'][0]);
                return {
                    symbol,
                    price,
                    total: shares * price,
                    diff: shares * (price - buyPrice),
                };
            })
         ))
}
