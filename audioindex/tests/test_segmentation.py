import pytest

np = pytest.importorskip("numpy")

librosa = pytest.importorskip("librosa")

from audioindex.segmentation import segments_on_beats
from audioindex.tests.audio_synth_utils import click_track


def test_bounds_monotonic():
    sr = 24000
    T = 2.0
    y = click_track(sr, T, freq=2)  # beats every 0.5s
    segs = segments_on_beats(y, sr)
    assert all(b > a for a, b in segs)
