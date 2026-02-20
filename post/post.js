const container = document.getElementById("post-container");
const shareBtn = document.getElementById("share-btn");
const shareMessage = document.getElementById("share-message");

const OWNER = "naima_05521";

const token = localStorage.getItem("token");
const name = localStorage.getItem("name");
const isOwner = Boolean(token) && name === OWNER;

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

if (!postId) {
  container.innerHTML = "<p>Post ID not specified.</p>";
} else {
  fetch(`https://v2.api.noroff.dev/blog/posts/${OWNER}/${postId}`)
    .then((res) => res.json())
    .then((json) => {
      if (!json.data) {
        container.innerHTML = `<p>Error: ${json.errors?.[0]?.message || "Post not found."}</p>`;
        return;
      }

      const post = json.data;
      const imgUrl = post.media?.url || "";
      const imgAlt = post.media?.alt || post.title;

      container.innerHTML = `
        ${imgUrl ? `<img src="${imgUrl}" alt="${imgAlt}">` : ""}
        <h1>${post.title}</h1>
        <p>${post.body}</p>

        ${
          isOwner
            ? `
              <div class="owner-actions">
                <a href="./edit.html?id=${postId}" class="edit-btn">Edit Post</a>
                <button id="deleteBtn" class="delete-btn" type="button">Delete Post</button>
                <p id="ownerMessage"></p>
              </div>
            `
            : ""
        }
      `;

      if (isOwner) {
        const deleteBtn = document.getElementById("deleteBtn");
        const ownerMessage = document.getElementById("ownerMessage");

        deleteBtn.addEventListener("click", () => {
          if (!confirm("Are you sure you want to delete this post?")) return;

          ownerMessage.textContent = "Deleting post...";

          fetch(`https://v2.api.noroff.dev/blog/posts/${OWNER}/${postId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then(async (res) => {
              if (res.ok) {
                ownerMessage.textContent = "Post deleted successfully!";
                setTimeout(() => {
                  window.location.href = "../index.html";
                }, 800);
                return;
              }

              const data = await res.json();
              throw new Error(data.errors?.[0]?.message || "Failed to delete post.");
            })
            .catch((error) => {
              console.error("Error deleting post:", error);
              ownerMessage.textContent = "Error deleting post: " + error.message;
            });
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching post:", error);
      container.innerHTML = "<p>Error loading post.</p>";
    });
}

// Share button 
if (shareBtn) {
  shareBtn.addEventListener("click", () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this post!",
          text: "I found this post interesting and wanted to share it with you.",
          url: window.location.href,
        })
        .then(() => {
          shareMessage.textContent = "Post shared successfully!";
        })
        .catch((error) => {
          console.error("Error sharing post:", error);
          shareMessage.textContent = "Error sharing post.";
        });
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          shareMessage.textContent = "Link copied to clipboard!";
        })
        .catch((error) => {
          console.error("Error copying link:", error);
          shareMessage.textContent = "Error copying link." + window.location.href;
        });
    }
  });
}
