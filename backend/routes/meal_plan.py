from flask import request, Blueprint, jsonify
from config import Config
import requests
import os
from dotenv import load_dotenv

load_dotenv()

meal_plan_bp = Blueprint('recipes', __name__)
SPOON_API_KEY = os.getenv('SPOONACULAR_API_KEY')