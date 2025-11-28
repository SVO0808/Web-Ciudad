// NAVBAR RESPONSIVE
const bars = document.querySelector('.bars');
const navBar = document.querySelector('.nav_bar');

bars.addEventListener('click', () => {
    navBar.classList.toggle('active');
});