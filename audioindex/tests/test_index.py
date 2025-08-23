import pytest
np = pytest.importorskip("numpy")
faiss = pytest.importorskip("faiss")


from audioindex.index import SegmentIndex, SegMeta


def test_search_shapes():
    idx = SegmentIndex(dim=2)
    X = np.array([[1, 0], [0, 1]], dtype=np.float32)
    metas = [SegMeta("a", 0, 0.0, 1.0, 1, "a.wav"), SegMeta("b", 0, 0.0, 1.0, 1, "b.wav")]
    idx.add(X, metas)
    Q = np.array([[1, 0]], dtype=np.float32)
    out = idx.search(Q, topk=1)
    assert len(out[0]) == 1
    assert out[0][0][0].track_id == "a"
