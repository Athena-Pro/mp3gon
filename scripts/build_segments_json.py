"""Utility to build segments.json for MP3gon overlay."""

import json
from pathlib import Path

from audioindex.index import SegMeta


def build_segments(metas: list[SegMeta], out_path: str) -> None:
    data = [m.__dict__ for m in metas]
    Path(out_path).write_text(json.dumps(data, indent=2))
