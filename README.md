# DGTL11001 Foundations of Animation: Principles of Animation Lab — Weeks 1-2

Current version: **2.9.2**

An offline-friendly, dependency-free teaching utility for introducing the bouncing ball through timing, spacing, slow in/out, squash/stretch, anticipation, exaggeration, and follow-through.

Open `activities.html` for the combined Weeks 1–6 activity navigator. It keeps the Weeks 1–2 laboratory controls on one page and links directly to the relevant Week 3, Week 4, Week 5 and Week 6 principle demonstrations.

Standalone pages remain available: `index.html` for the Week 1 entry point, `week2.html` for the Arcs & Staging entry point, `week3.html` for anticipation and exaggeration, `week4.html` for follow-through and overlapping action, `week5.html` for flexibility through a swinging arm, and `week6.html` for the Williams walk cycle. `week4-cumulative.html` provides a second Week 4 activity in which students can combine the principles and animation settings introduced across Weeks 1–4.

## Run

Open `activities.html` or any standalone activity page directly in a modern browser. No build step or server is required.

## Teaching flow

1. Begin with the default Week 1 exercise: **vertical**, **12 fps**, **rubber ball**, and **constant height**.
2. On **Timing**, alter the bounce beat and retained energy.
3. Move to **Spacing**, enable **Show spacing**, pause, and step through individual frames.
4. Compare even spacing, a soft ease, and gravity-based spacing without changing the impact timing.
5. Move to **Squash & stretch** and compare the rubber, basketball, and bowling-ball presets.
6. Use **A/B compare** to show a neutral baseline beside the current settings.

## Frame rate and paths

- Switch between **12 fps** and **24 fps** while preserving the action's duration in seconds. Frame stepping and the six-second timeline update to the selected rate.
- Choose **Vertical** for a straight up-and-down bounce.
- Choose **Arcs & Staging**, select one to six bounces, and drag the overall start, first apex, and end handles. Each generated rebound loses both height and horizontal travel, resolving toward the ground before the final roll. The activity opens with the five-arc Rubber teaching setup shown in the Week 2 lesson.
- The dedicated `week2.html` entry point opens with an arcs-and-staging theory panel explaining paths of action, momentum, diminishing bounce energy, composition, visual clarity and space in the direction of travel. Its fourth principle tab returns students directly to this Week 2 focus.
- After the final generated arc, the ball settles onto the ground and rolls beyond the stage before the sequence repeats.
- Use **¼ speed** to study contact, deformation, spacing, and recovery without changing the underlying frame rate.
- In **Vertical** mode, choose **Constant height** for a perpetual looping exercise or **Decay** to demonstrate energy loss.

The teaching interpretation is based on Richard Williams, *The Animator's Survival Kit*, “It’s All in the Timing and the Spacing,” printed pages 35–39 (PDF pages 42–46 in the supplied edition).

Activity references:

- Timing: printed pp. 35–37 (PDF pp. 42–44)
- Spacing: printed pp. 35–39 (PDF pp. 42–46)
- Squash & stretch: printed pp. 38–39 (PDF pp. 45–46)

The study-help panel uses a topic index derived from the full supplied texts of Richard Williams and Preston Blair. It provides short, contextual paraphrases with relevant PDF page references, while the current activity and weekly resources help students apply the answer.

## Interface

- Desktop **Studio view** fits the animated stage, Live Controls, Williams lesson, frame map, and question panel into one viewport without page-level scrolling.
- Desktop Studio view uses three teaching columns: settings on the left, a reduced central stage with its frame map, and one combined **Williams, in Practice** guidance and questioning panel on the right.
- Typography uses one sans-serif family throughout, with consistent display, section-heading, body, label, and caption levels.
- The frame map is embedded as a dedicated row inside the stage card, preventing overlap at browser zoom levels.
- The frame map is collapsed by default, opens with **Show spacing**, and can also be toggled independently as a stage drawer.
- Secondary arc-count and bounce-decay controls now use an **Advanced settings** disclosure.
- Williams answers remain hidden until a student submits a question, reducing visual noise in the default view.
- Week 1 and Week 2 Google Slides are linked from the Williams panel, and question responses recommend the relevant presentation by week.
- The spacing drawer now renders paired, dynamically numbered timing charts for impact-to-apex and apex-to-impact, informed by Brian LeMay's perpetual-bounce example and Williams' timing/spacing discussion.
- The study helper uses the Clip Studio 2D animation guide to clarify drawing exposure (ones, twos, threes and fours), frame rate, keyframes, breakdowns, in-betweens, onion skinning and the wider principles workflow.
- Preston Blair's book now informs answers about bouncing-ball paths, numbered drawings, contact, recoil, weight, extremes, in-betweens and follow-through; the O'Reilly edition is linked for CQU student access.
- **Explain motion** slows playback to quarter speed, reveals spacing/onion information, and labels the key, fast-spacing, slow-in, apex, slow-out, and fast-fall phases directly on the motion path.
- Collapse or restore **Live controls** with its hamburger dock without resetting the activity.
- On desktop, the Williams lesson card is positioned in the right column and the frame map remains beneath the stage to reduce unnecessary scrolling.
- Student questions receive concise paraphrases drawn from a broad topic index of the supplied Williams and Blair texts. Each response identifies relevant PDF pages and connects the answer to the current activity where possible.
- The question field also recognises common animation requests, including frame rate, playback speed, vertical or arc paths, constant or decaying height, material presets, spacing visibility, spacing amount, deformation, and arc count.

## Standalone activities

- `week3.html` demonstrates a tailless ball anticipating, jumping over a central box, preparing for landing with a progressively angled oval pose, landing and recovering. It includes separate controls for anticipation amount and duration, overall exaggeration, takeoff stretch, landing squash and follow-through recovery. Students can drag the launch marker to rebuild the arc from a nearer or farther starting position, and use Explain motion for labelled quarter-speed study.
- `week4.html` demonstrates follow-through and overlapping action with a three-section flexible tail. From frame 18, the ball progressively stretches along its descending motion path while the tail attachment follows the transformed ball boundary. It includes collapsible principle groups and material presets.
- `week4-cumulative.html` duplicates the Week 4 ball-and-tail jump and presents each Week 1–4 principle as a separate collapsed control group: squash and stretch, timing, spacing, arcs and staging, anticipation, exaggeration, follow-through and overlapping action. Its right-hand panel provides matching theory briefs in teaching sequence. The activity deliberately retains a single arc.
- `week5.html` demonstrates flexibility with a connected shoulder, elbow, wrist and hand. Students can adjust the pendulum arc and timing, spacing at the extremes, successive elbow and hand delays, the amount of joint breaking and follow-through, compare against a rigid arm, and reveal accurate key poses and labelled motion.
- `week6.html` demonstrates the walk cycle through connected contact, down, passing and up positions. Students can adjust the step beat, stride, pendulum spacing, body-level change, forward lean, knee and foot articulation, opposing arm swing and hand follow-through; reveal the four key positions; and compare the result with a rigid walk.
- Week 4 ball positions use the complete transformed outline—including squash, stretch, rotation and scaled stroke width—for collision clearance, keeping the ball above the solid box and ground surfaces at extreme control settings. Reciprocal squash-and-stretch scaling preserves the ball’s apparent area, maintaining its volumetric relationship with the attached tail.
- Week 6 draws separate travelling arcs for the hips and head, constructs each foot from heel-to-ball and toe sections so Contact reads as a heel strike, Down as flat support, and Up as a planted-toe push-off, and provides both on-the-spot and left-to-right walk presentations. The far-side arm is layered behind the torso to preserve the side-view depth cue.
- In the Week 6 travelling presentation, root translation is solved from the active support foot so its world position remains locked from weight acceptance through Passing and only releases at toe-off.
