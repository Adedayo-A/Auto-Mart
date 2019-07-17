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
            const { token } = inStore.data;
            const data = {
                token,
            }
            httpPost(path, data, (err, respData, xhttp) => {
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
    
    document.querySelector('.img-svg').onclick = () => {
        if(arrowUp.style.display == 'none' && dropDown.style.display == 'none') {
            arrowUp.style.display = 'block';
            dropDown.style.display = 'block';
        } else {
            dropDown.style.display = 'none';
            arrowUp.style.display = 'none';
        }
    }

    // FLAG SUBMIT
    document.querySelector('.report').onsubmit = (e) => {
        e.preventDefault();
        const info = document.querySelector('.info').value;
        console.log(info);
        const data = {
            info,
        } 
        const adId = window.location.search.slice(1).split("&")[0].split("=")[1];
        const path = `/api/v1/flag/${adId}`;
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
                window.location.href = "../index.html";
            } else {
                console.log(response);
                // BAD DATA
                toastr.error(response.error.message);
            }
        });
    }

});

    // const nav = document.querySelector('.nav');
    // const firstImage = document.querySelector('.one');
    // const filterResults = document.querySelector('.filter-results');
    // const reportForm = document.querySelector(".report-form");
    // document.querySelector('#nav-toggle').onclick = () => {
    //     if(nav.className === "nav") {
    //         nav.className += " responsive";
    //         firstImage.className += " responsive";
    //         filterResults.className += " responsive";
    //         reportForm.className +=  " show" + " responsive";
    //     }   else {
    //             nav.className = "nav";
    //             firstImage.className = "one";
    //             filterResults.className = "filter-results";
    //             reportForm.className += ".report-form.show";
    //         }
    // }