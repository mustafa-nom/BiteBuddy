#add stuff here
from dotenv import load_dotenv
import requests
import os

load_dotenv()
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')

def get_recipes_from_keywords(food_keywords, num_recipe_per_keyword):
    all_recipes = []
    for keyword in food_keywords:
        search_url = 'https://api.spoonacular.com/recipes/complexSearch'
        params = {
            'query': keyword,
            'number': num_recipe_per_keyword,
            'apiKey': SPOON_API_KEY
        }
        response = requests.get(search_url, params=params)
        data = response.json()

        recipes = data.get('results', [])
        print(f"Keyword provided: {keyword} \n Recipe got: {recipes}")
        for recipe in recipes:
            recipe_id = recipe['id']
            info_url = f'https://api.spoonacular.com/recipes/{recipe_id}/information'
            info_params = {
                'apiKey': SPOON_API_KEY
            }
            info_response = requests.get(info_url, params=info_params)
            info_data = info_response.json()

            all_recipes.append({
                'id': recipe_id,
                'title': recipe['title'],
                'image': recipe.get('image'),
                'source_keyword': keyword,
                'cookTime': f"{info_data.get('readyInMinutes', '?')} mins",
                'instructions': info_data.get('instructions', 'No instructions provided.'),
                'neededIngredients': ', '.join([ingredient['name'] for ingredient in info_data.get('extendedIngredients', [])]),
                'type': ', '.join(info_data.get('dishTypes', []))
            })

    return all_recipes

def get_weekly_recipes_from_keywords(food_keywords, num_recipe_per_keyword):
    all_recipes = []
    new_recipes = {}
    print(len(food_keywords))
    for keyword in food_keywords:
        search_url = 'https://api.spoonacular.com/recipes/complexSearch'
        params = {
            'query': keyword,
            'number': num_recipe_per_keyword,
            'apiKey': SPOON_API_KEY
        }
        response = requests.get(search_url, params=params)
        data = response.json()

        recipes = data.get('results', [])
        print(f"Keyword provided: {keyword} \n Recipe got: {recipes}")

        if not recipes:
            all_recipes.append({
                'id': 0,
                'title': "NOT FOUND",
                'image': "https://ih1.redbubble.net/image.1861329778.2941/st,small,845x845-pad,1000x1000,f8f8f8.jpg",
                'source_keyword': keyword,
                'cookTime': f"N/A",
                'instructions': "N/A",
                'neededIngredients': "N/A",
                'type': "N/A"
            })
        else:
            recipe = recipes[0]
            recipe_id = recipe['id']
            info_url = f'https://api.spoonacular.com/recipes/{recipe_id}/information'
            info_params = {
                'apiKey': SPOON_API_KEY
            }
            info_response = requests.get(info_url, params=info_params)
            info_data = info_response.json()

            all_recipes.append({
                'id': recipe_id,
                'title': recipe['title'],
                'image': recipe.get('image'),
                'source_keyword': keyword,
                'cookTime': f"{info_data.get('readyInMinutes', '?')} mins",
                'instructions': info_data.get('instructions', 'No instructions provided.'),
                'neededIngredients': ', '.join([ingredient['name'] for ingredient in info_data.get('extendedIngredients', [])]),
                'type': ', '.join(info_data.get('dishTypes', []))
            })

    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    meals = ["Breakfast", "Lunch", "Dinner"]
    
    for i in range(0, len(all_recipes), 3):
         day_index = i//3
         day = days[day_index]
         new_recipes[day] = {
             meals[0]: all_recipes[i],
             meals[1]: all_recipes[i+1],
             meals[2]:all_recipes[i+2]
         }
    
    print(new_recipes)
    return new_recipes

def get_ingredient(ingredient_name):
    params = {
        'query': ingredient_name,
        'apiKey': SPOON_API_KEY
    }
    search_url = 'https://api.spoonacular.com/food/ingredients/search'
    response = requests.get(search_url, params=params)
    data = response.json()
    results = data.get('results', [])
    if not results:
        return None

    ingredient = results[0]
    return {
        'id': ingredient.get('id'),
        'name': ingredient.get('name'),
        'image': ingredient.get('image')
    }
