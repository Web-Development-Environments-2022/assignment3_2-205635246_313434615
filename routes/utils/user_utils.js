const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into favoriterecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}'`);
    return recipes_id;
}

// ----------------I added here---------------------------------------NEED TO ADD RECIPE INFO
async function insertNewRecipe(user_id, r_image, r_name, r_likes, is_v1, is_v2, is_glut_f, is_user_fav, analyzedInstructions){
    await DButils.execQuery(
    `insert into usersrecipes (user_id,image_recipe,name_recipe,likes,vegetarian,vegan,glutenFree,userFavorite) 
    VALUES ('${user_id}', '${r_image}', '${r_name}', '${r_likes}', '${is_v1}', '${is_v2}','${is_glut_f}', '${is_user_fav}')`);
}

async function getMyRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select * from usersrecipes where user_id='${user_id}'`);
    return recipes_id;
}


exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.insertNewRecipe = insertNewRecipe;
exports.getMyRecipes = getMyRecipes;

