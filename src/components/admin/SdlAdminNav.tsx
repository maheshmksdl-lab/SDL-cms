"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNav } from "@payloadcms/ui";

import { withCmsBasePath } from "./adminBasePath";

const collapsedClass = "sdl-admin-nav-collapsed";
const readyClass = "sdl-admin-nav-ready";
const storageKey = "sdl-admin-nav-collapsed";
const sidebarId = "sdl-admin-sidebar";

/**
 * Above this width the sidebar is a permanent part of the layout, in either
 * Rail or Expanded mode. Below it, Payload's own drawer takes over untouched.
 * Must stay aligned with Payload's `s` breakpoint (max-width: 768px) so we
 * never straddle it — see admin-theme.css.
 */
const permanentSidebarQuery = "(min-width: 769px)";

/**
 * A tablet: wide enough for the permanent sidebar, but driven by a finger. This
 * is what `any-pointer: coarse` answers - it stays true on an iPad in either
 * orientation, and false on a desktop with a mouse, which width alone cannot do
 * (an iPad in landscape is 1366px, the same as plenty of laptops).
 */
const tabletQuery = "(min-width: 769px) and (any-pointer: coarse)";

/** Tooltips are for pointers; a tap has nothing to dismiss one. */
const hoverTipQuery = "(hover: hover) and (pointer: fine)";

const flyoutClass = "sdl-flyout-open";
const tipClass = "sdl-nav-tip";
/** Gap between an icon and its label tooltip. */
const tipOffset = 8;
/** Gap between the rail and the flyout panel. */
const flyoutOffset = 2;

/**
 * Payload's NavProvider closes the nav whenever its `l` breakpoint
 * (max-width: 1440px) matches, and NavWrapper then puts `inert` on the
 * <aside>. `inert` cannot be undone from CSS — the links inside would stay
 * unclickable — so the only way to keep a usable sidebar between 769px and
 * 1440px is to own `navOpen` ourselves.
 *
 * Verified against Payload 3.81: this settles after ~2 assertions and stays
 * bounded across resize and orientation changes, with no render loop.
 */
function useSidebarStaysOpen() {
  const { navOpen, setNavOpen } = useNav();

  useEffect(() => {
    const query = window.matchMedia(permanentSidebarQuery);
    const sync = () => {
      if (query.matches) {
        setNavOpen(true);
      }
    };

    sync();
    query.addEventListener("change", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, [setNavOpen]);

  // NavProvider re-closes the nav on every breakpoint change; re-assert.
  useEffect(() => {
    if (!navOpen && window.matchMedia(permanentSidebarQuery).matches) {
      setNavOpen(true);
    }
  }, [navOpen, setNavOpen]);

  return setNavOpen;
}

export function SdlAdminNav() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawer, setIsDrawer] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const setNavOpen = useSidebarStaysOpen();

  useEffect(() => {
    const storedValue = window.localStorage.getItem(storageKey);
    // Tablets start collapsed: the rail leaves far more room for the document on
    // a screen that size. Desktop still starts expanded. Either way an explicit
    // choice wins, so the toggle is not overridden on the next visit.
    const shouldCollapse =
      storedValue === null ? window.matchMedia(tabletQuery).matches : storedValue === "true";

    document.documentElement.classList.toggle(collapsedClass, shouldCollapse);
    setIsCollapsed(shouldCollapse);

    // Only animate once the stored state has been applied, so a rail user does
    // not watch the sidebar slide shut on first paint.
    window.requestAnimationFrame(() => {
      document.documentElement.classList.add(readyClass);
    });
  }, []);

  // Below 769px the sidebar is Payload's overlay drawer rather than a rail, so
  // there is no rail state to toggle. The button is still visible there, so it
  // closes the drawer instead of being a control that does nothing.
  useEffect(() => {
    const query = window.matchMedia(permanentSidebarQuery);
    const sync = () => setIsDrawer(!query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  // aria-controls needs a real id, and the <aside> is rendered by Payload.
  useEffect(() => {
    const sidebar = buttonRef.current?.closest(".nav");

    if (sidebar && !sidebar.id) {
      sidebar.id = sidebarId;
    }
  }, []);

  const setCollapsed = useCallback((next: boolean) => {
    document.documentElement.classList.toggle(collapsedClass, next);
    window.localStorage.setItem(storageKey, String(next));
    setIsCollapsed(next);
  }, []);

  /**
   * Submenu flyout.
   *
   * In the icon rail a group icon is all there is to click, and Payload's own
   * handler only toggles a container that the rail hides — so it looked inert.
   * Activating an icon now opens just that group's links in a panel beside the
   * rail: click another icon to switch, the same icon again to close.
   *
   * Driven by `click`, so a mouse, a tap and keyboard Enter/Space all work the
   * same way. Nothing here responds to hover.
   */
  useEffect(() => {
    if (!isCollapsed) {
      return;
    }

    const sidebar = buttonRef.current?.closest(".nav");

    if (!sidebar) {
      return;
    }

    const groups = () => Array.from(sidebar.querySelectorAll<HTMLElement>(".nav-group"));

    const close = () => {
      groups().forEach((group) => {
        group.classList.remove(flyoutClass);

        const panel = group.querySelector<HTMLElement>(":scope > .rah-static");

        panel?.style.removeProperty("top");
        panel?.style.removeProperty("left");

        // Give AnimateHeight its aria-hidden back if we borrowed the panel.
        if (panel?.dataset.sdlAriaHidden) {
          panel.setAttribute("aria-hidden", panel.dataset.sdlAriaHidden);
          delete panel.dataset.sdlAriaHidden;
        }

        group.querySelector(".nav-group__toggle")?.setAttribute("aria-expanded", "false");
      });
    };

    const open = (group: HTMLElement) => {
      close();

      const panel = group.querySelector<HTMLElement>(":scope > .rah-static");
      const toggle = group.querySelector(".nav-group__toggle");

      if (!panel) {
        return;
      }

      group.classList.add(flyoutClass);
      toggle?.setAttribute("aria-expanded", "true");

      // A group collapsed in the user's saved preferences is rendered
      // aria-hidden by AnimateHeight; the flyout is showing it, so unhide it.
      if (panel.getAttribute("aria-hidden") === "true") {
        panel.dataset.sdlAriaHidden = "true";
        panel.setAttribute("aria-hidden", "false");
      }

      // Position after the class is applied, so the panel has its real height.
      const rail = sidebar.getBoundingClientRect();
      const anchor = (toggle ?? group).getBoundingClientRect();
      const height = panel.getBoundingClientRect().height;
      const top = Math.max(8, Math.min(anchor.top, window.innerHeight - height - 8));

      panel.style.top = `${top}px`;
      panel.style.left = `${rail.right + flyoutOffset}px`;
    };

    const onClick = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const toggle = target?.closest(".nav-group__toggle");

      if (!toggle) {
        // A link inside an open flyout: let it navigate, then tidy up.
        if (target?.closest(`.${flyoutClass}`)) {
          close();
        }

        return;
      }

      // Payload's NavGroup would toggle a container the rail hides; the flyout
      // replaces that entirely, so its handler must not run.
      event.preventDefault();
      event.stopPropagation();

      const group = toggle.closest<HTMLElement>(".nav-group");

      if (!group) {
        return;
      }

      if (group.classList.contains(flyoutClass)) {
        close();
      } else {
        open(group);
      }
    };

    const onOutside = (event: Event) => {
      if (!(event.target as HTMLElement | null)?.closest(".nav-group")) {
        close();
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    // A fixed panel cannot follow the rail, so stop showing it rather than
    // letting it drift away from its icon.
    sidebar.addEventListener("click", onClick, true);
    document.addEventListener("click", onOutside);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    sidebar.querySelector(".nav__scroll")?.addEventListener("scroll", close);

    return () => {
      close();
      sidebar.removeEventListener("click", onClick, true);
      document.removeEventListener("click", onOutside);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      sidebar.querySelector(".nav__scroll")?.removeEventListener("scroll", close);
    };
  }, [isCollapsed]);

  /**
   * Label tooltip.
   *
   * In the rail an icon is unlabelled, so hovering one names it. This only ever
   * shows a label — it never expands the menu, which is the flyout's job.
   *
   * Pointer devices only: a touch screen has no hover, and a tooltip triggered
   * by a tap would linger with nothing to dismiss it.
   */
  useEffect(() => {
    if (!isCollapsed) {
      return;
    }

    if (!window.matchMedia(hoverTipQuery).matches) {
      return;
    }

    const sidebar = buttonRef.current?.closest(".nav");

    if (!sidebar) {
      return;
    }

    let tip: HTMLElement | null = null;

    const hide = () => {
      tip?.remove();
      tip = null;
    };

    const show = (icon: Element, label: string) => {
      hide();

      tip = document.createElement("div");
      tip.className = tipClass;
      tip.setAttribute("role", "presentation");
      tip.textContent = label;
      document.body.appendChild(tip);

      const anchor = icon.getBoundingClientRect();
      const rail = sidebar.getBoundingClientRect();
      const box = tip.getBoundingClientRect();

      tip.style.left = `${rail.right + tipOffset}px`;
      tip.style.top = `${Math.max(4, Math.min(
        anchor.top + anchor.height / 2 - box.height / 2,
        window.innerHeight - box.height - 4,
      ))}px`;
    };

    const onOver = (event: Event) => {
      const icon = (event.target as HTMLElement | null)?.closest(
        ".nav-group__toggle, .nav__wrap > .nav__link",
      );

      if (!icon) {
        return;
      }

      // The flyout already names this group; a tooltip on top would be noise.
      if (icon.closest(`.${flyoutClass}`)) {
        return;
      }

      const label = icon
        .querySelector(".nav-group__label, .nav__link-label")
        ?.textContent?.trim();

      if (label) {
        show(icon, label);
      }
    };

    sidebar.addEventListener("pointerover", onOver);
    sidebar.addEventListener("pointerout", hide);
    // Capture on document: the flyout handler stops propagation on the sidebar,
    // which would skip a bubble listener there and leave the tooltip stranded.
    document.addEventListener("click", hide, true);
    window.addEventListener("resize", hide);
    sidebar.querySelector(".nav__scroll")?.addEventListener("scroll", hide);

    return () => {
      hide();
      sidebar.removeEventListener("pointerover", onOver);
      sidebar.removeEventListener("pointerout", hide);
      document.removeEventListener("click", hide, true);
      window.removeEventListener("resize", hide);
      sidebar.querySelector(".nav__scroll")?.removeEventListener("scroll", hide);
    };
  }, [isCollapsed]);

  /**
   * The rail hides every label, which leaves Payload's group buttons with no
   * accessible name. Copy the visible text onto the button so screen readers
   * still announce it. Purely an accessibility measure — nothing visual changes.
   */
  useEffect(() => {
    const sidebar = buttonRef.current?.closest(".nav");

    sidebar?.querySelectorAll(".nav-group").forEach((group) => {
      const toggle = group.querySelector(".nav-group__toggle");
      const label = group.querySelector(".nav-group__label")?.textContent?.trim();

      if (toggle && label && !toggle.getAttribute("aria-label")) {
        toggle.setAttribute("aria-label", label);
        toggle.setAttribute("aria-haspopup", "true");
      }
    });
  }, []);

  const actionLabel = isDrawer
    ? "Close navigation"
    : isCollapsed
      ? "Expand navigation"
      : "Collapse navigation";

  const toggleMenu = () => {
    if (isDrawer) {
      setNavOpen(false);

      return;
    }

    setCollapsed(!isCollapsed);
  };

  /**
   * Act on pointerdown, not click.
   *
   * Pressing this button moves focus into it, which can end the keyboard reveal
   * and re-lay out the sidebar while the button is still under the pointer. The
   * button then shifts before mouseup, the click resolves against its parent,
   * and the press does nothing. Handling pointerdown settles the toggle before
   * anything can move.
   *
   * Keyboard activation still arrives as a click with `detail === 0`, so Enter
   * and Space keep working; a pointer's own follow-up click is ignored.
   */
  const handlePointerDown = () => {
    toggleMenu();
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.detail === 0) {
      toggleMenu();
    }
  };

  return (
    <div className="sdl-admin-nav flex items-center gap-3 px-6 py-7">
      <div className="sdl-admin-nav__brand-mark" aria-hidden="true">
        <img
          src={withCmsBasePath("/sdl-mark.svg")}
          alt=""
          className="sdl-admin-nav__brand-image"
        />
      </div>
      <h1 className="sdl-admin-nav__title text-2xl font-bold">Social DNA Labs</h1>
      <button
        aria-controls={sidebarId}
        aria-expanded={isDrawer ? true : !isCollapsed}
        aria-label={actionLabel}
        className="sdl-admin-nav__menu"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        ref={buttonRef}
        title={actionLabel}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  );
}

export default SdlAdminNav;
