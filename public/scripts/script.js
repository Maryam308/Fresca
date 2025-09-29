document.addEventListener("DOMContentLoaded", function () {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const toggleBtns = document.querySelectorAll(".toggle-option");
  const recipeCards = document.querySelectorAll(".recipe-card");

  // Set background images for recipe cards
  document.querySelectorAll(".recipe-image[data-image]").forEach((img) => {
    const imageUrl = img.getAttribute("data-image");
    img.style.backgroundImage = `url('${imageUrl}')`;
  });

  let currentCategoryFilter = "all";
  let currentTypeFilter = "all";

  function filterRecipes() {
    let visibleCount = 0;

    recipeCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      const cardAuthorId = card.dataset.authorId;

      // Check category filter
      const categoryMatch =
        currentCategoryFilter === "all" ||
        cardCategory === currentCategoryFilter;

      // Check type filter (all recipes vs my recipes)
      const typeMatch =
        currentTypeFilter === "all" ||
        (currentTypeFilter === "my-recipes" && cardAuthorId === currentUserId);

      // Show card only if both filters match
      if (categoryMatch && typeMatch) {
        card.classList.remove("hidden");
        visibleCount++;
      } else {
        card.classList.add("hidden");
      }
    });

    // Show/hide no recipes message based on visible count
    const noRecipesMessage = document.getElementById("no-recipes-message");
    const noRecipesText = document.getElementById("no-recipes-text");

    if (visibleCount === 0 && recipeCards.length > 0) {
      noRecipesText.textContent = "No recipes available.";
      noRecipesMessage.classList.remove("hidden");
    } else {
      noRecipesMessage.classList.add("hidden");
    }
  }

  // Category filtering
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      currentCategoryFilter = this.dataset.category;
      filterRecipes();
    });
  });

  // Recipe type toggle
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      toggleBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      currentTypeFilter = this.dataset.type;
      filterRecipes();
    });
  });

  // Run filter once on page load so toggles work immediately
  filterRecipes();

  // Smooth scroll for back to top
  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});

// Show/hide back to top button based on scroll
window.addEventListener("scroll", function () {
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    if (window.pageYOffset > 300) {
      backToTop.style.display = "flex";
    } else {
      backToTop.style.display = "none";
    }
  }
});

function addInput(type) {
  const container = document.getElementById(type + "-container");

  if (type === "ingredients") {
    const input = document.createElement("input");
    input.type = "text";
    input.name = "ingredients[]";
    input.placeholder = "e.g., 2 tablespoons olive oil";
    input.required = true;
    container.appendChild(input);
  } else if (type === "steps") {
    const textarea = document.createElement("textarea");
    textarea.name = "steps[]";
    textarea.placeholder = "Describe the next step in detail...";
    textarea.required = true;
    container.appendChild(textarea);
  }

  // Add animation
  const newElement = container.lastElementChild;
  newElement.style.opacity = "0";
  newElement.style.transform = "translateY(-10px)";

  setTimeout(() => {
    newElement.style.transition = "all 0.3s ease";
    newElement.style.opacity = "1";
    newElement.style.transform = "translateY(0)";
  }, 10);
}

document.querySelector("form")?.addEventListener("submit", function (e) {
  const ingredients = document.querySelectorAll('input[name="ingredients[]"]');
  const steps = document.querySelectorAll('textarea[name="steps[]"]');

  if (ingredients.length === 0 || steps.length === 0) {
    e.preventDefault();
    alert("Please add at least one ingredient and one cooking step.");
    return;
  }

  // Check if any ingredient or step is empty
  let hasEmptyFields = false;
  ingredients.forEach((input) => {
    if (!input.value.trim()) hasEmptyFields = true;
  });
  steps.forEach((textarea) => {
    if (!textarea.value.trim()) hasEmptyFields = true;
  });

  if (hasEmptyFields) {
    e.preventDefault();
    alert("Please fill in all ingredient and step fields.");
    return;
  }
});
