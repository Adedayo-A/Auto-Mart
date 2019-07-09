function httpGet (path, query, callback) {
    let queryString = '';
    Object.keys(query).forEach((key) => {
        queryString += `${key}=${query[key]}&`;
    })
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://127.0.0.1:5000${path}?${queryString}`, true);
    xhttp.onload = () => { 
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send();
}

function httpPost (path, data, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", `http://127.0.0.1:8000${path}` , true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.onload = () => {
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send(JSON.stringify(data));
}

function httpPut (path, data, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `http://127.0.0.1:8000${path}`, true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.onload = () => {
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send(JSON.stringify(data));
}

function httpDelete (path, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `http://127.0.0.1:5000${path}`, true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.onload = () => {
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send();
}