// @title Track 02 (working title)
// @by Eign0x
// Reflex Damage / v3 / Intact Plead groove / sparse dub / stable bass
// Export 0-140; 176 BPM; 1 cycle = 4 beats.
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

const BPM = 176;
const END = 136;
const LEVEL = 0.55;
const START_CYCLE = 0;
const LOOP = false;
setcps(BPM / 240);
await samples({
  'rd_plead': 'breaks157/000_PLEAD.WAV',
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

// Plead source is one bar: measured length, no assumed sample BPM.
const br = p => s("rd_plead").slice(4,p).speed(BPM*1.8162131519274376/240)
  .clip(1).attack(0.001).release(0.003).hpf(140).lpf(9500).gain(0.65).orbit(1);
// Full-bar playback preserves the original kick/snare and ghost-note timing.
const a = s("rd_plead").speed(BPM*1.8162131519274376/240).clip(1)
  .attack(0.001).release(0.003).hpf(140).lpf(9500).gain(0.65).orbit(1);
const b = br("0 1 2 3");
const turn = br("0 1 2 ~");
const groove = arrange([7,a],[1,turn]);
const reply = arrange([6,a],[1,b],[1,turn]);
const support = k("rd_808kick ~ ~ ~").end(0.12).gain(0.25);
const claps = sn("~ ~ ~ rd_clap").gain(0.10);
// Extra hats only in interludes: the break supplies its own top end in drops.
const hats = stack(hh("~ rd_jhat ~ rd_jhat").gain(0.07),hh("~ ~ ~ rd_jopen").gain(0.045));
const lowA = "<[g1@3 ~ ~ ~ f1 ~] [g1@2 ~ ~ d2@2 ~ ~]>";
const lowB = "<[g1@2 ~ ~ f1@2 ~ ~] [bb1@2 ~ ~ g1@2 ~ ~]>";
const pluck = p => note(p).s("triangle").hpf(110).lpf(900).attack(0.008).decay(0.22).sustain(0.08).release(0.06).clip(0.68).gain(0.34).orbit(2);
const bassA = stack(sub(lowA),pluck(lowA));
const bassB = stack(sub(lowB),pluck(lowB).lpf(1500));
const stab = note("<[g3,d4] [f3,c4] [g3,d4] [bb3,f4]>").struct("~ x ~ ~")
  .s("sawtooth").hpf(420).lpf(1800).attack(0.005).decay(0.09).sustain(0).release(0.12)
  .gain(0.12).delay(0.12).delaytime(90/BPM).delayfeedback(0.18).orbit(3);
const air = note("<g3 d4>").slow(4).s("triangle").hpf(300).lpf(1000).attack(0.8).release(1).gain(0.10).room(0.4).orbit(3);
const build = arrange([4,br("0 ~ 2 ~").hpf(1200).gain(0.2)],[2,hats],[2,claps]);
const pocket = stack(br("0 ~ ~ 3").gain(0.38),support,stab);

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
