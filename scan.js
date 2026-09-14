const video=document.getElementById('camera'),canvas=document.getElementById('capture'),ctx=canvas.getContext('2d',{willReadFrequently:true}),statusEl=document.getElementById('scanStatus'),result=document.getElementById('result');
const targets=[
'assets/影印/c95e5a58-d7c5-4e8d-abcc-503f90609f51 2.jpg',
'assets/影印/c95e5a58-d7c5-4e8d-abcc-503f90609f51 3.jpg',
'assets/影印/c95e5a58-d7c5-4e8d-abcc-503f90609f51 4.jpg',
'assets/影印/c95e5a58-d7c5-4e8d-abcc-503f90609f51.jpg'
];let targetFeatures=[];
async function camera(){try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});video.srcObject=s;await video.play();statusEl.textContent='相機已就緒'}catch(e){statusEl.textContent='請允許相機權限'}}
function featuresFromCanvas(c){const x=c.getContext('2d').getImageData(0,0,c.width,c.height).data;const bins=new Float32Array(48);for(let i=0;i<x.length;i+=16){const r=x[i],g=x[i+1],b=x[i+2];bins[Math.min(15,r>>4)]++;bins[16+Math.min(15,g>>4)]++;bins[32+Math.min(15,b>>4)]++}let sum=0;for(const v of bins)sum+=v;return [...bins].map(v=>v/sum)}
function dist(a,b){let s=0;for(let i=0;i<a.length;i++){const d=a[i]-b[i];s+=d*d}return Math.sqrt(s)}
async function loadTargets(){targetFeatures=[];for(const src of targets){const img=new Image();img.src=src;await img.decode();const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.drawImage(img,0,0,128,128);targetFeatures.push(featuresFromCanvas(c))}}
async function scan(){if(!video.videoWidth)return;const side=Math.min(video.videoWidth,video.videoHeight),sx=(video.videoWidth-side)/2,sy=(video.videoHeight-side)/2;ctx.drawImage(video,sx,sy,side,side,0,0,256,256);const f=featuresFromCanvas(canvas);const ds=targetFeatures.map(t=>dist(f,t));let best=0;for(let i=1;i<ds.length;i++)if(ds[i]<ds[best])best=i;const confidence=Math.max(0,Math.min(99,Math.round((1-ds[best]*3.2)*100)));document.getElementById('resultTitle').textContent='最接近：任務 '+(best+1);document.getElementById('resultConfidence').textContent='辨識信心 '+confidence+'%';result.classList.add('show');if(confidence>=48){statusEl.textContent='辨識成功，正在進入小遊戲…';setTimeout(()=>location.href='missions.html?game='+(best+1),700)}else statusEl.textContent='辨識不足，請靠近並讓圖卡填滿掃描框'}
document.getElementById('scanBtn').onclick=scan;document.querySelectorAll('[data-target]').forEach(b=>b.onclick=()=>location.href='missions.html?game='+(Number(b.dataset.target)+1));
Promise.all([camera(),loadTargets()]);