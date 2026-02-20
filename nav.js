document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const OWNER = "naima_05521";

  const isLoggedIn = Boolean(token);
  const isOwner = isLoggedIn && name === OWNER;

  // Detect where we are: root, /post/, or /account/
  const path = window.location.pathname;
  const inPost = path.includes("/post/");
  const inAccount = path.includes("/account/");

  const homeHref = (inPost || inAccount) ? "../index.html" : "./index.html";
  const createHref = inPost ? "./create.html" : (inAccount ? "../post/create.html" : "./post/create.html");
  const loginHref = inAccount ? "./login.html" : (inPost ? "../account/login.html" : "./account/login.html");
  const registerHref = inAccount ? "./register.html" : (inPost ? "../account/register.html" : "./account/register.html");

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    window.location.href = homeHref;
  }

  nav.innerHTML = `
    <a href="${homeHref}">Home</a>
    ${isOwner ? `<a href="${createHref}">Create Post</a>` : ""}
    ${
      isLoggedIn
        ? `<a href="#" id="logoutBtn">Logout</a>`
        : `
          <a href="${loginHref}">Login</a>
          <a href="${registerHref}">Register</a>
        `
    }
  `;

  if (isLoggedIn) {
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
  }
});

