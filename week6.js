(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const canvas = $('#stage'), ctx = canvas.getContext('2d');
  const map = $('#actionMap'), mctx = map.getContext('2d');
  const controls = Object.fromEntries(['tempo','stride','spacing','down','up','lean','knee','foot','arms','overlap'].map(id => [id, $('#'+id)]));
  const defaults = {tempo:50,stride:64,spacing:78,down:66,up:56,lean:5,knee:72,foot:100,arms:62,overlap:2};
  const presets = {
    natural:{tempo:50,stride:64,spacing:78,down:66,up:56,lean:5,knee:72,foot:100,arms:62,overlap:2},
    light:{tempo:38,stride:58,spacing:88,down:38,up:72,lean:4,knee:82,foot:78,arms:72,overlap:3},
    heavy:{tempo:72,stride:50,spacing:62,down:92,up:25,lean:8,knee:48,foot:45,arms:38,overlap:1}
  };
  const lessons = {
    contact:['Contact establishes the step.','The legs reach their widest separation at contact. The forward heel arrives as the rear foot finishes pushing away.','Pause on Contact, then step to Down. Watch the pelvis accept the weight only after the foot has met the ground.'],
    down:['Down makes the weight visible.','Just after contact, the front leg bends and the pelvis drops. This is the lowest body position and the clearest statement of weight.','Raise Down position, then compare Natural and Heavy. Keep the foot planted while the knee and pelvis absorb the fall.'],
    passing:['Passing transfers the body over one leg.','The free foot passes the supporting leg while the body returns towards its median height. The silhouette narrows before opening into the next stride.','Pause at Passing. Reduce Knee flexibility and notice how quickly the swing foot begins to scrape or feel mechanical.'],
    up:['Up converts push-off into the next fall.','After the passing position, the supporting leg straightens and lifts the pelvis. The free leg reaches forward to prepare the next contact.','Increase Up position and watch the body rise after Passing—not at the contact itself.']
  };
  const prompts=['Which position carries the body lowest—and why does it occur after contact?','Why do the arms swing opposite the legs?','Where is the supporting leg straightest during this walk?','How does foot roll change the feeling of contact and push-off?','Which control changes weight without changing the step timing?'];
  let fps=12,speed=1,frame=0,playing=true,last=performance.now(),compare=false,promptIndex=0,travelMode='spot';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const mix=(a,b,t)=>a+(b-a)*t;
  const wrap=v=>((v%1)+1)%1;
  const secondsPerStep=()=>+controls.tempo.value/100;
  const cycleFrames=()=>Math.max(12,Math.round(secondsPerStep()*2*fps));
  const totalFrames=()=>cycleFrames()*(travelMode==='across'?3:1);
  function smooth(t){return t*t*(3-2*t)}
  function easedCycle(u){const linear=wrap(u), wave=(1-Math.cos(linear*Math.PI*2))/2; const eased=linear<.5?wave/2:.5+(1-wave)/2; return mix(linear,eased,+controls.spacing.value/100*.42)}
  function phaseName(u){const p=wrap(u*2)*4, i=Math.floor(p+.5)%4; return ['CONTACT','DOWN','PASSING','UP'][i]}
  function bodyOffset(u,rigid){if(rigid)return 0;const p=wrap(u*2)*4,seg=Math.floor(p),t=smooth(p-seg);const down=+controls.down.value*.16,up=+controls.up.value*.13;const ys=[0,down,0,-up,0];return mix(ys[seg],ys[seg+1],t)}
  function footTarget(legPhase,stride,lift,ground,scale,rigid){
    const q=wrap(legPhase), roll=rigid?0:+controls.foot.value/100, length=scale*.115, clearance=scale*.022;
    let x,t,stance,angle,toeAngle,baseY,state;
    if(q<.62){
      stance=true;t=q/.62;x=stride/2-stride*t;baseY=ground;
      if(t<.2){const k=smooth(t/.2);angle=mix(-Math.PI/4,0,k)*roll;toeAngle=angle;state='HEEL STRIKE'}
      else if(t<.42){angle=0;toeAngle=0;state='FLAT SUPPORT'}
      else{const k=smooth(clamp((t-.42)/.18,0,1));angle=Math.PI/4*k*roll;toeAngle=mix(angle,0,k*roll);state='TOE PUSH-OFF'}
    }else{
      stance=false;t=(q-.62)/.38;x=-stride/2+stride*smooth(t);baseY=ground-Math.sin(Math.PI*t)*lift;
      const heelPrep=smooth(clamp((t-.72)/.28,0,1));angle=mix(Math.PI/4,-Math.PI/4,heelPrep)*roll;toeAngle=angle;state='SWING CLEARANCE';
    }
    const heelOffset=Math.sin(angle)*(-length*.32), toeJointOffset=Math.sin(angle)*(length*.43), toeTipOffset=toeJointOffset+Math.sin(toeAngle)*(length*.35);
    const lowest=Math.max(heelOffset,toeJointOffset,toeTipOffset);
    return{x,y:baseY-lowest-clearance,stance,t,angle,toeAngle,state,length};
  }
  function ik(hip,foot,l1,l2,bend){let dx=foot.x-hip.x,dy=foot.y-hip.y,d=Math.hypot(dx,dy);d=clamp(d,Math.abs(l1-l2)+.1,l1+l2-.1);const a=Math.atan2(dy,dx),cosA=clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1),off=Math.acos(cosA)*bend;return{x:hip.x+Math.cos(a-off)*l1,y:hip.y+Math.sin(a-off)*l1}}
  function poseAt(f,rigid=false,allowTravel=true){
    const u=easedCycle(f/cycleFrames()),w=canvas.clientWidth,h=canvas.clientHeight,scale=Math.min(w,h),ground=h*.87;
    const stride=scale*(.28+.22*(+controls.stride.value/100)),leg=scale*.225,lower=scale*.225,lift=scale*(.08+.10*(+controls.knee.value/100));
    const leftFootLocal=footTarget(u,stride,lift,ground,scale,rigid),rightFootLocal=footTarget(u+.5,stride,lift,ground,scale,rigid);
    let rootX=w*.5;
    if(allowTravel&&travelMode==='across'){
      const halfStep=f/cycleFrames()*2,halfIndex=Math.floor(halfStep),support=halfIndex%2===0?leftFootLocal:rightFootLocal;
      const stepAdvance=stride*(.5/.62),margin=scale*.32;
      rootX=margin+halfIndex*stepAdvance+(stride*.5-support.x);
    }
    const pelvis={x:rootX,y:ground-leg-lower+bodyOffset(u,rigid)},lf={x:pelvis.x+leftFootLocal.x,y:leftFootLocal.y},rf={x:pelvis.x+rightFootLocal.x,y:rightFootLocal.y};
    const bend=.65+.35*(+controls.knee.value/100),lk=ik({x:pelvis.x-5,y:pelvis.y},lf,leg,lower,bend),rk=ik({x:pelvis.x+5,y:pelvis.y},rf,leg,lower,bend);
    const lean=(rigid?0:+controls.lean.value)*Math.PI/180,torso=scale*.235,shoulder={x:pelvis.x+Math.sin(lean)*torso,y:pelvis.y-Math.cos(lean)*torso},head={x:shoulder.x+Math.sin(lean)*scale*.09,y:shoulder.y-Math.cos(lean)*scale*.09};
    const armAmount=(rigid?0.18:+controls.arms.value/100)*.78,delay=(rigid?0:+controls.overlap.value)/cycleFrames(),armWave=Math.sin((u-delay)*Math.PI*2),upper=scale*.17,fore=scale*.16;
    function arm(side){const a=Math.PI/2+side*armWave*armAmount,elbow={x:shoulder.x+Math.cos(a)*upper,y:shoulder.y+Math.sin(a)*upper},lagWave=Math.sin((u-delay*1.8)*Math.PI*2),b=a+side*lagWave*(rigid?.04:.22),hand={x:elbow.x+Math.cos(b)*fore,y:elbow.y+Math.sin(b)*fore};return{elbow,hand}}
    return{u,ground,scale,pelvis,shoulder,head,lf,rf,lk,rk,leftArm:arm(1),rightArm:arm(-1),leftFootLocal,rightFootLocal,lean}
  }
  function line(a,b,width,col,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=col;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore()}
  function joint(p,r,fill,stroke,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=Math.max(2,r*.2);ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore()}
  function footShape(ankle,info,scale,fill,outline,alpha){
    const len=info.length, heel={x:ankle.x+Math.cos(info.angle)*(-len*.32),y:ankle.y+Math.sin(info.angle)*(-len*.32)}, toeJoint={x:ankle.x+Math.cos(info.angle)*(len*.43),y:ankle.y+Math.sin(info.angle)*(len*.43)}, toe={x:toeJoint.x+Math.cos(info.toeAngle)*(len*.35),y:toeJoint.y+Math.sin(info.toeAngle)*(len*.35)};
    line(heel,toeJoint,scale*.038,outline,alpha);line(toeJoint,toe,scale*.031,outline,alpha);line(heel,toeJoint,scale*.026,fill,alpha);line(toeJoint,toe,scale*.019,fill,alpha);joint(ankle,scale*.013,'#fff8f3',outline,alpha);joint(toeJoint,scale*.009,fill,outline,alpha);
    return{heel,toeJoint,toe};
  }
  function drawFigure(p,alpha=1,rigid=false){const s=p.scale,outline=rigid?'#68736f':'#173b39',fill=rigid?'#dfe4e2':'#ffd3c4',bone=s*.035,showArms=$('#armsToggle').checked;function drawArm(arm,armAlpha=alpha){line(p.shoulder,arm.elbow,bone*.6+s*.006,outline,armAlpha);line(arm.elbow,arm.hand,bone*.48+s*.006,outline,armAlpha);line(p.shoulder,arm.elbow,bone*.6,fill,armAlpha);line(arm.elbow,arm.hand,bone*.48,fill,armAlpha);joint(arm.elbow,s*.014,'#fff8f3',outline,armAlpha);joint(arm.hand,s*.012,fill,outline,armAlpha)}if(showArms)drawArm(p.leftArm,alpha*.68);line(p.pelvis,p.shoulder,bone+s*.012,outline,alpha);line(p.pelvis,p.shoulder,bone,fill,alpha);for(const [hip,knee,foot,info] of [[{x:p.pelvis.x-5,y:p.pelvis.y},p.lk,p.lf,p.leftFootLocal],[{x:p.pelvis.x+5,y:p.pelvis.y},p.rk,p.rf,p.rightFootLocal]]){line(hip,knee,bone*.86+s*.008,outline,alpha);line(knee,foot,bone*.72+s*.008,outline,alpha);line(hip,knee,bone*.86,fill,alpha);line(knee,foot,bone*.72,fill,alpha);joint(knee,s*.018,'#fff8f3',outline,alpha);footShape(foot,info,s,fill,outline,alpha)}joint(p.pelvis,s*.026,fill,outline,alpha);joint(p.shoulder,s*.03,fill,outline,alpha);joint(p.head,s*.052,fill,outline,alpha);if(showArms)drawArm(p.rightArm);return p}
  function drawPaths(){
    const w=canvas.clientWidth,h=canvas.clientHeight,left=w*.08,right=w*.92;
    ctx.save();ctx.lineWidth=2;ctx.setLineDash([6,7]);
    for(const [point,colour] of [['head','rgba(239,91,63,.32)'],['pelvis','rgba(29,110,104,.42)']]){ctx.strokeStyle=colour;ctx.beginPath();for(let i=0;i<96;i++){const p=poseAt(i/96*totalFrames()),pt=p[point],x=travelMode==='across'?pt.x:mix(left,right,i/96);if(i)ctx.lineTo(x,pt.y);else ctx.moveTo(x,pt.y)}ctx.stroke()}
    ctx.strokeStyle='rgba(29,110,104,.22)';for(const leg of ['lf','rf']){ctx.beginPath();for(let i=0;i<=80;i++){const p=poseAt(i/80*totalFrames()),pt=p[leg];if(i)ctx.lineTo(pt.x,pt.y);else ctx.moveTo(pt.x,pt.y)}ctx.stroke()}
    ctx.restore();
    if($('#explainToggle').checked){label('HEAD ARC',{x:left+42,y:poseAt(0).head.y-13},'#ef5b3f');label('HIP ARC',{x:left+38,y:poseAt(0).pelvis.y-12},'#1d6e68')}
  }
  function label(text,p,col){ctx.save();ctx.font='700 10px Inter,Arial,sans-serif';ctx.textAlign='center';const tw=ctx.measureText(text).width,x=clamp(p.x,tw/2+10,canvas.clientWidth-tw/2-10),y=clamp(p.y,22,canvas.clientHeight-12);ctx.fillStyle='rgba(255,253,250,.94)';ctx.fillRect(x-tw/2-7,y-15,tw+14,23);ctx.fillStyle=col;ctx.fillText(text,x,y+1);ctx.restore()}
  function drawPositionStrip(){const phases=[0,.125,.25,.375,.5],names=['CONTACT','DOWN','PASSING','UP','CONTACT'];const w=canvas.clientWidth,h=canvas.clientHeight,active=Math.round(wrap(frame/cycleFrames()*2)*4)%4;ctx.save();ctx.translate(0,h*.02);for(let i=0;i<phases.length;i++){const p=poseAt(phases[i]*cycleFrames(),false,false);const x=w*(.11+i*.195),factor=.54,base=h*.87,isActive=(i%4)===active;ctx.save();ctx.translate(x-p.pelvis.x*factor,base-p.ground*factor);ctx.scale(factor,factor);drawFigure(p,isActive?1:.34,false);ctx.restore();label(names[i],{x,y:base+18},isActive?'#ef5b3f':'#66716e')}ctx.restore()}
  function phaseInfo(u){const p=wrap(u*2)*4,i=Math.floor(p+.5)%4;return[
    ['CONTACT','The legs are at their widest. The forward heel strikes first as the opposite foot finishes pushing away.','Contact · heel strike begins the step'],
    ['DOWN','The forward foot settles flat as the leg accepts the body weight. The pelvis reaches its lowest point.','Down · flat support receives the weight'],
    ['PASSING','The free foot passes the supporting leg while the body returns to median height.','Passing · weight moves over one leg'],
    ['UP','The supporting heel rises while the toe stays planted, pushing the pelvis upward and forward towards the next contact.','Up · toe push-off creates the next fall']][i]}
  function drawScene(){const w=canvas.clientWidth,h=canvas.clientHeight,p=poseAt(frame);ctx.clearRect(0,0,w,h);ctx.fillStyle='#e7f0ed';ctx.fillRect(0,0,w,h*.88);ctx.fillStyle='#ece3d2';ctx.fillRect(0,h*.88,w,h*.12);ctx.strokeStyle='#b8ad92';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,h*.87);ctx.lineTo(w,h*.87);ctx.stroke();if($('#pathToggle').checked)drawPaths();if($('#posesToggle').checked)drawPositionStrip();else{if(compare)drawFigure(poseAt(frame,true),.3,true);const g=drawFigure(p);if($('#explainToggle').checked){label('PELVIS · WEIGHT PATH',{x:g.pelvis.x,y:g.pelvis.y-30},'#ef5b3f');const support=[g.leftFootLocal,g.rightFootLocal].find(foot=>foot.stance)||g.leftFootLocal;const supportPoint=support===g.leftFootLocal?g.lf:g.rf;label(support.state,{x:supportPoint.x,y:supportPoint.y+34},'#1d6e68');if($('#armsToggle').checked)label('OPPOSING ARM SWING',{x:g.leftArm.hand.x,y:g.leftArm.hand.y-24},'#1d6e68')}}const info=phaseInfo(p.u);$('#phaseTitle').textContent=info[0];$('#phaseNote').textContent=info[1];$('#motionLabel').textContent=info[2]}
  function drawMap(){const w=map.clientWidth,h=map.clientHeight,left=70,right=w-16,total=cycleFrames(),half=total/2;const beats=[['CONTACT',0,'#ef5b3f'],['DOWN',half*.25,'#e1a22b'],['PASS',half*.5,'#1d6e68'],['UP',half*.75,'#1d6e68'],['CONTACT',half,'#ef5b3f'],['DOWN',half*1.25,'#e1a22b'],['PASS',half*1.5,'#1d6e68'],['UP',half*1.75,'#1d6e68'],['CONTACT',total-1,'#ef5b3f']];mctx.clearRect(0,0,w,h);mctx.strokeStyle='#d9d9d1';mctx.beginPath();mctx.moveTo(left,h*.54);mctx.lineTo(right,h*.54);mctx.stroke();mctx.font='700 8px Inter,Arial,sans-serif';for(const [name,f,col] of beats){const x=left+(right-left)*f/(total-1);mctx.fillStyle=col;mctx.beginPath();mctx.arc(x,h*.54,5,0,Math.PI*2);mctx.fill();mctx.fillStyle='#5e6966';mctx.textAlign='center';mctx.fillText(name,x,h*.31);mctx.fillText(Math.round(f)+1,x,h*.77)}mctx.fillStyle='#66716e';mctx.textAlign='left';mctx.fillText('BODY / FEET',4,h*.57)}
  function draw(){$('#canvasWrap').classList.toggle('note-left',travelMode==='across'&&frame/totalFrames()>.5);drawScene();drawMap()}
  function resize(){for(const c of [canvas,map]){const d=devicePixelRatio||1,r=c.getBoundingClientRect();c.width=Math.max(1,Math.round(r.width*d));c.height=Math.max(1,Math.round(r.height*d));c.getContext('2d').setTransform(d,0,0,d,0,0)}draw()}
  function sync(){for(const id of ['stride','spacing','down','up','knee','foot','arms'])$('#'+id+'Out').value=controls[id].value+'%';$('#tempoOut').value=secondsPerStep().toFixed(2)+' s';$('#leanOut').value=controls.lean.value+'°';$('#overlapOut').value=controls.overlap.value+' '+(+controls.overlap.value===1?'frame':'frames');const t=totalFrames();frame=wrap(frame/t)*t;$('#scrubber').max=t-1;$('#scrubber').value=Math.floor(frame);draw()}
  function setFps(v){const progress=frame/totalFrames();fps=v;frame=progress*totalFrames();$('#fpsOut').value=v+' fps';$$('[data-fps]').forEach(b=>b.classList.toggle('active',+b.dataset.fps===v));sync()}
  function setSpeed(v){speed=v;$('#speedOut').value=v===1?'Normal':v===.5?'½ speed':'¼ speed';$$('[data-speed]').forEach(b=>b.classList.toggle('active',+b.dataset.speed===v))}
  function setTravel(mode){travelMode=mode;$('#travelOut').value=mode==='across'?'Across stage':'On the spot';$$('[data-travel]').forEach(b=>b.classList.toggle('active',b.dataset.travel===mode));sync()}
  function applyPreset(name){Object.entries(presets[name]).forEach(([k,v])=>controls[k].value=v);$$('[data-preset]').forEach(b=>b.classList.toggle('active',b.dataset.preset===name));sync()}
  function reset(){Object.entries(defaults).forEach(([k,v])=>controls[k].value=v);fps=12;speed=1;frame=0;playing=true;compare=false;$('#armsToggle').checked=true;$('#pathToggle').checked=true;$('#posesToggle').checked=false;$('#explainToggle').checked=false;$('#playBtn').textContent='Ⅱ';$('#compareBtn').textContent='Compare rigid walk';setTravel('spot');setSpeed(1);setFps(12);applyPreset('natural')}
  function tick(now){if(playing)frame=(frame+Math.min(100,now-last)/1000*fps*speed)%totalFrames();last=now;$('#scrubber').value=Math.floor(frame);$('#frameReadout').textContent=`Frame ${String(Math.floor(frame)+1).padStart(2,'0')} / ${totalFrames()}`;$('#timeReadout').textContent=(frame/fps).toFixed(2)+' s';draw();requestAnimationFrame(tick)}
  Object.values(controls).forEach(c=>c.addEventListener('input',sync));$$('[data-fps]').forEach(b=>b.addEventListener('click',()=>setFps(+b.dataset.fps)));$$('[data-speed]').forEach(b=>b.addEventListener('click',()=>setSpeed(+b.dataset.speed)));$$('[data-travel]').forEach(b=>b.addEventListener('click',()=>setTravel(b.dataset.travel)));$$('[data-preset]').forEach(b=>b.addEventListener('click',()=>applyPreset(b.dataset.preset)));
  $('#playBtn').addEventListener('click',()=>{playing=!playing;$('#playBtn').textContent=playing?'Ⅱ':'▶'});$('#prevFrame').addEventListener('click',()=>{playing=false;frame=(Math.floor(frame)-1+totalFrames())%totalFrames();$('#playBtn').textContent='▶';draw()});$('#nextFrame').addEventListener('click',()=>{playing=false;frame=(Math.floor(frame)+1)%totalFrames();$('#playBtn').textContent='▶';draw()});$('#scrubber').addEventListener('input',e=>{playing=false;frame=+e.target.value;$('#playBtn').textContent='▶';draw()});
  $('#compareBtn').addEventListener('click',()=>{compare=!compare;$('#compareBtn').textContent=compare?'Hide rigid walk':'Compare rigid walk';draw()});$('#fullscreenBtn').addEventListener('click',()=>$('#canvasWrap').requestFullscreen?.());['armsToggle','pathToggle','posesToggle'].forEach(id=>$('#'+id).addEventListener('change',draw));$('#explainToggle').addEventListener('change',()=>{if($('#explainToggle').checked)setSpeed(.25);draw()});$('#resetAll').addEventListener('click',reset);$('#resetControls').addEventListener('click',reset);$('#newPrompt').addEventListener('click',()=>{promptIndex=(promptIndex+1)%prompts.length;$('#promptText').textContent=prompts[promptIndex]});
  $$('.week6-tabs .tab').forEach(b=>b.addEventListener('click',()=>{$$('.week6-tabs .tab').forEach(x=>x.classList.toggle('active',x===b));const [a,c,t]=lessons[b.dataset.focus];$('#lessonTitle').textContent=a;$('#lessonCopy').textContent=c;$('#tryThis').textContent=t}));
  $('#week6Question').addEventListener('keydown',e=>e.stopPropagation());addEventListener('keydown',e=>{if(e.target.matches('input,textarea'))return;if(e.code==='Space'){e.preventDefault();$('#playBtn').click()}if(e.key==='ArrowLeft')$('#prevFrame').click();if(e.key==='ArrowRight')$('#nextFrame').click()});addEventListener('resize',resize);document.addEventListener('fullscreenchange',()=>requestAnimationFrame(resize));reset();resize();requestAnimationFrame(tick);
}());
