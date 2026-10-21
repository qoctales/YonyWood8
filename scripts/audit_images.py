import os

def audit():
    code_files = []
    for root, dirs, files in os.walk('src'):
        for f in files:
            if f.endswith(('.ts', '.tsx', '.json', '.css', '.html')):
                code_files.append(os.path.join(root, f))
    for f in ['index.html', 'server.ts', 'public/manifest.json']:
        if os.path.exists(f):
            code_files.append(f)

    code_text = ''
    for path in code_files:
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                code_text += f.read() + '\n'
        except Exception:
            pass

    # Check src/assets/images
    unused_src = []
    if os.path.exists('src/assets/images'):
        for f in os.listdir('src/assets/images'):
            full_path = os.path.join('src/assets/images', f)
            if os.path.isfile(full_path):
                size = os.path.getsize(full_path)
                if f not in code_text:
                    unused_src.append((full_path, f, size))

    # Check public
    unused_public = []
    # Protected system files in public
    protected_public = {
        'icon.svg', 'apple-touch-icon.png', 'manifest.json', 'favicon.ico',
        'yonywood-logo.svg', 'yonywood-logo-gras.svg', 'yonywood-logo-moyen.svg',
        'logo-yonywood.svg', 'logo-yonywood-clean.svg', 'logo-yonywood-clean.png',
        'logo YonyWood.png', 'yonywoodlogo.jpg'
    }

    for root, dirs, files in os.walk('public'):
        for f in files:
            full_path = os.path.join(root, f)
            if not os.path.isfile(full_path):
                continue
            if f in protected_public:
                continue
            rel_path = os.path.relpath(full_path, 'public')
            # Check various ways it could be referenced
            variations = [
                f,
                rel_path,
                '/' + rel_path,
                rel_path.replace('\\', '/'),
                '/' + rel_path.replace('\\', '/'),
            ]
            is_referenced = any(v in code_text for v in variations)
            if not is_referenced:
                size = os.path.getsize(full_path)
                unused_public.append((full_path, rel_path, size))

    print(f"Unused src/assets/images count: {len(unused_src)}")
    print(f"Unused src/assets/images total MB: {sum(s for _, _, s in unused_src)/(1024*1024):.2f}")
    print(f"Unused public count: {len(unused_public)}")
    print(f"Unused public total MB: {sum(s for _, _, s in unused_public)/(1024*1024):.2f}")

    with open('unused_src_images.txt', 'w') as f_out:
        for p, name, size in sorted(unused_src, key=lambda x: -x[2]):
            f_out.write(f"{size}\t{p}\n")

    with open('unused_public_images.txt', 'w') as f_out:
        for p, name, size in sorted(unused_public, key=lambda x: -x[2]):
            f_out.write(f"{size}\t{p}\n")

if __name__ == '__main__':
    audit()
