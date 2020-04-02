import React, {useState, useEffect} from 'react';
import { AsyncStorage, StyleSheet, Text, TextInput, View, Button } from 'react-native';

import {useApi} from './api';

const styles = StyleSheet.create({
    view: {
        flex: 2,
        padding: 50,
    },
    input: {
        borderStyle: 'solid',
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
    },
    stock: {
        flexDirection: 'row',
    },
    header: {
        fontSize: 18,
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: 'center',
    },
});

async function stockConfig(param) {
    const raw = await AsyncStorage.getItem(param);
    return raw ? JSON.parse(raw) : [];
}

async function addStock(param, value) {
    const items = await stockConfig(param);
    await AsyncStorage.setItem(param, JSON.stringify([...items, value]));
}

async function removeStock(param, symbol) {
    const items = await stockConfig(param);
    const filtered = items.filter((stock)=> stock.symbol !== symbol);
    await AsyncStorage.setItem(param, JSON.stringify(filtered));
}

export function StockAdd({navigation}) {
    const {param} = navigation.state.params;
    const [value, setValue] = useState({
        symbol: '',
        shares: '',
        buyPrice: '',
    });

    function change(key, text) {
        setValue({...value, [key]: text});
    }

    async function submit() {
        await addStock(param, value)
        navigation.goBack();
    }

    return (<View style={styles.view}>
        <Text>Add stock</Text>

        <View>
            <Text>Ticker</Text>
            <TextInput value={value.symbol} onChangeText={change.bind(null, 'symbol')} onSubmitEditing={submit} style={styles.input} />
        </View>
        <View>
            <Text>Number of shares</Text>
            <TextInput value={value.shares} onChangeText={change.bind(null, 'shares')} onSubmitEditing={submit} style={styles.input} />
        </View>
        <View>
            <Text>Buy price</Text>
            <TextInput value={value.buyPrice} onChangeText={change.bind(null, 'buyPrice')} onSubmitEditing={submit} style={styles.input} />
        </View>

    </View>);
}

export default function StockSettings({navigation, param, label}) {
    const [stocks=[], loading, onLoad] = useApi(stockConfig)(param);

    function push() {
        navigation.navigate('StockAdd', {param});
    }

    return (<View>
        <Text style={styles.header}>{label}</Text>
        {stocks.map((stock, idx)=> (<View key={idx} style={styles.stock} >
            <Text>{stock.symbol} -- {stock.shares} -- {stock.buyPrice}</Text>
            <Text onPress={()=> removeStock(param, stock.symbol).then(onLoad)} > Remove</Text>
        </View>))}
        
        <Button title="Add" onPress={push} />
    </View>);
}
