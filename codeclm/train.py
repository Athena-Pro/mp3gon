import torch
import torch.nn as nn
import yaml
from torch.utils.data import DataLoader

from .dataset import TokenDataset
from .model import CodecGPT


def train(cfg_path: str = "configs/codec24k.yaml"):
    cfg = yaml.safe_load(open(cfg_path))
    ds = TokenDataset(cfg["data"]["glob"], codec=None, max_len=cfg["train"]["ctx"])
    dl = DataLoader(
        ds,
        batch_size=cfg["train"]["batch"],
        shuffle=True,
        collate_fn=lambda b: {"tokens": nn.utils.rnn.pad_sequence([x["tokens"] for x in b], batch_first=True, padding_value=0)},
    )
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = CodecGPT(
        vocab_size=cfg["model"]["vocab"],
        d=cfg["model"]["d"],
        n_layer=cfg["model"]["L"],
        n_head=cfg["model"]["H"],
        max_len=cfg["train"]["ctx"],
    ).to(device)
    opt = torch.optim.AdamW(model.parameters(), lr=cfg["train"]["lr"])
    for step, batch in enumerate(dl):
        x = batch["tokens"][:, :-1].to(device)
        y = batch["tokens"][:, 1:].to(device)
        logits = model(x)
        loss = nn.functional.cross_entropy(logits.reshape(-1, logits.size(-1)), y.reshape(-1), label_smoothing=0.1)
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
        opt.zero_grad()
        if step % 50 == 0:
            print(f"step {step} loss {loss.item():.3f}")


if __name__ == "__main__":
    train()
