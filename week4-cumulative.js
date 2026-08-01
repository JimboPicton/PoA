// Cumulative Week 4 extension: keep the focused Week 4 model intact, then layer Weeks 1–3 controls over it.
const cumulativeDefaults={cumulativeSquash:48,bounceTiming:.95,spacingModel:2,energyRetained:84,anticipationAmount:58,exaggerationAmount:65};
const cumulativeControls=Object.fromEntries(Object.keys(cumulativeDefaults).map(id=>[id,$('#'+id)]));
const focusedPhysics=physics,focusedFlightFrames=flightFrames,focusedMotionAt=motionAt,focusedReset=reset;

function cumulativeValue(id){return +cumulativeControls[id].value}
function equalArcProgress(progress,ph){
  const samples=48,points=[],lengths=[0];let total=0;
  for(let i=0;i<=samples;i++){
    const u=i/samples,t=u*ph.flightTime,x=.51*u,y=ph.startHeight+ph.launchVelocity*t-.5*ph.g*t*t;
    points.push({u,x,y});
    if(i){const previous=points[i-1];total+=Math.hypot((x-previous.x)*4.2,(y-previous.y)*.55);lengths.push(total)}
  }
  const target=progress*total;let index=1;while(index<lengths.length&&lengths[index]<target)index++;
  const before=lengths[index-1],after=lengths[index]||before+1,blend=(target-before)/Math.max(.0001,after-before);
  return points[index-1].u+(points[index]?.u-points[index-1].u||0)*blend
}
function cumulativeSpacing(progress,ph){
  const mode=cumulativeValue('spacingModel');
  if(mode===0)return equalArcProgress(progress,ph);
  if(mode===1)return progress*progress*(3-2*progress);
  return progress
}

physics=function(){
  const ph=focusedPhysics(),retained=cumulativeValue('energyRetained')/100,energyScale=.84+retained*.19,launchVelocity=ph.launchVelocity*energyScale,apexHeight=ph.startHeight+launchVelocity*launchVelocity/(2*ph.g),flightTime=(launchVelocity+Math.sqrt(launchVelocity*launchVelocity+2*ph.g*ph.startHeight))/ph.g;
  return{...ph,launchVelocity,apexHeight,flightTime}
};
flightFrames=function(){return Math.max(8,Math.round(focusedFlightFrames()*cumulativeValue('bounceTiming')/.95))};
motionAt=function(f){
  const launch=preparationFrames(),flight=flightFrames();let sampleFrame=f;
  if(f>=launch&&f<launch+flight){const raw=(f-launch)/flight,mapped=cumulativeSpacing(raw,physics());sampleFrame=launch+mapped*flight}
  const state=focusedMotionAt(sampleFrame),shape=cumulativeValue('cumulativeSquash')/48,anticipation=cumulativeValue('anticipationAmount')/58,exaggeration=.55+cumulativeValue('exaggerationAmount')/100*.69,retained=cumulativeValue('energyRetained')/84;
  if(state.phase==='anticipation'){
    state.squash*=shape*anticipation;
    state.x=.32+(state.x-.32)*anticipation
  }else if(state.landed){
    state.squash*=shape*exaggeration*retained;
    state.p=clamp(state.p/(.55+.45*retained),0,1);
    state.phase=state.p<.3?'impact':'settle'
  }else{
    state.squash*=shape*exaggeration;
    if(state.landingStretch)state.landingStretch*=shape*exaggeration
  }
  state.cumulativeEnergy=retained;
  return state
};

function updateCumulativeLabels(){
  $('#cumulativeSquashOut').value=cumulativeValue('cumulativeSquash')+'%';
  $('#bounceTimingOut').value=cumulativeValue('bounceTiming').toFixed(2)+' s';
  $('#spacingModelOut').value=['Even','Soft ease','Gravity'][cumulativeValue('spacingModel')];
  $('#energyRetainedOut').value=cumulativeValue('energyRetained')+'%';
  $('#anticipationAmountOut').value=cumulativeValue('anticipationAmount')+'%';
  $('#exaggerationAmountOut').value=cumulativeValue('exaggerationAmount')+'%'
}
function syncCumulative(){updateCumulativeLabels();frame=clamp(frame,0,totalFrames()-1);sync()}
function resetCumulative(){for(const [id,value] of Object.entries(cumulativeDefaults))cumulativeControls[id].value=value;focusedReset();updateCumulativeLabels();sync()}
Object.values(cumulativeControls).forEach(control=>control.addEventListener('input',syncCumulative));
$('#resetAll').onclick=$('#resetControls').onclick=resetCumulative;
$('#cumulativeDockToggle').onclick=()=>{
  const panel=$('#cumulativeControlsPanel'),collapsed=panel.classList.toggle('collapsed');
  $('#cumulativeGrid').classList.toggle('cumulative-panel-collapsed',collapsed);
  $('#cumulativeDockToggle').setAttribute('aria-expanded',String(!collapsed));
  $('#cumulativeDockToggle').setAttribute('aria-label',collapsed?'Expand animation settings':'Collapse animation settings');
  $('#cumulativeDockToggle').title=collapsed?'Expand animation settings':'Collapse animation settings';
  requestAnimationFrame(resize)
};
updateCumulativeLabels();sync();
