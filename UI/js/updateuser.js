document.addEventListener('DOMContentLoaded', () => {

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


    // USER SVG CLICK
    const arrowUp = document.querySelector('.arrow-up');
    const dropDown = document.querySelector('.dropdown');
    document.querySelector('.img-svg').onclick = () => {
        if(arrowUp.style.display == 'none' && dropDown.style.display == 'none') {
            arrowUp.style.display = 'block';
            dropDown.style.display = 'block';
        } else {
            dropDown.style.display = 'none';
            arrowUp.style.display = 'none';
        }
    }

    // REDIRECT TO HOMEPAGE
    const redirection = () => {
        window.location.href = "../index.html";
    }

    // GET USER PROFILE
    const getuser = () => {
        const path = '/api/v1/users/auth/getuser';
        httpGet(path, (err, respData, xhttp) => {
            if (err) {
                console.log(err);
            } else {
                console.log(respData);
                document.querySelector('.status').value = respData.status;
                document.querySelector('.update-lastname').value = respData.last_name;
                document.querySelector('.update-address').value = respData.address;
                if (respData.first_name !== null && respData.last_name !== null && respData.address != null) {
                    toastr.info('Your profile is up to date');
                } else {
                    toastr.info('Complete your profile!!');
                }
            }
        })
    }
    getuser();

    // UPDATED USER RESUBMITTED
    document.querySelector('.update-profile').onsubmit = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        const first_name = document.querySelector('.update-firstname').value;
        const last_name = document.querySelector('.update-lastname').value;
        const address = document.querySelector('.update-address').value;
        const data = {
            first_name,
            last_name,
            address,            
        };
        console.log(data);
        const path = '/api/v1/users/auth/update';
        httpPatch(path, data, (err, respData, xhttp) => {
            console.log(respData);
            if (err) {
                console.log(err);
            } else if (respData.status === 200) {
                localStorage.setItem('loggedInUser', JSON.stringify(respData));
                toastr.success(respData.message);
                redirection();
            } else {
                toastr.error(respData.message);
                document.querySelector('.response').style.color = 'red';
            }
        });
    }
});