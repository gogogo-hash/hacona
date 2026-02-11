
import { Controller } from "@hotwired/stimulus"

/*
 * Smoothly scroll to section IDs with a sticky-header offset.
 * Usage:
 *   <body data-controller="smooth-scroll"
 *         data-smooth-scroll-header-selector-value="#site-header">
 *     #gallerysmooth-scroll#toSection">Gallery</a>
 *   </body>
 */
export default class extends Controller {
  static values = {
    headerSelector: String
  }

  connect() {
    this.headerEl = this.headerSelectorValue
      ? document.querySelector(this.headerSelectorValue)
      : null
  }

  toSection(event) {
    const link = event.currentTarget
    const href = link.getAttribute("href")
    if (!href || !href.startsWith("#")) return

    const target = document.querySelector(href)
    if (!target) return

    event.preventDefault()

    const headerOffset = this.headerEl ? this.headerEl.offsetHeight : 0
    const rect = target.getBoundingClientRect()
    const absoluteY = window.scrollY + rect.top - headerOffset

    window.scrollTo({ top: absoluteY, behavior: "smooth" })

    // After scrolling, move focus for accessibility
    // Use a small timeout to allow the scroll to begin
    setTimeout(() => {
      // Ensure element can be focused
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1")
      }
      target.focus({ preventScroll: true })
    }, 300)
  }
}
