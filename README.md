# Principles of Animation Lab — Week 1

Current version: **1.5.0**

An offline-friendly, dependency-free teaching utility for introducing the bouncing ball through timing, spacing, slow in/out, and squash/stretch.

## Run

Open `index.html` directly in a modern browser. No build step or server is required.

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
- Choose **Editable arc**, select one to six bounces, and drag the overall start, first apex, and end handles. Intermediate contacts and progressively smaller arcs are generated from the energy-retention setting.
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
- Desktop Studio view uses three teaching columns: settings on the left, a reduced central stage with its frame map, and Williams guidance plus student questions on the right.
- Collapse or restore **Live controls** with its hamburger dock without resetting the activity.
- On desktop, the Williams lesson card is positioned in the right column and the frame map remains beneath the stage to reduce unnecessary scrolling.
- Student questions may receive a contextual application or extrapolation, but each response remains grounded in Williams' printed pp. 35–39 and identifies itself as interpretation rather than quotation.
- The question field also recognises common animation requests, including frame rate, playback speed, vertical or arc paths, constant or decaying height, material presets, spacing visibility, spacing amount, deformation, and arc count.
