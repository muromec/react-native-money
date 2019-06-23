
export function combineOne(acc, res) {
    return Object.entries(res || {}).reduce(function(acc, [currency, balance]) {
        return Object.assign({}, acc, {[currency]: balance + (acc[currency] || 0)});
    }, acc);
}

export function combine(resources) {
    return resources.reduce(combineOne, {});
}

export function flatten(list) {
    return list.reduce((acc, element)=> ([...acc, ...element]), []);
}

export function add(a, b) {
    return a + b;
}

export function sum(numbers) {
    return numbers.reduce(add, 0);
}

export function combineStock(list) {
    return list ? sum(list.map(data=> data.total)) : null;
}
