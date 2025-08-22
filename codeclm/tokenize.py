import torch
import torchaudio
import numpy as np

TARGET_SR = 24_000

def to_24k_mono(y: np.ndarray, sr: int) -> torch.Tensor:
    t = torch.from_numpy(y.astype("float32"))
    if t.ndim == 2:
        t = t.mean(1)
    t = t.unsqueeze(0)
    if sr != TARGET_SR:
        t = torchaudio.functional.resample(t, sr, TARGET_SR)
    return t


def encode_encodec(t_24k: torch.Tensor, codec) -> list[torch.LongTensor]:
    codes = codec.encode(t_24k)
    return [c.squeeze(0).cpu().long() for c in codes]
