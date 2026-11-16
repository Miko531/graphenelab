export function download(name,content,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
export function csv(rows){return rows.map(r=>r.map(v=>String(v).replaceAll('"','""')).map(v=>`"${v}"`).join(',')).join('\n')}
export function exportSignal(data,fs){download('graphenelab-signal.csv',csv([['time_s','signal'],...Array.from(data,(v,i)=>[i/fs,v])]),'text/csv')}
