document.addEventListener('DOMContentLoaded', () => {
 
  const signupBox = document.getElementById('signupbox');
  const loginBox = document.getElementById('loginbox');
  const signUpLink = document.getElementById('signUpLink');
  const signInLink = document.getElementById('signInLink');

  signUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupBox.style.display = 'block';
    loginBox.style.display = 'none';
  });

  signInLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupBox.style.display = 'none';
    loginBox.style.display = 'block';
  });

 
  document.getElementById('signupButton').addEventListener('click', async () => {
    await window.signup();
  });

  document.getElementById('loginButton').addEventListener('click', async () => {
    await window.signin();
  });
});

// Signup function
window.signup = async function() {
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  try {
    await axios.post("http://localhost:3000/signup", {
      username: username,
      password: password
    });
    alert("Signed up successfully");
   
    document.getElementById('signupbox').style.display = 'none';
    document.getElementById('loginbox').style.display = 'block';
  } catch (error) {
    console.error("Signup error:", error);
    alert("Signup failed. Please try again.");
  }
}

// Signin function
window.signin = async function() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  if (!username || !password) {
    alert('Please enter both username and password.');
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/signin", {
      username: username,
      password: password
    });
    localStorage.setItem("token", response.data.token);
    alert("Signed in successfully");
    // Redirect to the todos page
    window.location.href = 'todos.html'; 
  } catch (error) {
    console.error("Signin error:", error);
    alert("Signin failed. Please check your credentials and try again.");
  }
}
