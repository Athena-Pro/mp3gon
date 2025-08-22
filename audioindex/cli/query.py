import argparse
import json

import faiss
import numpy as np
import soundfile as sf
import torch

from ..embeddings import embed_text_queries, embed_audio_segment
from ..index import SegmentIndex, SegMeta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--idx")
    ap.add_argument("--meta")
    ap.add_argument("--text")
    ap.add_argument("--wav")
    ap.add_argument("--topk", type=int, default=10)
    args = ap.parse_args()

    base = SegmentIndex(dim=512)
    base.index = faiss.read_index(args.idx)
    metas = [SegMeta(**m) for m in json.load(open(args.meta))]
    base.metas = metas

    if args.text:
        Q = embed_text_queries([args.text])
    else:
        y, sr = sf.read(args.wav, dtype="float32")
        if y.ndim == 2:
            y = y.mean(axis=1)
        Q = embed_audio_segment(torch.from_numpy(y), sr)

    results = base.search(Q, topk=args.topk)[0]
    print(json.dumps([
        {"track": m.track_id, "seg": m.seg_id, "start": m.start, "end": m.end, "score": score}
        for m, score in results
    ], indent=2))


if __name__ == "__main__":
    main()
