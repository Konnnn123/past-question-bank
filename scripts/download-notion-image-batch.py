#!/usr/bin/env python3
"""Download a batch of short-lived Notion image URLs into a local media cache."""

from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import re
import urllib.request
from pathlib import Path


def suffix(content_type: str | None, url: str) -> str:
    if content_type:
        guessed = mimetypes.guess_extension(content_type.split(";", 1)[0].strip())
        if guessed:
            return guessed
    found = re.search(r"\.(png|jpe?g|webp|gif)(?:[?#]|$)", url, re.I)
    return "." + found.group(1).lower() if found else ".bin"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--entries-base64", required=True, help="UTF-8 JSON [{pageId, urls}]")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    entries = json.loads(base64.b64decode(args.entries_base64).decode("utf-8"))
    args.output.mkdir(parents=True, exist_ok=True)
    written = 0
    for entry in entries:
        page_id = entry["pageId"].replace("-", "")
        for index, url in enumerate(entry["urls"]):
            request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(request, timeout=45) as response:
                body = response.read()
                destination = args.output / f"notion_{page_id}_{index}{suffix(response.headers.get('Content-Type'), url)}"
                destination.write_bytes(body)
                written += 1
    print(f"Downloaded {written} images into {args.output}")


if __name__ == "__main__":
    main()
