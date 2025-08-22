
def click_track(sr: int, T: float, freq: int = 2):
    import numpy as np
    y = np.zeros(int(sr * T), dtype="float32")
    step = sr // freq
    y[::step] = 1.0
    return y
