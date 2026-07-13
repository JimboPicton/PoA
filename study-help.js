(function () {
  'use strict';

  const links = {
    week1: ['Week 1 student slides', 'https://docs.google.com/presentation/d/1iBo5OyaN4sjvoCp92qWSaAlMNOlbYj4q3wPBBEreIAo/edit?slide=id.gc6f73a04f_0_0#slide=id.gc6f73a04f_0_0'],
    week2: ['Week 2 student slides', 'https://docs.google.com/presentation/d/148BvL4nyMlw9BvBBL7QyGmwcDrSj25bIpliIRhYz2Uc/edit?slide=id.gb1fca5a94a_0_56#slide=id.gb1fca5a94a_0_56'],
    week3: ['Week 3 student slides', 'https://docs.google.com/presentation/d/1dPYDbWHvat9S3rlIIbXHi5eNtUsvWwaruVwqFdS7-wc/edit?slide=id.gc6f73a04f_0_0#slide=id.gc6f73a04f_0_0'],
    week4: ['Week 4 student slide deck', 'https://echo360.net.au/ui/player/f01b2b96-3ea8-40c0-834a-2ea74f136b1c?secureLinkAccessDataId=1c7d119c-101c-44a6-a5d9-5330bbee1adb&autoplay=false&automute=false'],
    blair: ['Preston Blair on O’Reilly', 'https://www.oreilly.com/library/view/cartoon-animation-with/9781633228917/'],
    slow: ['Animation Mentor: slow in and slow out', 'https://www.animationmentor.com/blog/slow-in-and-slow-out-the-12-basic-principles-of-animation/'],
    squash: ['Animation Mentor: squash and stretch', 'https://www.animationmentor.com/blog/squash-and-stretch-the-12-basic-principles-of-animation/page/25/?et_blog=&targetCategory=All'],
    exposure: ['Clip Studio: 2D animation guide', 'https://www.clipstudio.net/how-to-draw/archives/172581']
  };

  const topics = [
    {
      match: q => /timing/.test(q) && /spacing/.test(q),
      title: 'Timing and spacing — related, but different',
      source: 'Williams PDF pp. 42–46; Blair PDF pp. 171–174',
      text: 'Timing tells us when an action happens and how long it lasts. Spacing tells us how far the subject moves from one drawing to the next.\n\nA ball can reach the ground on the same frame in two versions, so the timing is unchanged. If one version has close drawings near the apex and wider gaps near impact, its spacing shows acceleration more clearly.\n\nIn the lab, use the frame numbers to read timing and the gaps between positions to read spacing.',
      resources: ['week1', 'week2', 'slow']
    },
    {
      match: q => /on (?:one|two|three|four)s?|on [1-4]s|ones|twos|threes|fours|exposure|held drawing/.test(q),
      title: 'Animating on ones, twos, threes and fours',
      source: 'Williams timing discussion; Blair PDF pp. 171–174',
      text: 'These terms describe how long each drawing stays on screen. On ones, a new drawing appears every frame. On twos, each drawing is held for two frames. Threes and fours hold it for three or four frames.\n\nAt 24 fps, animating on twos usually means about 12 new drawings per second. The shot can still last one second; only the frequency of new drawings changes.\n\nUse ones when fast or subtle action needs more detail. Twos are common for traditional animation. Longer holds can create a deliberately stepped result.',
      resources: ['week1', 'exposure']
    },
    {
      match: q => /timing|frame rate|fps|duration|beat|hold/.test(q),
      title: 'Timing places the important beats',
      source: 'Williams PDF pp. 42–46; Blair PDF pp. 171–174',
      text: 'Timing is the number and placement of frames between important poses. In a bounce, the main beats include contact, takeoff and the apex.\n\nMore frames make the action take longer. Fewer frames make it happen sooner. This changes rhythm and can change the apparent weight. Frame rate is separate: it tells us how many frames are displayed each second.\n\nIn the lab, change the bounce duration and watch where the contact and apex frame numbers move.',
      resources: ['week1']
    },
    {
      match: q => /spacing|slow in|slow out|ease|acceleration|deceleration/.test(q),
      title: 'Spacing makes speed visible',
      source: 'Williams PDF pp. 42–46; Blair PDF pp. 171–174',
      text: 'Spacing is the distance travelled between successive drawings. Close positions read as slow movement. Wide gaps read as fast movement.\n\nFor a bouncing ball under gravity, positions cluster near the apex and spread farther apart during the fall. Slow in and slow out use the same idea around a pose or key drawing.\n\nTurn on the spacing display and compare the gaps without changing the keyframe timing.',
      resources: ['week1', 'week2', 'slow']
    },
    {
      match: q => /squash|stretch|volume|deform|recoil|rubber|basketball|bowling|material|weight|heavy|light/.test(q),
      title: 'Shape and timing communicate material and weight',
      source: 'Williams PDF pp. 42–46 and 99–102; Blair PDF pp. 138–143',
      text: 'Squash shows compression at impact or preparation. Stretch supports fast movement and the release of force. The form should keep roughly the same apparent volume: when it becomes shorter, it also becomes wider.\n\nWeight does not come from distortion alone. Timing, spacing, rebound height and recovery all contribute. A rubber ball can deform and rebound strongly; a bowling ball should deform much less and usually feels harder and heavier.\n\nCompare the material presets while keeping the path unchanged.',
      resources: ['week1', 'squash', 'blair']
    },
    {
      match: q => /anticipat|prepar|crouch|wind.?up|action.?reaction/.test(q),
      title: 'Anticipation prepares the audience',
      source: 'Williams PDF pp. 278–290; Blair PDF pp. 119, 125 and 138',
      text: 'Anticipation is a clear preparation before the main action. It often moves against the direction of the action: a ball compresses downward before it launches upward.\n\nIts job is to show intention and build force. Too little preparation can make the action feel sudden. Too much can delay the action or suggest more force than the jump delivers.\n\nIn Week 3, compare the jump with Anticipation amount at zero and then restore it.',
      resources: ['week3', 'blair']
    },
    {
      match: q => /exaggerat|push the pose|overshoot|take/.test(q),
      title: 'Exaggeration clarifies the main idea',
      source: 'Williams PDF pp. 278–290; Blair PDF pp. 119, 138 and 198',
      text: 'Exaggeration means strengthening the clearest idea in the action. It does not mean making every part equally large or extreme.\n\nFor a jump, you could push the preparation, takeoff stretch, apex pose or landing reaction. Keep the path, weight and volume believable so the stronger pose still belongs to the same action.\n\nIn Week 3, raise one exaggeration control at a time and compare the takeoff and landing drawings.',
      resources: ['week3', 'blair']
    },
    {
      match: q => /follow.?through|overlap|successive|delay|drag|tail|secondary action|flexib|settle/.test(q),
      title: 'The main action leads; flexible parts respond later',
      source: 'Williams PDF pp. 231–257; Blair PDF pp. 130 and 142–143',
      text: 'Follow-through is the movement that continues after the main body changes speed or direction. Overlapping action means connected parts do not start, stop or reverse on the same frame.\n\nFor the tailed ball, the ball leads. The tail base responds first, the middle follows, and the tip responds last. This successive delay produces a travelling curve instead of a rigid shape.\n\nIn Week 4, increase the action delay and compare the BALL and TAIL rows in the action breakdown.',
      resources: ['week4', 'blair']
    },
    {
      match: q => /arc|path|trajectory|flow|line of action|staging.*arc/.test(q),
      title: 'Arcs organise a readable path of action',
      source: 'Williams PDF pp. 96–98; Blair PDF pp. 59–64 and 125',
      text: 'Natural movement usually follows a clear arc rather than changing direction through accidental corners. The arc shows where the subject travels; spacing along it shows changes in speed.\n\nFor a bouncing ball, each rebound should lose height and horizontal travel as energy is lost. The final bounces resolve towards the ground before the ball rolls away.\n\nIn Arcs & Staging, adjust the handles, then check that every contact reaches the ground and that each later arc is smaller.',
      resources: ['week2', 'blair']
    },
    {
      match: q => /staging|composition|silhouette|clarity|centre of interest|appeal/.test(q),
      title: 'Staging directs attention to the important idea',
      source: 'Williams PDF pp. 178–203; Blair PDF pp. 59–64 and 156',
      text: 'Staging makes the action easy to see and understand. Position, scale, silhouette, contrast and empty space should direct the viewer towards the main idea.\n\nA clear pose should read before detail is added. If the ball, path labels or box overlap in a confusing way, the principle is harder to study.\n\nUse the path display to check the composition, then hide it and confirm that the action still reads clearly.',
      resources: ['week2', 'blair']
    },
    {
      match: q => /pose.?to.?pose|straight.?ahead|key.?frame|key drawing|extreme|breakdown|in.?between/.test(q),
      title: 'Keys establish the structure; breakdowns describe the journey',
      source: 'Williams PDF pp. 67–74; Blair PDF p. 105',
      text: 'In pose-to-pose animation, key drawings establish the important story or action positions. Extremes define the limits of an action. Breakdowns show how the movement travels between those poses, and in-betweens complete the spacing.\n\nStraight-ahead animation develops one drawing after another and can feel spontaneous, but it is harder to control. Animators often combine both methods.\n\nFor a jump, plan the preparation, takeoff, apex and contact first. Then design the breakdown poses and spacing between them.',
      resources: ['week1', 'week3', 'blair']
    },
    {
      match: q => /dialog|lip.?sync|mouth|phoneme|speech/.test(q),
      title: 'Dialogue begins with attitude, accents and phrasing',
      source: 'Williams PDF pp. 309–319; Blair PDF pp. 158–178',
      text: 'Dialogue animation is more than matching mouth shapes to sounds. First identify the character’s attitude, the important accents and the phrasing of the line. The body can prepare for or lead a spoken accent before the mouth reaches its strongest shape.\n\nUse only the mouth shapes that help the speech read. Holds, blinks, gestures and overlapping action should support the performance rather than compete with it.\n\nPlan the body and key accents first, then refine the mouth timing.',
      resources: ['blair']
    },
    {
      match: q => /walk|run|body mechanic|locomotion|contact pose|passing position/.test(q),
      title: 'Body mechanics need clear contacts, passing positions and weight',
      source: 'Williams PDF pp. 107–173; Blair PDF pp. 88–95',
      text: 'Walks and runs are built from clear contact, down, passing and up positions. The hips carry weight while the arms, clothing and other flexible parts overlap the main action.\n\nSpacing and vertical movement affect weight. Even spacing can feel mechanical; changes around contact and passing positions help the cycle feel supported by gravity.\n\nCheck the path of the hips first, then add the delayed movement of secondary parts.',
      resources: ['blair']
    }
  ];

  function answer(question, context = {}) {
    const q = String(question || '').trim().toLowerCase();
    const topic = topics.find(item => item.match(q));
    if (topic) return { title: topic.title, source: topic.source, text: topic.text, resources: topic.resources.map(key => links[key]) };
    const current = context.activity === 'week4'
      ? 'In this activity, identify the ball as the primary action and the tail as the delayed secondary action.'
      : context.activity === 'week3'
        ? 'In this activity, identify the preparation, main jump and landing reaction.'
        : 'In this activity, identify the key contacts, the apex, the spacing between frames and any change of shape.';
    return {
      title: 'Start with the clearest action idea',
      source: 'Richard Williams and Preston Blair — full supplied texts',
      text: `Williams and Blair both begin with clear poses, readable timing and a path that supports the action. Ask what the audience must notice first, where the key drawings belong, and how the in-between spacing communicates force and weight.\n\n${current}\n\nTry asking about a specific principle, pose, frame or control if you want a more focused answer.`,
      resources: [links.blair]
    };
  }

  function render(result, answerElement, resourcesElement) {
    answerElement.classList.remove('hidden');
    const heading = answerElement.querySelector('strong');
    const body = answerElement.querySelector('span');
    if (heading) heading.textContent = `${result.title} · ${result.source}`;
    if (body) body.textContent = result.text;
    if (!resourcesElement) return;
    resourcesElement.replaceChildren();
    for (const [label, url] of result.resources || []) {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener';
      anchor.textContent = `${label} ↗`;
      resourcesElement.append(anchor);
    }
  }

  window.PoAStudyHelp = { answer, render };
}());
