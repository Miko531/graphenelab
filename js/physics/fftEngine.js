export function nextPowerOfTwo(n){let p=1;while(p<n)p*=2;return p}
export function fft(input){
 const n=nextPowerOfTwo(input.length), re=new Float64Array(n), im=new Float64Array(n); re.set(input);
 for(let i=1,j=0;i<n;i++){let bit=n>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j){[re[i],re[j]]=[re[j],re[i]]}}
 for(let len=2;len<=n;len<<=1){const a=-2*Math.PI/len;for(let i=0;i<n;i+=len)for(let j=0;j<len/2;j++){const c=Math.cos(a*j),s=Math.sin(a*j),k=i+j+len/2,tr=re[k]*c-im[k]*s,ti=re[k]*s+im[k]*c;re[k]=re[i+j]-tr;im[k]=im[i+j]-ti;re[i+j]+=tr;im[i+j]+=ti}}
 return {re,im,n};
}
export function spectrum(input,fs=1){const f=fft(input),out=[];for(let i=0;i<=f.n/2;i++)out.push({x:i*fs/f.n,y:Math.hypot(f.re[i],f.im[i])/f.n*2});return out}
