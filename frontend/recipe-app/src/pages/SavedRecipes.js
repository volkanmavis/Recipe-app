import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MdAccessTime } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import "./SavedRecipes.css";
import { GiConfirmed } from "react-icons/gi";
import { Link } from "react-router-dom";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [editMode, setEditMode] = useState(""); 
  const [editedRecipe, setEditedRecipe] = useState({ name: "", instructions: "", cookingTime: 0 });
  const token = window.localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userID = decodedToken ? decodedToken.id : null;

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(`https://recipe-app-x7py.onrender.com/recipes/savedRecipes/${userID}`);
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchSavedRecipes();
  }, [userID]);

  const deleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`https://recipe-app-x7py.onrender.com/recipes/savedRecipes/${userID}/${recipeId}`);
      const response = await axios.get(`https://recipe-app-x7py.onrender.com/recipes/savedRecipes/${userID}`);
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const editRecipe = async (recipeId, updatedRecipe) => {
    try {
      await axios.put(`https://recipe-app-x7py.onrender.com/recipes/savedRecipes/${userID}/${recipeId}`, { recipe: updatedRecipe });
      const response = await axios.get(`https://recipe-app-x7py.onrender.com/recipes/savedRecipes/${userID}`);
      setSavedRecipes(response.data.savedRecipes);
      setEditMode("");
    } catch (err) {
      console.log(err);
    }
  };

  const enterEditMode = (recipeId, recipe) => {
    setEditedRecipe({ ...recipe });
    setEditMode(recipeId);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedRecipe(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="card">
      <h1>Saved Recipes</h1>
      <ul>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id}>
             
            {!editMode || editMode !== recipe._id ? (
              <>
              <Link className="link-style" to={`/recipe/${recipe._id}`}>
                <h2>{recipe.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
                <div className="image-container">
                  <img src={recipe.imageURL} alt={recipe.name} />
                </div>
                <p className="home-instructions">{recipe.instructions}</p>
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
                <div className="save-buttons">
                  <RiDeleteBinLine className="delete" onClick={() => deleteRecipe(recipe._id)}/> 
                  <GrEdit className="edit" onClick={() => enterEditMode(recipe._id, recipe)}/>
                </div>
              </>
            ) : (
              <div className="edit-page">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" value={editedRecipe.name} onChange={handleEditChange} />
                <label htmlFor="instructions">Instructions</label>
                <input type="text" name="instructions" value={editedRecipe.instructions} onChange={handleEditChange} />
                <label htmlFor="cookingTime">Cooking Time (minutes)</label>
                <input type="number" name="cookingTime" value={editedRecipe.cookingTime} onChange={handleEditChange} />
                
                <GiConfirmed className="confirm-button" onClick={() => editRecipe(recipe._id, editedRecipe)}/> 
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}  