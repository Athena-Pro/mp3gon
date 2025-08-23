import hashlib
import os
from typing import Optional, List

import numpy as np
import torch
import torchaudio
from laion_clap import CLAP_Module

SR_CLAP = 48_000
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

_clap_model = None

def _clap():
    global _clap_model
    if _clap_model is None:
        m = CLAP_Module(enable_fusion=False).to(DEVICE).eval()
        m.load_ckpt("clap_htsat_fused")
        _clap_model = m
    return _clap_model


def _hash_arr(arr: np.ndarray) -> str:
    return hashlib.sha1(arr.tobytes()).hexdigest()[:16]


def embed_audio_segment(wav: torch.Tensor, sr: int, cache_dir: Optional[str] = None) -> np.ndarray:
    if wav.dim() == 1:
        wav = wav.unsqueeze(0)
    wav = torchaudio.functional.resample(wav, sr, SR_CLAP)
    key = _hash_arr(wav.cpu().numpy()) if cache_dir else None
    path = os.path.join(cache_dir, f"{key}.npy") if cache_dir else None
    if path and os.path.exists(path):
        return np.load(path)
    z = _clap().get_audio_embedding_from_data(x=wav.to(DEVICE)).cpu().numpy()
    if path:
        os.makedirs(cache_dir, exist_ok=True)
        np.save(path, z)
    return z


def embed_text_queries(texts: List[str]) -> np.ndarray:
    return _clap().get_text_embedding(texts).cpu().numpy()
