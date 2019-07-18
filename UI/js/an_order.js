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
            const { token } = inStore.data;
            console.log(token);
            const data = {
                token,
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

    // GET SPECIFIC ORDER
    const get_an_order = () => {
        const postId = window.location.search.slice(1).split("&")[0].split("=")[1];
        console.log(postId);
        const path = `/api/v1/order/${postId}`;
        httpGet(path, (err, response, xhttp) => {
            if (err) {
                toastr.error('An error occured');
                console.log(err);
            } else if (response.status === 401) {
                toastr.info('session expired');
                window.location.href = "signinpage.html";
            } else if (response.data.state === 'success') {
                console.log(response);
                const orderdetails = response.data.order;
                let output = '';
                for (var i in orderdetails) {
                    const orderId = orderdetails[i].id || 'N/A';
                    const isaccepted = orderdetails[i].status == 'accepted';
                    const updtButton = `<button class="edit"><a href="editorder.html?orderid=${orderId}">Update</a></button>`;
                    const canclButton = `<button class="delete" value="${orderId}"> Cancel Order </button>`;
                    const image = orderdetails[i].image || 'N/A';
                    const carId = orderdetails[i].car_id || 'N/A';
                    const manufacturer = orderdetails[i].manufacturer || 'N/A';
                    const model = orderdetails[i].model || 'N/A';
                    const status = orderdetails[i].status || 'N/A';
                    const priceOffered = orderdetails[i].amount || 'N/A';
                    output += `<div class="div-result-wrap wrap-all">
                        <div class="wrapper-result one">
                            <div class="card-pictures">
                                    <img src= ${image} />
                            </div>
                            <div class="card-stories">
                                <div class="div-inside-card">
                                    <h4 class="first-heading-card-stories"> Car id: ${carId} </h4>
                                    <h4 class="first-heading-card-stories"> Manufacturer: ${manufacturer} </h4>
                                    <h4 class="first-heading-card-stories"> Model: ${model} </h4>
                                    <h4 class="first-heading-card-stories"> Status of Order: ${status} </h4>
                                    <h3 class="heading-price-card-stories"> Price Offered: ${priceOffered} </h3>
                                </div>
                                <p class="para-delete-card-stories">
                                ${!isaccepted ? updtButton:''}
                                ${!isaccepted ? canclButton:''}
                                </p>
                            </div>
                        </div>
                    </div>`
                }
                document.querySelector('.section-result').innerHTML = output;
                const delete_order = (e) => {
                    const targ = e.target.value;
                    const path = `/api/v1/order/${targ}/`;
                    httpDelete( path, (err, response, xhttp) => {
                        if (err) {
                            toastr.error('An error occured');
                            console.log(err);
                        } else {
                            toastr.success(response.data.message)
                            window.location.href = 'myorders.html';
                        }
                    })
                }
                document.querySelector('.delete').onclick = delete_order;
                toastr.info(response.data.message);
                
            } else {
                console.log(response);
                toastr.info(response.message);
            }
        })
    }
    get_an_order(); 
});
