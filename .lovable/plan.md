

## Logoisum — Premium Hero Section

### What we're building
A full-screen video background hero section for a video editing agency called "Logoisum" with a floating nav bar, bold typography mixing Barlow and Instrument Serif fonts, and prominent CTAs.

### Key Components

**1. Fonts Setup**
- Import Google Fonts: Barlow (400, 500, 600, 700) and Instrument Serif (400 italic)

**2. Floating Navigation Bar**
- White background, rounded-[16px], subtle shadow, positioned over the video
- Left: "Logoisum" logo text
- Center: About, Works, Services, Testimonial links (Barlow Medium, 14px)
- Right: Dark (#222) "Book A Free Meeting" button with 45° arrow icon in circular housing

**3. Video Background**
- Full-screen `<video>` element: muted, autoplay, loop, playsInline
- Source: the provided CloudFront MP4 URL
- `object-cover` to fill the section, no color overlay

**4. Hero Content (centered over video)**
- Line 1: "Agency that makes your" — Barlow bold, tight tracking (-4px)
- Line 2: "videos & reels viral" — Instrument Serif italic, 84px
- Subtext: "Short-form video editing for Influencers, Creators and Brands" — Barlow Medium, 18px
- CTA: White pill button "See Our Workreel" with play icon

**5. Responsive Design**
- min-h-[90vh], proper spacing, text scales down on mobile
- Nav collapses or simplifies on smaller screens

