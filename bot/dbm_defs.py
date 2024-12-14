import dbm

DB_FILE = 'data.dbm'

def add_rec(key, value):
    with dbm.open(DB_FILE, 'c') as db:
        db[str(key)] = str(value)

def get_rec(key):
    with dbm.open(DB_FILE, 'r') as db:
        value = db.get(str(key))
        if value is None:
            raise KeyError(f"Key '{key}' not found in the database.")
        return int(value)