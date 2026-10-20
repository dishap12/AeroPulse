"""Validate generated airport data independent of line endings or blank lines."""
from pathlib import Path
import csv
import io
import subprocess

ROOT = Path(__file__).resolve().parents[1]
FILES = ["data/yow_monthly.csv", "data/yyz_annual.csv", "data/airport-data.js"]

def committed(path: str) -> str:
    return subprocess.run(
        ["git", "show", f"HEAD:{path}"], cwd=ROOT,
        capture_output=True, text=True, check=True
    ).stdout

def records(text: str):
    return [row for row in csv.reader(io.StringIO(text)) if row]

for item in FILES:
    current = (ROOT / item).read_text(encoding="utf-8")
    original = committed(item)
    if item.endswith(".csv"):
        assert records(current) == records(original), f"Dataset changed: {item}"
    else:
        assert current.strip() == original.strip(), f"Generated bundle changed: {item}"
    print(f"MATCH {item}")

print("Generated data matches the committed snapshot.")
