import torch
import torch.nn as nn


class CodecGPT(nn.Module):
    def __init__(self, vocab_size, d: int = 768, n_layer: int = 12, n_head: int = 12,
                 max_len: int = 8192, pdrop: float = 0.1):
        super().__init__()
        self.tok = nn.Embedding(vocab_size, d)
        self.pos = nn.Embedding(max_len, d)
        self.blocks = nn.ModuleList(
            [nn.TransformerEncoderLayer(d, n_head, 4 * d, batch_first=True,
                                        activation="gelu", dropout=pdrop)
             for _ in range(n_layer)]
        )
        self.norm = nn.LayerNorm(d)
        self.head = nn.Linear(d, vocab_size)

    def forward(self, x, cond=None):
        B, T = x.shape
        h = self.tok(x) + self.pos(torch.arange(T, device=x.device))[None]
        if cond is not None:
            h = torch.cat([cond, h], 1)
        for blk in self.blocks:
            h = blk(h)
        return self.head(self.norm(h))[:, -T:]
