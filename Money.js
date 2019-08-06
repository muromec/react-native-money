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

import {format, formatCurrency} from './format';


function line(pieces) {
    return pieces
        .filter((part)=> part)
        .join(' | ');
}

function total(stock, banks, fx) {
    return (util.sum(
        Object.keys(banks)
            .map((currency)=> banks[currency] * (fx[currency] || 1))
    ) + (stock * fx.USD)) / fx.EUR || 0;
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
    const stockPrice = util.combineStock([...(stock||[]), ...(bits||[])]);

    return <View style={styles.container} onPress={onPress} >

        <Text onPress={onPress} style={styles.total} >
            {format(total(stockPrice, banks, {USD: uahUSD, EUR: uahEUR}))}€
        </Text>

        {loading && <Text>Loading...</Text>}
        <Text onPress={onPress} >
            {line([
                uahUSD && `USD: ${format(uahUSD, 2)}₴`,
                uahEUR && `EUR: ${format(uahEUR, 2)}₴`,
            ])}
        </Text>
        <Text onPress={onPress} >
            {line(
                Object.entries(banks).map(([currency, balance])=> 
                    balance && formatCurrency(currency, balance)
                )
            )}
        </Text>

        <Stock stocks={stock} onPress={onPress} />

        <Stock stocks={bits} onPress={onPress} />

    </View>;
}

