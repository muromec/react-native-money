import React, {useState, useEffect} from 'react';
import { AsyncStorage, StyleSheet, Text, TextInput, View } from 'react-native';
import StockSettings from './StockSettings';

const styles = StyleSheet.create({
    container: {
        padding: 30,
        alignSelf: 'flex-end',
    },
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
});

export function SettingsButton({onPress}) {
    return <View style={styles.container} onPress={onPress}>
        <Text onPress={onPress}>Settings</Text>
    </View>;
}

export default function Settings({navigation}) {
    const [value, setValue] = useState({
        fio: '',
        privat_id: '',
        privat_token: '',
    });
    useEffect(()=> {
        AsyncStorage.multiGet(Object.keys(value))
            .then(Object.fromEntries)
            .then(setValue);
    }, []);

    function change(key, text) {
        setValue({...value, [key]: text});
    }

    function submit() {
        AsyncStorage.multiSet(
            Object.entries(value)
                .map(([key, part])=> [key, part || ''])
        );
        navigation.goBack();
    }

    return <View style={styles.view}>
        <View>
            <Text>FIO token</Text>
            <TextInput value={value.fio} onChangeText={change.bind(null, 'fio')} onSubmitEditing={submit} style={styles.input} />
        </View>
        <View>
            <Text>Privat Id</Text>
            <TextInput value={value['privat_id']} onChangeText={change.bind(null, 'privat_id')} onSubmitEditing={submit} style={styles.input} />
        </View>
        <View>
            <Text>Privat token</Text>
            <TextInput value={value['privat_token']} onChangeText={change.bind(null, 'privat_token')} onSubmitEditing={submit} style={styles.input} />
        </View>

        <StockSettings navigation={navigation} label="Stocks" param="stocks" />
        <StockSettings navigation={navigation} label="Bits" param="bits" />

    </View>
}
Settings.navigationOptions = {
    title: 'Settings',
};

