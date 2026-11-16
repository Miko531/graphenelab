export const SUBSTRATES={
  hBN:{name:'Гексагональний нітрид бору (h-BN)',epsilonR:4,trapDensity:1e10,muE:1.2,muH:1.1,flickerScale:.2,pairEnergy:15,radiationScale:.55},
  SiO2:{name:'Діоксид кремнію (SiO₂)',epsilonR:3.9,trapDensity:1e12,muE:.5,muH:.45,flickerScale:1,pairEnergy:17,radiationScale:1},
  Al2O3:{name:'Оксид алюмінію (Al₂O₃)',epsilonR:9,trapDensity:3e11,muE:.65,muH:.6,flickerScale:.75,pairEnergy:18,radiationScale:.8},
  SiC:{name:'Карбід кремнію (SiC)',epsilonR:9.7,trapDensity:5e10,muE:.9,muH:.85,flickerScale:.35,pairEnergy:7.8,radiationScale:.65},
  vacuum:{name:'Підвішений графен (вакуум)',epsilonR:1,trapDensity:0,muE:2,muH:2,flickerScale:.1,pairEnergy:0,radiationScale:.1}
};
export const substrate=(key='SiO2')=>SUBSTRATES[key]||SUBSTRATES.SiO2;
export function withSubstrate(params={},key=params.substrate||'SiO2'){const s=substrate(key);return {...params,substrate:key,epsilonR:s.epsilonR,muE:params.manualMobility?params.muE:s.muE,muH:params.manualMobility?params.muH:s.muH,flicker:(params.flicker??1e-7)*s.flickerScale,trapDensity:s.trapDensity,pairEnergy:s.pairEnergy,radiationScale:s.radiationScale};}
