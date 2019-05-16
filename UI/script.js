const svg = document.querySelector('.svg');
const arrowUp = document.querySelector('.arrow-up');
const dropDown = document.querySelector('.dropdown');
const dropDownFunc = () => {
    if(arrowUp.style.display == 'none' && dropDown.style.display == 'none') {
        arrowUp.style.display = 'block';
        dropDown.style.display = 'block';
    } else {
        dropDown.style.display = 'none';
        arrowUp.style.display = 'none';
    }
}

const toggleBlock = () => {
    console.log(arrowUp.classList);
    arrowUp.classList.toggle("none");
    dropDown.classList.toggle('none');
}

svg.addEventListener('click', toggleBlock);