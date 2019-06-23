import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import "react-native-gesture-handler";

import Money from './Money';
import Settings, {SettingsButton} from './Settings';
import {StockAdd} from './StockSettings';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

function App({navigation}) {
    function toggle() {
        navigation.navigate('Settings')
    }

    return (<View style={styles.container}>
        <SettingsButton onPress={toggle} />
        <Money />
    </View>);
}
App.navigationOptions = {
    title: 'Home',
};

const AppNavigator = createStackNavigator(
    { App, Settings, StockAdd, },
    { initialRouteName: "App"},
);

export default createAppContainer(AppNavigator);
