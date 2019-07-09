document.addEventListener('DOMContentLoaded', () => {
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

    const arrowUp = document.querySelector('.arrow-up');
    const dropDown = document.querySelector('.dropdown');
    const body = document.querySelector('.body');
    
    document.querySelector('.img-svg').onclick = () => {
        if(arrowUp.style.display === 'none' && dropDown.style.display == 'none') {
            arrowUp.style.display = 'block';
            dropDown.style.display = 'block';
        } else {
            dropDown.style.display = 'none';
            arrowUp.style.display = 'none';
        }
    }

    if (localStorage.getItem("loggedInUser") === null) {
        const needUser = document.querySelectorAll('.need-user');
        needUser.forEach((user) => {
            user.style.display = 'none';
        });
        const needUserLink = document.querySelectorAll('.need-user-link');
        needUserLink.forEach((noUserLink) => {
            noUserLink.href = 'UI/signinpage.html';
        });
    } else if (localStorage.getItem("loggedInUser") !== null) {
        const inStore = JSON.parse(localStorage.getItem('loggedInUser'));
        const firstname = inStore.username;
        const neednotUser = document.querySelectorAll('.no-user');
        neednotUser.forEach((user)=> {
            user.style.display = 'none';
        })
        document.querySelector('.dashboard-dropdown').innerHTML = `Welcome ${firstname}`
    }

    document.querySelector('.sign-out').onclick = () => {
        localStorage.clear();
    }

})
