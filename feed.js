window.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('username');
    if(user) {
        let elem = document.querySelector('#userInfo');
        elem.textContent = user;
        elem.style.fontSize = "12px";
        elem.style.alignSelf = 'center';
        elem.style.height = '25px';
    }
});