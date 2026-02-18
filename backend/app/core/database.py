# 1. import thư viện cần thiết
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://TUNG:06qSikXo3zp5sn6O@tttnwithha.7gm7jqb.mongodb.net/?appName=TTTNwithHA"

client = MongoClient(MONGO_URI)

db = client["mg_app"]

