#!/usr/bin/env python3
"""Explicit one-way sync of the canonical catalog into a website JSON snapshot."""
import hashlib,json,sys
from pathlib import Path
website=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]).expanduser().resolve() if len(sys.argv)>1 else website.parent/"catalog"/"data"/"resources.json"
entries=json.loads(source.read_text(encoding="utf-8"))
assert isinstance(entries,list) and all(item.get("id") and item.get("url") for item in entries)
ids=[item["id"] for item in entries]
assert len(ids)==len(set(ids))
dest=website/"data"/"resources.json"
dest.parent.mkdir(parents=True,exist_ok=True)
body=json.dumps(entries,indent=2,ensure_ascii=False)+"\n"
dest.write_text(body,encoding="utf-8")
print(f"Synced {len(entries)} records -> {dest} | sha256={hashlib.sha256(body.encode()).hexdigest()}")
