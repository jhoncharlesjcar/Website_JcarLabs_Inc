(() => {
  const socialNames = new Map([
    ["wa.me", "WhatsApp"],
    ["vimeo.com", "Vimeo"],
    ["youtube.com", "YouTube"],
    ["youtu.be", "YouTube"],
    ["instagram.com", "Instagram"],
    ["x.com", "X (Twitter)"],
    ["linkedin.com", "LinkedIn"],
  ])

  const pageHeadings = new Map([
    ["/work", "Proyectos"],
    ["/services", "Servicios"],
    ["/contact", "Contacto"],
    ["/privacy-policy", "Política de privacidad"],
    ["/terms-of-use", "Términos de uso"],
    ["/404", "Página no encontrada"],
  ])

  function labelLinks() {
    document.querySelectorAll("a[href]").forEach((link) => {
      try {
        const url = new URL(link.href, location.href)
        const match = [...socialNames].find(([domain]) => url.hostname === domain || url.hostname.endsWith(`.${domain}`))
        if (match && (!link.getAttribute("aria-label") || link.getAttribute("aria-label") === "Button")) {
          link.setAttribute("aria-label", match[1])
        }
      } catch {
        // Ignore malformed links left by third-party components.
      }
    })

    document.querySelectorAll('a[role="button"][aria-label="Button"]:not([href])').forEach((control) => {
      control.setAttribute("aria-label", "Volver arriba")
    })
  }

  function labelFormControls() {
    document.querySelectorAll("form input, form textarea, form select").forEach((control) => {
      const name = control.getAttribute("name")
      const placeholder = control.getAttribute("placeholder")
      const label = placeholder || name
      const primaryField = ["Name", "Email", "Message"].includes(name || "")

      if (primaryField && label && !control.getAttribute("aria-label")) control.setAttribute("aria-label", label)
      if (name === "Name") control.setAttribute("autocomplete", "name")
      if (name === "Email") control.setAttribute("autocomplete", "email")

      if (!primaryField) {
        control.removeAttribute("aria-label")
        control.setAttribute("aria-hidden", "true")
        control.setAttribute("tabindex", "-1")
      }
    })
  }

  function improveMenu() {
    document.querySelectorAll("nav div[tabindex='0']").forEach((candidate) => {
      const style = getComputedStyle(candidate)
      const rect = candidate.getBoundingClientRect()
      if (style.cursor !== "pointer" || rect.top > 120 || rect.width > 100) return

      candidate.setAttribute("role", "button")
      if (!candidate.getAttribute("aria-label")) candidate.setAttribute("aria-label", "Abrir menú de navegación")
    })

    document.querySelectorAll("nav").forEach((navigation) => {
      const menu = [...navigation.querySelectorAll("div")].find((element) => {
        const text = element.innerText?.replace(/\s+/g, " ").trim() || ""
        const style = getComputedStyle(element)
        return (text.includes("HOME") || text.includes("INICIO")) && (text.includes("CONTACT") || text.includes("CONTACTO")) && style.filter !== "none"
      })
      if (!menu) return

      const sync = () => {
        const style = getComputedStyle(menu)
        const closed = Number(style.opacity) < 0.1 || style.pointerEvents === "none"
        if (closed) {
          menu.setAttribute("inert", "")
          menu.setAttribute("aria-hidden", "true")
        } else {
          menu.removeAttribute("inert")
          menu.removeAttribute("aria-hidden")
        }
        navigation.querySelectorAll('[role="button"]').forEach((toggle) => {
          toggle.setAttribute("aria-expanded", String(!closed))
          toggle.setAttribute("aria-label", closed ? "Abrir menú de navegación" : "Cerrar menú de navegación")
        })
      }
      sync()
      if (!menu.dataset.accessibilityObserved) {
        menu.dataset.accessibilityObserved = "true"
        new MutationObserver(sync).observe(menu, { attributes: true, attributeFilter: ["style", "class"] })
      }
    })
  }

  function improveHeadingOutline() {
    const main = document.querySelector("main")
    if (!main) return

    const path = location.pathname.replace(/\/$/, "") || "/"
    const isProject = path.startsWith("/work/")
    const isService = path.startsWith("/services/")
    const desiredHeading = pageHeadings.get(path) || ((isProject || isService) ? document.title.split(" — ")[0] : null)

    if (desiredHeading && !main.querySelector("[data-accessible-page-heading]")) {
      const heading = document.createElement("h1")
      heading.className = "sr-only"
      heading.dataset.accessiblePageHeading = "true"
      heading.textContent = desiredHeading
      main.prepend(heading)
    }

    const nativeHeadings = [...main.querySelectorAll("h1:not([data-accessible-page-heading])")]
    if (desiredHeading) {
      nativeHeadings.forEach((heading) => {
        heading.setAttribute("role", "heading")
        heading.setAttribute("aria-level", "2")
      })
    } else if (nativeHeadings.length > 1) {
      nativeHeadings.slice(1).forEach((heading) => {
        heading.setAttribute("role", "heading")
        heading.setAttribute("aria-level", "2")
      })
    }
  }

  function improveMedia() {
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
    document.querySelectorAll("video").forEach((video) => {
      if (reduceMotion) {
        video.autoplay = false
        video.pause()
        video.controls = true
      }

      if (video.muted && video.loop && !video.controls) {
        video.setAttribute("aria-hidden", "true")
      } else if (!video.getAttribute("aria-label")) {
        video.setAttribute("aria-label", "Video de presentación")
      }
    })
  }

  function removeNestedLandmarks() {
    document.querySelectorAll("nav nav").forEach((navigation) => navigation.setAttribute("role", "presentation"))
    document.querySelectorAll("footer footer").forEach((footer) => footer.setAttribute("role", "presentation"))
  }

  let scheduled = false
  function enhance() {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(() => {
      scheduled = false
      labelLinks()
      labelFormControls()
      improveMenu()
      improveHeadingOutline()
      improveMedia()
      removeNestedLandmarks()
    })
  }

  document.addEventListener("DOMContentLoaded", enhance, { once: true })
  window.addEventListener("load", enhance, { once: true })
  setTimeout(enhance, 1200)
  setTimeout(enhance, 3500)
})()
