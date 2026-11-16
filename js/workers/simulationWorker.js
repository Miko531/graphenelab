import {generateNoise} from '../physics/noiseModel.js';import {spectrum} from '../physics/fftEngine.js';import {welch} from '../physics/psdEngine.js';
self.onmessage=e=>{try{const p=e.data,n=generateNoise(p);self.postMessage({noise:Array.from(n),spectrum:spectrum(Array.from(n),p.fs),psd:welch(Array.from(n),p.fs,Math.min(256,n.length))})}catch(error){self.postMessage({error:error.message})}};
