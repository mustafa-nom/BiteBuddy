#add stuff here
from dotenv import load_dotenv
import requests
import os

load_dotenv()
# load api key
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')
print(SPOON_API_KEY)

# call get request with list of ingredients
ingredients = ['paprika', 'flour', 'salt', 'milk', 'chicken']
url = 'https://api.spoonacular.com/recipes/findByIngredients'
params = {
    'ingredients': ingredients,
    'number': 5,
    'apiKey': SPOON_API_KEY
}

response = requests.get(url, params=params)
print(response.json())

# get missing ingredients

# get id of the recipe and perform recipe information request

# get extended_ingredients fromm response and extract amount descriptions from 'original'
# description = []
# recipe_ingredients = response.json()['extended_ingredients']
# for ingredient in recipe_ingredients:
#   description.append(ingredient['original'])