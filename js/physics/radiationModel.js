import {C,clamp} from './constants.js';
const factors={alpha:{let:1.0,trap:1.0,damage:1.5},beta:{let:.28,trap:.45,damage:.35},gamma:{let:.08,trap:.2,damage:.12}};
export function radiation(params={}){
 const type=params.type??'gamma', flux=Math.max(0,params.flux??0), duration=Math.max(0,params.duration??0), energy=Math.max(0,params.energy??100), thickness=Math.max(0,params.upperThickness??params.shieldThickness??0);
 const f=factors[type]??factors.gamma, attenuation=type==='gamma'?Math.exp(-Math.max(0,params.mu??.12)*thickness):Math.exp(-thickness/Math.max(1, type==='alpha'?20:500));
 const substrateScale=params.radiationScale??1, deposited=flux*duration*energy*1e3*C.q*f.let*attenuation*substrateScale, trap=deposited*1.1e-3*f.trap, dirac=trap/C.q*1e-16, conductivityChange=-clamp(f.damage*deposited/Math.max(1e-18,energy*1e3*C.q*flux*Math.max(1,duration)),0,.9);
 return {depositedEnergy:deposited,trappedChargeDensity:trap,diracShift:dirac,relativeConductivityChange:conductivityChange,attenuation};
}
