import glob
import soundfile as sf
import torch
from torch.utils.data import Dataset

from .tokenize import to_24k_mono, encode_encodec
from .packing import pack_codes


class TokenDataset(Dataset):
    def __init__(self, glob_wav: str, codec, max_len: int = 8192):
        self._paths = glob.glob(glob_wav)
        self.codec = codec
        self.max_len = max_len

    def __len__(self) -> int:
        return len(self._paths)

    def __getitem__(self, i: int):
        y, sr = sf.read(self._paths[i], dtype="float32")
        t = to_24k_mono(y, sr)
        codes = encode_encodec(t, self.codec)
        seq = pack_codes(codes)[: self.max_len]
        return {"tokens": seq}
