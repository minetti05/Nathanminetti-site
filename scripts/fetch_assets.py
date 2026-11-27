"""Downloads the files in scripts/assets-manifest.json into the repo, byte for byte.

Run by .github/workflows/fetch-assets.yml. Files that already exist are never
overwritten. Nothing is resized, recompressed or edited. A report is written to
scripts/assets-report.txt.
"""
import json, os, urllib.request

UA = {"User-Agent": "Mozilla/5.0 (asset fetch for nathanminetti-site)"}

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def is_image(b):
    return b[:3] == b"\xff\xd8\xff" or b[:8] == b"\x89PNG\r\n\x1a\n" or b[:4] == b"RIFF"

def best(candidates):
    """Try each URL and keep the largest real image (the highest resolution available)."""
    found = []
    for u in candidates:
        try:
            b = get(u)
            if is_image(b):
                found.append((len(b), b, u))
        except Exception as e:  # noqa: BLE001
            print(f"  miss {u}: {e}")
    if not found:
        return None, None
    found.sort(key=lambda x: x[0], reverse=True)
    return found[0][1], found[0][2]

def main():
    manifest = json.load(open("scripts/assets-manifest.json"))
    report, failures = [], 0
    for item in manifest["items"]:
        dest, t = item["dest"], item["type"]
        if os.path.exists(dest):
            report.append(f"exists  {dest}")
            continue
        data = src = None
        if t == "original":
            data, src = best([item["url"], item["url"] + "?format=original"])
        elif t == "youtube":
            for name in ("maxresdefault", "sddefault", "hqdefault"):
                d, s = best([f"https://i.ytimg.com/vi/{item['id']}/{name}.jpg"])
                if d and len(d) > 3000:  # YouTube returns a tiny grey image when a size is missing
                    data, src = d, s
                    break
        elif t == "oembed":
            try:
                thumb = json.loads(get(item["url"]))["thumbnail_url"]
                cands = [thumb]
                if "i.scdn.co" in thumb:
                    cands.insert(0, thumb.replace("ab67616d00001e02", "ab67616d0000b273"))
                if "vimeocdn" in thumb:
                    import re
                    cands.insert(0, re.sub(r"_\d+x\d+", "_1920x1080", thumb))
                data, src = best(cands)
            except Exception as e:  # noqa: BLE001
                print(f"  oembed failed {item['url']}: {e}")
        if not data:
            failures += 1
            report.append(f"FAILED  {dest}")
            continue
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "wb") as f:
            f.write(data)
        report.append(f"ok      {dest}  {len(data)} bytes  from {src}")
        print(report[-1])
    with open("scripts/assets-report.txt", "w") as f:
        f.write("\n".join(report) + f"\n\nfailures: {failures}\n")
    print(f"done, failures: {failures}")

if __name__ == "__main__":
    main()
