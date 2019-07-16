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
            noUserLink.href = 'UI/signinpage.html';
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
            window.location.href = 'UI/signinpage.html';
        } else {
            const token = inStore.token;
            const data = {
                token: token,
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
                    window.location.href = "./UI/signinpage.html";
                }
            });
        }
    }
    tokenVerify();

    // SIGN OUT
    document.querySelector('.sign-out').onclick = () => {
        localStorage.clear();
        window.location.href = 'UI/signinpage.html';
    }
    
    // USER SVG CLICK
    const arrowUp = document.querySelector('.arrow-up');
    const dropDown = document.querySelector('.dropdown');
    const body = document.querySelector('.body');
    
    // NAV CLICK ON MOBILE    
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


    // GET SPECIFIC AD
    const getAd = () => {
        const adId = window.location.search.slice(1).split("&")[0].split("=")[1];
        console.log(adId);
        const path = `/api/v1/car/${adId}`;
        httpGet(path, (err, respData, xhttp) => {
            if (err) {
                console.log(err);
            } else {
                console.log(respData);
                document.querySelector('.status').value = respData.carad[0].status || '';
                document.querySelector('.state').value = respData.carad[0].state || '';
                document.querySelector('.manufacturer').value = respData.carad[0].manufacturer || '';
                document.querySelector('.model').value = respData.carad[0].model || '';
                document.querySelector('.body_type').value = respData.carad[0].body_type || '';
                document.querySelector('.amount').value = respData.carad[0].price || '';
                document.querySelector('.ext_col').value = respData.carad[0].ext_col || '';
                document.querySelector('.int_col').value = respData.carad[0].int_col || '';
                document.querySelector('.transmission').value = respData.carad[0].transmission || '';
                document.querySelector('.mileage').value = respData.carad[0].mileage || '';
                document.querySelector('.doors').value = respData.carad[0].door || '';
                document.querySelector('.description').value = respData.carad[0].description || '';
                document.querySelector('.preview').src = respData.carad[0].image_url || '';        
            }
        })
    }
    getAd();

    // UPDATE AD SUBMIT
    document.querySelector('.post').onsubmit = (e) => {
        e.preventDefault();
        const status = document.querySelector('.status').value;
        const state = document.querySelector('.state').value;
        const manufacturer = document.querySelector('.manufacturer').value;
        const model = document.querySelector('.model').value;
        const body_type = document.querySelector('.body_type').value;
        const price = document.querySelector('.amount').value;
        const ext_col = document.querySelector('.ext_col').value;
        const int_col = document.querySelector('.int_col').value;
        const transmission = document.querySelector('.transmission').value;
        const mileage = document.querySelector('.mileage').value;
        const door = document.querySelector('.doors').value;
        const description = document.querySelector('.description').value;
        const image_url = document.querySelector('.preview').src;
        
        data = {
            status,
            state,
            manufacturer,
            model,
            body_type,
            price,
            ext_col,
            int_col,
            transmission,
            mileage,
            door,
            description,
            image_url,
        }
        const adId = window.location.search.slice(1).split("&")[0].split("=")[1];
        const path = `/api/v1/car/${adId}/`;

        httpPatch(path, data, (err, respData, xhttp) => {
            if(err) {
                console.log(err);
            } else if (respData.status === 200) {
                console.log(respData);
                // GOOD DATA
                toastr.success(respData.message);
                window.location.href = "ads.html";
            } else {
                console.log(respData);
                // BAD DATA
                toastr.error(respData.message);
            }
        });
    }
});