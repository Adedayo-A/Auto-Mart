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
    
    // NAV CLICK ON MOBILE
    const nav = document.querySelector('.nav');
    const backgroundImage = document.querySelector('.backgrnd-image');
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
        if(arrowUp.style.display == 'none' && dropDown.style.display == 'none') {
            arrowUp.style.display = 'block';
            dropDown.style.display = 'block';
        } else {
            dropDown.style.display = 'none';
            arrowUp.style.display = 'none';
        }
    }

    // IMAGE UPLOAD TO CLOUDINARY
    const fileupload =  document.querySelector('.file-upload');
    fileupload.addEventListener('change', (event) => {
        console.log(event);
        const file = event.target.files[0];
        console.log(file);
        let formData = new FormData();
        formData.append('myImage', file);
        
        const path = '/api/v1/upload/';

        httpPostImage(path, formData, (err, respData, xhttp) => {
            if(err) {
                console.log(err);
            } else {
                console.log(respData);
                document.querySelector('.preview').src = respData.image_url;
                // GOOD DATA
                // toastr.success('respData.message');
            }
        })
    });

    // SELECT FIELD MANIPULATION
    const select = document.querySelector('.select-status');

    const sel_man = () => {
        if (select.value === "") {
            document.querySelector('.sold').style.display = 'none';
        } else {
            document.querySelector('.sold').style.display = 'block';
        }
    }
    sel_man();

    // FORM SUBMIT
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
        const path = '/api/v1/car/';

        httpPostCar(path, data, (err, respData, xhttp) => {
            if(err) {
                console.log(err);
            } else if (respData.status === 200) {
                console.log(respData);
                // GOOD DATA
                toastr.success(respData.message);
                // window.location.href = "ads.html";
            } else {
                console.log(respData);
                // BAD DATA
                toastr.error(respData.message);
            }
        });
    }
});
    