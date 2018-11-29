let app = new Vue({
    el: '#app',
    data: {
        messages: [],
        username: "funnbot"
    }
});
var dropdown = document.querySelector('.dropdown');
var global = document.querySelector('html');
var deletemsg = document.getElementById('deletemsg');
var profile = document.getElementById('profile');
var profile_modal = document.getElementById('profile_modal');
var profile_modal_close = document.getElementById('profile_modal_close');

dropdown.addEventListener('click', (event) => {
    event.stopPropagation();
    dropdown.classList.toggle('is-active');
});
// Closes the dropdown if anything else is clicked. ^ Takes priority if dropdown is clicked.
global.addEventListener('click', (event) => {
    // event.stopPropagation(); disabled for now, might need to use this in other things
    dropdown.classList.remove('is-active');
});
deletemsg.addEventListener('click', (event) => {

    // Check if id/snowflake matchs with msg author id/snowflake in database
});
profile.addEventListener('click', (event) => {
    profile_modal.classList.add('is-active');
});
profile_modal_close.addEventListener('click', (event) => {
    profile_modal.classList.remove('is-active');
});
