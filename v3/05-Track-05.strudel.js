// @title Track 05 (working title)
// @by Eign0x
// Reflex Damage / v3 / Stick and stomp breaks / acid bass / rave finale
// Export 0-148; 192 BPM; 1 cycle = 4 beats.
// FIRST_DROP = 24; intro / build / drop / development / outro.
// 000-008 Distant rave stabs
// 008-016 Tom and filtered break build
// 016-020 False drop / wide space
// 020-024 Snare reply and stop
// 024-040 Full-speed release
// 040-056 Stomp response
// 056-064 Drum spotlight
// 064-080 Acid breakdown
// 080-088 Last build
// 088-112 Final drop / breaks alternate in four-bar phrases
// 112-128 Raw energy return
// 128-136 Last drums
// 136-144 Rave echo tail

const BPM = 192;
const END = 144;
const LEVEL = 0.55;
const START_CYCLE = 0;
const LOOP = false;
setcps(BPM / 240);
await samples({
  'rd_stick': 'breaks125/015_sdstckbr.wav',
  'rd_stomp': 'breaks125/016_bllstmp.wav',
  'rd_909kick': '909/BT0A0A7.WAV',
  'rd_clap': 'cp/HANDCLP0.wav',
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

// Two new break recordings alternate. No layered loops, no random chopping.
const stick = p => s("rd_stick").slice(4,p).speed(BPM*1.871201814058957/240)
  .clip(1).attack(0.001).release(0.003).hpf(135).lpf(10800).gain(0.64).orbit(1);
const stomp = p => s("rd_stomp").slice(4,p).speed(BPM*1.9392290249433106/240)
  .clip(1).attack(0.001).release(0.003).hpf(135).lpf(10800).gain(0.64).orbit(1);
const a = stick("0 1 2 3");
const b = stomp("0 1 2 3");
const fill = stick("0 1 2 [3 ~]");
const groove = arrange([7,a],[1,fill]);
const reply = arrange([4,b],[3,a],[1,fill]);
const support = k("rd_909kick ~ ~ ~").gain(0.32);
const claps = sn("~ rd_clap ~ rd_clap").gain(0.19);
const hats = hh("~ rd_hat ~ rd_hat").gain(0.075);
const lowA = "<[a1 ~ a1 e2 ~ g1 a1 ~] [a1 ~ ~ a1 bb1 ~ g1 ~]>";
const lowB = "<[a1@2 ~ e2 ~ a1 g1 ~] [bb1 ~ a1 ~ g1 ~ a1 ~]>";
const acid = p => note(p).s("sawtooth").hpf(120).lpf(sine.range(650,2000).slow(4)).lpq(3)
  .lpenv(2).lpattack(0.005).lpdecay(0.12).lpsustain(0.05)
  .attack(0.005).decay(0.10).sustain(0.15).release(0.04).clip(0.6).distort(0.3).gain(0.20).orbit(2);
const bassA = stack(sub(lowA),acid(lowA));
const bassB = stack(sub(lowB),acid(lowB).lpf(1900));
const rave = note("<[a3,e4] [g3,d4] [bb3,f4] [a3,e4]>").struct("x ~ ~ x ~ ~ x ~")
  .s("supersaw").unison(3).detune(0.16).hpf(450).lpf(2100).attack(0.006).decay(0.13).sustain(0.04).release(0.15)
  .gain(0.10).delay(0.085).delaytime(90/BPM).delayfeedback(0.12).orbit(3);
const air = note("<a3 e4>").slow(4).s("sawtooth").hpf(350).lpf(800).attack(0.8).release(0.8).gain(0.07).room(0.3).orbit(3);
const tom = s("~ ~ rd_tom ~").speed("<0.7 1>").end(0.4).gain(0.16).orbit(4);
const build = arrange([4,stack(tom,rave)],[3,stack(a.hpf(1300).gain(0.20),hats)],[1,sn("rd_clap rd_clap ~ ~").gain(0.22)]);
const fake = stack(k("rd_909kick ~ ~ ~").gain(0.55),sub("a1@2 ~ ~"),rave);

const song = arrange(
  [8, stack(air,rave)],
  [8, stack(build,lift)],
  [4, fake],
  [4, arrange([3,stack(tom,claps)],[1,rave])],
  [16, stack(groove,support,bassA,hats)],
  [16, stack(reply,support,bassB,rave)],
  [8, stack(reply,claps)],
  [16, stack(acid(lowB),air,tom)],
  [8, stack(build,lift)],
  [24, stack(reply,support,bassB,rave)],
  [16, stack(groove,support,bassA)],
  [8, stack(reply,sub(lowA))],
  [8, stack(air,rave)]
);

const fade = signal(t => {
  const pos = LOOP ? Number(t) % END : Number(t);
  return LEVEL * Math.max(0, Math.min(1, (END - pos) / 8));
});
song.postgain(fade).filterWhen(t => Number(t) >= 0 && (LOOP || Number(t) < END)).early(START_CYCLE)
