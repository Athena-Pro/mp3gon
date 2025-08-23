import pytest

torch = pytest.importorskip("torch")

from codeclm.packing import pack_codes, unpack_codes


def test_round_trip():
    c1 = torch.tensor([1, 2, 3])
    c2 = torch.tensor([4, 5, 6])
    seq = pack_codes([c1, c2])
    out1, out2 = unpack_codes(seq, 2)
    assert torch.equal(c1, out1)
    assert torch.equal(c2, out2)
