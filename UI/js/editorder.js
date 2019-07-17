document.addEventListener('DOMContentLoaded', () => {
    const lineTwo = document.querySelector('.line-two');
    const line = document.querySelector('.line');
    const inStore = JSON.parse(localStorage.getItem('loggedInUser'));

       // VERIFY LOCAL STORAGE
       if (!inStore) {
        const needUser = document.querySelector('.need-user');
            needUser.style.display = 'none';
        const needUserLink = document.querySelectorAll('.need-user-link');
        needUserLink.forEach((noUserLink) => {
            noUserLink.href = 'signinpage.html';
        });
    } else if (inStore) {
        const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
        console.log(inStore);
        let firstname = inStore.username;
        const neednotUser = document.querySelectorAll('.no-user');
        neednotUser.forEach((neednouser)=> {
            neednouser.style.display = 'none';
        })
        document.querySelector('.dashboard-dropdown').innerHTML = `Welcome ${firstname}`
    }

    // VERIFY TOKEN 
    const tokenVerify = () => {
        const path = '/api/v1/users/auth/tokenverify';
        const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
        console.log(inStore);
        if (inStore === null) {
            console.log('token expired');
            toastr.info('session expired, please login');
            localStorage.clear();
            window.location.href = 'signinpage.html';
        } else {
            const { token } = inStore.data;
            const data = {
                token,
            }
            httpPost(path, data, (err, respData, xhttp) => {
                console.log(respData);
                if (err) {
                    console.log(err);
                }  else if (respData.status === 200) {
                        console.log('still on');
                }  else if (respData.status === 403) {
                    toastr.info('session expired');
                    localStorage.clear();
                    window.location.href = "signinpage.html";
                }
            });
        }
    }
    tokenVerify();

    // SIGN OUT
    document.querySelector('.sign-out').onclick = () => {
        localStorage.clear();
        window.location.href = 'signinpage.html';
    }
    
    // USER SVG CLICK
    const arrowUp = document.querySelector('.arrow-up');
    const dropDown = document.querySelector('.dropdown');
    const body = document.querySelector('.body');
    
    // NAV ON MOBILE    
    const nav = document.querySelector('.nav');
    const mainIndex = document.querySelector('.main-index');
    document.querySelector('#nav-toggle').onclick = () => {
        if(nav.className === "nav") {
            nav.className += " responsive";
            mainIndex.className += " responsive";

        }   else {
                nav.className = "nav";
                mainIndex.className = "main-index";
        }
    }

    const getOrder = () => {
        const orderId = window.location.search.slice(1).split("&")[0].split("=")[1];
        const path = `/api/v1/order/${orderId}`;
        httpGet(path, (err, respData, xhttp) => {
            if (err) {
                console.log(err);
            } else if (respData.status === 401){
                toastr.success(respData.error.message);
                window.location.href = "signinpage.html";
            } else {
                console.log(respData)
                document.querySelector('.price').value = respData.data.order[0].amount;
                document.querySelector('.description').value = respData.data.order[0].description;
            }
        })
    }
    getOrder();

    document.querySelector('.order').onsubmit = (e) => {
        e.preventDefault();
        const price_offered = document.querySelector('.price').value;
        const description = document.querySelector('.description').value;

        const data = {
            price_offered,
            description,
        }
        const orderId = window.location.search.slice(1).split("&")[0].split("=")[1];
        const path = `/api/v1/order/${orderId}/`;
        httpPatch(path, data, (err, respData, xhttp) => {
            console.log(respData);
            if (err) {
                console.log(err);
            } else if (respData.status === 401){
                toastr.success(respData.error.message);
                window.location.href = "signinpage.html";
            } else if (respData.status === 200) {
                window.location.href = "myorders.html";
                toastr.success(respData.data.message);
            } else {
                toastr.error(respData.error.message);
            }
        });
    }
});
