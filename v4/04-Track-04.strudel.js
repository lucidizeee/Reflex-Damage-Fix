// @title Track 04 (working title)
// @by Eign0x
// Reflex Damage / v4 / Fast broken 808 groove / dark semitone lead / driven harmonic bass
// Export 0-132; 196 BPM; 1 cycle = 4 beats.
// FIRST_DROP = 16; intro / build / drop / development / outro.
// 000-008 Dark intro
// 008-016 Fast build
// 016-032 Full-speed lead drop
// 032-048 Bass answer
// 048-052 Short breath
// 052-060 Rhythm resumes
// 060-068 Build
// 068-096 Second drop / semitone lead
// 096-112 Final lead return
// 112-120 Percussion exit
// 120-128 Tail

const BPM = 196;
const END = 128;
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
  .attack(0.01).decay(0.10).sustain(0.75).release(0.065).clip(0.87).gain(1.15).orbit(2);
const k = p => s(p).end(0.55).lpf(1800).gain(0.64).orbit(1);
const sn = p => s(p).hpf(160).lpf(9200).gain(0.40).orbit(1);
const hh = p => s(p).end(0.18).hpf(5200).gain("0.13 0.07 0.10 0.055").orbit(1);
const lift = s("white*8").hpf(1600).lpf(saw.range(1800,7000).slow(8))
  .attack(0.01).decay(0.065).sustain(0).release(0.025)
  .gain(saw.range(0.012,0.075).slow(8)).orbit(4);

// Sparse 808 stepper. Snare on beat 3 in the first drop, backbeat later.
// A driving two-bar broken beat. The answer adds one displaced snare,
// rather than falling back to halftime.
const kickA = k("<[rd_808kick ~ ~ ~ ~ ~ rd_808kick ~ rd_808kick ~ ~ ~ ~ ~ ~ ~] [rd_808kick ~ ~ rd_808kick ~ ~ ~ ~ ~ ~ rd_808kick ~ ~ ~ ~ ~]>").end(0.15).gain(0.58);
const kickB = k("rd_808kick ~ ~ rd_808kick ~ ~ ~ ~ rd_808kick ~ ~ ~ ~ rd_808kick ~ ~").end(0.15).gain(0.58);
const hatA = hh("rd_jhat*8").gain("0.10 0.05 0.08 0.04");
const clicks = s("~ ~ rd_perc ~ ~ ~ ~ rd_perc").end(0.4).hpf(900).gain(0.10).orbit(4);
const fast = stack(kickA,sn("<[~ rd_808snare ~ rd_808snare] [~ ~ ~ ~ rd_808snare ~ ~ ~ ~ ~ ~ rd_808snare ~ ~ rd_808snare ~]>").gain(0.48),hatA);
const full = stack(kickB,sn("~ rd_808snare ~ rd_808snare").gain(0.46),hatA,clicks);
const turn = stack(kickA,sn("~ rd_808snare ~ [rd_808snare rd_808snare]").gain(0.38),hh("~ ~ ~ rd_jopen"));
const groove = arrange([6,fast],[1,full],[1,turn]);
const reply = arrange([4,full],[3,fast],[1,turn]);
const lowA = "<[e1 ~ e1 ~ ~ b1 e1 ~] [e1 ~ ~ f1 e1 ~ d2 ~]>";
const lowB = "<[e1 ~ ~ b1 ~ e1 ~ ~] [f1@2 ~ e1 ~ ~ d2 ~]>";
const weight = p => note(p).s("sawtooth")
  .hpf(105).lpf(950).attack(0.012).decay(0.22).sustain(0.65).release(0.10).distort(0.22).gain(0.36).orbit(2);
const bassA = stack(sub(lowA).release(0.1),weight(lowA));
const bassB = stack(sub(lowB),weight(lowB).lpf(1400));
const air = note("<[e3,b3] [f3,b3]>").slow(8).s("triangle").hpf(260).lpf(750)
  .attack(1.8).release(1.6).gain(0.14).room(0.35).roomsize(4).orbit(3);
const sonar = note("<e4 ~ b3 ~>").slow(2).s("sine").attack(0.01).decay(0.12).sustain(0).release(0.25)
  .gain(0.08).delay(0.25).delaytime(90/BPM).delayfeedback(0.35).orbit(3);
// A clear four-bar lead phrase, with a different answer in the second drop.
const leadVoice = p => note(p).s("supersaw").unison(2).detune(0.09)
  .hpf(330).lpf(2300).attack(0.018).decay(0.11).sustain(0.15).release(0.09)
  .clip(0.67).distort(0.25).gain(0.21).delay(0.10).delaytime(90/BPM).delayfeedback(0.18)
  .room(0.12).roomsize(2).orbit(3);
const leadA = leadVoice("<[e4 ~ f4 e4 ~ b3 ~ ~] [e4 ~ ~ d4 e4 ~ f4 ~] [f4 ~ e4 ~ b3 ~ d4 ~] [e4@2 ~ f4 e4 ~ ~ ~]>");
const leadB = leadVoice("<[e4 ~ b4 ~ f4 e4 ~ ~] [f4 ~ e4 ~ d4 ~ e4 ~] [b3 ~ e4 f4 ~ e4 ~ ~] [e4@2 ~ f4 e4 ~ b3 ~]>").lpf(2800);
const build = arrange([4,stack(clicks,sonar)],[3,hatA],[1,sn("rd_808snare ~ rd_808snare ~").gain(0.18)]);

const song = arrange(
  [8, stack(air,sonar)],
  [8, stack(build,air)],
  [16, stack(groove,bassA,leadA)],
  [16, stack(groove,bassB,leadA)],
  [4, stack(air,sonar)],
  [8, stack(clicks,hatA,sub("e1 ~ ~ ~"))],
  [8, build],
  [28, stack(reply,bassB,leadB)],
  [16, stack(groove,bassA,leadA)],
  [8, stack(clicks,hatA)],
  [8, stack(air,sonar)]
);

const fade = signal(t => {
  const pos = LOOP ? Number(t) % END : Number(t);
  return LEVEL * Math.max(0, Math.min(1, (END - pos) / 8));
});
song.postgain(fade).filterWhen(t => Number(t) >= 0 && (LOOP || Number(t) < END)).early(START_CYCLE)
