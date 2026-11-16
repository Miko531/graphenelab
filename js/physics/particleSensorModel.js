import {mulberry32,gaussian} from './noiseModel.js';
import {welch} from './psdEngine.js';
import {substrate} from './substrateModel.js';

export const PARTICLES={
 none:{name:'Без частинки (лише фоновий шум)',amplitude:0},
 alpha:{name:'Альфа, ⁴He²⁺ · 5,5 МеВ',amplitude:1.35},
 beta:{name:'Бета, β⁻ · 1 МеВ',amplitude:1},
 gamma:{name:'Гамма, γ · 662 кеВ',amplitude:.85},
 proton:{name:'Протон, ¹H⁺ · 2 МеВ',amplitude:1.15}
};
const mean=a=>a.reduce((s,v)=>s+v,0)/Math.max(1,a.length);
const rms=a=>Math.sqrt(mean(a.map(v=>v*v)));
function moving(a,size){const out=new Float64Array(a.length),n=Math.max(1,Math.floor(size));for(let i=0;i<a.length;i++){let s=0;for(let j=Math.max(0,i-n+1);j<=i;j++)s+=a[j];out[i]=s/Math.min(n,i+1)}return out}
function median(a,size){const out=new Float64Array(a.length),n=Math.max(3,Math.floor(size)|1);for(let i=0;i<a.length;i++){const w=Array.from(a.slice(Math.max(0,i-n+1),i+1)).sort((x,y)=>x-y);out[i]=w[Math.floor(w.length/2)]}return out}
function lowpassForward(a,cutoff,fs){const out=new Float64Array(a.length),frequency=Math.min(fs*.49,Math.max(.1,cutoff)),k=Math.tan(Math.PI*frequency/fs),k2=k*k,norm=1/(1+Math.SQRT2*k+k2),b0=k2*norm,b1=2*b0,b2=b0,a1=2*(k2-1)*norm,a2=(1-Math.SQRT2*k+k2)*norm;let x1=a[0]||0,x2=x1,y1=x1,y2=x1;for(let i=0;i<a.length;i++){const x=a[i],y=b0*x+b1*x1+b2*x2-a1*y1-a2*y2;out[i]=y;x2=x1;x1=x;y2=y1;y1=y}return out}
function filtfiltLow(a,cutoff,fs){const first=lowpassForward(a,cutoff,fs),reverse=lowpassForward(Float64Array.from(first).reverse(),cutoff,fs);return Float64Array.from(reverse).reverse()}
function filterSignal(a,{dspFilter='bandpass',cutoff=350,window=9,fs=10000}={}){if(dspFilter==='moving')return moving(a,window);if(dspFilter==='median')return median(a,window);const low=filtfiltLow(a,cutoff,fs);if(dspFilter==='bandpass'){const base=filtfiltLow(a,Math.max(5,cutoff*.06),fs),out=new Float64Array(a.length);for(let i=0;i<a.length;i++)out[i]=low[i]-base[i];return out}return low}
function noiseLevel(params,s){const current=params.currentMicroA*1e-6,layers=Math.max(1,params.grapheneLayers||1),white=current*.03/Math.sqrt(layers),flicker=current*.012*s.flickerScale/layers,thermal=current*.0008/Math.sqrt(layers);return {white,flicker,thermal,total:Math.hypot(white,flicker,thermal)}}
function pulseShape(u,rise,decay){if(u<0)return 0;const peak=rise*decay/(decay-rise)*Math.log(decay/rise),norm=Math.exp(-peak/decay)-Math.exp(-peak/rise);return (Math.exp(-u/decay)-Math.exp(-u/rise))/norm}
export function simulateParticle(params={}){
 const N=Math.max(1000,Math.floor(params.sampleCount||1000)),fs=params.sampleRate||10000,s=substrate(params.substrate||'SiO2'),particle=PARTICLES[params.particle||'none']||PARTICLES.none,rng=mulberry32(params.seed||73),n=noiseLevel(params,s),raw=new Float64Array(N),signal=new Float64Array(N),center=Math.floor(N*.38),period=Math.floor(N*.28),rise=.0008,decay=s.flickerScale>=.8?.007:.004,pulseAmplitude=n.total*particle.amplitude;
 for(let i=0;i<N;i++){const t=i/fs;let pulse=0;if(particle.amplitude){const hitIndices=params.periodicHits?[center,center+period,center+period*2]:[center];for(const hit of hitIndices)pulse+=pulseAmplitude*pulseShape((i-hit)/fs,rise,decay)}const drift=n.flicker*Math.sin(2*Math.PI*t*.8)/Math.sqrt(i+1),white=n.white*gaussian(rng),telegraph=s.trapDensity>5e11&&rng()<.004?(params.currentMicroA*1e-6)*.004:0;signal[i]=pulse;raw[i]=pulse+drift+white+thermalNoise(n.thermal,rng)+telegraph}
 const filtered=filterSignal(raw,params),baselineRaw=raw.slice(0,Math.floor(N*.25)),baselineFiltered=filtered.slice(0,Math.floor(N*.25)),sigmaRaw=rms(Array.from(baselineRaw).map(v=>v-mean(baselineRaw))),sigmaFiltered=rms(Array.from(baselineFiltered).map(v=>v-mean(baselineFiltered))),peakEnd=Math.min(N,center+Math.ceil(decay*fs*5)),peakRaw=Math.max(...raw.slice(center,peakEnd))-mean(baselineRaw),peakFiltered=Math.max(...filtered.slice(center,peakEnd))-mean(baselineFiltered),snrRaw=peakRaw/Math.max(1e-18,sigmaRaw),snrFiltered=peakFiltered/Math.max(1e-18,sigmaFiltered),psd=welch(Array.from(raw),fs,256,.5),ideal=signal;
 return {raw,filtered,signal,ideal,psd,metrics:{peakRaw,peakFiltered,sigmaRaw,sigmaFiltered,snrRaw,snrFiltered,snrRawDb:20*Math.log10(Math.max(1e-18,snrRaw)),snrFilteredDb:20*Math.log10(Math.max(1e-18,snrFiltered)),gainDb:20*Math.log10(Math.max(1e-18,snrFiltered/snrRaw)),gainFactor:snrFiltered/Math.max(1e-18,snrRaw)},fs};
}
function thermalNoise(scale,rng){return scale*gaussian(rng)}
