const svg = document.querySelector('.svg-img');
const arrowUp = document.querySelector('.arrow-up');
const dropDown = document.querySelector('.dropdown');
const bodySignup = document.querySelector('.body-signup');
const report = document.querySelector('.report');
const hid = document.querySelector('#hide');
const sectionResult = document.querySelector('.section-result');
const lineTwo = document.querySelector('.line-two');
const line = document.querySelector('.line');
const close = document.querySelector('.close');
const noLine = document.querySelector('.no-line');
const logIn = document.querySelector('.log-in');
const signUp = document.querySelector('.sign-up-pg');
const sixChar = document.querySelector('.p-char');
const paraConfirmPassword = document.querySelector('.p-signin-2');
const searchBoxConfirmPassword = document.querySelector('.search-confirm-password');
const signInButton = document.querySelector('.button');
const forgotPassword = document.querySelector('.forgot-p');
const editButton = document.querySelector('.edit');
const editSlide = document.querySelector('.edit-pop-up');
const wrapAll = document.querySelector('.wrap-all');


const editSlider = () => {
    editSlide.classList.toggle('edit-pop-down');
    wrapAll.classList.add('hide-edit')
}

editButton.addEventListener('click', editSlider);

const clickLogin = () => {
    // if (line.style.display=== 'none') {
        line.style.display = 'block';
        lineTwo.style.display = 'none';
        sixChar.style.display = 'none';
        paraConfirmPassword.style.display = 'none';
        searchBoxConfirmPassword.style.display = 'none';
        signInButton.value = 'Login';
        forgotPassword.style.display = 'block';
    
    // if(noLine.className === 'no-line') {
    //     return displayLogin();
    // } else if (lineTwo.className === 'no-line') {
    //     return displaySignup();
    // }
}

const clickSignup = () => {
    lineTwo.style.display = 'block';
    line.style.display = 'none';
    sixChar.style.display = 'block';
    paraConfirmPassword.style.display = 'block';
    searchBoxConfirmPassword.style.display = 'block';
    signInButton.value = 'Sign up';
    forgotPassword.style.display = 'none';
}

const mouseOverLogin = () => {
    line.style.display = 'block';
}


const mouseOverSignup = () => {
    lineTwo.style.display = 'block';
}

const mouseOutLogin = () => {
    line.style.display = 'none';
}

const mouseOutSignup = () => {
    lineTwo.style.display = 'none';
}

logIn.addEventListener('mouseover', mouseOverLogin);
signUp.addEventListener('mouseover', mouseOverSignup);

logIn.addEventListener('mouseout', mouseOutLogin);
signUp.addEventListener('mouseout', mouseOutSignup);

logIn.addEventListener('click', clickLogin);
signUp.addEventListener('click', clickSignup);

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

document.querySelector( "#nav-toggle" )
  .addEventListener( "click", function() {
    this.classList.toggle( "active" );
  });