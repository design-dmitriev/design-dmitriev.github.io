#!/usr/bin/env python3
"""Сжатие картинок для портфолио: любой формат -> WebP.

  python3 tools/optimize-images.py portfolio/img/<папка> файл1.png файл2.jpg ...
      слайды 1.webp, 2.webp ... (900 px по ширине), миниатюры N-t.webp (240 px), cover.webp (450x600) из первого
  python3 tools/optimize-images.py --rich portfolio/img/rich/5 длинный_макет.png
      длинный макет: 5.webp (1080 px), 5-lq.webp (заглушка), 5-cover.webp (верх макета 450x600)
"""
import sys, os
from PIL import Image

Q = 78


def save(im, path, q=Q):
    im.save(path, 'WEBP', quality=q, method=6)
    print(f'{path}: {os.path.getsize(path) // 1024} КБ')


def slides(out, files):
    os.makedirs(out, exist_ok=True)
    for i, f in enumerate(files, 1):
        im = Image.open(f).convert('RGB')
        a = im.resize((900, 1200), Image.LANCZOS)
        save(a, f'{out}/{i}.webp')
        save(a.resize((240, 320), Image.LANCZOS), f'{out}/{i}-t.webp', 74)
        if i == 1:
            save(a.resize((450, 600), Image.LANCZOS), f'{out}/cover.webp')


def rich(base, f):
    os.makedirs(os.path.dirname(base) or '.', exist_ok=True)
    im = Image.open(f).convert('RGB')
    w = 1080
    h = round(im.height * w / im.width)
    a = im.resize((w, h), Image.LANCZOS)
    save(a, base + '.webp')
    save(a.resize((200, round(h * 200 / w)), Image.LANCZOS), base + '-lq.webp', 30)
    save(a.crop((0, 0, w, round(w * 4 / 3))).resize((450, 600), Image.LANCZOS), base + '-cover.webp')
    print(f'w={w} h={h}  (внести в portfolio/cards.json -> rich.items)')


if __name__ == '__main__':
    args = sys.argv[1:]
    if args and args[0] == '--rich':
        rich(args[1], args[2])
    elif len(args) >= 2:
        slides(args[0], args[1:])
    else:
        print(__doc__)
