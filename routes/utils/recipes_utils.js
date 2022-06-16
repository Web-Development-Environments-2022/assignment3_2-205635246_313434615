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
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree,analyzedInstructions, summary,extendedIngredients,servings} = recipe_info.data;//gold

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        steps: getSteps(analyzedInstructions),
        summary:summary,
        amountAndIng: getIngredientsList(extendedIngredients),
        servings: servings
    }
}

async function getOnlyPreview(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree} = recipe_info.data;//gold

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

function getIngredientsList(ex_list){
    short_list = []
    ex_list.map((element) => short_list.push(element.name +' - ' + element.amount))
    return short_list
}

function getSteps(ex_list){
    if(ex_list == null || ex_list.length == 0){
        return null
    }
    var steps = ex_list[0].steps
    if (steps == null){
        return null
    }

    short_list = []
    steps.map((element) => short_list.push(element.step))
    return short_list    
}

async function getRecipeSearchInformation(name, cuisine, diet, intolerance, number_of_results) {
    if (number_of_results == null){
        number_of_results = 5
    }
    return await axios.get(`${api_domain}/complexSearch`, {
        params: {
            query:name,
            number:number_of_results,
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey,
            cuisine: cuisine,
            diet: diet,
            intolerance: intolerance,
            instructionsRequired: true,
            addRecipeInformation: true
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
    const results = await getRecipesPreview(ids);
    return results
}

async function getRecipesPreview(recipes_id_array){
    let promises=[]
    let tmp_dict={}
    for (let i = 0; i < recipes_id_array.length; i++) {
        const p = new Promise((resolve, reject) =>{ 
            tmp_dict = getOnlyPreview(recipes_id_array[i])
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




