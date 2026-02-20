document.addEventListener("DOMContentLoaded", () => { 
  console.log("index.js loaded");
  const grid = document.getElementById("post-grid");
  const OWNER = "naima_05521"; 
  console.log("grid:", grid)


  const slider = document.getElementById("carouselSlide");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  let carouselPosts = [];
  let currentIndex = 0;

  function updateCarousel() {
    const post = carouselPosts[currentIndex];
    const imgUrl = post.media?.url || '';
    const imgAlt = post.media?.alt || post.title;
    slider.innerHTML = `
      ${imgUrl ? `<img src="${imgUrl}" alt="${imgAlt}">` : ''}
      <h2>${post.title}</h2>
      <p>${post.body}</p>
      <a href="./post/index.html?id=${post.id}" class="read-more-btn">Read More</a>
    `;
  }

  if (!grid) {
    console.error("Post grid element not found");
    return;
  }
  fetch(`https://v2.api.noroff.dev/blog/posts/${OWNER}?limit=12`)
    .then((res) => res.json())
    .then((json) => {
      console.log("Fetched posts:", json);

      if (!json.data){
        grid.innerHTML = `<p>Error: ${json.errors?.[0]?.message || 'Failed to load posts.'}</p>`;
        return; 
      }

      carouselPosts = json.data.slice(0, 3);
      currentIndex = 0;
      updateCarousel();

      grid.innerHTML = "";

      json.data.forEach((post) => {
        const imgUrl = post.media?.url || "";
        const imgAlt = post.media?.alt || post.title;

        grid.innerHTML += `
          <div class="post-card">
            ${imgUrl ? `<img src="${imgUrl}" alt="${imgAlt}">` : ""}
            <h3 class="post-title">${post.title}</h3>
            <p class="post-body">${post.body}</p>
            <a href="./post/index.html?id=${post.id}" class="read-more-btn">Read More</a>
          </div>
        `;
      });
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      grid.innerHTML = "<p>Error loading posts.</p>";
    });

    prevBtn.addEventListener("click", () => {
      if (carouselPosts.length === 0) return;
      currentIndex = (currentIndex - 1 + carouselPosts.length) % carouselPosts.length;
      updateCarousel();
    });
    
    nextBtn.addEventListener("click", () => { 
      if (carouselPosts.length === 0) return;
      currentIndex = (currentIndex + 1) % carouselPosts.length;
      updateCarousel();
    });
});


