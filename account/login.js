const form = document.querySelector("#loginForm");
const message = document.getElementById("loginMessage");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "Logging in...";

  fetch("https://v2.api.noroff.dev/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log("API response:", data);
    //if login fails, data.data will be null and data.error will contain the error message
    if (!data.data) {
      message.textContent = data.errors?.[0]?.message || "Login failed: Unknown error";
      return;
    }

    const accessToken = data.data.accessToken;
    const displayName = data.data.name; 
    localStorage.setItem("token", accessToken);
    localStorage.setItem("name", displayName);

    console.log("stored:", {
      token: !!accessToken,
      name: displayName,
    }); 
    message.textContent = "Login successful!";
    window.location.href = "/index.html"; // Redirect to homepage after successful login
  })
  .catch(error => {
    console.error("Error occurred:", error);
    message.textContent = "An error occurred during login.";
  }); 

});
