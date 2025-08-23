build-index:
	audioindex-build --in_glob 'data/wavs/*.wav' --seg beats --out_idx artifacts/idx.faiss --out_meta artifacts/meta.json --cache .cache/clap

query:
	audioindex-query --idx artifacts/idx.faiss --meta artifacts/meta.json --text "funk guitar mutes" --topk 10

train-codec:
	codeclm-train
