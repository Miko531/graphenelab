import {C,clamp} from './constants.js';
export function oxideCapacitance({epsilonR=3.9,tox=300e-9}={}){return C.eps0*Math.max(.1,epsilonR)/Math.max(1e-12,tox)}
export function gfetCurrent(vg,{vds=.05,vDirac=0,n0=1e15,muE=.5,muH=.5,L=1e-6,W=5e-6,Rc=100,epsilonR=3.9,tox=300e-9}={}){
 const nGate=oxideCapacitance({epsilonR,tox})*(vg-vDirac)/C.q;
 const n=Math.max(0,nGate),p=Math.max(0,-nGate),sigma=C.q*(n0*muE+n*muE+p*muH);
 const resistance=2*Math.max(0,Rc)+Math.max(1e-12,L)/(Math.max(1e-12,W)*sigma);
 return vds/resistance;
}
export function transferCurve(params={},count=121){const min=params.vgMin??-5,max=params.vgMax??5;const points=[];for(let i=0;i<count;i++){const vg=min+(max-min)*i/(count-1);points.push({x:vg,y:gfetCurrent(vg,params)})}return points}
