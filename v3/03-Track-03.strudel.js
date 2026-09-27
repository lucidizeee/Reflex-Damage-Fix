// @title Track 03 (working title)
// @by Eign0x
// Reflex Damage / v3 / Fast industrial stepper / metallic FM bass / full-time drops
// Export 0-140; 200 BPM; 1 cycle = 4 beats.
// FIRST_DROP = 24; intro / build / drop / development / outro.
// 000-008 Factory room
// 008-016 Machine starts
// 016-024 Tom build
// 024-032 Immediate full-time drop
// 032-048 Double-time release
// 048-064 Collision
// 064-072 Percussion cut
// 072-088 Driving kick variation
// 088-096 Rebuild
// 096-120 Last drive
// 120-128 Drum drive out
// 128-136 Factory tail

const BPM = 200;
const END = 136;
const LEVEL = 0.55;
const START_CYCLE = 0;
const LOOP = false;
setcps(BPM / 240);
await samples({
  'rd_909kick': '909/BT0A0A7.WAV',
  'rd_hard': 'sd/rytm-00-hard.wav',
  'rd_factory': 'industrial/006_07.wav',
  'rd_tom': '808ht/HT25.WAV',
  'rd_hat': 'hh/000_hh3closedhh.wav'
}, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/');

const sub = p => note(p).s("sine").lpf(105).pan(0.5)
  .attack(0.01).decay(0.10).sustain(0.75).release(0.065).clip(0.83).gain(0.95).orbit(2);
const k = p => s(p).end(0.55).lpf(1800).gain(0.64).orbit(1);
const sn = p => s(p).hpf(160).lpf(9200).gain(0.40).orbit(1);
const hh = p => s(p).end(0.18).hpf(5200).gain("0.13 0.07 0.10 0.055").orbit(1);
const lift = s("white*8").hpf(1600).lpf(saw.range(1800,7000).slow(8))
  .attack(0.01).decay(0.065).sustain(0).release(0.025)
  .gain(saw.range(0.012,0.075).slow(8)).orbit(4);

// Programmed industrial break: a different kit, no raw or Amen layer.
const ka = k("<[rd_909kick ~ ~ rd_909kick ~ ~ rd_909kick ~] [rd_909kick ~ ~ ~ rd_909kick ~ rd_909kick ~]>");
const kb = k("<[rd_909kick ~ rd_909kick ~ ~ rd_909kick ~ ~] [rd_909kick ~ ~ rd_909kick ~ ~ rd_909kick ~]>");
const back = sn("~ rd_hard ~ rd_hard");
const hats = hh("<rd_hat*8 [rd_hat ~ rd_hat rd_hat ~ rd_hat rd_hat ~]>");
const hit = s("rd_factory").end(0.85).hpf(600).lpf(4500).gain(0.17).orbit(4);
const machine = hit.struct("<[~ ~ x ~ ~ x ~ ~] [~ x ~ ~ ~ ~ x ~]>");
const tom = s("~ ~ ~ [rd_tom rd_tom]").speed("0.8 0.65").end(0.35).hpf(100).gain(0.26).orbit(1);
const a = stack(ka,back,hats);
const b = stack(kb,back,hh("rd_hat ~ rd_hat ~ rd_hat rd_hat ~ rd_hat"),machine);
const turn = stack(k("rd_909kick ~ ~ ~"),sn("~ rd_hard ~ ~"),tom);
const groove = arrange([4,a],[2,b],[1,a],[1,turn]);
const reply = arrange([2,b],[2,a],[2,b],[1,a],[1,turn]);
const drive = stack(k("rd_909kick*4").gain(0.48),back,hats);
const lowA = "<[cs2 ~ cs2 ~ g1 ~ b1 ~] [cs2 ~ e2 ~ cs2 ~ d2 ~]>";
const lowB = "<[cs2 ~ g1 cs2 ~ b1 cs2 ~] [d2 ~ cs2 ~ e2 ~ g1 ~]>";
const growl = p => note(p).s("sine").fm(2.4).fmh(2).fmdecay(0.09).fmsustain(0.08)
  .hpf(100).lpf(sine.range(900,2400).slow(4)).lpq(0.65).attack(0.01).decay(0.16).sustain(0.3).release(0.05)
  .clip(0.52).distort(0.4).gain(0.34).orbit(2);
const bassA = stack(sub(lowA),growl(lowA));
const bassB = stack(sub(lowB),growl(lowB).fm(3.0));
const air = s("brown").slow(4).hpf(500).lpf(1700).attack(0.7).release(0.6).gain(0.035).orbit(3);
const bell = note("<[cs4 ~ g3 ~] [~ d4 ~ b3]>").slow(2).s("sine").fm(1.7).fmh(1.47)
  .attack(0.003).decay(0.25).sustain(0).release(0.18).hpf(350).gain(0.12).room(0.12).orbit(3);
const build = arrange([4,stack(machine,bell)],[3,stack(hats,tom)],[1,sn("rd_hard rd_hard rd_hard ~").gain(0.20)]);

const song = arrange(
  [8, stack(air,bell)],
  [8, stack(machine,bell)],
  [8, build],
  [8, stack(groove,bassA)],
  [16, stack(groove,bassA)],
  [16, stack(reply,bassB,bell)],
  [8, stack(machine,tom,air)],
  [16, stack(drive,bassB,bell)],
  [8, stack(build,air)],
  [24, stack(reply,bassB,bell)],
  [8, stack(groove,sub("cs2 ~ g1 ~"))],
  [8, stack(air,bell)]
);

const fade = signal(t => {
  const pos = LOOP ? Number(t) % END : Number(t);
  return LEVEL * Math.max(0, Math.min(1, (END - pos) / 8));
});
song.postgain(fade).filterWhen(t => Number(t) >= 0 && (LOOP || Number(t) < END)).early(START_CYCLE)
