import os 
from dotenv import load_dotenv
load_dotenv()

class Config:
    ASTRA_DB_API_ENDPOINT = os.getenv("ASTRA_DB_API_ENDPOINT")
    ASTRA_DB_APPLICATION_TOKEN = os.getenv("ASTRADB_APPLICATION_TOKEN")
    ASTRA_DB_KEYSPACE = os.getenv("ASTRA_DB_KEYSPACE")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    EMBEDDING_MODEL = "BAAI/bge-base-en-v1.5"
    RAG_MODEL = "llama-3.1-8b-instant"
    # llama-3.3-70b-versatile  or meta-llama/llama-guard-4-12b