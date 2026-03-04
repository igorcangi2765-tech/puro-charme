# PLAN-visual-polish.md

> **Task:** Visual Polish & UX Enhancements (Option C)
> **Status:** PLANNING
> **Agent:** Frontend Specialist

---

## 1. Context & Goal

The goal is to implement "Option C: Visual Polish" from the brainstorming session. This involves upgrading the website's UI/UX to a "Premium/State-of-the-Art" level using advanced animations, micro-interactions, and visual refinements, without altering the backend or adding heavy features.

## 2. Requirements (Socratic Gate)

*   **Primary Constraint:** Must look "Premium" and "Fluid".
*   **Performance:** Animations must be 60fps; no jank.
*   **Responsiveness:** Mobile experience must remain excellent.
*   **Tech Stack:** React, Tailwind CSS, Framer Motion (already installed).

## 3. Task Breakdown

### Phase 1: Foundation & configuration
- [ ] **Config**: Update `tailwind.config.js` with custom easings (`cubic-bezier`) and animation keyframes.
- [ ] **Styles**: Add `scroll-behavior: smooth` and font optimization in `index.css`.

### Phase 2: Core Components
- [ ] **Cursor**: Enhance `CustomCursor.tsx` to be magnetic (stick to buttons) and interactive (grow on hover).
- [ ] **Scroll Progress**: Create `components/ScrollProgress.tsx` for a subtle reading indicator.
- [ ] **Page Transition**: Wrap `App.tsx` content in `<AnimatePresence>` for smooth section mounting.

### Phase 3: Section Polish (The "Wow" Factor)
- [ ] **Hero Section**: Implement parallax scrolling for text vs. background images.
- [ ] **Services Section**: Add glassmorphism hover effects to cards.
- [ ] **Gallery**: staggered animation for images appearing on scroll.
- [ ] **Footer**: Reveal effect (footer "uncovers" as you scroll to the bottom).

### Phase 4: Micro-Interactions
- [ ] **Buttons**: Add "glow" or "magnetic" hover states.
- [ ] **Images**: Lazy load with a blur-to-sharp reveal animation.

## 4. Verification Checklist

- [ ] **Visual**: Does the cursor snap to buttons?
- [ ] **Visual**: Does the hero section feel deep (parallax)?
- [ ] **Performance**: Is the scroll smooth on mobile devices?
- [ ] **Code**: Are all new components strictly typed?

---

## Agent Assignment
- **Primary**: Frontend Specialist
- **Skills**: `frontend-design`, `react-best-practices`, `tailwind-patterns`
