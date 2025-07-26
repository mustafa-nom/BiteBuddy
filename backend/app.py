from flask import Flask
from flask_cors import CORS
import os
from routes.recipes import recipes_bp  
from routes.map import map_bp
from routes.meal_plan import meal_plan_bp

app = Flask(__name__)
CORS(app)

# -- Register Blueprints --
app.register_blueprint(map_bp, url_prefix="/map")
app.register_blueprint(meal_plan_bp, url_prefix="/meal_plan")
app.register_blueprint(recipes_bp, url_prefix="/recipes")

@app.route('/')
def home():
    return {
        "message": "BiteBuddy works!",
        "endpoints": {
            "recipes" : "recipes/by-ingredients?ingredients=flour,water",
            "map" : "/map/recipe"
        }
    }

if __name__ == "__main__":
    app.run(debug=True)
