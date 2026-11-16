export const C={q:1.602176634e-19,kB:1.380649e-23,hbar:1.054571817e-34,eps0:8.8541878128e-12,vF:1e6};
export const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
export const finite=(v,fallback=0)=>Number.isFinite(Number(v))?Number(v):fallback;
