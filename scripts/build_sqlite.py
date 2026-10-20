"""Optional analytical SQLite database generated from the bundled official CSV snapshots.
Run: python scripts/build_sqlite.py
The database file is ignored by git; app continues working without it.
"""
import csv
import sqlite3
from pathlib import Path
root=Path(__file__).resolve().parents[1]
db=root/'data'/'aeropulse.sqlite'
conn=sqlite3.connect(db)
with conn:
    conn.executescript('''
    DROP TABLE IF EXISTS yow_passengers;
    CREATE TABLE yow_passengers (
      airport TEXT NOT NULL, year INTEGER NOT NULL, month INTEGER NOT NULL CHECK(month BETWEEN 1 AND 12),
      domestic INTEGER NOT NULL, transborder INTEGER NOT NULL, international INTEGER NOT NULL,
      total INTEGER NOT NULL, status TEXT NOT NULL,
      PRIMARY KEY (airport, year, month),
      CHECK(total=domestic+transborder+international)
    );
    DROP TABLE IF EXISTS yyz_annual;
    CREATE TABLE yyz_annual (
      airport TEXT NOT NULL, year INTEGER NOT NULL, domestic_m REAL,
      international_m REAL,total_m REAL NOT NULL,precision TEXT NOT NULL,
      PRIMARY KEY(airport,year)
    );
    ''')
    with (root/'data'/'yow_monthly.csv').open(newline='') as f:
        conn.executemany('INSERT INTO yow_passengers VALUES (:airport,:year,:month,:domestic,:transborder,:international,:total,:status)',list(csv.DictReader(f)))
    with (root/'data'/'yyz_annual.csv').open(newline='') as f:
        conn.executemany('INSERT INTO yyz_annual VALUES (:airport,:year,:domestic_m,:international_m,:total_m,:precision)',list(csv.DictReader(f)))
print('Created',db,'with',conn.execute('SELECT COUNT(*) FROM yow_passengers').fetchone()[0],'YOW records')
conn.close()


