from flask import Flask

from .config import load

app = Flask(__name__)

config = load()

if not config:
    print("config not found!")
    exit(1)
