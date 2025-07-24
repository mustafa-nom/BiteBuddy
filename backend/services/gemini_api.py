import google.generativeai as genai
import sys
import os
import requests
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import Config

# set up w/ key and model instructions
genai.configure(api_key=Config.GEMINI_API_KEY)
system_instructions = {
    "mood_to_recipe": """
        You are a recipe assistant. Based on a user's mood or craving, respond with 2 or 3 specific dish or food names that are popular and likely to exist in the Spoonacular recipe database.
        Return them as a short, comma-separated list (e.g., "chocolate cake, scrambled eggs, french toast").
        Do not explain anything or include full sentences. Keep the answer short and usable as a search query.

    """,

    "goal_to_meal_plan": """
        You are a nutrition coach. Based on the user's fitness goal (e.g., lose weight, gain muscle, maintain energy), generate a 1-day meal plan.
        Include breakfast, lunch, dinner, and snacks with brief ingredient lists. Prioritize balance and practicality.
    """,
}

# get the model and its instructions based on current purpose
def get_model(purpose):
    instructions = system_instructions[purpose]
    return genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=instructions,
    )

# return list of recipes based on mood
def get_recipe_from_mood(mood_txt):
    model = get_model("mood_to_recipe")
    response = model.generate_content(mood_txt)
    print(response.text.strip())
    raw_text = response.text.strip()
    recipe_names = [item.strip() for item in raw_text.split(',') if item.strip()]
    print (recipe_names)
    return recipe_names

# create 1-day meal plan based on user goal
def generate_meal_plan(meal_plan_goal):
    model = get_model("goal_to_meal_plan")
    prompt = f"Given my meal plan goal, create a full day meal plan: {meal_plan_goal}"
    response = model.generate_content(prompt)
    raw_text = response.text.strip()
    print(raw_text)
    return raw_text


