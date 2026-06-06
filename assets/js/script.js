/* =========================================================
   Premium Portfolio V3 JavaScript
   - GSAP hero reveal
   - ScrollTrigger reveal animations
   - magnetic buttons
   - custom cursor
   - reduced-motion protection
   ========================================================= */

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

/* Mobile navigation */

const navToggle = document.querySelector('[data-nav-toggle]')
const nav = document.querySelector('[data-nav]')

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open')
    navToggle.setAttribute('aria-expanded', String(isOpen))
  })

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open')
      navToggle.setAttribute('aria-expanded', 'false')
    })
  })
}

/* Run advanced motion only when allowed */

window.addEventListener('load', () => {
  if (prefersReducedMotion) {
    document
      .querySelectorAll('.reveal-card, .reveal-text, .reveal-heading')
      .forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })

    return
  }

  if (!window.gsap) return

  gsap.registerPlugin(ScrollTrigger)

  /* Initial hero reveal */

  gsap.set('.reveal-heading', {
    y: 48,
    opacity: 0
  })

  gsap.set('.reveal-text', {
    y: 24,
    opacity: 0
  })

  gsap.set('.reveal-card', {
    y: 36,
    opacity: 0
  })

  const heroTimeline = gsap.timeline({
    defaults: {
      ease: 'power3.out',
      duration: 1
    }
  })

  heroTimeline
    .to('.site-header', {
      y: 0,
      opacity: 1,
      duration: 0.7
    })
    .to(
      '.hero .reveal-heading',
      {
        y: 0,
        opacity: 1
      },
      '-=0.35'
    )
    .to(
      '.hero .reveal-text',
      {
        y: 0,
        opacity: 1,
        stagger: 0.12
      },
      '-=0.55'
    )
    .to(
      '.hero .reveal-card',
      {
        y: 0,
        opacity: 1
      },
      '-=0.55'
    )

  /* Scroll reveals */

  gsap.utils.toArray('.page-section').forEach((section) => {
    const items = section.querySelectorAll(
      '.reveal-card, .section-intro, .content-block, .metric-card'
    )

    if (!items.length) return

    gsap.to(items, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: 'top 78%'
      }
    })
  })

  /* Subtle parallax for large images */

  gsap.utils
    .toArray('.project-card img, .case-hero-media img')
    .forEach((img) => {
      gsap.to(img, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
    })
})

/* Magnetic buttons */

if (!prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect()
      const x = event.clientX - rect.left - rect.width / 2
      const y = event.clientY - rect.top - rect.height / 2

      el.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`
    })

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)'
    })
  })
}
