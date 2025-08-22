import numpy as np
import librosa

HOP = 512

def _bounds_from_frames(frames: np.ndarray, n_samples: int) -> np.ndarray:
    last_f = int(np.ceil(n_samples / HOP))
    return np.r_[0, frames, last_f]

def segments_on_onsets(y, sr):
    onset_frames = librosa.onset.onset_detect(y=y, sr=sr, hop_length=HOP, backtrack=True)
    bounds = _bounds_from_frames(onset_frames, len(y))
    times = librosa.frames_to_time(bounds, sr=sr, hop_length=HOP)
    return list(zip(times[:-1], times[1:]))

def segments_on_beats(y, sr):
    _, beats = librosa.beat.beat_track(y=y, sr=sr, hop_length=HOP, units="frames")
    bounds = _bounds_from_frames(beats, len(y))
    times = librosa.frames_to_time(bounds, sr=sr, hop_length=HOP)
    return list(zip(times[:-1], times[1:]))
