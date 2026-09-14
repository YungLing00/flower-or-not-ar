const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
let completed=JSON.parse(localStorage.getItem('flower-web-missions')||'[false,false,false,false]');let currentGame=1;const toast=$('#toast');
const titles=['能量反射','能量核心','生態拼圖','地方探索跑酷'];
function save(){localStorage.setItem('flower-web-missions',JSON.stringify(completed));renderStatus()}
function renderStatus(){$('#totalBadges').textContent=completed.filter(Boolean).length;$$('.task-card').forEach((c,i)=>c.classList.toggle('done',completed[i]))}renderStatus();
function showToast(t){toast.textContent=t;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),1600)}
function openGame(n){currentGame=n;$('#gameNo').textContent='MISSION 0'+n;$('#gameTitle').textContent=titles[n-1];$$('.game-panel').forEach(p=>p.classList.toggle('active',Number(p.dataset.panel)===n));$('#complete').classList.remove('show');$('#gameShell').classList.add('open');$('#gameShell').scrollIntoView({behavior:'smooth',block:'start'})}
$$('.task-card').forEach(c=>c.onclick=()=>openGame(Number(c.dataset.game)));$('#closeGame').onclick=()=>$('#gameShell').classList.remove('open');$('#backToMap').onclick=()=>{$('#complete').classList.remove('show');$('#gameShell').classList.remove('open');document.querySelector('.task-cards').scrollIntoView({behavior:'smooth'})};
function completeGame(n){completed[n-1]=true;save();$('#completeTitle').textContent=titles[n-1]+'完成';$('#complete').classList.add('show');showToast('獲得 MISSION 0'+n+' 徽章 ✦')}

// GAME 1
const area=$('#game1Area'),ball=$('#energyBall'),paddle=$('#paddle');let bx=100,by=80,vx=3.1,vy=3.8,bounce=0,life=3,loop1=null,running1=false;
function paddleMove(clientX){const r=area.getBoundingClientRect();let x=clientX-r.left;x=Math.max(60,Math.min(r.width-60,x));paddle.style.left=x+'px'}
area.addEventListener('pointermove',e=>paddleMove(e.clientX));area.addEventListener('pointerdown',e=>paddleMove(e.clientX));
function resetBall(){const r=area.getBoundingClientRect();bx=r.width/2;by=80;vx=(Math.random()>.5?1:-1)*3.1;vy=3.8}
function startBounce(){cancelAnimationFrame(loop1);bounce=0;life=3;running1=true;$('#bounceScore').textContent=0;$('#bounceLife').textContent=3;resetBall();tick1()}
function tick1(){if(!running1)return;const r=area.getBoundingClientRect();bx+=vx;by+=vy;if(bx<17||bx>r.width-17)vx*=-1;if(by<20)vy=Math.abs(vy);const pr=paddle.getBoundingClientRect(),ar=area.getBoundingClientRect(),px=pr.left-ar.left,py=pr.top-ar.top;if(vy>0&&by+17>=py&&by+17<=py+22&&bx>=px-8&&bx<=px+pr.width+8){vy=-Math.abs(vy)*1.015;bounce++;$('#bounceScore').textContent=bounce;if(bounce>=12){running1=false;return completeGame(1)}}if(by>r.height+30){life--;$('#bounceLife').textContent=life;if(life<=0){running1=false;showToast('挑戰失敗，再試一次');return}resetBall()}ball.style.left=bx+'px';ball.style.top=by+'px';loop1=requestAnimationFrame(tick1)}$('#startBounce').onclick=startBounce;

// GAME 2
let orbScore=0,orbTimer=null;function spawnOrb(){const stage=$('#orbStage');const d=document.createElement('button');d.className='orb-dot';d.setAttribute('aria-label','能量光點');const r=stage.getBoundingClientRect();d.style.left=(20+Math.random()*(r.width-70))+'px';d.style.top=(25+Math.random()*(r.height-90))+'px';d.onclick=()=>{orbScore++;d.remove();$('#orbText').textContent=orbScore+' / 15';$('#orbFill').style.width=(orbScore/15*100)+'%';if(orbScore>=15){clearInterval(orbTimer);$$('.orb-dot').forEach(x=>x.remove());$('#core').classList.add('charged');completeGame(2)}};stage.appendChild(d);setTimeout(()=>d.remove(),1700)}
$('#startOrb').onclick=()=>{clearInterval(orbTimer);$$('.orb-dot').forEach(x=>x.remove());orbScore=0;$('#orbText').textContent='0 / 15';$('#orbFill').style.width='0';$('#core').classList.remove('charged');spawnOrb();orbTimer=setInterval(spawnOrb,650)};

// GAME 3
let order=[0,1,2,3,4,5,6,7,8],selected=null;
function shuffle(){do{order.sort(()=>Math.random()-.5)}while(order.every((v,i)=>v===i));selected=null;renderPuzzle()}
function renderPuzzle(){const g=$('#puzzleGrid');g.innerHTML='';order.forEach((piece,pos)=>{const b=document.createElement('button');b.className='puzzle-piece';b.dataset.pos=pos;const row=Math.floor(piece/3),col=piece%3;b.style.backgroundPosition=(col*50)+'% '+(row*50)+'%';b.onclick=()=>selectPiece(pos,b);g.appendChild(b)})}
function selectPiece(pos,b){if(selected===null){selected=pos;b.classList.add('selected');return}const temp=order[selected];order[selected]=order[pos];order[pos]=temp;selected=null;renderPuzzle();if(order.every((v,i)=>v===i))setTimeout(()=>completeGame(3),250)}
$('#shufflePuzzle').onclick=shuffle;shuffle();

// GAME 4
let runnerRunning=false,runnerScore=0,runnerTimer=null,collisionTimer=null;
function jump(){if(!runnerRunning)return;const r=$('#runner');if(r.classList.contains('jump'))return;r.classList.add('jump');setTimeout(()=>r.classList.remove('jump'),430)}
$('#runnerStage').onclick=jump;window.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();jump()}});
function startRunner(){runnerRunning=true;runnerScore=0;$('#runScore').textContent=0;const o=$('#obstacle');o.classList.remove('run');void o.offsetWidth;o.classList.add('run');clearInterval(runnerTimer);clearInterval(collisionTimer);runnerTimer=setInterval(()=>{runnerScore++;$('#runScore').textContent=runnerScore;if(runnerScore>=100){runnerRunning=false;clearInterval(runnerTimer);clearInterval(collisionTimer);o.classList.remove('run');completeGame(4)}},90);collisionTimer=setInterval(()=>{if(!runnerRunning)return;const a=$('#runner').getBoundingClientRect(),b=o.getBoundingClientRect();const hit=!(a.right<b.left+8||a.left>b.right-8||a.bottom<b.top+8||a.top>b.bottom-8);if(hit){runnerRunning=false;clearInterval(runnerTimer);clearInterval(collisionTimer);o.classList.remove('run');showToast('撞到障礙，再試一次')}},35)}$('#startRunner').onclick=startRunner;

$('#clearProgress').onclick=()=>{completed=[false,false,false,false];save();showToast('任務進度已清除')};
const q=Number(new URLSearchParams(location.search).get('game'));if(q>=1&&q<=4)setTimeout(()=>openGame(q),120);