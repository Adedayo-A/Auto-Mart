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
})