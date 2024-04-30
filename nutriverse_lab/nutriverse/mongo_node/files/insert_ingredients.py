import pandas as pd
from pymongo import MongoClient


df = pd.read_excel('Book1.xlsx', engine='openpyxl')

mongo_uri = 'mongodb://localhost:27017'
database_name = 'nutriverse'
collection_name = 'food'


client = MongoClient(mongo_uri)
db = client[database_name]
collection = db[collection_name]
collection.insert_many(df.to_dict('records'))

client.close()

print("Data inserted into MongoDB collection successfully.")
