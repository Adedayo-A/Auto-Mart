document.addEventListener('DOMContentLoaded', () => {
    const lineTwo = document.querySelector('.line-two');
    const line = document.querySelector('.line');

    document.querySelector('.log-in').onclick = () => {
        line.style.display = 'block';
        lineTwo.style.display = 'none';
        document.querySelector('.registration-form').style.display = 'none';
        document.querySelector('.login-form').style.display = 'block';
    }

    document.querySelector('.sign-up-pg').onclick = () => {
        lineTwo.style.display = 'block';
        line.style.display = 'none';
        document.querySelector('.login-form').style.display = 'none';
        document.querySelector('.registration-form').style.display = 'block';
    }

    const arrowUp = document.querySelector('.arrow-up');
    const dropDown = document.querySelector('.dropdown');
    const body = document.querySelector('.body');
   
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


    

    const password = document.querySelector('.password-value');
    const searchBoxConfirmPassword = document.querySelector('.search-confirm-password');
    const email = document.querySelector('.email-value');

    searchBoxConfirmPassword.onkeyup = () => {
        if (password.value === '') {
            document.querySelector('.message').style.color = 'red';
            document.querySelector('.message').innerHTML = 'please enter a password';   
        } else if (password.value === searchBoxConfirmPassword.value) {
            document.querySelector('.message').style.color = 'green';
            document.querySelector('.message').innerHTML =  'password matches';
        } else {
            document.querySelector('.message').style.color = 'red';
            document.querySelector('.message').innerHTML = 'password does not match';
        }
    }

    const redirection = () => {
        window.location.href = "../index.html";
    }

    const checkform = () => {
      if (email.value === "") {
        toastr.error("Error: Email cannot be blank!");
        email.focus();
        return false;
      }  
      if (password.value !== "" && password.value == searchBoxConfirmPassword.value) {
        if(password.value.length < 6) {
          toastr.error("Error: Password must contain at least six characters!");
          password.focus();
          document.querySelector('.message').style.color = 'red';
          document.querySelector('.message').innerHTML = 'password must contain at least six characters';
          return false;
        }
        let re = /[0-9]/;
        if (!re.test(password.value)) {
          toastr.error("Error: password must contain at least one number (0-9)!");
          password.focus();
          document.querySelector('.message').style.color = 'red';
          document.querySelector('.message').innerHTML = 'password must contain at least one number (0-9)!'
          return false;
        }
        re = /[a-z]/;
        if (!re.test(password.value)) {
          toastr.error("Error: password must contain at least one lowercase letter (a-z)!");
          password.focus();
          document.querySelector('.message').style.color = 'red';
          document.querySelector('.message').innerHTML = 'password must contain at least one lowercase letter (a-z)!'
          return false;
        }
        re = /[A-Z]/;
        if (!re.test(password.value)) {
          toastr.error("Error: password must contain at least one uppercase letter (A-Z)!");
          password.focus();
          document.querySelector('.message').style.color = 'red';
          document.querySelector('.message').innerHTML = 'password must contain at least one uppercase letter (A-Z)!'
          return false;
        }
      } else {
        toastr.error("Error: Please check that you\'ve entered and confirmed your password correctly!");
        password.focus();
        document.querySelector('.message').style.color = 'red';
        document.querySelector('.message').innerHTML = 'Error: Please check that you\'ve entered and confirmed your password correctly!'
        return false;
      }
      toastr.success(password.value);
    }


    const signupForm = document.querySelector('.registration-form');    
    document.querySelector('.registration-form').onsubmit = (e) => {
        e.preventDefault();
        // checkform();
        const data = {
            email: email.value,
            password: password.value,
            confirm_password: searchBoxConfirmPassword.value,
        };
        console.log(email.value);
        const path = '/api/v1/users/auth/signup';
        httpPost(path, data, (err, respData, xhttp) => {
            console.log(respData);
            if (err) {
                console.log(err);
            }  else if (respData.status === 200) {
                document.querySelector('.response').innerHTML = respData;
                document.querySelector('.response').style.color = 'green';
                localStorage.setItem('loggedInUser', JSON.stringify(respData));
                redirection();
            } else {
                toastr.error(respData.message);
                document.querySelector('.response').style.color = 'red';
            }
        });    
    }

    const response = (element, data) => {
        element.innerHTML = data.message;
    }

    const notificationPort = document.querySelector('.response')

    document.querySelector('.login-form').onsubmit = (e) => {
        e.preventDefault();
        const data = {
            email: document.querySelector('.login-email').value,
            password: document.querySelector('.login-password').value,
        }
        console.log(document.querySelector('.login-email').value);
        console.log(document.querySelector('.login-password').value);
        const path = '/api/v1/users/auth/signin';
        httpPost(path, data, (err, respData, xhttp) => {
            console.log(respData);
            if(err) {
                console.log(err);
            } else if (respData.status === 200) {
                localStorage.setItem('loggedInUser', JSON.stringify(respData.data));
                const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
                console.log(inStore);
                setTimeout(redirection(), 2000);
                toastr.success(respData.data.message);
            } else {
                document.querySelector('.response').style.color = 'red';
                toastr.error(respData.data.message);
            }
        })
    }

    if (localStorage.getItem("loggedInUser") === null) {
        const needUserLink = document.querySelectorAll('.need-user-link');
        needUserLink.forEach((noUserLink) => {
            noUserLink.href = '#';
        });
    } else if (localStorage.getItem("loggedInUser") !== null) {
        const noUser = document.querySelectorAll('.no-user');
        noUser.forEach((user)=> {
            user.style.display = 'none';
        })
    }
    const tokenVerify = () => {
        const path = '/api/v1/users/auth/tokenverify';
        const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
        if (inStore === null) {
            console.log('token expired');
            toastr.info('session expired, please login');
            localStorage.clear();
        } else {
            const { token } = inStore;
            console.log(token);
            const data = {
                token,
            }
            httpPost(path, data, (err, respData, xhttp) => {
                console.log(respData);
                if (err) {
                    console.log(err);
                } else if (respData.status === 200) {
                    inStore;
                }  else if (respData.status === 403) {
                    toastr.info('session expired');
                    localStorage.clear();
                    window.location.href = "signinpage.html";
                    document.querySelector('.message').innerHTML = 'Session Expired! Login required'

                }
            });
        }
    }
    tokenVerify();
});


    // const currPage = document.querySelectorAll('.in-page');
    // currPage.forEach((page) => {
    //     page.style.display = 'none';
    // });
    // const needUser = document.querySelectorAll('.need-user');
    // needUser.forEach((user) => {
    //     user.style.display = 'none';
    // });


    // document.querySelector('.sign-up-pg').onmouseover = () => {
    //     lineTwo.style.display = 'block';
    // }
    
    // document.querySelector('.log-in').onmouseout = () => {
    //     line.style.display = 'none';
    // }

    // document.querySelector('.sign-up-pg').onmouseout = () => {
    //     lineTwo.style.display = 'none';
    // }
    
    // document.querySelector('.log-in').onmouseout = () => {
    //     line.style.display = 'none';
    // }
