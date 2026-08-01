// Cumulative Week 4 extension: keep the focused Week 4 model intact, then layer Weeks 1–3 controls over it.
const cumulativeDefaults={cumulativeSquash:48,bounceTiming:.95,spacingModel:2,energyRetained:84,anticipationAmount:58,exaggerationAmount:65};
const cumulativeControls=Object.fromEntries(Object.keys(cumulativeDefaults).map(id=>[id,$('#'+id)]));
const focusedPhysics=physics,focusedFlightFrames=flightFrames,focusedMotionAt=motionAt,focusedReset=reset;

Object.assign(lessons,{
  squash:['Shape follows force.','Squash shows compression at takeoff and impact. Stretch supports fast movement. Preserve the ball’s apparent volume so the changing shape communicates force without changing its mass.','Compare Rubber with Bowling while keeping the timing and path unchanged. Which material can support more deformation?'],
  timing:['Timing places the important beats.','Timing determines when anticipation, takeoff, apex and impact occur. More frames lengthen the action; fewer frames make those same beats arrive sooner and alter the apparent weight.','Change Bounce timing while leaving Gravity spacing selected. Watch the frame numbers move without changing the staged purpose of the jump.'],
  spacing:['Spacing describes speed between drawings.','Close drawings show slower movement; wider gaps show faster movement. Gravity creates close spacing near the apex and increasingly wide spacing as the ball accelerates toward landing.','Compare Even, Soft ease and Gravity while keeping Bounce timing unchanged. Which version communicates weight most clearly?'],
  arcs:['The path stages the action.','A clear arc gives the jump flow and makes its direction easy to read. Staging keeps the box, apex and landing separated so the audience can understand the action at a glance.','Turn on Show phases. Adjust Jump height until the silhouettes clear the box while still feeling connected to the landing point.'],
  anticipation:['Preparation makes the action readable.','Anticipation moves against the main action before takeoff. The ball compresses and shifts first, giving the audience time to understand its intention and the force about to be released.','Reduce Anticipation to zero, then restore it. Does the jump feel less intentional without the preparatory pose?'],
  exaggeration:['Push the idea, not every part.','Exaggeration strengthens the clearest idea in the action. It can push the preparation, takeoff stretch, apex or landing reaction while the underlying arc and weight remain believable.','Increase Exaggeration at quarter speed. Identify the point where the action becomes clearer and the point where it begins to lose its material identity.'],
  follow:['The body leads. The tail catches up.','Follow-through continues the movement of flexible parts after the ball changes speed or direction. The tail should continue through landing and settle after the primary action.','Reduce Tail flexibility, then increase it. Watch which version carries the landing force beyond the ball’s contact frame.'],
  overlap:['Different parts carry different timing.','Overlapping action prevents the tail from behaving as one rigid shape. Its base responds first, followed by the middle and tip, creating a travelling change of direction.','Set Action delay to zero, then increase it. Step through the frames and locate the delayed response from the tail base to its tip.']
});

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
  state.squash=clamp(state.squash,-.72,.82);
  if(state.landingStretch)state.landingStretch=clamp(state.landingStretch,0,.8);
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
updateCumulativeLabels();sync();
