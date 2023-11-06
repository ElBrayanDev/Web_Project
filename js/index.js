function scrollDown() {
  document.querySelector(".others h1").scrollIntoView({ behavior: "smooth" });
}

window.onload = function () {
  // JavaScript code to handle login and logout
  document.getElementById('loginBtn').addEventListener('click', openNav);
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the username from the form
    var username = document.getElementById('username').value;

    // Store the username in localStorage
    localStorage.setItem('username', username);

    // Redirect back to this page
    window.location.href = 'index.html';
  });

  // Check if a user is logged in
  var username = localStorage.getItem('username');
  if (username) {
    // Update the login button with the username
    document.getElementById('loginBtn').textContent = username;

    // Show the logout button
    document.getElementById('logoutBtn').style.display = 'block';

    // Hide the login form
    document.getElementById('loginForm').style.display = 'none';

    // Display the username
    var usernameDisplay = document.createElement('p');
    usernameDisplay.className = 'username-display'; // Add a class
    usernameDisplay.innerHTML = 'Logged in as: <br> <br>' + username;
    document.getElementById('mySidenav').appendChild(usernameDisplay);
  }

  // Add a click event listener to the logout button
  document.getElementById('logoutBtn').addEventListener('click', function () {
    // Remove the username from localStorage
    localStorage.removeItem('username');

    // Refresh the page
    location.reload();
  });
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

  //! THIS IS NEW

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

  document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get the user data from the form
    var username = document.getElementById('regUsername').value;
    var email = document.getElementById('regEmail').value;
    var password = document.getElementById('regPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    // Check if the passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Store the user data in localStorage in JSON format
    var userData = {
      username: username,
      email: email,
      password: password
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    // Redirect back to this page
    window.location.href = 'index.html';
  });

}

/*
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  localStorage.setItem('username', username);
  localStorage.setItem('password', password);
  location.reload();
}*/

if (localStorage.getItem('username')) {
  document.getElementById('loginBtn').innerText = localStorage.getItem('username');
  // Add logout button to the navigation bar
  const logoutBtn = document.createElement('button');
  logoutBtn.innerText = 'Logout';
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    location.reload();
  });
  document.getElementById('mySidenav').appendChild(logoutBtn);
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
function closeRightNav() {
  document.getElementById("myRightSidenav").style.width = "0";
}
document.querySelector('.closebtn').addEventListener('click', closeNav);
document.querySelector('.closebtn2').addEventListener('click', closeRightNav);
