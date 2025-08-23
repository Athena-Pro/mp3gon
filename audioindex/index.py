from dataclasses import dataclass
from typing import List, Tuple

import faiss
import numpy as np


@dataclass
class SegMeta:
    track_id: str
    seg_id: int
    start: float
    end: float
    sr: int
    path: str


class SegmentIndex:
    def __init__(self, dim: int = 512):
        self.index = faiss.IndexFlatIP(dim)
        self.metas: List[SegMeta] = []

    @staticmethod
    def _l2n(x: np.ndarray) -> np.ndarray:
        return x / (np.linalg.norm(x, axis=1, keepdims=True) + 1e-9)

    def add(self, X: np.ndarray, metas: List[SegMeta]) -> None:
        Xn = self._l2n(X.astype(np.float32))
        self.index.add(Xn)
        self.metas.extend(metas)

    def search(self, Q: np.ndarray, topk: int = 10) -> List[List[Tuple[SegMeta, float]]]:
        Qn = self._l2n(Q.astype(np.float32))
        D, I = self.index.search(Qn, topk)
        out: List[List[Tuple[SegMeta, float]]] = []
        for b in range(Q.shape[0]):
            out.append([(self.metas[i], float(D[b, j])) for j, i in enumerate(I[b]) if i != -1])
        return out
