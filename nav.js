document.addEventListener("DOMContentLoaded", () => {
    const nav = document.getElementById("nav");
    if (!nav) return

    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const OWNER = "naima_05521";

    const isLoggedIn = Boolean(token);
    const isOwner = isLoggedIn && name === OWNER;
    function logout(e) {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("username");
        window.location.href = "./index.html";
    }

    nav.innerHTML = `
        <a href="./index.html">Home</a>
        ${isOwner ? `<a href="./post/create.html">Create Post</a>` : ""}
        ${isLoggedIn ? `<a href="#" id="logoutBtn">Logout</a>` : `
            <a href="./account/login.html">Login</a>
            <a href="./account/register.html">Register</a>
        `}
    `;

    if (isLoggedIn) {
        document.getElementById("logoutBtn").addEventListener("click", logout);
    }
});

