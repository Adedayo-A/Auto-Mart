document.addEventListener('DOMContentLoaded', () => {
    const arrowUp = document.querySelector('.arrow-up');
    const dropDown = document.querySelector('.dropdown');
    const body = document.querySelector('.body');
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
    const token_verify = () => {
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
                }  else if (respData.status === 401) {
                    toastr.info('session expired');
                    localStorage.clear();
                    window.location.href = "signinpage.html";
                }
            });
        }
    }
    token_verify();

    // SIGN OUT
    document.querySelector('.sign-out').onclick = () => {
        localStorage.clear();
        window.location.href = 'signinpage.html';
    }

    
    // CLICK USER SVG
    document.querySelector('.img-svg').onclick = () => {
        if(arrowUp.style.display == 'none' && dropDown.style.display == 'none') {
            arrowUp.style.display = 'block';
            dropDown.style.display = 'block';
        } else {
            dropDown.style.display = 'none';
            arrowUp.style.display = 'none';
        }
    }

    // NAV TOGGLE CLICK ON MOBILE
    const nav = document.querySelector('.nav');
    const firstImage = document.querySelector('.one');
    const filterResults = document.querySelector('.filter-results');
    const reportForm = document.querySelector(".report-form");
    
    document.querySelector('#nav-toggle').onclick = () => {
        if(nav.className === "nav") {
            nav.className += " responsive";
            firstImage.className += " responsive";
            filterResults.className += " responsive";
            reportForm.className +=  " show" + " responsive";
        }   else {
                nav.className = "nav";
                firstImage.className = "one";
                filterResults.className = "filter-results";
                reportForm.className += ".report-form.show";
        }
    }

    // GET SPECIFIC AD
    const get_an_ad = () => {
        const postId = window.location.search.slice(1).split("&")[0].split("=")[1];
        console.log(postId);
        path = `/api/v1/car/${postId}`;
        httpGet(path, (err, response, xhttp) => {
            if (err) {
                toastr.error('An error occured');
                console.log(err);
            } else if (response.status === 401) {
                toastr.info('session expired');
                window.location.href = "signinpage.html";
            } else if (response.data.state === 'success') {
                console.log(response);
                toastr.info(response.data.message);
                const cars = response.data.car_ad;
                let output = '';
                for (var i in cars) {
                    const adId = cars[i].id || 'N/A';
                    const delButton = `<button class="deleteone" value="${adId}"> Delete AD </button>`;
                    const int_color = cars[i].int_color || 'N/A';
                    const image = cars[i].image_url || 'N/A';
                    const price = cars[i].state || 'N/A';
                    const manufacturer = cars[i].manufacturer || 'N/A';
                    const ext_color = cars[i].ext_color || 'N/A';
                    const transmission = cars[i].transmission || 'N/A'; 
                    const mileage = cars[i].mileage || 'N/A'; 
                    const body_type = cars[i].body_type || 'N/A';
                    const model = cars[i].model || 'N/A';
                    const state = cars[i].state || 'N/A';
                    const door = cars[i].door || 'N/A';
                    const description = cars[i].description || 'N/A';
                    const status = cars[i].status || 'N/A';
                    output += 
                     `<div class="div-result-wrap wrap-all">
                            <div class="wrapper-result one">
                                <div class="card-pictures"><img src= ${image} /> </div>
                                <div class="card-stories">
                                    <div class="div-inside-card">
                                        <h4 class="first-heading-card-stories"> State of Car: ${state} </h4>
                                        <h3 class="heading-price-card-stories"> Price of Car: ${price} </h3>
                                        <h4 class="heading-make-card-stories"> Manufacturer: ${manufacturer} </h4>
                                        <h4 class="heading-make-card-stories"> Model: ${model} </h4>
                                        <h4 class="heading-make-card-stories"> Interior color: ${int_color} </h4>
                                        <h4 class="heading-make-card-stories"> Exterior color: ${ext_color} </h4>
                                        <h4 class="heading-make-card-stories"> Transmission: ${transmission} </h4>
                                        <h4 class="heading-make-card-stories"> Mileage: ${mileage} </h4>
                                        <h4 class="heading-make-card-stories"> Body Type: ${body_type} </h4>
                                        <h4 class="heading-make-card-stories"> Door: ${door} </h4>
                                        <h4 class="heading-make-card-stories"> Description: ${description} </h4>  
                                        <p class="para-status-card-stories">
                                            <span> Availability: ${status} </span>
                                        </p>
                                        <p>
                                            <button class="viewone"><a href="purchase-order.html?adId=${adId}">Make a purchase order</a></button>
                                        </p>
                                        <p>
                                            <button class="editone">Flag</button>
                                            ${inStore.admin ? delButton: ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>`
                }
                const delete_ad = (e) => {
                    console.log('targ');
                    const targ = e.target.value;
                    console.log(targ);
                    const path = `/api/v1/car/${targ}/`;
                    httpDelete( path, (err, response, xhttp) => {
                        if (err) {
                            toastr.error('An error occured');
                            console.log(err);
                        } else {
                            console.log(response);
                            toastr.success(response.data.message);
                            window.location.href = '../index.html';
                        }
                    })
                }
                
                document.querySelector('.section-result').innerHTML = output;
                if (inStore.admin) {
                    document.querySelector('.deleteone').onclick = delete_ad;
                }
            } else {
                console.log(response);
                toastr.info(response.message);
            }
        })
    }
    get_an_ad();
});
