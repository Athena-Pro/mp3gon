import soundfile as sf
import numpy as np


def slice_wav(path: str, sr: int, start: float, end: float) -> np.ndarray:
    y, srx = sf.read(path, dtype="float32")
    if y.ndim == 2:
        y = y.mean(axis=1)
    assert srx == sr, f"SR mismatch: {srx} vs {sr}"
    s_i, e_i = int(start * sr), int(end * sr)
    return y[s_i:e_i]
