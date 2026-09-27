// @title Track 04 (working title)
// @by Eign0x
// Reflex Damage / v2 / 808 halftime / percussion / deep FM sub pressure
// Export 0-140; 172 BPM; 1 cycle = 4 beats.
// FIRST_DROP = 24; intro / build / drop / development / outro.
// 000-016 Pressure chamber
// 016-024 Percussion gathers
// 024-040 Sub-first halftime drop
// 040-056 Sonar reply
// 056-064 Empty room
// 064-072 Pulse returns
// 072-080 Dry build
// 080-104 Double-time second drop
// 104-120 Back to weight
// 120-128 Percussion exit
// 128-136 Air tail

const BPM = 172;
const END = 136;
const LEVEL = 0.55;
const START_CYCLE = 0;
const LOOP = false;
setcps(BPM / 240);
await samples({
  'rd_808kick': '808bd/BD0050.WAV',
  'rd_808snare': '808sd/SD5025.WAV',
  'rd_perc': 'perc/002_perc2.wav',
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

// Sparse 808 stepper. Snare on beat 3 in the first drop, backbeat later.
const kickA = k("<[rd_808kick ~ ~ ~ ~ ~ rd_808kick ~] [rd_808kick ~ ~ rd_808kick ~ ~ ~ ~]>").end(0.20).gain(0.55);
const kickB = k("<[rd_808kick ~ ~ ~ ~ rd_808kick ~ ~] [~ rd_808kick ~ ~ rd_808kick ~ ~ ~]>").end(0.20).gain(0.55);
const hatA = hh("~ rd_jhat ~ ~ rd_jhat ~ ~ rd_jhat").swingBy(0.08,4);
const clicks = s("<[rd_perc ~ ~ rd_perc ~ ~ ~ ~] [~ ~ rd_perc ~ ~ rd_perc ~ ~]>").end(0.5).hpf(900).gain(0.13).pan("<0.35 0.65>").orbit(4);
const half = stack(kickA,sn("~ ~ rd_808snare ~").gain(0.50),hatA,clicks);
const full = stack(kickB,sn("~ rd_808snare ~ rd_808snare").gain(0.43),hh("rd_jhat*8"),clicks);
const turn = stack(kickA,sn("~ rd_808snare ~ [rd_808snare ~]").gain(0.43),hh("~ ~ ~ rd_jopen"));
const groove = arrange([6,half],[1,half],[1,turn]);
const reply = arrange([4,full],[2,half],[1,full],[1,turn]);
const lowA = "<[e1@3 ~ ~ b1 ~ ~] [e1@2 ~ ~ f1@2 ~ ~]>";
const lowB = "<[e1 ~ ~ b1 ~ e1 ~ ~] [f1@2 ~ e1 ~ ~ d2 ~]>";
const weight = p => note(p).s("sine").fm(0.65).fmh(1).fmdecay(0.4).fmsustain(0.1)
  .hpf(110).lpf(800).attack(0.06).decay(0.3).sustain(0.55).release(0.15).gain(0.23).orbit(2);
const bassA = stack(sub(lowA).release(0.1),weight(lowA));
const bassB = stack(sub(lowB),weight(lowB).lpf(1400));
const air = note("<[e3,b3] [f3,b3]>").slow(8).s("triangle").hpf(260).lpf(750)
  .attack(1.8).release(1.6).gain(0.14).room(0.35).roomsize(4).orbit(3);
const sonar = note("<e4 ~ b3 ~>").slow(2).s("sine").attack(0.01).decay(0.12).sustain(0).release(0.25)
  .gain(0.08).delay(0.25).delaytime(90/BPM).delayfeedback(0.35).orbit(3);
const build = arrange([4,stack(clicks,sonar)],[3,hatA],[1,sn("rd_808snare ~ rd_808snare ~").gain(0.18)]);

const song = arrange(
  [16, stack(air,sonar)],
  [8, stack(build,air)],
  [16, stack(groove,bassA)],
  [16, stack(groove,bassB,sonar)],
  [8, stack(air,sonar)],
  [8, stack(clicks,hatA,sub("e1 ~ ~ ~"))],
  [8, build],
  [24, stack(reply,bassB)],
  [16, stack(groove,bassA,sonar)],
  [8, stack(clicks,hatA)],
  [8, stack(air,sonar)]
);

const fade = signal(t => {
  const pos = LOOP ? Number(t) % END : Number(t);
  return LEVEL * Math.max(0, Math.min(1, (END - pos) / 8));
});
song.postgain(fade).filterWhen(t => Number(t) >= 0 && (LOOP || Number(t) < END)).early(START_CYCLE)
