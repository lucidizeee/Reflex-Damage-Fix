# Reflex Damage — v4

Judul masih sementara. Versi ini memperbaiki dasar ritme, bukan hanya mengganti sampel.

| Track | Perubahan / identitas | BPM | Export cycles |
| --- | --- | ---: | --- |
| [01](01-Track-01.strudel.js) | Raw roller sebagai acuan; sama persis dengan v3. | 180 | 0–148 |
| [02](02-Track-02.strudel.js) | Plead dihapus. Kick/snare disusun satu per satu, dengan frasa tanya-jawab dua bar, bass renggang, echo pendek. | 184 | 0–140 |
| [03](03-Track-03.strudel.js) | Kick dan snare asimetris dalam dua bar; aksen hat 3-3-2; bass mengikuti kick. Bukan backbeat Track 01. | 200 | 0–140 |
| [04](04-Track-04.strudel.js) | Halftime utama dihapus, intro dipendekkan, break cepat sejak drop pertama. Lead memakai tegangan semitone, nada pendek, dan distorsi ringan. | 196 | 0–132 |
| [05](05-Track-05.strudel.js) | Break dan acid bass v3 dipertahankan. Hook empat bar bergantian dengan rave stabs; turnaround pendek menandai akhir frasa. | 192 | 0–148 |

## Play

Copy seluruh isi satu file ke https://strudel.cc/, Stop pola lama, kemudian Play. Tunggu sampel selesai dimuat pada pemutaran pertama. File mandiri, satu track per pemutaran.

Untuk export penuh gunakan `START_CYCLE = 0` dan `LOOP = false`; rentang pada tabel termasuk empat cycle untuk ekor efek. Satu cycle adalah empat ketuk.

Drop untuk perbandingan: Track 01 cycle 16/88; Track 02 cycle 24/88; Track 03 cycle 24/96; Track 04 cycle 16/68; Track 05 cycle 40/88. Track 05 cycle 40–48 mencakup pergantian rave stabs ke hook baru.

## Batas pemeriksaan

Seluruh aransemen diperiksa dengan Strudel. Posisi kick/snare yang diprogram dibandingkan dengan mengabaikan nama sampelnya; kelimanya berbeda. Ini bukan analisis semua transient yang tertanam dalam sampel break Track 01 dan 05.

Dua cuplikan delapan bar per track dirender dengan Superdough untuk memeriksa sample loading, output audio dan clipping. Lingkungan ini tidak menyediakan fasilitas mendengarkan audio, jadi versi ini belum mendapat penilaian dengar oleh assistant dan tidak diklaim sudah pasti enak didengar. Render cuplikan juga bukan mastering album penuh.

Versi sebelumnya: [v3](../v3/README.md).
