from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

env = os.getenv("APP_ENV", "production")
load_dotenv(".env.staging" if env == "staging" else ".env", override=True)

uri = os.getenv("DATABASE_URL")
client = MongoClient(uri, server_api=ServerApi('1'))

try:
    client.admin.command('ping')
    print(f"Connected to MongoDB ({env})")
except Exception as e:
    print(f"Failed to connect to MongoDB ({env}): {e}")
