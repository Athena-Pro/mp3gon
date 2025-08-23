import torch

from .model import CodecGPT
from .packing import unpack_codes


def generate(model: CodecGPT, prompt: torch.LongTensor, max_len: int = 100) -> torch.LongTensor:
    model.eval()
    with torch.no_grad():
        out = [prompt]
        for _ in range(max_len):
            x = torch.cat(out, dim=1)
            logits = model(x)
            next_tok = torch.argmax(logits[:, -1], dim=-1, keepdim=True)
            out.append(next_tok)
            if int(next_tok.item()) == 2:  # EOS
                break
        return torch.cat(out, dim=1)
