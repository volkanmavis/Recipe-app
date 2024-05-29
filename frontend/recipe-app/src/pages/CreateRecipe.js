import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateRecipe.css";



export const CreateRecipe = () => {
  const token = window.localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
    cookingTime: 0,
    category: "",
    userOwner: decodedToken ? decodedToken.id : "",
  });

  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setCategory(value); // Update the category state
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const handleIngredientChange = (e, index) => {
    const { value } = e.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const removeIngredient = (index) => {
    const ingredients = [...recipe.ingredients];
    ingredients.splice(index, 1);
    setRecipe({ ...recipe, ingredients });
  };

  const handleCookingTimeChange = (event) => {
    const cookingTime = parseInt(event.target.value);
    setRecipe({ ...recipe, cookingTime });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Include the selected category in the recipe data
      const recipeData = { ...recipe, category };
      await axios.post(`https://recipe-app-x7py.onrender.com/recipes`, recipeData);
      alert("Recipe created successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const categories = [
    "Appetizer",
    "Bread",
    "Breakfast / Brunch",
    "Dessert",
    "Drink",
    "Lunch",
    "Main Dish",
    "Salad",
    "Snack",
    "Soup",
    "Vegan",
  ];

  return (
    <div className="wrapper">
      <div className="create-recipe-form">
        <h2>Create a Recipe</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="name">Name</label>
          <input
            placeholder="Recipe name"
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
          />
          <label htmlFor="ingredients">Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div className="ingredients" key={index}>
              <input
                placeholder="Ingredient"
                type="text"
                name="ingredients"
                value={ingredient}
                onChange={(e) => handleIngredientChange(e, index)}
              />
              <button type="button" onClick={() => removeIngredient(index)}>
                Remove Ingredient
              </button>
            </div>
          ))}
          <button onClick={addIngredient} type="button">
            Add Ingredient
          </button>
          <label htmlFor="instructions">Instructions</label>
          <textarea
            name="instructions"
            id="instructions"
            placeholder="How to cook"
            onChange={handleChange}
          ></textarea>
          <label htmlFor="imageURL">Image URL</label>
          <input
            placeholder="Image URL"
            type="text"
            name="imageURL"
            id="imageURL"
            onChange={handleChange}
          />
          <label htmlFor="cookingTime">Cooking time</label>
          <input
            placeholder="Cooking time in Minutes"
            type="number"
            name="cookingTime"
            id="cookingTime"
            onChange={handleCookingTimeChange}
          />
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button type="submit">Create Recipe</button>
        </form>
      </div>
    </div>
  );
};
