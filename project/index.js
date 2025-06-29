const apiKey = "2c83992ca38349b287b5e7aa3af6d2f0";
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const orderForm = document.getElementById("orderForm");
const selectedItem = document.getElementById("selectedItem");
const orders = document.getElementById("orders");
const placeOrderButton = document.getElementById("placeOrderButton");
const orderList = document.getElementById("orderList");


searchButton.addEventListener("click", function () {
    const query = searchInput.value.trim();
    if (!query) return;
    results.innerHTML = "Loading...";
    fetchRecipes(query);
});


function fetchRecipes(query) {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&addRecipeInformation=true&apiKey=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayIngredientResultsWithDetails(data.results);
        })
        .catch(err => {
            results.innerHTML = "Error loading data";
            console.error(err);
        });
}


function displayIngredientResultsWithDetails(recipeResults) {
    results.innerHTML = "";

    if (!recipeResults || recipeResults.length === 0) {
        results.innerHTML = "No recipes found";
        return;
    }

    recipeResults.forEach(recipe => {
        const container = document.createElement("div");
        container.className = "results-item";

        const img = document.createElement("img");
        img.src = recipe.image;
        img.alt = recipe.title;

        const title = document.createElement("h3");
        title.textContent = recipe.title;

        const ingredientsList = document.createElement("ul");
        ingredientsList.className = "ingredients-list";

        const combinedIngredients = recipe.extendedIngredients || [];

        combinedIngredients.forEach(ingredient => {
            const li = document.createElement("li");
            li.textContent = ingredient.original;
            ingredientsList.appendChild(li);
        });

        const form = document.createElement("div");
        form.className = "order-form";

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Your name";

        const orderButton = document.createElement("button");
        orderButton.textContent = "Place Order";

       
        orderButton.addEventListener("click", function () {
            const userName = nameInput.value.trim();
            if (!userName) return alert("Please enter your name");

            const order = {
                name: userName,
                item: recipe.title,
                ingredients: combinedIngredients.map(i => i.original),
                type: "ingredient"
            };

            saveOrder(order);
            displayOrders();
            alert(`Order placed for ${recipe.title}`);
        });

        form.appendChild(nameInput);
        form.appendChild(orderButton);

        container.appendChild(img);
        container.appendChild(title);
        container.appendChild(ingredientsList);
        container.appendChild(form);
        results.appendChild(container);
    });
}


function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
}


function displayOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orderList.innerHTML = "";

    orders.forEach(order => {
        const li = document.createElement("li");
        li.textContent = `${order.name} ordered "${order.item}"`;

        if (order.ingredients && order.ingredients.length) {
            const ul = document.createElement("ul");
            order.ingredients.forEach(ing => {
                const ingrLi = document.createElement("li");
                ingrLi.textContent = ing;
                ul.appendChild(ingrLi);
            });
            li.appendChild(ul);
        }

        orderList.appendChild(li);
    });
}


displayOrders();

function displayOrders() {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orderList.innerHTML = "";

    orders.forEach(order => {
        const li = document.createElement("li");
        li.textContent = `${order.name} ordered "${order.item}"`;

        if (order.ingredients && order.ingredients.length) {
            const ul = document.createElement("ul");
            order.ingredients.forEach(ing => {
                const ingrLi = document.createElement("li");
                ingrLi.textContent = ing;
                ul.appendChild(ingrLi);
            });
            li.appendChild(ul);
        }

        orderList.appendChild(li);
    });
}

const clearOrdersButton = document.getElementById("clearOrdersButton");

clearOrdersButton.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete all orders?")) {
        localStorage.removeItem("orders");
        displayOrders();
    }
});
