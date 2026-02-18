const form = document.querySelector("#registerForm");
const message = document.getElementById("registerMessage");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value.trim();
  message.textContent = "Registering...";

  fetch("https://v2.api.noroff.dev/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password,
      name: name
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.data) {
      message.textContent = "Registration successful! You can now log in.";
      setTimeout(() => {
        window.location.href = "./login.html"; // Redirect to login page after successful registration
      }, 800);
    } else {
      message.textContent = "Registration failed: " + (data.errors?.[0]?.message || "Unknown error");
    }
  })
  .catch(error => {
    console.error("Error occurred:", error);
    message.textContent = "An error occurred during registration.";
  });
}); 