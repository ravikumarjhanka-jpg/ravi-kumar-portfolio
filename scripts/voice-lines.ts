// Lists every line the avatar can speak, with its clip key and the text sent to the speech model.
// Usage: npm run voice:lines > voice-lines.json
// Record each `spoken` text, save it as public/voice/<key>.mp3, then run `npm run voice:manifest`.
import { allVoiceLines, lineKey, spoken } from '../src/lib/lines';

const out = allVoiceLines().map((text) => ({ key: lineKey(text), text, spoken: spoken(text) }));
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
