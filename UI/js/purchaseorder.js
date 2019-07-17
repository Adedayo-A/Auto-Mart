document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.nav');
    const backgroundImage = document.querySelector('.backgrnd-image');
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
    
    // NAV ON MOBILE
    document.querySelector('#nav-toggle').onclick = () => {
        if(nav.className === "nav") {
            nav.className += " responsive";
            backgroundImage.className += " responsive";

        }   else {
                nav.className = "nav";
                backgroundImage.className = "backgrnd-image";
        }
    }
    
    // USER SVG CLICK
    const arrowUp = document.querySelector('.arrow-up');
    const dropDown = document.querySelector('.dropdown');
    const body = document.querySelector('.body');
    
    document.querySelector('.img-svg').onclick = () => {
        if (arrowUp.style.display == 'none' && dropDown.style.display == 'none') {
            arrowUp.style.display = 'block';
            dropDown.style.display = 'block';
        } else {
            dropDown.style.display = 'none';
            arrowUp.style.display = 'none';
        }
    }

    // SUBMIT PURCHASE ORDER
    document.querySelector('.order').onsubmit = (e) => {
        e.preventDefault();
        const price_offered = document.querySelector('.price').value;
        const description = document.querySelector('.description').value;

        const data = {
            price_offered,
            description,
        } 
        const postId = window.location.search.slice(1).split("&")[0].split("=")[1];
        path = `/api/v1/order/${postId}`;
        httpPost(path, data, (err, response, xhttp) => {
            if (err) {
                toastr.error('An error occured');
                console.log(err);
            } else if (response.status === 401) {
                toastr.info('session expired');
                window.location.href = "signinpage.html";
            } else if (response.status === 200) {
                console.log(response);
                // GOOD DATA
                toastr.success(response.data.message);
                window.location.href = "ads.html";
            } else {
                console.log(response);
                // BAD DATA
                toastr.error(response.error.message);
            }
        });
    }
})