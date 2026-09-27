// @title Track 01 (working title)
// @by Eign0x
// Reflex Damage / v2 / Raw roller / original F-minor identity
// Export 0-148; 180 BPM; 1 cycle = 4 beats.
// FIRST_DROP = 16; intro / build / drop / development / outro.
// 000-008 Metal and air
// 008-016 Filtered build
// 016-032 Full roller drop
// 032-048 Hook enters
// 048-064 Bass response
// 064-080 Halftime valley
// 080-088 Rebuild
// 088-112 Second drop / alternate break
// 112-128 Return to theme
// 128-136 Drum exit
// 136-144 Air tail

const BPM = 180;
const END = 144;
const LEVEL = 0.55;
const START_CYCLE = 0;
const LOOP = false;
setcps(BPM / 240);
await samples({
  'rd_raw': 'breaks165/000_RAWCLN.WAV',
  'rd_kick': 'bd/BT0AADA.wav',
  'rd_snare': 'sd/rytm-01-classic.wav',
  'rd_hat': 'hh/000_hh3closedhh.wav',
  'rd_metal': 'metal/003_3.wav'
}, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/');

const sub = p => note(p).s("sine").lpf(105).pan(0.5)
  .attack(0.01).decay(0.10).sustain(0.75).release(0.065).clip(0.83).gain(0.95).orbit(2);
const k = p => s(p).end(0.55).lpf(1800).gain(0.64).orbit(1);
const sn = p => s(p).hpf(160).lpf(9200).gain(0.40).orbit(1);
const hh = p => s(p).end(0.18).hpf(5200).gain("0.13 0.07 0.10 0.055").orbit(1);
const lift = s("white*8").hpf(1600).lpf(saw.range(1800,7000).slow(8))
  .attack(0.01).decay(0.065).sustain(0).release(0.025)
  .gain(saw.range(0.012,0.075).slow(8)).orbit(4);

// Raw roller: intact beat-sized chunks, two-bar replies, one short fill per 8 bars.
const raw = p => s("rd_raw").slice(4,p).speed(BPM*1.4228798185941043/240)
  .clip(1).attack(0.001).release(0.003).hpf(120).lpf(11000).gain(0.68).orbit(1);
const a = raw("0 1 2 3");
const b = raw("<[0 1 0 3] [2 1 2 3]>");
const fill = raw("0 1 [2 2] [3 ~]");
const groove = arrange([3,a],[1,b],[3,a],[1,fill]);
const answer = arrange([2,b],[2,a],[2,raw("0 1 [2 0] 3")],[1,a],[1,fill]);
const support = stack(k("rd_kick ~ ~ ~ ~ rd_kick ~ ~").gain(0.40),sn("~ rd_snare ~ rd_snare").gain(0.20));
const hats = hh("<rd_hat*8 [rd_hat ~ rd_hat rd_hat ~ rd_hat rd_hat ~]>");
const reese = p => note(p).s("supersaw").unison(3).detune(0.22).spread(0.3)
  .hpf(115).lpf(sine.range(450,1300).slow(8)).lpq(0.7).lpenv(1.3)
  .attack(0.01).decay(0.16).sustain(0.6).release(0.08).clip(0.8).distort(0.6).gain(0.30).orbit(2);
const lowA = "<[f1@3 ~ f1 ~ eb1 gb1] [f1@2 ~ f1 ~ ~ ab1 g1]>";
const lowB = "<[f1 ~ f1 ~ c2 ~ eb1 f1] [gb1@2 ~ f1 ~ eb1 f1 ~]>";
const bassA = stack(sub(lowA),reese(lowA));
const bassB = stack(sub(lowB),reese(lowB).lpf(1600));
const air = note("<[f3,c4] [gb3,c4]>").slow(4).s("supersaw").unison(2).detune(0.1)
  .hpf(220).lpf(700).attack(0.6).release(0.9).gain(0.12).room(0.25).roomsize(3).orbit(3);
const hook = note("<[f3 ~ ab3 ~ g3 ~ ~ ~] [f3 ~ eb3 ~ gb3 ~ ~ ~]>").slow(2)
  .s("sawtooth").hpf(250).lpf(1300).attack(0.015).decay(0.2).sustain(0.12).release(0.2).gain(0.13).room(0.15).orbit(3);
const metal = s("rd_metal ~ ~ ~ ~ ~ rd_metal ~").slow(2).speed(0.75).end(0.6).hpf(700).gain(0.10).orbit(4);
const half = stack(k("rd_kick ~ ~ ~"),sn("~ ~ rd_snare ~"),hh("rd_hat*4"));
const build = arrange([4,groove.hpf(1400).gain(0.18)],[3,groove.hpf(700).gain(0.32)],[1,sn("rd_snare rd_snare rd_snare ~").gain(0.20)]);

const song = arrange(
  [8, stack(air,metal)],
  [8, stack(build,air,lift)],
  [16, stack(groove,support,bassA,hats)],
  [16, stack(answer,support,bassA,hook)],
  [16, stack(groove,support,bassB,metal)],
  [16, stack(half,sub("f1@3 ~"),air)],
  [8, stack(build,lift,hook)],
  [24, stack(answer,support,bassB,hats)],
  [16, stack(groove,support,bassA,hook)],
  [8, stack(groove,sub(lowA))],
  [8, stack(air,metal)]
);

const fade = signal(t => {
  const pos = LOOP ? Number(t) % END : Number(t);
  return LEVEL * Math.max(0, Math.min(1, (END - pos) / 8));
});
song.postgain(fade).filterWhen(t => Number(t) >= 0 && (LOOP || Number(t) < END)).early(START_CYCLE)
