import argparse
import glob
import json
import os

import faiss
import soundfile as sf
import numpy as np
import torch

from ..segmentation import segments_on_onsets, segments_on_beats
from ..embeddings import embed_audio_segment
from ..index import SegmentIndex, SegMeta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in_glob", required=True)
    ap.add_argument("--seg", choices=["onsets", "beats"], default="beats")
    ap.add_argument("--out_idx", required=True)
    ap.add_argument("--out_meta", required=True)
    ap.add_argument("--cache", default=None)
    args = ap.parse_args()

    idx = SegmentIndex(dim=512)
    seg_fn = segments_on_beats if args.seg == "beats" else segments_on_onsets
    metas, feats = [], []

    for path in glob.glob(args.in_glob):
        y, sr = sf.read(path, dtype="float32")
        if y.ndim == 2:
            y = y.mean(axis=1)
        segs = seg_fn(y, sr)
        for j, (s, e) in enumerate(segs):
            s_i, e_i = int(s * sr), int(e * sr)
            z = embed_audio_segment(torch.from_numpy(y[s_i:e_i]), sr, cache_dir=args.cache)
            feats.append(z.squeeze(0))
            metas.append(SegMeta(track_id=os.path.basename(path), seg_id=j,
                                 start=float(s), end=float(e), sr=sr, path=path))

    X = np.stack(feats, axis=0)
    idx.add(X, metas)
    faiss.write_index(idx.index, args.out_idx)
    with open(args.out_meta, "w") as f:
        json.dump([m.__dict__ for m in metas], f, indent=2)


if __name__ == "__main__":
    main()
