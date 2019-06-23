import { AsyncStorage } from 'react-native';

export default async function api() {
    const token = await AsyncStorage.getItem('fio');
    if (!token) {
        return Promise.resolve({});
    }
    return fetch(`https://www.fio.cz/ib_api/rest/last/${token}/transactions.json`)
      .then(response=> response.json())
      .then(response=> ({
          [response.accountStatement.info.currency]:
            response.accountStatement.info.closingBalance
      }));
}
