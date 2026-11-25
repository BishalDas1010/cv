# Portfolio Portrait & Footer Scene Visual Refinement

Refines the art-style portraits and layered compositions in both the hero/about portrait slots and the animated footer crowd banner so the background feels cohesive and the subject's face remains bright, sharp, and immediately legible on both mobile and desktop screens.

## User Review & Critical Decisions

> [!IMPORTANT]
> All visual updates below reflect your confirmed choices and preserve every existing name, project, and copy block unchanged.

- **Scope Confirmed**: Fix both the hero/about portrait background and the footer standing-character scene.
- **Visual Style Confirmed**: Brighter editorial art style with crisp, high-contrast facial lighting and clear eye/expression definition.
- **Content Confirmed**: Keep all existing portfolio text, names, and contact details unchanged; update only the visual artwork, framing, and layering.

## 1. Overview & Core Concept

- **What It Does**: Replaces the dim portrait framing and undersized full-body footer figure with custom-regenerated, brightly lit art-style portraits derived from your uploaded photo, paired with cleaner background separation and improved proportions on mobile and desktop.
- **Target Audience / Persona**: Recruiters, hiring managers, and freelance clients browsing the portfolio on smartphones (`375px`–`430px`) or desktop monitors (`1440px`).
- **Key Value**: Ensures the first impression in the hero and the signature closing moment in the footer showcase your face clearly without muddy shadows, cramped backgrounds, or visual overlap from the moving crowd.

## 2. User Experience & Visual Design

- **Key User Flows**:
  - **Hero & About Arrival**: Visitors immediately see a clean, balanced portrait card with luminous facial highlights and a studio-grade neutral backdrop that integrates naturally into the dark obsidian canvas (and light mode) without harsh edge clipping.
  - **Closing Footer Experience**: Visitors scroll to the white editorial footer stage where your standing art-style character anchors the center with an unmistakable, well-lit face while the black-and-white illustrated crowd glides smoothly behind and to the sides.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-contrast monochrome editorial illustration—clean ink linework with soft luminous facial tone values rather than heavy dark crosshatching.
  - *Color Palette & Mood*: Deep obsidian canvas (`#0A0A0A`) and crisp gallery white footer stage (`#FFFFFF`), keeping 90%+ monochrome discipline with subtle warmth on the character's footwear accent.
  - *Typography & Hierarchy*: Preserves `Plus Jakarta Sans` architectural display headlines, `DM Sans` body prose, and `JetBrains Mono` tabular metadata (`1.5`–`1.7` line height, zero pill clutter).
  - *Component Styling & Layout*:
    - **Hero & About Portrait Containers**: Switch to a crisp studio-toned backdrop (`#1A1B1E` soft neutral slate/charcoal gradient) with `object-top` focal framing so the head and eyes always stay centered and uncropped across `aspect-[3/4]` and `aspect-[4/5]` breakpoints.
    - **Footer Standing Character Stage**: Increase the subject-to-canvas head proportion (framing from mid-thigh/knees or tighter full-body vertical proportion with a larger, bright face), soften the moving background crowd opacity (`opacity-60` with lower vertical height behind the shoulders), and widen the soft radial backdrop clearing so the face sits cleanly above the crowd line.
- **Interactive Feedback & Motion**: Smooth GPU-composited horizontal crowd marquee (`translate3d`) with subtle walking bob behind the stationary center character, respecting `prefers-reduced-motion` and keeping mobile sticky navigation strictly under `15%` of viewport height.

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Regenerate Brighter Art-Style Assets vs. CSS Filter Tweaks Alone**
  - *Chosen Approach*: Generate two refreshed art-style portraits from the uploaded reference photo with brighter facial key lighting, cleaner background isolation, and better head-to-frame scale, rather than relying only on CSS `brightness()` filters.
  - *Why*: CSS brightness filters wash out ink linework and amplify dark crosshatching noise; regenerating with luminous studio lighting preserves crisp black ink edges while keeping eyes and facial features sharp.
  - *Alternatives Considered*: Keeping the current images and applying CSS `brightness-125 contrast-90` (rejected because it reduces ink crispness and leaves the footer head too small).
- **Decision 2: Adjust Crowd Vertical Height & Center Clearing Behind the Main Character**
  - *Chosen Approach*: Keep the moving crowd anchored slightly lower (`72%`–`78%` of stage height) with softer opacity behind a wider white radial halo, allowing the standing main character's shoulders and head to rise cleanly above the crowd horizon.
  - *Why*: Directly resolves the small/obscured face issue on mobile screens while maintaining the "one standing still, everyone else moving" storytelling effect.
  - *Alternatives Considered*: Removing the crowd behind the center entirely with hard divider lines (rejected because it breaks the seamless panoramic street-crowd illusion).

## 4. Technical Architecture & Data Strategy

- **Architecture & Visual Layering Diagram**:

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Portfolio Visual Pipeline                    │
├──────────────────────────────┬──────────────────────────────────┤
│      Hero & About Views      │     Animated Footer Stage        │
├──────────────────────────────┼──────────────────────────────────┤
│  Reference Photo             │  Layer 1 (Back, z-0):            │
│    └─> Bright Art Portrait   │    Moving Line-Art Crowd Track   │
│         (Studio Slate BG)    │    (translate3d infinite loop)   │
│                              │                                  │
│  Focal Framing:              │  Layer 2 (Mid, z-5):             │
│    object-cover object-top   │    Wide Soft Radial White Halo   │
│    Zero harsh contrast clip  │                                  │
│                              │  Layer 3 (Front, z-10):          │
│                              │    Stationary Art-Style Figure   │
│                              │    (Bright high-contrast face,   │
│                              │     shoulders & head above crowd)│
└──────────────────────────────┴──────────────────────────────────┘
```

- **Data Model & Asset Mapping**: Central profile configuration holds the updated bright hero portrait URL and updated standing character illustration URL, ensuring all responsive containers (hero card, about split, desktop modal, and mobile preview) stay synchronized from one source.
- **Interactive & Responsive State Mapping**:
  - Viewport media queries adapt stage height (`280px` mobile to `380px` desktop) and character scale so the face stays crisp at `375px` mobile widths without overflowing or colliding with the fixed bottom thumb-zone navigation bar.
  - Fallback UI icons remain wired on `onError` handlers for every image slot to guarantee zero broken frames.
