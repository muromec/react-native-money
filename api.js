import {useState, useEffect} from 'react';

export const useApi = (api) => (...params)=> {
    const {0: result, 1: setResult} = useState();
    const {0: loading, 1: setLoading} = useState();
    function load() {
        setLoading(true);
        api(...params)
            .then(setResult)
            .catch(console.error)
            .then(setLoading);
    }
    useEffect(load, []);
    return [result, loading, load];
}

export const useApis = (...list)=> {
    const effects = list.map((api)=> useApi(api)());
    return [
        ...effects.map(([result])=> result),
        effects.reduce((acc, [result, loading])=> acc || loading, false),
        function loadAll () {
            Promise.all(effects.map(
                ([result, loading, load])=> loading || load()
            ))
        }
    ];
}
