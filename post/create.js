const form = document.getElementById("createForm");
const message = document.getElementById("message");


const OWNER = "naima_05521";

// Check if user is logged in 
const token = localStorage.getItem("token");
const name = localStorage.getItem("name"); 


const isOwner = Boolean(token) && name === OWNER;

if (!isOwner) {
  alert("only the owner can create posts. Please log in with the correct account.");
  window.location.href = "../account/login.html";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim();
  const mediaUrl = document.getElementById("imgUrl").value.trim();
  const mediaAlt = document.getElementById("imgAlt").value.trim();
  if (!title) {
    message.textContent = "Title is required.";
    return;
  }
  const payload = {title}; 
  if (body) payload.body = body;
  if (mediaUrl) {
    payload.media = { url: mediaUrl, alt: mediaAlt || title };
  }

  message.textContent = "Creating post...";

  fetch(`https://v2.api.noroff.dev/blog/posts/${OWNER}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  })

    .then((res) => {
      return res.json().then((data) => {
        console.log("Response from API:", data);

        if (!res.ok) {
          message.textContent = "Failed to create post: " + (data.errors?.[0]?.message || "unknown error");
        return;
        }

        const newPostId = data.data.id;
        if (!newPostId) {
          message.textContent = "Post created but no ID returned.";
          return;
        }

        message.textContent = "Post created successfully!";
        form.reset();
        setTimeout(() => {
          window.location.href = `./index.html?id=${newPostId}`;
        }, 800);
      });
    })
    .catch((error) => {
      console.error("Error creating post:", error);
      message.textContent = "Error creating post.";
    });
});