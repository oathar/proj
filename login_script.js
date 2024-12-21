// Function to show the Sign Up page and hide the Sign In page
function showSignup() {
    document.getElementById('signup_main').style.display = 'block';
    document.getElementById('signin_main').style.display = 'none';
}

// Function to show the Sign In page and hide the Sign Up page
function showSignin() {
    document.getElementById('signup_main').style.display = 'none';
    document.getElementById('signin_main').style.display = 'block';
}

// Sign Up Form Handler
let signupForm = document.querySelector(".form-signup");

signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let name = document.getElementById("signup-name").value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;

    // Check if user is already registered
    if (localStorage.getItem(email)) {
        alert("Already a user");
    } else {
        // Store new user credentials in localStorage
        localStorage.setItem(email, JSON.stringify({ name, password }));
        alert("Welcome new user");
    }
});

// Sign In Form Handler
let signinForm = document.querySelector(".form-signin");

document.getElementById('login-btn').addEventListener("click", (e) => {
    e.preventDefault();  // Prevent form submission from reloading the page

    let email = document.getElementById("signin-email").value;
    let password = document.getElementById("signin-password").value;

    // Retrieve user details from localStorage
    let user = JSON.parse(localStorage.getItem(email));

    if (user && user.password === password) {
        alert("Login successful");
        localStorage.setItem('currentUser', email); // Store the current user in localStorage
        window.location.href = "./index.html";  // Redirect to the dashboard page after login
    } else {
        alert("Invalid login credentials");
    }
});