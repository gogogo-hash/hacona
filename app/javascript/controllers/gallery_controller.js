
import { Controller } from "@hotwired/stimulus"

/*
 * Accessible, auto-playing gallery (carousel) with keyboard support.
 * HTML structure (simplified):
 * <section data-controller="gallery"
 *          data-gallery-interval-value="4000"
 *          data-gallery-pause-on-hover-value="true">
 *   <div data-gallery-target="viewport">
 *     <ul data-gallery-target="track">
 *       <li class="slide">...</li>
 *     </ul>
 *   </div>
 *   gallery#prevPrev</button>
 *   gallery#nextNext</button>
 * </section>
 */
export default class extends Controller {
  static targets = ["viewport", "track"]
  static values = {
    interval: { type: Number, default: 4000 },
    pauseOnHover: { type: Boolean, default: true }
  }

  connect() {
    this.index = 0
    this.slides = Array.from(this.trackTarget.children)
    this.count = this.slides.length

    // Set ARIA roles
    this.element.setAttribute("role", "region")
    this.element.setAttribute("aria-roledescription", "carousel")
    this.element.setAttribute("aria-label", "Image gallery")

    this.trackTarget.setAttribute("role", "list")
    this.slides.forEach((slide, i) => {
      slide.setAttribute("role", "group")
      slide.setAttribute("aria-roledescription", "slide")
      slide.setAttribute("aria-label", `${i + 1} of ${this.count}`)
    })

    // Keyboard support
    this.keydownHandler = (e) => {
      if (e.key === "ArrowRight") { this.next(); e.preventDefault() }
      if (e.key === "ArrowLeft") { this.prev(); e.preventDefault() }
      if (e.key === " " || e.key === "Spacebar") {
        this.toggle(); e.preventDefault()
      }
    }
    this.element.addEventListener("keydown", this.keydownHandler)

    // Autoplay
    this.play()

    // Pause on hover/focus
    if (this.pauseOnHoverValue) {
      this.mouseEnterHandler = () => this.pause()
      this.mouseLeaveHandler = () => this.play()
      this.focusInHandler = () => this.pause()
      this.focusOutHandler = () => this.play()

      this.element.addEventListener("mouseenter", this.mouseEnterHandler)
      this.element.addEventListener("mouseleave", this.mouseLeaveHandler)
      this.element.addEventListener("focusin", this.focusInHandler)
      this.element.addEventListener("focusout", this.focusOutHandler)
    }

    // Resize handler keeps slide at correct offset
    this.resizeHandler = () => this.go(this.index, false)
    window.addEventListener("resize", this.resizeHandler)

    // Start at first slide
    this.go(0, false)
  }

  disconnect() {
    this.pause()
    this.element.removeEventListener("keydown", this.keydownHandler)
    window.removeEventListener("resize", this.resizeHandler)
    if (this.pauseOnHoverValue) {
      this.element.removeEventListener("mouseenter", this.mouseEnterHandler)
      this.element.removeEventListener("mouseleave", this.mouseLeaveHandler)
      this.element.removeEventListener("focusin", this.focusInHandler)
      this.element.removeEventListener("focusout", this.focusOutHandler)
    }
  }

  play() {
    if (this.timer) return
    this.timer = setInterval(() => this.next(), this.intervalValue)
    this.element.setAttribute("aria-live", "off")
  }

  pause() {
    if (!this.timer) return
    clearInterval(this.timer)
    this.timer = null
    this.element.setAttribute("aria-live", "polite")
  }

  toggle() {
    if (this.timer) { this.pause() } else { this.play() }
  }

  next() {
    this.go((this.index + 1) % this.count)
  }

  prev() {
    this.go((this.index - 1 + this.count) % this.count)
  }

  go(i, animate = true) {
    this.index = i
    const offset = this.viewportWidth()
    const x = -1 * offset * this.index

    this.trackTarget.style.transition = animate ? "transform 500ms ease" : "none"
    this.trackTarget.style.transform = `translateX(${x}px)`
  }

  viewportWidth() {
    return this.viewportTarget.getBoundingClientRect().width
  }
}
