// Builds src/data/voice-manifest.json from the clips in public/voice/ (file name = line key).
import { readdirSync, writeFileSync } from 'node:fs';
const files = readdirSync('public/voice').filter((f) => f.endsWith('.mp3')).sort();
const map = Object.fromEntries(files.map((f) => [f.replace(/\.mp3$/, ''), `voice/${f}`]));
writeFileSync('src/data/voice-manifest.json', JSON.stringify(map, null, 2) + '\n');
console.log(`${files.length} clips in manifest`);
