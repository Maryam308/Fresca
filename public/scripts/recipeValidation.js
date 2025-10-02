document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (!form) return;

  function addInput(type) {
    const container = document.getElementById(type + "-container");
    const wrapper = document.createElement("div");

    if (type === "ingredients") {
      wrapper.className = "ingredient-field";
      const input = document.createElement("input");
      input.type = "text";
      input.name = "ingredients[]";
      input.placeholder = "e.g., 2 tablespoons olive oil";
      input.required = true;
      wrapper.appendChild(input);
    } else if (type === "steps") {
      wrapper.className = "step-field";
      const textarea = document.createElement("textarea");
      textarea.name = "steps[]";
      textarea.placeholder = "Describe the next step in detail...";
      textarea.required = true;
      wrapper.appendChild(textarea);
    }

    container.appendChild(wrapper);
    addRemoveButtons(); // Re-check buttons after adding

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

  function addRemoveButtons() {
    const ingredientsContainer = document.getElementById(
      "ingredients-container"
    );
    const stepsContainer = document.getElementById("steps-container");

    // Helper function to process fields
    const processFields = (container, fieldClass) => {
      const fields = container.querySelectorAll(`.${fieldClass}`);

      fields.forEach((field) => {
        // Remove any existing button first
        let existingBtn = field.querySelector(".btn-remove");
        if (existingBtn) {
          existingBtn.remove();
        }

        // Only add a remove button if there is more than one field
        if (fields.length > 1) {
          const removeBtn = document.createElement("button");
          removeBtn.type = "button";
          removeBtn.className = "btn-remove";
          removeBtn.textContent = "×";
          removeBtn.onclick = () => removeField(field);
          field.appendChild(removeBtn);
        }
      });
    };

    if (ingredientsContainer) {
      processFields(ingredientsContainer, "ingredient-field");
    }
    if (stepsContainer) {
      processFields(stepsContainer, "step-field");
    }
  }

  function removeField(fieldElement) {
    // Animate out
    fieldElement.style.transition = "all 0.3s ease";
    fieldElement.style.opacity = "0";
    fieldElement.style.transform = "translateX(-20px)";

    setTimeout(() => {
      fieldElement.remove();
      addRemoveButtons(); // Refresh remove buttons after removal
    }, 300);
  }

  // Expose functions globally so EJS buttons can access them
  window.addInput = addInput;

  addRemoveButtons();

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

    // Check if containers are empty or if fields inside them are empty
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
