"""Generate placeholder transparent PNGs for Expo assets."""
import struct, zlib, os

def png(w, h, path):
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    ihdr_chunk = b'IHDR' + ihdr
    ihdr_full = struct.pack('>I', len(ihdr)) + ihdr_chunk + struct.pack('>I', zlib.crc32(ihdr_chunk) & 0xffffffff)
    raw = b''
    for _ in range(h):
        raw += b'\x00' + b'\x00' * (w * 4)
    comp = zlib.compress(raw, 9)
    idat_chunk = b'IDAT' + comp
    idat_full = struct.pack('>I', len(comp)) + idat_chunk + struct.pack('>I', zlib.crc32(idat_chunk) & 0xffffffff)
    iend_chunk = b'IEND'
    iend_full = struct.pack('>I', 0) + iend_chunk + struct.pack('>I', zlib.crc32(iend_chunk) & 0xffffffff)
    with open(path, 'wb') as f:
        f.write(sig + ihdr_full + idat_full + iend_full)

os.makedirs('assets', exist_ok=True)
png(1024, 1024, 'assets/icon.png')
png(1284, 2778, 'assets/splash.png')
png(1024, 1024, 'assets/adaptive-icon.png')
png(48, 48, 'assets/favicon.png')
print('OK', os.listdir('assets'))