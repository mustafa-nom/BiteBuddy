from flask import Flask
from flask_cors import CORS
import os
from routes.recipes import recipes_bp  
from routes.map import map_bp
from routes.meal_plan import meal_plan_bp
from routes.fridge import fridge_bp

app = Flask(__name__)
CORS(app)

# -- Register Blueprints --
app.register_blueprint(map_bp, url_prefix="/map")
app.register_blueprint(meal_plan_bp, url_prefix="/meal_plan")
app.register_blueprint(recipes_bp, url_prefix="/recipes")
app.register_blueprint(fridge_bp, url_prefix="/fridge")

@app.route('/')
def home():
    return {
        "message": "BiteBuddy works!",
        "endpoints": {
            "recipes" : "recipes/suggest?mood=Im lazy",
            "map" : "/map/recipe",
            "meal_plan": "meal_plan/suggest?goal=lean bulk",
            "fridge": "fridge/search?ingredient=white eggs"
        }
    }

if __name__ == "__main__":
    app.run(debug=True)
