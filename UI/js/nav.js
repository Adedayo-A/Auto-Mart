document.addEventListener('DOMContentLoaded', () => {
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
})
    