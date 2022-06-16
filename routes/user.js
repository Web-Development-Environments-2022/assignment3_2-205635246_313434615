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
    const likes = req.body.popularity;
    const vegetarian = req.body.vegetarian;
    const vegan = req.body.vegan;
    const gluten = req.body.glutenFree;
    //const favorite = req.body.userFavorite;
    const am_in ="I am a temp!!!"
    const instructions = req.body.analyzedInstructions;
    const num_of_dishes = 5;
    await user_utils.insertNewRecipe(user_id, image, name, likes, vegetarian, vegan, gluten, /*favorite*/ am_in, instructions, num_of_dishes);
    res.status(200).send("The Recipe successfully saved in users profile!#!#!#!");
  } 
  catch (error) 
  {
    next(error);
  }
});

/* Get-Recipes */
 router.get('/getRecipes', async (req, res, next) => {
  try 
  {
    const user_id = req.session.user_id;
    //let favorite_recipes = {};
    const recipe_db_records = await user_utils.getMyRecipes(user_id);
    let recipes_array = [];

    let results = recipe_db_records.map((element) => recipes_array.push(user_utils.getMyRecipeDetails(element,false))); //extracting the recipe ids into array
    //const results = await user_utils.getMyRecipesPreview(recipes_id);
    res.status(200).send({randomRecipes : recipes_array});
  } 
  catch (error)
  {
    res.status(401).send("Invalid recipe details.");
  }
});


module.exports = router;
