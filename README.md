# DGTL11001 Foundations of Animation: Principles of Animation Lab — Weeks 1-2

Current version: **2.7.2**

An offline-friendly, dependency-free teaching utility for introducing the bouncing ball through timing, spacing, slow in/out, squash/stretch, anticipation, exaggeration, and follow-through.

Open `activities.html` for the combined Weeks 1–4 activity navigator. It keeps the Weeks 1–2 laboratory controls on one page and links directly to the relevant Week 3 and Week 4 principle demonstrations.

Standalone pages remain available: `index.html` for Weeks 1–2, `week3.html` for anticipation and exaggeration, and `week4.html` for follow-through and overlapping action.

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
- After the final generated arc, the ball settles onto the ground and rolls beyond the stage before the sequence repeats.
- Use **¼ speed** to study contact, deformation, spacing, and recovery without changing the underlying frame rate.
- In **Vertical** mode, choose **Constant height** for a perpetual looping exercise or **Decay** to demonstrate energy loss.

The teaching interpretation is based on Richard Williams, *The Animator's Survival Kit*, “It’s All in the Timing and the Spacing,” printed pages 35–39 (PDF pages 42–46 in the supplied edition).

Activity references:

- Timing: printed pp. 35–37 (PDF pp. 42–44)
- Spacing: printed pp. 35–39 (PDF pp. 42–46)
- Squash & stretch: printed pp. 38–39 (PDF pp. 45–46)

The source-bounded question panel provides short, contextual teaching responses grounded in this page range. Teaching utility by Jim Picton, CQUniversity, informed by the work of Richard Williams.

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
- Student questions may receive a contextual application or extrapolation, but each response remains grounded in Williams' printed pp. 35–39 and identifies itself as interpretation rather than quotation.
- The question field also recognises common animation requests, including frame rate, playback speed, vertical or arc paths, constant or decaying height, material presets, spacing visibility, spacing amount, deformation, and arc count.

## Standalone activities

- `week3.html` demonstrates a tailless ball anticipating, jumping over a central box, landing and recovering. It includes separate controls for anticipation amount and duration, overall exaggeration, takeoff stretch, landing squash and follow-through recovery. Students can drag the launch marker to rebuild the arc from a nearer or farther starting position, and use Explain motion for labelled quarter-speed study.
- `week4.html` demonstrates follow-through and overlapping action with a three-section flexible tail. It includes collapsible principle groups and material presets.
