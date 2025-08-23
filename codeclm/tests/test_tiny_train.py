import pytest

torch = pytest.importorskip("torch")

from codeclm.model import CodecGPT


def test_forward_shapes():
    model = CodecGPT(vocab_size=10, d=16, n_layer=1, n_head=2, max_len=16)
    x = torch.randint(0, 10, (2, 5))
    y = model(x)
    assert y.shape == (2, 5, 10)
