import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Home.css";
import { MdAccessTime } from "react-icons/md";
import { MdOutlineBookmarkAdded } from "react-icons/md";
import { MdBookmarkAdded } from "react-icons/md";
import { Link } from "react-router-dom";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const token = window.localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userID = decodedToken ? decodedToken.id : null;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`https://recipe-app-x7py.onrender.com/recipes`);
        setRecipes(response.data); // Update the recipes state with the fetched data
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`https://recipe-app-x7py.onrender.com/recipes/savedRecipes/ids/${userID}`); // Fetch saved recipes using the user ID
        setSavedRecipes(response.data.savedRecipes); // Update the savedRecipes state with the fetched data
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  const saveRecipe = async (recipeId) => {
    try {
      const response = await axios.put(`https://recipe-app-x7py.onrender.com/recipes`, { recipeId, userID }); // Save the recipe using the user ID
      setSavedRecipes(response.data.savedRecipes); // Update the savedRecipes state
    } catch (error) {
      console.log(error);
    }
  };

  const isRecipeSaved = (recipeId) => {
    if (!savedRecipes) return false; 
    return savedRecipes.includes(recipeId);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };


  const filteredRecipes = selectedCategory
    ? recipes.filter((recipe) => recipe.category === selectedCategory)
    : recipes;

  return (
    <div className="recipes">
      <h1>Recipes</h1>
      {/* Add a button to filter recipes by category */}
      <div >
        <button className="filter-button" onClick={() => handleCategoryChange("")}>All</button>
        {categories.map((category, index) => (
          <button className="filter-button" key={index} onClick={() => handleCategoryChange(category)}>
            {category}
          </button>
        ))}
      </div>
      <ul>
        {/* Render each recipe */}
        {filteredRecipes.map((recipe) => (
          <li key={recipe._id}>
            <Link className="link-style" to={`/recipe/${recipe._id}`}>
            <div>
            <h2>{recipe.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
            <div className="image-container">
            <img src={recipe.imageURL} alt={recipe.name}/>
            </div>
            </div>
            <div>
              <p className="home-instructions">{recipe.instructions}</p>
            </div>
            <div className="ingredients">
              {recipe.ingredients.map((ingredient, index) => (
              <ol key={index}>{index+1}-{" "}{ingredient}</ol>
              ))}
            </div>
            <div className="time">
              <MdAccessTime /> {recipe.cookingTime} minutes
            </div>
            </Link>
            <hr />
            {/* Conditionally render save button based on authentication */}
              {userID && (
              <button onClick={() => saveRecipe(recipe._id)} disabled={isRecipeSaved(recipe._id)} title={isRecipeSaved(recipe._id) ? "Saved" : "Save"}>
                {isRecipeSaved(recipe._id) ? (
                <MdBookmarkAdded className="add-button" />) : ( <MdOutlineBookmarkAdded className="add-button" /> )}
                </button>
              )}
          </li>
          
        ))}
      </ul>
    </div>
  );
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
