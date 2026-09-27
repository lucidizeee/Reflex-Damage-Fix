// @title Track 02 (working title)
// @by Eign0x
// Reflex Damage / v4 / Dry programmed break / two-bar question and answer / dark pulse bass
// Export 0-140; 184 BPM; 1 cycle = 4 beats.
// FIRST_DROP = 16; intro / build / drop / development / outro.
// 000-008 Echo stabs
// 008-016 Shuffle build
// 016-024 Drum-only drop
// 024-040 Sub arrives
// 040-056 Dub reply
// 056-064 Bass cut / echo pocket
// 064-080 Bass and hat interlude
// 080-088 Drums re-enter without riser
// 088-112 Second drop / bass and break together
// 112-128 Roll out
// 128-136 Echo tail

const BPM = 184;
const END = 136;
const LEVEL = 0.55;
const START_CYCLE = 0;
const LOOP = false;
setcps(BPM / 240);
await samples({
  'rd_jkick': 'jazz/000_BD.wav',
  'rd_jsnare': 'jazz/007_SN.wav',
  'rd_808kick': '808bd/BD0050.WAV',
  'rd_clap': 'cp/HANDCLP0.wav',
  'rd_jhat': 'jazz/003_HH.wav',
  'rd_jopen': 'jazz/004_OH.wav'
}, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/');

const sub = p => note(p).s("sine").lpf(105).pan(0.5)
  .attack(0.01).decay(0.10).sustain(0.75).release(0.065).clip(0.83).gain(0.95).orbit(2);
const k = p => s(p).end(0.55).lpf(1800).gain(0.64).orbit(1);
const sn = p => s(p).hpf(160).lpf(9200).gain(0.40).orbit(1);
const hh = p => s(p).end(0.18).hpf(5200).gain("0.13 0.07 0.10 0.055").orbit(1);
const lift = s("white*8").hpf(1600).lpf(saw.range(1800,7000).slow(8))
  .attack(0.01).decay(0.065).sustain(0).release(0.025)
  .gain(saw.range(0.012,0.075).slow(8)).orbit(4);

// No loop sample. Every kick/snare hit is explicitly placed on a 16-step grid.
const drumKick = p => k(p).end(0.8).gain(0.66);
const drumSnare = p => sn(p).gain(0.48);
const a = stack(
  drumKick("rd_jkick ~ ~ ~ ~ ~ rd_jkick ~ ~ ~ rd_jkick ~ ~ ~ ~ ~"),
  drumSnare("~ ~ ~ ~ rd_jsnare ~ ~ ~ ~ ~ ~ ~ rd_jsnare ~ ~ ~"),
  hh("~ rd_jhat ~ rd_jhat ~ rd_jhat ~ rd_jhat").gain(0.09));
const b = stack(
  drumKick("rd_jkick ~ ~ ~ ~ ~ ~ ~ rd_jkick ~ ~ ~ ~ ~ rd_jkick ~"),
  drumSnare("~ ~ ~ ~ rd_jsnare ~ ~ ~ ~ ~ rd_jsnare ~ ~ ~ ~ ~"),
  hh("~ rd_jhat ~ ~ ~ rd_jhat ~ rd_jopen").gain(0.08));
const turn = stack(drumKick("rd_jkick ~ ~ ~"),drumSnare("~ rd_jsnare ~ rd_jsnare"));
const groove = arrange([1,a],[1,b],[1,a],[1,b],[1,a],[1,b],[1,a],[1,turn]);
const reply = arrange([1,b],[1,a],[1,b],[1,a],[1,b],[1,a],[1,b],[1,turn]);
const support = k("rd_808kick ~ ~ ~").end(0.10).gain(0.18);
const claps = sn("~ ~ ~ rd_clap").gain(0.09);
const hats = hh("~ rd_jhat ~ rd_jhat").gain(0.07);
const lowA = "<[g1@3 ~ ~ ~ f1 ~] [g1@2 ~ ~ d2@2 ~ ~]>";
const lowB = "<[g1@2 ~ ~ f1@2 ~ ~] [bb1@2 ~ ~ g1@2 ~ ~]>";
const pluck = p => note(p).s("triangle").hpf(110).lpf(900).attack(0.008).decay(0.22).sustain(0.08).release(0.06).clip(0.68).gain(0.34).orbit(2);
const bassA = stack(sub(lowA),pluck(lowA));
const bassB = stack(sub(lowB),pluck(lowB).lpf(1500));
const stab = note("<[g3,d4] [f3,c4] [g3,d4] [bb3,f4]>").struct("~ ~ x ~")
  .s("sawtooth").hpf(420).lpf(1800).attack(0.005).decay(0.09).sustain(0).release(0.12)
  .gain(0.12).delay(0.06).delaytime(90/BPM).delayfeedback(0.10).orbit(3);
const air = note("<g3 d4>").slow(4).s("triangle").hpf(300).lpf(1000).attack(0.8).release(1).gain(0.10).room(0.4).orbit(3);
const build = arrange([4,hats],[3,a.hpf(950).gain(0.18)],[1,claps]);
const pocket = stack(drumKick("rd_jkick ~ ~ ~"),hats,stab);

const song = arrange(
  [8, stack(stab,air)],
  [8, stack(build,air)],
  [8, stack(groove,support)],
  [16, stack(groove,support,bassA,claps)],
  [16, stack(reply,bassB,stab)],
  [8, pocket],
  [16, stack(bassA,hats,air)],
  [8, stack(build,stab)],
  [24, stack(reply,support,bassB)],
  [16, stack(groove,bassA,stab)],
  [8, stack(stab,air)]
);

const fade = signal(t => {
  const pos = LOOP ? Number(t) % END : Number(t);
  return LEVEL * Math.max(0, Math.min(1, (END - pos) / 8));
});
song.postgain(fade).filterWhen(t => Number(t) >= 0 && (LOOP || Number(t) < END)).early(START_CYCLE)
