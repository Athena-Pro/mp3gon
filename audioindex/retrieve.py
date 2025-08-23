from typing import List
import torch

from .embeddings import embed_text_queries, embed_audio_segment
from .index import SegmentIndex


def text_to_segments(text: str, idx: SegmentIndex, topk: int = 10):
    q = embed_text_queries([text])
    return idx.search(q, topk=topk)[0]


def audio_to_segments(wav: torch.Tensor, sr: int, idx: SegmentIndex, topk: int = 10):
    q = embed_audio_segment(wav, sr)
    return idx.search(q, topk=topk)[0]
