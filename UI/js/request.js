function httpGet (path, callback) {
    const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = inStore.data.token;
    console.log(token);
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", window.api_url+path, true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
    xhttp.onload = () => { 
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send();
}

function httpPost (path, data, callback) {
    const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = inStore.data.token;
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", window.api_url+path , true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
    xhttp.onload = () => {
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send(JSON.stringify(data));
}

function httpPatch (path, data, callback) {
    const  inStore  = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = inStore.data.token;
    let xhttp = new XMLHttpRequest();
    xhttp.open("PATCH", window.api_url+path , true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
    xhttp.onload = () => {
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send(JSON.stringify(data));
}

function httpDelete (path, callback) {
    const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = inStore.data.token;
    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", window.api_url+path, true);
    xhttp.setRequestHeader('Content-type','application/json');
    xhttp.setRequestHeader('Authorization', `Bearer ${token}`);
    xhttp.onload = () => {
        callback(null, JSON.parse(xhttp.responseText || '{}'), xhttp);
    }
    xhttp.send();
}