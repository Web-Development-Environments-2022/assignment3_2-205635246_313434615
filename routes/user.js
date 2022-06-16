var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

//Authenticate all incoming requests by middleware

router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
         req.user_id = req.session.user_id;
         next();
      }
    }).catch(err => next(err));
  } 
  else 
  {
    res.sendStatus(401);
  }
});

router.get("/alive1", (req, res) => res.send("I'm alive1"));

/* This path gets body with recipeId and save this recipe in the favorites list of the logged-in user */
router.post('/addFavoriteRecipe', async (req, res, next) => {
  try 
  {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
  } 
  catch (error) 
  {
    res.status(402).send("Invalid recipe Id or already favorited.");
  }
})

/* Get-Favorite-Recipe */
router.get('/getFavouriteRecipe', async (req, res, next) => {
  try 
  {
    const user_id = req.session.user_id;
    //let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } 
  catch (error)
  {
    next(error);
  }
});

/* Add-Recipe */
router.post('/addRecipe', async (req, res, next) => {
  try 
  {
    const user_id = req.session.user_id;
    const image = req.body.image;
    const name = req.body.name;
    const likes = req.body.likes;
    const vegetarian = req.body.vegetarian;
    const vegan = req.body.vegan;
    const gluten = req.body.glutenFree;
    const favorite = req.body.userFavorite;
    const analyzedInstructions = req.body.analyzedInstructions;

    await user_utils.insertNewRecipe(user_id, image, name, likes, vegetarian, vegan, gluten, favorite, analyzedInstructions);
    res.status(200).send("The Recipe successfully saved in users profile!#!#!#!");
  } 
  catch (error) 
  {
    next(error);
  }
});

/* Get-Recipes */
 router.get('/getRecipe', async (req, res, next) => {
  try 
  {
    const user_id = req.session.user_id;
    //let favorite_recipes = {};
    const recipes_id = await user_utils.getMyRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } 
  catch (error)
  {
    next(error);
  }
});


module.exports = router;
