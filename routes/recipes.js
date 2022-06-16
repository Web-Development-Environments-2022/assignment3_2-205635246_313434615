var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

router.get("/aaa", (req, res,next) => {
  res.send("im there")
});

router.get("/searchRecipe", async (req, res, next) => {
  try{
    const recipe = await recipes_utils.searchRecipes(req.query.name, req.query.cuisine, req.query.diet,
      req.query.intolerance, req.query.number_of_results);
  //res.send(req.query.cuisine);
    res.status(200).send(recipe);
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

module.exports = router;
