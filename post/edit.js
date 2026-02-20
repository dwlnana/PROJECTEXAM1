const token = localStorage.getItem("token");
const name = localStorage.getItem("name");
const OWNER = "naima_05521";

const message = document.getElementById("message");
const form = document.getElementById("editForm");
const deleteBtn = document.getElementById("deleteBtn");

if (!token || name !== OWNER) {
  alert("You must be logged in as the owner to edit a post.");
  window.location.href = "../account/login.html";
}

// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId) {
  message.textContent = "Post ID not specified.";
  form.style.display = "none";
  deleteBtn.style.display = "none";
} else {
  fetch(`https://v2.api.noroff.dev/blog/posts/${OWNER}/${postId}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.data) {
        message.textContent = data.errors?.[0]?.message || "Post not found.";
        form.style.display = "none";
        deleteBtn.style.display = "none";
        return;
      }

      const post = data.data;
      document.getElementById("title").value = post.title || "";
      document.getElementById("body").value = post.body || "";
      document.getElementById("imgUrl").value = post.media?.url || "";
      document.getElementById("imgAlt").value = post.media?.alt || "";
    })
    .catch((error) => {
      console.error("Error fetching post:", error);
      message.textContent = "Error loading post.";
    });
}

// UPDATE POST
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const payload = {
    title: document.getElementById("title").value.trim(),
    body: document.getElementById("body").value.trim(),
  };

  const mediaUrl = document.getElementById("imgUrl").value.trim();
  const mediaAlt = document.getElementById("imgAlt").value.trim();

  if (mediaUrl) {
    payload.media = { url: mediaUrl, alt: mediaAlt || payload.title };
  }

  message.textContent = "Updating post...";

  fetch(`https://v2.api.noroff.dev/blog/posts/${OWNER}/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.data) {
        message.textContent =
          "Failed to update post: " + (data.errors?.[0]?.message || "Unknown error");
        return;
      }

      message.textContent = "Post updated successfully!";
      setTimeout(() => {
        window.location.href = `./index.html?id=${postId}`;
      }, 800);
    })
    .catch((error) => {
      console.error("Error occurred:", error);
      message.textContent = "An error occurred while updating the post.";
    });
});

// DELETE POST
deleteBtn.addEventListener("click", function () {
  if (!confirm("Are you sure you want to delete this post?")) return;

  message.textContent = "Deleting post...";

  fetch(`https://v2.api.noroff.dev/blog/posts/${OWNER}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Delete failed");
      message.textContent = "Post deleted successfully!";
      setTimeout(() => {
        window.location.href = "./index.html";
      }, 800);
    })
    .catch((error) => {
      console.error("Error occurred:", error);
      message.textContent = "An error occurred while deleting the post.";
    });
});
