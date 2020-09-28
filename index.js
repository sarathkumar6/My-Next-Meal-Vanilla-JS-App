const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsElement = document.getElementById("meals");
const singleMealElement = document.getElementById("single-meal");
const mealCategoryElement = document.getElementById("meal-category");
const resultHeading = document.getElementById("result-heading");
/**
 * Random meals API
 * https://www.themealdb.com/api.php
 *
 */

/**
 * Handler callbacks
 */

function searchMyMeal(event) {
  event.preventDefault();
  singleMealElement.innerHTML = "";
  mealCategoryElement.innerHTML = "";

  // Get the search text
  const searchText = search.value;

  if (searchText.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${searchText}'</h2>`;

        if (data.meals !== null && data.meals.length > 0) {
          mealsElement.innerHTML = data.meals
            .map(
              meal => `<div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>`
            )
            .join("");
          // Clear search text
          search.value = "";
        } else {
          mealsElement.innerHTML = `<p>There are no search results for ${searchText}. Try a different meal!</p>`;
        }
      });
  } else {
    alert("Please enter valid search text");
  }
}

function addMealToDOM(meal) {
  const ingredientsArray = [];
  for (let i = 1; i < 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredientsArray.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  singleMealElement.innerHTML = `
        <div class="singel-meal">
            <h1>${meal.strMeal}</h1>
            <img class="" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
                ${meal.strArea ? `<p>Cuisine: ${meal.strArea}</p>` : ""}
            </div>
            <div class="main">
                <p>
                    ${meal.strInstructions}
                </p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredientsArray
                      .map(ingredient => `<li>${ingredient}</li>`)
                      .join("")}
                </ul>
            </div>
        </div>
    `;
}

function addMealCategoriesToDOM(categories) {
  mealCategoryElement.innerHTML = categories
    .map(
      category => `<h1>${category.strCategory}</h1><div class="meal">
    <img src="${category.strCategoryThumb}" alt="${category.strCategoryThumb}" />
    <div class="meal-info" data-mealID="${category.idCategory}">
    <h3>${category.strCategory}</h3>
    </div>
    
</div>`
    )
    .join("");
  /**mealCategoryElement.innerHTML = `
        <div class="meal-category">
            <h1>${category.strMeal}</h1>
            <img src="${category.strCategoryThumb}" alt="${category.strCategoryThumb}" />
            <div class="meal-category-info">
                ${category.strCategory? `<p>${category.strCategory}</p>` : ''}
            </div>
            <div class="main">
                <p>
                    ${category.strCategoryDescription}
                </p>
            </div>
        </div>
    `;*/
}
function getMealById(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}

function getMealCategoryById(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealId}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      mealCategoryElement.innerHTML = "";
      //resultHeading.innerHTML = `<h2>Search results for '${mealId}'</h2>`;

      if (data.meals !== null && data.meals.length > 0) {
        mealsElement.innerHTML = data.meals
          .map(
            meal => `<div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>`
          )
          .join("");
      } else {
        mealCategoryElement.innerHTML = "";
        mealsElement.innerHTML = `<p>There are no search results for ${mealId}. Try a different meal!</p>`;
      }
    });
}

function getRandomMeal() {
  //clear meals and headings
  mealsElement.innerHTML = "";
  resultHeading.innerHTML = "";
  mealCategoryElement.innerHTML = "";
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(response => response.json())
    .then(data => {
      const randomMeal = data.meals[0];
      addMealToDOM(randomMeal);
    });
}

function getMealCategories() {
  mealsElement.innerHTML = "";
  resultHeading.innerHTML = "";
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then(response => response.json())
    .then(data => {
      const mealCategories = data.categories;
      console.log(mealCategories);
      if (data.categories !== null && data.categories.length > 0) {
        mealCategoryElement.innerHTML = data.categories
          .map(
            meal => `<div class="meal">
                  <img src="${meal.strCategoryThumb}" alt="${meal.strCategory}" />
                  <div class="meal-info" data-meal-category="${meal.strCategory}">
                      <h3>${meal.strCategory}</h3>
                  </div>
              </div>`
          )
          .join("");
      } else {
        mealCategoryElement.innerHTML = `<p>There are no search results for ${searchText}. Try a different meal!</p>`;
      }
    });
}

/**
 * Event Listeners
 */

submit.addEventListener("submit", searchMyMeal);
random.addEventListener("click", getRandomMeal);

mealsElement.addEventListener("click", e => {
  mealCategoryElement.innerHTML = "";
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  console.log(mealInfo);
  if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealid");
    console.log(mealId);
    getMealById(mealId);
  }
});

mealCategoryElement.addEventListener("click", e => {
  const mealInfo = e.path.find(item => {
    console.log(e);
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  console.log(mealInfo);
  if (mealInfo) {
    const mealCategory = mealInfo.getAttribute("data-meal-category");
    console.log(mealCategory);
    getMealCategoryById(mealCategory);
  }
});

getMealCategories();
