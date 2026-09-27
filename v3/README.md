# Reflex Damage — v3

Judul Track 01–05 masih sementara. Revisi ini mengikuti masukan setelah v2 didengarkan.

| Track | Perubahan | BPM | Export cycles |
| --- | --- | ---: | --- |
| [01](01-Track-01.strudel.js) | Sama persis dengan v2 | 180 | 0–148 |
| [02](02-Track-02.strudel.js) | Plead dimainkan utuh selama tujuh bar; fill berupa jeda pendek. Bass lebih renggang, hat tambahan dikeluarkan dari drop, echo stab dikurangi. | 176 | 0–140 |
| [03](03-Track-03.strudel.js) | Tempo naik dari 186 ke 200. Drop langsung full-time, bagian halftime diganti drive. Pola kick baru, bass metallic FM di C-sharp, motif bell baru. | 200 | 0–140 |
| [04](04-Track-04.strudel.js) | Lead empat bar dengan jawaban lebih tinggi di drop kedua. Sub diperkuat, bass harmonik saw ditambahkan agar terdengar di speaker kecil. | 172 | 0–140 |
| [05](05-Track-05.strudel.js) | Acid bass, rave stabs, tempo dan bentuk drop dipertahankan. Potongan berulang tiap dua bar dihapus; pergantian sumber break setiap empat bar, hat/kick tambahan dan echo dikurangi. | 192 | 0–148 |

## Play dan export

Copy seluruh isi satu file ke https://strudel.cc/, Stop pola sebelumnya, lalu Play. Tunggu sampel dimuat. Tiap file dapat dimainkan sendiri.

Untuk export penuh: `START_CYCLE = 0`, `LOOP = false`, lalu gunakan rentang di tabel. Satu cycle adalah empat ketuk; empat cycle terakhir pada rentang export disediakan untuk ekor efek.

Untuk langsung membandingkan drop pertama: Track 02 cycle **24**, Track 03 **24**, Track 04 **24**, Track 05 **24**. Drop kedua: Track 02 **88**, Track 03 **96**, Track 04 **80**, Track 05 **88**. Ubah `START_CYCLE` untuk mendengarkan bagian tersebut, lalu kembalikan ke 0 sebelum export.

Validasi: seluruh pola dievaluasi dengan Strudel, sampel sumber dimuat, dan delapan cuplikan drop dirender dengan Superdough. Pemeriksaan ini mencakup error pola, sample yang hilang, overlap break, serta level cuplikan; bukan mastering WAV album penuh.

Versi sebelumnya tersedia di [v2](../v2/README.md).
