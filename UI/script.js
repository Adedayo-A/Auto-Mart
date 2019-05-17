const svg = document.querySelector('.svg');
const arrowUp = document.querySelector('.arrow-up');
const dropDown = document.querySelector('.dropdown');
const bodySignup = document.querySelector('.body-signup');
const report = document.querySelector('.report');
const hid = document.querySelector('#hide');
const sectionResult = document.querySelector('.section-result');
const close = document.querySelector('.close');

console.log(report);
console.log(hid);

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

const showReport = () => {
    if(hid.className === 'hid') {
        hid.className = 'show';
    }
    else if (hid.className === 'show') {
        hid.className = 'hid';
    }
}

svg.addEventListener('click', toggleBlock);
report.addEventListener('click', showReport);
close.addEventListener('click', ()=>{
    if(hid.className === 'show') {
        hid.className = 'hid';
    }
})
