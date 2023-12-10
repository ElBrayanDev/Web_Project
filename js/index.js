function scrollDown() {
  document.querySelector(".others h1").scrollIntoView({ behavior: "smooth" });
}

window.onload = function () {
  // JavaScript code to handle login and logout
  document.getElementById('loginBtn').addEventListener('click', openNav);
  document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Get the username and password from the form
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Send a POST request to the /auth/login route
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });


    //TODO 1: Check if the response is ok
    if (response.ok) {
      // Login successful
      const user = await response.json();
      console.log('Logged in as:', user.username);

      // Store the username in localStorage
      localStorage.setItem('username', username);

      // Update the login button with the username
      document.getElementById('loginBtn').textContent = username;

      // Show the logout button
      document.getElementById('logoutBtn').style.display = 'block';

      // Hide the login form
      document.getElementById('loginForm').style.display = 'none';

      // Display the username
      var usernameDisplay = document.createElement('p');
      usernameDisplay.textContent = 'Logged in as ' + username;
      document.body.appendChild(usernameDisplay);
    } else {
      // Login failed
      console.log('Invalid credentials');
    }
  });

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
