import { Controller } from "@hotwired/stimulus"

/*
 * Fade in/out elements as they enter/leave the viewport using Intersection Observer.
 * Usage:
 *   <section data-controller="scroll-fade" data-scroll-fade-threshold-value="0.2">
 *     Content fades in when 20% is visible
 *   </section>
 *
 * Or on individual elements:
 *   <div data-controller="scroll-fade">
 *     <h2>This fades in</h2>
 *   </div>
 */
export default class extends Controller {
  static values = {
    threshold: { type: Number, default: 0.2 },
    duration: { type: Number, default: 900 } // ms
  }

  connect() {
    console.log("scroll-fade controller connected to:", this.element)
    this.setupIntersectionObserver()
    this.element.classList.add("scroll-fade--initial")
    // Apply dynamic duration
    this.element.style.setProperty("--fade-duration", `${this.durationValue}ms`)
  }

  setupIntersectionObserver() {
    console.log("Setting up Intersection Observer...")
    const options = {
      threshold: this.thresholdValue,
      rootMargin: "0px"
    }

    this.observer = new IntersectionObserver((entries) => {
      console.log("Intersection Observer detected entries:", entries)
      entries.forEach((entry) => {
        console.log("Entry:", entry.target, "isIntersecting:", entry.isIntersecting)
        if (entry.isIntersecting) {
          // Element is in viewport - fade in
          console.log("Adding visible class")
          entry.target.classList.add("scroll-fade--visible")
          entry.target.classList.remove("scroll-fade--hidden")
        } else {
          // Element left viewport - fade out
          console.log("Adding hidden class")
          entry.target.classList.remove("scroll-fade--visible")
          entry.target.classList.add("scroll-fade--hidden")
        }
      })
    }, options)

    this.observer.observe(this.element)
    console.log("Observer is now watching element")
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}
