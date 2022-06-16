const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    return recipes_id;
}

// ----------------I added here---------------------------------------NEED TO ADD RECIPE INFO
async function insertNewRecipe(user_id, r_image, r_name, r_likes, is_v1, is_v2, is_glut_f, is_user_fav,amountIng, analyzedInstructions, name_plates){
    await DButils.execQuery(
    `insert into usersrecipes (user_id,image_recipe,name_recipe,likes,vegetarian,vegan,glutenFree,userFavorite,amountAndIng,
    instructions,numOfManot) VALUES ('${user_id}', '${r_image}', '${r_name}', '${r_likes}', '${is_v1}', '${is_v2}',
    '${is_glut_f}', '${is_user_fav}', '${amountIng}', '${analyzedInstructions}', '${name_plates}')`);
}

async function getMyRecipes(user_id){
    const my_recipes_id = await DButils.execQuery(`select * from usersrecipes where user_id='${user_id}'`);
    return my_recipes_id;////kkk
}

function getMyRecipeDetails(recipe_db_record){
    return {
        my_recipe_id: recipe_db_record.my_recipe_id,
        user_id: recipe_db_record.user_id,
        image_recipe: recipe_db_record.image_recipe,
        name_recipe: recipe_db_record.name_recipe,
        likes: recipe_db_record.likes,
        vegetarian: recipe_db_record.vegetarian,
        vegan: recipe_db_record.vegan,
        glutenFree: recipe_db_record.glutenFree,
        userFavorite: recipe_db_record.userFavorite,
        amountAndIng: recipe_db_record.amountAndIng,
        instructions: recipe_db_record.instructions,
        numOfManot: recipe_db_record.numOfManot
    }
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.insertNewRecipe = insertNewRecipe;
exports.getMyRecipes = getMyRecipes;
exports.getMyRecipeDetails = getMyRecipeDetails;

