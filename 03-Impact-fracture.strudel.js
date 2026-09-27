// @title Impact fracture
// @by Eign0x
// Reflex Damage Fix | Track 03 | Raw break drive / dark Reese / clipped industrial stabs
// Export: start 0, end 148 (includes effect tail). 1 cycle = 4 beats.
// Intro contains no break; build precedes the first full drop.
// 000-008: drone, ticks
// 008-016: drums.hpf(950).gain(0.22), drone, rise
// 016-032: drums, k, sn, bassA, hats
// 032-048: reply, k, sn, bassA, motif
// 048-056: half, bassHalf, ticks
// 056-064: drums, k, bassB
// 064-080: drone, bassHalf, motif
// 080-088: build, drone, rise
// 088-112: reply, k, sn, bassB, hats, ticks
// 112-128: drums, k, sn, bassA, motif
// 128-136: drums, sub(lowA).gain(0.70)
// 136-144: drone, ticks

const BPM = 184;
const END = 144;
const LEVEL = 0.60;
const START_CYCLE = 0;
const LOOP = false;
setcps(BPM / 240);

// Samples: same palette as No warning.
await samples({
  rd_raw: 'breaks165/000_RAWCLN.WAV',
  rd_amen: 'breaks152/000_AMEN.WAV',
  rd_kick: 'bd/BT0AADA.wav',
  rd_snare: 'sd/rytm-01-classic.wav',
  rd_hard: 'sd/rytm-00-hard.wav',
  rd_hat: 'hh/000_hh3closedhh.wav',
  rd_metal: 'metal/003_3.wav'
}, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/');

// Instruments
const raw = p => s('rd_raw').slice(4, p)
  .speed(BPM * 1.4228798185941043 / 240).clip(1)
  .hpf(115).lpf(11000).gain(0.68).orbit(1);
const amen = p => s('rd_amen').slice(12, p)
  .speed(BPM * 4.6998412698412695 / 720).clip(1)
  .hpf(145).lpf(10500).gain(0.68).orbit(1);
const kick = p => s(p).end(0.46).lpf(1500).gain(0.76).orbit(1);
const snare = p => s(p).hpf(170).lpf(9000).gain(0.36).orbit(1);
const hat = p => s(p).end(0.075).hpf(5500)
  .gain("0.13 0.065 0.10 0.055").pan("0.46 0.54").orbit(1);
const sub = p => note(p).s('sine').lpf(110)
  .attack(0.008).decay(0.10).sustain(0.82).release(0.065)
  .clip(0.88).gain(1.02).pan(0.5).orbit(2);
const reese = p => note(p).s('supersaw').unison(3).detune(0.22).spread(0.30)
  .hpf(110).lpf(sine.range(380, 1150).slow(8)).lpq(0.8)
  .lpenv(1.4).lpattack(0.015).lpdecay(0.20).lpsustain(0.25)
  .attack(0.008).decay(0.16).sustain(0.65).release(0.08)
  .clip(0.80).distort(0.65).gain(0.38).orbit(2);
const air = p => note(p).s('supersaw').unison(3).detune(0.12).spread(0.75)
  .hpf(180).lpf(780).attack(0.60).release(1.10).clip(0.94)
  .gain(0.18).room(0.30).roomsize(3).roomlp(2200).orbit(3);
const metal = p => s(p).speed("0.72 1 0.84 1.12").end(0.70)
  .hpf(500).lpf(3800).gain(0.20).pan("0.3 0.7")
  .room(0.12).roomsize(1.3).orbit(4);
const rise = s("white*8").hpf(1000).lpf(saw.range(1600, 7600).slow(8))
  .attack(0.008).decay(0.07).sustain(0).release(0.025)
  .gain(saw.range(0.015, 0.11).slow(8)).orbit(4);

// One beat per slice. Fills use eighths, never rapid random microchops.
const a = raw("0 1 2 3");
const b = raw("<[0 1 0 3] [2 1 2 3]>");
const c = raw("0 1 [2 0] 3");
const fill = raw("0 1 [2 2] [3 ~]");
const drums = arrange([3, a], [1, b], [2, a], [1, c], [1, fill]);
const reply = arrange([2, b], [2, a], [2, c], [1, a], [1, fill]);
const k = kick("<[rd_kick ~ ~ ~ ~ rd_kick ~ ~] [rd_kick ~ ~ rd_kick ~ ~ ~ ~]>").gain(0.48);
const sn = snare("~ rd_hard ~ rd_hard").gain(0.22);
const hats = hat("<rd_hat*8 [rd_hat ~ rd_hat ~ rd_hat rd_hat ~ rd_hat]>");
const half = stack(kick("rd_kick ~ ~ ~ ~ ~ rd_kick ~").gain(0.58), snare("~ ~ rd_hard ~"), hat("rd_hat*4"));

const lowA = "<[f1@2 ~ f1 ~ c2 ~ gb1] [f1 ~ ~ eb1 f1@2 ~ ~]>";
const lowB = "<[f1 ~ c2 ~ gb1 ~ f1 ~] [eb1@2 ~ f1 ~ gb1 f1 ~]>";
const bassA = stack(sub(lowA), reese(lowA));
const bassB = stack(sub(lowB), reese(lowB).lpf(1500).lpenv(1.7));
const bassHalf = stack(sub("<f1@3 ~ [gb1@2 ~ f1]>"), reese("<f1@3 ~ [gb1@2 ~ f1]>").lpf(680).gain(0.24));
// Open fifths and a semitone tension; no piano or extended jazz harmony.
const drone = air("<[f3,c4] [gb3,c4] [f3,c4] [eb3,c4]>").slow(4);
const motif = note("<[f3 ~ ~ gb3 ~ ~ c3 ~] [f3 ~ eb3 ~ ~ ~ ~ ~]>").slow(2)
  .s('supersaw').unison(2).detune(0.08).hpf(270).lpf(1250)
  .attack(0.012).decay(0.18).sustain(0.12).release(0.20).clip(0.68)
  .gain(0.15).room(0.18).roomsize(2.4).roomlp(1800).orbit(3);
const ticks = metal("<rd_metal ~ [~ rd_metal] ~>").slow(2).gain(0.12);
// One clear build, with the last beat left open for the drop.
const build = arrange([4, a.hpf(1600).gain(0.16)], [2, b.hpf(900).gain(0.30)],
  [1, snare("rd_snare*4").gain(0.14)], [1, snare("rd_snare rd_snare rd_snare ~").gain(0.22)]);

const song = arrange(
  [8, stack(drone, ticks)],
  [8, stack(drums.hpf(950).gain(0.22), drone, rise)],
  [16, stack(drums, k, sn, bassA, hats)],
  [16, stack(reply, k, sn, bassA, motif)],
  [8, stack(half, bassHalf, ticks)],
  [8, stack(drums, k, bassB)],
  [16, stack(drone, bassHalf, motif)],
  [8, stack(build, drone, rise)],
  [24, stack(reply, k, sn, bassB, hats, ticks)],
  [16, stack(drums, k, sn, bassA, motif)],
  [8, stack(drums, sub(lowA).gain(0.70))],
  [8, stack(drone, ticks)]
);

const fade = signal(t => {
  const pos = LOOP ? Number(t) % END : Number(t);
  return LEVEL * Math.max(0, Math.min(1, (END - pos) / 8));
});
song.postgain(fade)
  .filterWhen(t => Number(t) >= 0 && (LOOP || Number(t) < END))
  .early(START_CYCLE)

