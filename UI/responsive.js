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

})
