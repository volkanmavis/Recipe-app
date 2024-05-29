import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './RecipeDetails.css'

export const RecipeDetails = () => {
  const { id } = useParams(); 
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`https://recipe-app-x7py.onrender.com/recipes/${id}`); 
        setRecipe(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-details">
      <h1 id="recipeName">{recipe.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h1>
      <p className="recipe-elements">Instructions:{" "} {recipe.instructions}</p>
      <ul className="ingredients-details">
        <p className="recipe-elements">Ingredients: </p>
        {recipe.ingredients.map((ingredient, index) => (
          <ol className="ingredients-list" key={index}> {index+1}-{" "} {ingredient}</ol>
        ))}
      </ul >
      <p className="recipe-elements" >Cooking Time: {recipe.cookingTime} minutes</p>
    </div>
  );
};
