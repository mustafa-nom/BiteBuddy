import google.generativeai as genai
import sys
import os
import requests
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config
import json
from services.firebase_user import get_user_data

# set up w/ key and model instructions
genai.configure(api_key=Config.GEMINI_API_KEY)
system_instructions = {
    "mood_to_recipe": """
        You are a recipe assistant. The user will give you:
        1. a mood or craving,
        2. a list of ingredients currently in their fridge.
        Suggest 2 or 3 realistic dishes that fit the user's mood and can be made using some or all of their available ingredients. 
        Your answers should be popular, likely to exist in the Spoonacular database, and use the fridge items when possible.
        Return only a comma-separated list of the dish names. No sentences, no extra words.
    """,

    "goal_to_meal_plan": """
        You are a nutrition coach. Based on the user's fitness goal (e.g. lose weight, gain muscle, maintain energy),
        generate a 1‑day meal plan with exactly three dishes for the day (breakfast, lunch, dinner) that are likely to exist in the Spoonacular recipe database. Keep the answer short, generic, and usable as a search query. 
        Focus on popular, common recipes that will most likely exist in the Spoonacular database. Avoid niche or uncommon names. Keep the names broad and generalized (e.g. oatmeal, fried rice, chicken pasta).
        Include some variety among the meals so same recipes aren't reapeated consistently.
        Return **only** a JSON array of 3 dish‑name strings in order:
        ["day1_breakfast", "day1_lunch", "day1_dinner"]
        No backticks, no extra words or explanation—just the JSON array.
    """,
}

# get the model and its instructions based on current purpose
def get_model(purpose):
    instructions = system_instructions[purpose]
    return genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=instructions,
    )

# return list of recipes based on mood AND user's ingredients
# add Firebase user fridge_ingredients
def get_recipe_from_mood(mood_txt, username):
    user_data = get_user_data(username)
    if not user_data or "fridge_ingredients" not in user_data:
        raise ValueError("No fridge ingredients found for this user.")
    
    fridge_ingredients = user_data["fridge_ingredients"]
    ingredient_list = ", ".join(fridge_ingredients)

    prompt = (
        f"My mood is: {mood_txt}\n"
        f"My fridge has the following ingredients: {ingredient_list}\n"
        "Suggest 2 or 3 dishes that match the mood and can be made from these ingredients."
    )

    model = get_model("mood_to_recipe")
    response = model.generate_content(prompt)
    raw_text = response.text.strip()
    recipe_names = [item.strip() for item in raw_text.split(',') if item.strip()]
    return recipe_names

# gets keywords for three meals in one day
def generate_day_keywords(goal, day):
    model = get_model("goal_to_meal_plan")
    prompt = f"Create a meal plan (breakfast, lunch, dinner) for {day} based on this goal: {goal}"
    response = model.generate_content(prompt)
    raw = response.text.strip()

    if raw.startswith("```"):
        raw = "\n".join(raw.splitlines()[1:-1]).strip()

    try:
        keywords = json.loads(raw)
    except Exception as e:
        print(f"JSON parsing error for {day}:", e)
        raise ValueError(f"Couldn't parse JSON from Gemini for {day}: {raw}")

    if not isinstance(keywords, list) or len(keywords) != 3:
        raise ValueError(f"Expected 3 keywords for {day}, got {len(keywords)}: {keywords}")

    return [k.strip() for k in keywords]


# create 1-day meal plan based on user goal
# def generate_meal_plan(meal_plan_goal):
#     model = get_model("goal_to_meal_plan")
#     prompt = f"Create a full day plan for this goal: {meal_plan_goal}"
#     response = model.generate_content(prompt)
#     raw = response.text.strip()
#     print("Gemini raw response:", raw)
    
#     if raw.startswith("```"):
#         raw = "\n".join(raw.splitlines()[1:-1]).strip()
        
#     try:
#         keywords = json.loads(raw)
#     except Exception as e:
#         print("JSON parsing error:", e)
#         raise ValueError(f"Couldn't parse JSON from Gemini output: {raw}")
    
#     if not isinstance(keywords, list) or any(not isinstance(k, str) for k in keywords):
#         raise ValueError(f"output wasnt a list of strings: {keywords!r}")
#     if len(keywords) != 21:
#         raise ValueError(f"wanted 21 items for meal-plan, got {len(keywords)}: {keywords!r}")
#     return [k.strip() for k in keywords]


