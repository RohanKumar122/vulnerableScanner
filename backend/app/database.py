from pymongo import MongoClient
import os

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017/"))
db = client["website_scraper"]
links_collection = db["links"]