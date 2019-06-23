import { AsyncStorage } from 'react-native';

import * as util from '../util';

function request(settings) {
  const headers = {
      id: settings.privat_id,
      token: settings.privat_token,
      'Content-Type': 'application/json;charset=utf8',
  };
  return fetch('https://acp.privatbank.ua/api/proxy/rest/today', {headers});
}

export default async function api() {
  const settings = Object.fromEntries(
    await AsyncStorage.multiGet(['privat_id', 'privat_token'])
  );
  if (!settings.privat_id || !settings.privat_token) {
      return Promise.resolve({});
  }

  return request(settings)
    .then((response)=> response.json())
    .then((response)=> {
        const balances = response['balanceResponse'];
        const accounts = util.flatten(
            balances.map((balance)=> 
                Object.entries(balance).map(([number, info])=> 
                    Object.assign({}, info, {number})
                )
            )
        );
        return util.combine(accounts
          .map(account=> ({[account.currency]: Number(account.balanceOut)}))
        );
    });
}
