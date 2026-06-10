const fs = require('fs');
const path = require('path');

const instrument = 'cat';
const outFile = path.join(__dirname, 'cat-mp3.js');

const samplesDir = path.join(__dirname, 'sounds');

// Eight-note layout using only local files from sounds/.
const samples = [
  { note: 'C5', file: 'Domestic cat  meowing  a little purring at the start.mp3' },
  { note: 'A4', file: 'A cat meowsAOS02003.mp3' },
  { note: 'G4', file: 'A cat meowsAOS01999.mp3' },
  { note: 'F4', file: 'AnimalsCatIntCUSingleMe.mp3' },
  { note: 'E4', file: 'Cat mewing.mp3' },
  { note: 'D4', file: 'Cat mewing with a whine and a snort.mp3' },
  { note: 'B4', file: 'cat7.wav' },
  { note: 'C4', file: 'AOS03668CatDeepPur2.mp3' },
];

const out = {};

for (const { note, file } of samples) {
  const absoluteFile = path.join(samplesDir, file);
  const ext = path.extname(file).toLowerCase();
  const mime = ext === '.mp3' ? 'audio/mp3' : `audio/${ext.slice(1)}`;
  const b64 = fs.readFileSync(absoluteFile).toString('base64');
  out[note] = `data:${mime};base64,${b64}`;
}

const js = [
  `if (typeof(MIDI) === 'undefined') var MIDI = {};`,
  `if (typeof(MIDI.Soundfont) === 'undefined') MIDI.Soundfont = {};`,
  `MIDI.Soundfont.${instrument} = ${JSON.stringify(out, null, 0)};`,
].join('\n');

fs.writeFileSync(outFile, js);
console.log(`Wrote ${outFile}`);
