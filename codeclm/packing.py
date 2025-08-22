import torch

SEP, EOS = 1, 2

def pack_codes(codebooks: list[torch.LongTensor]) -> torch.LongTensor:
    T = codebooks[0].numel()
    seq = []
    for t in range(T):
        for cb in codebooks:
            seq.append(int(cb[t]))
        seq.append(SEP)
    seq.append(EOS)
    return torch.tensor(seq, dtype=torch.long)


def unpack_codes(seq: torch.LongTensor, n_codebooks: int) -> list[torch.LongTensor]:
    buckets = [[] for _ in range(n_codebooks)]
    k = 0
    for tok in seq.tolist():
        if tok == EOS:
            break
        if tok == SEP:
            k = 0
            continue
        buckets[k].append(tok)
        k += 1
    return [torch.tensor(b, dtype=torch.long) for b in buckets]
