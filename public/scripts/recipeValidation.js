document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    const title = document.querySelector("#title");
    const prepTime = document.querySelector("#prepTime");
    const cookTime = document.querySelector("#cookTime");
    const ingredients = document.querySelectorAll(
      'input[name="ingredients[]"]'
    );
    const steps = document.querySelectorAll('textarea[name="steps[]"]');

    let errors = [];

    if (!title.value.trim()) errors.push("Title is required.");
    if (!prepTime.value || prepTime.value < 0)
      errors.push("Prep time must be a valid number.");
    if (!cookTime.value || cookTime.value < 0)
      errors.push("Cook time must be a valid number.");

    if (ingredients.length === 0)
      errors.push("At least one ingredient is required.");
    ingredients.forEach((input) => {
      if (!input.value.trim())
        errors.push("Ingredient fields cannot be empty.");
    });

    if (steps.length === 0)
      errors.push("At least one cooking step is required.");
    steps.forEach((textarea) => {
      if (!textarea.value.trim()) errors.push("Step fields cannot be empty.");
    });

    if (errors.length > 0) {
      e.preventDefault();
      alert(errors.join("\n"));
    }
  });
});
