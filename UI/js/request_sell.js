function httpGet (path, callback) {
    const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = inStore.token;
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://127.0.0.1:5000${path}`, true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
    xhttp.onload = () => { 
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send();
}

function httpPost (path, data, callback) {
    const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", `http://127.0.0.1:5000${path}` , true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.onload = () => {
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send(JSON.stringify(data));
}

function httpPostCar (path, data, callback) {
    const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = inStore.token;
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", `http://127.0.0.1:5000${path}` , true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
    xhttp.onload = () => {
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send(JSON.stringify(data));
}

function httpPostImage (path, data, callback) {
    const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = inStore.token;
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", `http://127.0.0.1:5000${path}` , true);
    // xhttp.setRequestHeader('Content-type','multipart/form-data');
    xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
    xhttp.onload = () => {
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send(data);
}

function httpPatch (path, data, callback) {
    const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = inStore.token;
    let xhttp = new XMLHttpRequest();
    xhttp.open("PATCH", `http://127.0.0.1:5000${path}`, true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
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