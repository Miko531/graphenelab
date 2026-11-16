import {C} from './constants.js';
export function mulberry32(seed=1){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
export function gaussian(rng){let u=0,v=0;while(!u)u=rng();while(!v)v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
export function generateNoise({N=2048,whiteRms=0,flicker=0,rtn=0,seed=1,fs=1000}={}){N=Math.max(0,Math.floor(N));const rng=mulberry32(seed),a=new Float64Array(N);for(let i=0;i<N;i++){const pink=flicker*Math.sin(2*Math.PI*(i+1)/N)/Math.sqrt(i+1);a[i]=whiteRms*gaussian(rng)+pink+(rtn&&rng()<.01?rtn:0)}return a}
export function thermalRms(T=300,R=1000,bw=100){return Math.sqrt(4*C.kB*T*bw/Math.max(1e-12,R))}
export function shotPsd(I=0,F=1){return 2*C.q*Math.abs(I)*Math.max(0,Math.min(1,F))}
