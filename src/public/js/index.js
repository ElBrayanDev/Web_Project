function scrollDown() {
  document.querySelector(".others h1").scrollIntoView({ behavior: "smooth" });
}

window.onload = function () {
  //* JavaScript code to handle login and logout
  document.getElementById('loginBtn').addEventListener('click', openNav);

  document.getElementById('registerForm').addEventListener('submit', function (event) {
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      event.preventDefault();
      alert('Passwords do not match');
    }
  });

  //* Add a click event listener to the logout button
  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.body.addEventListener('click', closeNav);
  }

  function closeNav(e) {
    // Check if clicked outside of the side navigation
    if (!document.getElementById('mySidenav').contains(e.target) && e.target.id !== 'loginBtn') {
      document.getElementById("mySidenav").style.width = "0";
      document.body.removeEventListener('click', closeNav);
    }
  }

  //! Register Nav bar
  document.getElementById('registerBtn').addEventListener('click', openRightNav);

  function openRightNav() {
    document.getElementById("myRightSidenav").style.width = "250px";
    document.body.addEventListener('click', closeRightNav);
  }

  function closeRightNav(e) { // Add the event object here
    // Check if clicked outside of the side navigation
    if (!document.getElementById('myRightSidenav').contains(e.target) && e.target.id !== 'registerBtn') {
      document.getElementById("myRightSidenav").style.width = "0";
      document.body.removeEventListener('click', closeRightNav);
    }
  }
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
function closeRightNav() {
  document.getElementById("myRightSidenav").style.width = "0";
}

document.addEventListener('DOMContentLoaded', (event) => {
  document.querySelector('.closebtn').addEventListener('click', closeNav);
  document.querySelector('.closebtn2').addEventListener('click', closeRightNav);
});
