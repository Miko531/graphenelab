import {C,clamp} from './constants.js';
export function carrierDensity({n0=1e15,ngate=0}={}){return Math.sqrt(n0*n0+ngate*ngate)}
export function fermiEnergy(n){return C.hbar*C.vF*Math.sqrt(Math.PI*Math.max(0,n))/C.q}
export function conductivity({n=0,p=0,muE=.5,muH=.5}){return C.q*Math.max(0,n*muE+p*muH)}
export function material(params={}){
 const n0=Math.max(0,params.n0??1e15), n=Math.max(0,params.n??2e15), p=Math.max(0,params.p??0);
 const total=carrierDensity({n0,ngate:n-p}); const sigma=conductivity({n,p,muE:params.muE??.5,muH:params.muH??.5});
 return {nTotal:total,fermiEnergy:fermiEnergy(total),conductivity:sigma,sheetResistance:sigma>0?1/sigma:Infinity};
}
