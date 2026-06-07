const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const navToggle = document.querySelector('[data-nav-toggle]')
const nav = document.querySelector('[data-nav]')

function setNavigation(open) {
  if (!navToggle || !nav) return

  nav.classList.toggle('is-open', open)
  navToggle.classList.toggle('is-open', open)
  navToggle.setAttribute('aria-expanded', String(open))
  navToggle.setAttribute(
    'aria-label',
    open ? 'Close navigation' : 'Open navigation'
  )
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    setNavigation(navToggle.getAttribute('aria-expanded') !== 'true')
  })

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setNavigation(false)
  })

  document.addEventListener('click', (event) => {
    if (!event.target.closest('[data-header]')) setNavigation(false)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setNavigation(false)
      navToggle.focus()
    }
  })

  window.matchMedia('(min-width: 48rem)').addEventListener('change', (event) => {
    if (event.matches) setNavigation(false)
  })
}

const revealItems = document.querySelectorAll(
  '.reveal-card, .reveal-text, .reveal-heading, .reveal-pillar, .section-intro'
)

document.querySelectorAll('.reveal-pillar').forEach((item, index) => {
  item.style.setProperty('--reveal-delay', `${(index % 6) * 70}ms`)
})

if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'))
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  )

  revealItems.forEach((item) => revealObserver.observe(item))
}

document.querySelectorAll('img:not([loading])').forEach((image) => {
  if (!image.closest('.cover-v1')) image.loading = 'lazy'
  image.decoding = 'async'
})

const recaptcha = document.querySelector('.g-recaptcha')

if (recaptcha) {
  let recaptchaRequested = false

  const loadRecaptcha = () => {
    if (recaptchaRequested) return

    recaptchaRequested = true
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true
    script.defer = true
    document.head.append(script)
  }

  const contactForm = recaptcha.closest('form')

  if ('IntersectionObserver' in window) {
    const recaptchaObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return

        loadRecaptcha()
        observer.disconnect()
      },
      { rootMargin: '500px 0px' }
    )

    recaptchaObserver.observe(recaptcha)
  }

  contactForm?.addEventListener('focusin', loadRecaptcha, { once: true })
  contactForm?.addEventListener('pointerenter', loadRecaptcha, { once: true })
}

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

if (!reducedMotion.matches && finePointer.matches) {
  document.querySelectorAll('.magnetic').forEach((element) => {
    let frame

    element.addEventListener('pointermove', (event) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect()
        const x = (event.clientX - rect.left - rect.width / 2) * 0.08
        const y = (event.clientY - rect.top - rect.height / 2) * 0.08

        element.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
    })

    element.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame)
      element.style.removeProperty('transform')
    })
  })
}
