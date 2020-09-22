const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsElement = document.getElementById("meals");
const singleMealElement = document.getElementById("single-meal");
const resultHeading = document.getElementById("result-heading");

/**
 * Handler callbacks
 */

function searchMyMeal(event) {
    event.preventDefault();
    singleMealElement.innerHTML = '';

    // Get the search text
    const searchText = search.value;

    if (searchText.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            resultHeading.innerHTML = `<h2>Search results for '${searchText}'</h2>`;

            if (data.meals  !== null && data.meals.length > 0) {
                mealsElement.innerHTML = data.meals.map(meal => `<div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>`).join('');
                // Clear search text
                search.value = '';
            } else {
                mealsElement.innerHTML = `<p>There are no search results for ${searchText}. Try a different meal!</p>`;
            }
        });

    } else {
        alert('Please enter valid search text');
    }
}

function addMealToDOM(meal) {
    const ingredientsArray = [];
    for (let i = 1; i < 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientsArray.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    singleMealElement.innerHTML = `
        <div class="singel-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>
                    ${meal.strInstructions}
                </p>
                <h2>Ingredients</h2>
                <ul>
                    ${ingredientsArray.map(ingredient => `<li>${ingredient}</li>`)}
                </ul>
            </div>
        </div>
    `
}
function getMealById(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data =>{
        const meal = data.meals[0];
        addMealToDOM(meal);
    })
}

/**
 * Event Listeners
 */

submit.addEventListener("submit", searchMyMeal);

mealsElement.addEventListener('click', e => {
    const mealInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        }
         else {
             return false;
         }
    });
    console.log(mealInfo);
    if (mealInfo) {
        const mealId = mealInfo.getAttribute('data-mealid');
        console.log(mealId);
        getMealById(mealId);
    }
});

