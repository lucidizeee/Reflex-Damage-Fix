// @title No warning
// @by Eign0x


// Masterrrrrr
const BPM = 180;
const END = 144;
const LEVEL = 2.00;
const START_CYCLE = 0; // Atur bagian
const LOOP = false;   // TURE = LOOP
setcps(BPM / 240);

// Sampleeee
await samples({
  rd_raw: 'breaks165/000_RAWCLN.WAV',
  rd_amen: 'breaks152/000_AMEN.WAV',
  rd_kick: 'bd/BT0AADA.wav',
  rd_snare: 'sd/rytm-01-classic.wav',
  rd_hard: 'sd/rytm-00-hard.wav',
  rd_hat: 'hh/000_hh3closedhh.wav',
  rd_metal: 'metal/003_3.wav'
}, 'https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/');

// Master
const raw = p => s('rd_raw').slice(16, p)
  .speed(BPM * 1.4228798185941043 / 240).clip(1)
  .hpf(115).lpf(11000).gain(0.80).orbit(1);
const amen = p => s('rd_amen').slice(48, p)
  .speed(BPM * 4.6998412698412695 / 720).clip(1)
  .hpf(145).lpf(10500).gain(0.58).orbit(1);
const kick = p => s(p).end(0.46).lpf(1500).gain(0.76).orbit(1);
const snare = p => s(p).hpf(170).lpf(9000).gain(0.36).orbit(1);
const hat = p => s(p).end(0.075).hpf(5500)
  .gain("0.72 0.35 0.55 0.28").pan("0.46 0.54").orbit(1);
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

// GROOVE + FILL/8bar
const a = raw("0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15");
const b = raw("0 1 2 3 4 5 [6 6] 7 0 9 10 11 12 13 [14 12] 15");
const f = raw("0 1 2 3 4 5 6 7 8 9 [4 4] 11 12 [12 12] [4 12 4] ~");
const drums = arrange([3, a], [1, b], [3, a], [1, f]);
const chopped = arrange([3, b], [1, f], [3, a], [1, f.rev()]);
const k = kick("rd_kick ~ ~ ~ ~ ~ ~ ~ ~ ~ rd_kick ~ ~ ~ ~ ~");
const k2 = kick("rd_kick ~ ~ ~ ~ ~ rd_kick ~ ~ ~ rd_kick ~ ~ ~ ~ ~");
const sn = snare("~ rd_snare ~ rd_snare");
const hats = hat("rd_hat*8");

const lowA = "<[f1@3 ~ f1 ~ eb1 gb1] [f1@2 ~ f1 ~ ~ ab1 g1]>";
const lowB = "<[f1 ~ f1 ~ c2 ~ eb1 f1] [gb1@2 ~ f1 ~ eb1 f1 ~]>";
const bassA = stack(sub(lowA), reese(lowA));
const bassB = stack(sub(lowB), reese(lowB).lpf(1400).lpenv(1.8));
const drone = air("<[f3,c4] [eb3,bb3] [gb3,db4] [f3,c4]>").slow(4);
const motif = note("<[f3 ~ ab3 ~ g3 ~ ~ ~] [f3 ~ eb3 ~ gb3 ~ ~ ~]>")
  .slow(2).s('supersaw').unison(2).detune(0.08)
  .hpf(230).lpf(1450).attack(0.02).decay(0.25).sustain(0.2)
  .release(0.28).gain(0.18).room(0.18).roomsize(3).orbit(3);
const ticks = metal("rd_metal ~ ~ ~ ~ ~ rd_metal ~").slow(2);
const tension = snare("rd_snare*8").gain(saw.range(0.045, 0.22).slow(8));
const half = stack(kick("rd_kick ~ ~ ~"), snare("~ ~ rd_snare ~"), a.hpf(1800).gain(0.19));

const song = arrange(
  [8, stack(drone, ticks, a.hpf(2200).gain(0.18))],
  [8, stack(drums.hpf(700).gain(0.47), k, drone, rise)],
  [16, stack(drums, k, sn, bassA, hats)],
  [16, stack(drums, k2, sn, bassA, hats, motif)],
  [16, stack(chopped, k2, sn, bassB, ticks)],
  [16, stack(half, sub("f1@3 ~").slow(2).gain(0.72), drone, motif)],
  [8, stack(drums.hpf(1100).gain(0.44), tension, rise, drone)],
  [16, stack(chopped, k2, sn, bassB, hats)],
  [16, stack(drums, k, sn, bassA, hats, motif, ticks)],
  [16, stack(drums, k, sub(lowA).gain(0.75), drone)],
  [8, stack(a.hpf(1500).gain(0.32), drone, ticks)]
);


// LAST BEbyYYYyyYYEh
const fade = signal(t => {
  const pos = LOOP ? Number(t) % END : Number(t);
  return LEVEL * Math.max(0, Math.min(1, (END - pos) / 8));
});
song.postgain(fade)
  .filterWhen(t => Number(t) >= 0 && (LOOP || Number(t) < END))
  .early(START_CYCLE)
