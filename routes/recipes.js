var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

router.get("/aaa", (req, res,next) => {
  res.send("im there")
});
/*
router.get("/searchRecipe", (req, res) => {
  //  const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
  //res.send(req.query.cuisine);
    res.send(req.query.name)
});
*/

router.get("/searchRecipe", async (req, res,next) => {
  try{
    const recipe = await recipes_utils.searchRecipes(req.query.name, req.query.cuisine, req.query.diet,
      req.query.intolerance, req.query.number_of_results);
  //res.send(req.query.cuisine);
    res.send(recipe)
  }
  catch(error){
    next(error);
  }

});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});


//Route path: /users/:userId/books/:bookId
/**
 * This path returns a full details of a recipe by its id
 */



module.exports = router;
