import os
from pymemcache.client import base

client = base.Client((os.getenv('mem_host', 'localhost'), os.getenv('mem_port', 11211)))

def add_rec(key, value):
    client.set(str(key), value)

def get_rec(key):
    value = client.get(str(key))
    return (int(value))