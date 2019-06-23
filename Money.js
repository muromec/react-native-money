import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Stock from './Stock';

import {useApis} from './api';
import * as util from './util';

import FIO from './links/fio';
import Bit from './links/bit';
import STOCK from './links/stock';
import Privat from './links/privat';
import NBU from './links/nbu';

import {format} from './format';


function line(pieces) {
    return pieces
        .filter((part)=> part)
        .join(' | ');
}

function total(bits, stock, banks, fx) {
    return (util.sum(
        Object.keys(banks)
            .map((currency)=> banks[currency] * (fx[currency] || 1))
    ) + (bits * fx.USD) + (stock * fx.USD)) / fx.USD;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    total: {
        fontSize: 25,
        padding: 15,
    }, 
});

export default function Money() {
    const [uahUSD, uahEUR, bits, stock, privat, fio, loading, onPress] = useApis(
        NBU('USD'), NBU('EUR'),
        Bit, STOCK, Privat, FIO
    );
    const banks = util.combine([fio, privat]);
    const stockPrice = util.combineStock(stock);
    const bitsPrice = util.combineStock(bits);


    return <View style={styles.container} onPress={onPress} >

        <Text onPress={onPress} style={styles.total} >
            {format(total(bitsPrice, stockPrice, banks, {USD: uahUSD, EUR: uahEUR}))}$
        </Text>

        {loading && <Text>Loading...</Text>}
        <Text onPress={onPress} >
            {line([
                uahUSD && `USD: ${format(uahUSD, 2)}₴`,
                uahEUR && `EUR: ${format(uahEUR, 2)}₴`,
            ])}
        </Text>
        <Text onPress={onPress} >
            {line([
                banks.UAH && `${format(banks.UAH)}₴`,
                banks.USD && `${format(banks.USD)}$`,
                banks.EUR && `${format(banks.EUR)}€`,
            ])}
        </Text>
        <Text onPress={onPress} >
            {line([
                stockPrice && `S: ${format(stockPrice)}`,
                bitsPrice && `B: ${format(bitsPrice)}`,
            ])}
        </Text>

        <Stock stocks={stock} onPress={onPress} />

        <Stock stocks={bits} onPress={onPress} />

    </View>;
}

