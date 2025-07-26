import google.generativeai as genai
import sys
import os
import requests
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config
import json

# set up w/ key and model instructions
genai.configure(api_key=Config.GEMINI_API_KEY)
system_instructions = {
    "mood_to_recipe": """
        You are a recipe assistant. Based on a user's mood or craving, respond with 2 or 3 specific dish or food names that are popular and likely to exist in the Spoonacular recipe database while also being possible to be made with the current user's fridge ingredients.
        Return them as a short, comma-separated list (e.g., "chocolate cake, scrambled eggs, french toast").
        Do not explain anything or include full sentences. Keep the answer short and usable as a search query.
    """,

    "goal_to_meal_plan": """
        You are a nutrition coach. Based on the user's fitness goal (e.g. lose weight, gain muscle, maintain energy),
        generate a 7‑day meal plan with exactly three dishes per day (breakfast, lunch, dinner).
        Return **only** a JSON array of 21 dish‑name strings in order:
        ["day1_breakfast", "day1_lunch", "day1_dinner",
        "day2_breakfast", "day2_lunch", "day2_dinner",
        …,
        "day7_breakfast", "day7_lunch", "day7_dinner"]
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
def get_recipe_from_mood(mood_txt):
    model = get_model("mood_to_recipe")
    response = model.generate_content(mood_txt)
    raw_text = response.text.strip()
    recipe_names = [item.strip() for item in raw_text.split(',') if item.strip()]
    return recipe_names

# create 7-day meal plan based on user goal
def generate_meal_plan(meal_plan_goal):
    model = get_model("goal_to_meal_plan")
    prompt = f"Given my meal plan goal, create a full week meal plan: {meal_plan_goal}"
    response = model.generate_content(prompt)
    raw = response.text.strip()
    if raw.startswith("```"):
        raw = "\n".join(raw.splitlines()[1:-1]).strip()
    keywords = json.loads(raw)
    if not isinstance(keywords, list) or any(not isinstance(k, str) for k in keywords):
        raise ValueError(f"output wasnt a list of strings: {keywords!r}")
    if len(keywords) != 21:
        raise ValueError(f"wanted 21 items for meal-plan, got {len(keywords)}: {keywords!r}")
    return [k.strip() for k in keywords]


