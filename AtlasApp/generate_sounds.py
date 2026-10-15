#!/usr/bin/env python3
"""
generate_sounds.py – Generates emergency alert sounds as .caf files
for the Atlas iOS app. Requires Python 3 stdlib only (struct, wave).

.caf (Core Audio Format) = AIFF-C variant; for notifications iOS also
accepts raw .wav renamed to .caf.  This script produces a minimal
WAVE file and writes it with a .caf extension – iOS accepts this for
UNNotificationSound.

Usage:
    python3 generate_sounds.py
Output files are written into AtlasApp/ (next to Info.plist).
"""

import struct, math, os

SAMPLE_RATE = 44100
OUTPUT_DIR  = os.path.join(os.path.dirname(__file__), "AtlasApp")


def sine_samples(freq: float, duration: float, amplitude: float = 0.7) -> list[int]:
    """Return a list of 16-bit PCM samples for a sine wave."""
    n = int(SAMPLE_RATE * duration)
    return [
        int(amplitude * 32767 * math.sin(2 * math.pi * freq * i / SAMPLE_RATE))
        for i in range(n)
    ]


def sweep_samples(freq_start: float, freq_end: float, duration: float,
                  amplitude: float = 0.7) -> list[int]:
    """Linear frequency sweep (chirp)."""
    n = int(SAMPLE_RATE * duration)
    result = []
    for i in range(n):
        t = i / SAMPLE_RATE
        freq = freq_start + (freq_end - freq_start) * (i / n)
        result.append(int(amplitude * 32767 * math.sin(2 * math.pi * freq * t)))
    return result


def fade(samples: list[int], fade_ms: int = 10) -> list[int]:
    """Apply a short fade-in and fade-out to avoid clicking."""
    fade_n = int(SAMPLE_RATE * fade_ms / 1000)
    out = list(samples)
    for i in range(min(fade_n, len(out))):
        factor = i / fade_n
        out[i] = int(out[i] * factor)
    for i in range(min(fade_n, len(out))):
        idx = len(out) - 1 - i
        factor = i / fade_n
        out[idx] = int(out[idx] * factor)
    return out


def write_wav_caf(filename: str, samples: list[int]) -> None:
    """Write samples as a WAV file with .caf extension (iOS accepts this)."""
    path = os.path.join(OUTPUT_DIR, filename)
    num_samples = len(samples)
    data_size   = num_samples * 2           # 16-bit = 2 bytes/sample

    with open(path, "wb") as f:
        # RIFF header
        f.write(b"RIFF")
        f.write(struct.pack("<I", 36 + data_size))  # ChunkSize
        f.write(b"WAVE")
        # fmt  sub-chunk
        f.write(b"fmt ")
        f.write(struct.pack("<I", 16))              # Subchunk1Size = 16 for PCM
        f.write(struct.pack("<H", 1))               # AudioFormat = PCM
        f.write(struct.pack("<H", 1))               # NumChannels = mono
        f.write(struct.pack("<I", SAMPLE_RATE))     # SampleRate
        f.write(struct.pack("<I", SAMPLE_RATE * 2)) # ByteRate
        f.write(struct.pack("<H", 2))               # BlockAlign
        f.write(struct.pack("<H", 16))              # BitsPerSample
        # data sub-chunk
        f.write(b"data")
        f.write(struct.pack("<I", data_size))
        for s in samples:
            f.write(struct.pack("<h", max(-32768, min(32767, s))))

    print(f"  ✓ {filename}  ({num_samples / SAMPLE_RATE:.2f}s, {os.path.getsize(path)} bytes)")


def generate_emergency_siren() -> None:
    """Rising siren wail repeated 3 times – 2.4 s total."""
    samples: list[int] = []
    for _ in range(3):
        samples += fade(sweep_samples(600, 1400, 0.4, 0.8))
        samples += fade(sweep_samples(1400, 600, 0.4, 0.7))
    write_wav_caf("emergency_siren.caf", samples)


def generate_alert_tone() -> None:
    """Triple short beep – used for warning-level alerts – 0.9 s total."""
    samples: list[int] = []
    for _ in range(3):
        samples += fade(sine_samples(880, 0.15, 0.75))
        samples += [0] * int(SAMPLE_RATE * 0.15)   # 150 ms silence
    write_wav_caf("alert_tone.caf", samples)


def generate_dispatch_tone() -> None:
    """Two-tone horn (police-style) – 1.2 s total."""
    samples: list[int] = []
    for _ in range(2):
        samples += fade(sine_samples(960,  0.25, 0.8))
        samples += fade(sine_samples(1200, 0.25, 0.8))
        samples += [0] * int(SAMPLE_RATE * 0.1)
    write_wav_caf("dispatch_tone.caf", samples)


if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print("Generating Atlas alert sounds …")
    generate_emergency_siren()
    generate_alert_tone()
    generate_dispatch_tone()
    print("Done. Add these .caf files to the Xcode project (AtlasApp target).")
