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
    document.querySelector('#nav-toggle').onclick = () => {
        if(nav.className === "nav") {
            nav.className += " responsive";
        }   else {
                nav.className = "nav";
        }
    }

    // GET USER ORDERS
    const getUserOrders = () => {
        const path = '/api/v1/order/user';
        httpGet(path, (err, response, xhttp) => {
            if (err) {
                toastr.error('An error occured');
                console.log(err);
            } else if (response.status === 401) {
                toastr.info('Session expired');
                window.location.href = 'signinpage.html';
            } else if (response.state === 'success') {
                console.log(response);
                toastr.info(response.message);
                const orderdetails = response.orders
                let output = '';
                for (let i in orderdetails) {
                    const image = orderdetails[i].image || 'N/A';
                    const carId = orderdetails[i].car_id || 'N/A';
                    const manufacturer = orderdetails[i].manufacturer || 'N/A';
                    const model = orderdetails[i].model || 'N/A';
                    const status = orderdetails[i].status || 'N/A';
                    const priceOffered = orderdetails[i].amount || 'N/A';
                    const orderId = orderdetails[i].id || 'N/A';
                    output += `<div class="div-result-wrap wrap-all">
                        <div class="wrapper-result one">
                            <div class="card-pictures">
                                <a href="an_order.html?orderid=${orderId}">
                                    <img src= ${image} />
                                </a>
                            </div>
                            <div class="card-stories">
                                <div class="div-inside-card">
                                    <h4 class="first-heading-card-stories"> Car id: ${carId} </h4>
                                    <h4 class="first-heading-card-stories"> Manufacturer: ${manufacturer} </h4>
                                    <h4 class="first-heading-card-stories"> Model: ${model} </h4>
                                    <h4 class="first-heading-card-stories"> Status of Order: ${status} </h4>
                                    <h3 class="heading-price-card-stories"> Price Offered: ${priceOffered} </h3>
                                    <button class="edit"> <a href="an_order.html?orderid=${orderId}"> View Order </a> </button>
                                </div>
                                <p class="para-delete-card-stories">
                                    <button class="edit"><a href="editorder.html?orderid=${orderId}">Update</a></button>
                                    <button class="delete"> Cancel Order </button>
                                </p>
                            </div>
                        </div>
                    </div>`
                }
                const deleteOrder = (e) => {
                    const targ = e.target.value;
                    path = `/api/v1/order/${targ}/`;
                    httpDelete( path, (err, response, xhttp) => {
                        if (err) {
                            toastr.error('An error occured');
                            console.log(err);
                        } else {
                            toastr.success(response.message)
                        }
                    })
                }
                document.querySelector('.delete').onclick = deleteOrder;
                document.querySelector('.section-result').innerHTML = output;                
            } else {
                console.log(response);
                toastr.info('An error occured');
            }
        })
    }
    getUserOrders();
});