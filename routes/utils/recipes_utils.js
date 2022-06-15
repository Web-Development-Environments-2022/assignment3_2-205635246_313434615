const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}
//https://api.spoonacular.com/recipes/complexSearch?query=pasta&number=10&apiKey=67686a03db364dc289fbcfc70626a194
//https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2
//https://api.spoonacular.com/recipes/716429/information?apiKey=67686a03db364dc289fbcfc70626a194
async function getRecipeSearchInformation(name, cuisine, diet, intolerance, number_of_results) {
    return await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query:name,
            number:number_of_results,
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function searchRecipes(name, cuisine, diet, intolerance, number_of_results) {
    let recipe_info = await getRecipeSearchInformation(name, cuisine, diet, intolerance, number_of_results);
    //let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;
    ids=[]
    for (let i = 0; i < recipe_info.data.results.length; i++) {
        ids.push(recipe_info.data.results[i].id)
    }
    return {ids:ids}
}

async function getRecipesPreview(recipes_id_array){
    let promises=[]
    let tmp_dict={}
    for (let i = 0; i < recipes_id_array.length; i++) {
        const p = new Promise((resolve, reject) =>{ 
            tmp_dict = getRecipeDetails(recipes_id_array[i])
            if(tmp_dict != {}){
                resolve(tmp_dict)
            }
            else{
                reject("Problem with getting recipe details!!")
            }
        })
        promises.push(p)
    }
    return Promise.all(promises)
}


exports.getRecipeDetails = getRecipeDetails;
exports.searchRecipes = searchRecipes;
exports.getRecipesPreview = getRecipesPreview




