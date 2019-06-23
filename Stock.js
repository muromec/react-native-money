import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text } from 'react-native';

import * as util from './util';
import {useApi} from './api';
import {format} from './format';

const styles = StyleSheet.create({
    container: {
        padding: 10,
        minWidth: '60%',
    },
    stock: {
        display: 'flex',
	flexDirection: 'row',
        minWidth: '100%',
        justifyContent: 'center',
    },
    total: {
        width: '100%',
        display: 'flex',
	flexDirection: 'row',
        marginLeft: '20%',
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: '#e9e9e9',
        justifyContent: 'center',
    },
    symbol: {
        minWidth: '20%',
        width: '20%',
    },

    cell: {
    },

    price: {
        minWidth: '20%',
        width: '20%',
        textAlign: 'right',


    },
    up: {
        color: 'green',
    },
    down: {
        color: 'red',
    },
});

function diffStyle(diff) {
    return [
        styles.cell,
        styles.price,
        diff > 0 ? styles.up : styles.down,
    ];
}

function Diff({diff, onPress}) {
    if (!diff) return null;

    return (<Text onPress={onPress} style={diffStyle(diff)} >
        {format(diff)}
    </Text>);
}

export default function Stock({stocks, onPress}) {
    if (!stocks || !stocks.length) return null;
    return <View style={styles.container} onPress={onPress} >
        {stocks.map((stock, idx)=> 
            <View key={idx} style={styles.stock} >
                <Text onPress={onPress} style={[styles.cell, styles.symbol]} >
                    {stock.symbol}
                </Text>
                <Text onPress={onPress} style={[styles.cell, styles.price]} >
                    {format(stock.price, 2)}
                </Text>
                <Text onPress={onPress} style={[styles.cell, styles.price]} >
                    {format(stock.total)}
                </Text>
                <Diff onPress={onPress} diff={stock.diff} />
            </View>)}
        <View style={styles.total}>
            <Text style={[styles.cell, styles.price]} >
                {format(util.sum((stocks.map((stock)=> stock.total))))}
            </Text>
            <Diff onPress={onPress} diff={util.sum((stocks.map((stock)=> stock.diff)))} />
        </View>
    </View>;
}

