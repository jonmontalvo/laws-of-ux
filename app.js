/* ==================================================================
   Laws of UX — rendering + GSAP animations
   ================================================================== */

(function () {
  "use strict";

  const LAWS = window.UX_LAWS || [];
  const hasGsap = typeof window.gsap !== "undefined";
  const STORAGE_KEY = "ux-laws-motion";
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------------
     Rendering
     --------------------------------------------------------------- */
  const overview = document.getElementById("overview");
  const lawsRoot = document.getElementById("laws"); // only present on law.html
  const template = document.getElementById("law-template");

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    children.forEach((c) => node.append(c));
    return node;
  };

  const pad = (n) => String(n).padStart(2, "0");

  const ARROW_ICON =
    '<svg class="resource__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"/></svg>';

  const lawUrl = (law) => `law.html?law=${encodeURIComponent(law.id)}`;

  // law.html shows the law named in the query string; index.html shows none.
  const currentId = new URLSearchParams(window.location.search).get("law");
  const current = lawsRoot ? LAWS.find((law) => law.id === currentId) : undefined;

  // Cards: every law except the one being read
  LAWS.forEach((law, i) => {
    if (law === current) return;
    overview.append(
      el("li", {}, [
        el("a", { class: "overview__link", href: lawUrl(law), style: `--tile:${law.color};--hi:${law.hi}` }, [
          el("div", { class: "overview__tile", html: law.svg }),
          el("div", { class: "overview__body" }, [
            el("span", { class: "overview__num", text: pad(i + 1) }),
            el("span", { class: "overview__name", text: law.name })
          ])
        ])
      ])
    );
  });

  if (!lawsRoot) return;

  const toggle = document.getElementById("motion-toggle");

  if (!current) {
    // Missing or unknown ?law= value: say so and leave the full card grid below.
    document.title = "Law not found — Laws of UX";
    toggle.hidden = true;
    lawsRoot.append(
      el("section", { class: "hero" }, [
        el("p", { class: "eyebrow", text: "Law not found" }),
        el("h1", { text: "That law isn't here" }),
        el("p", { class: "hero__lede", text: "The link may be out of date. Pick one of the sixteen laws below." })
      ])
    );
    return;
  }

  // Detail view for the current law
  {
    const law = current;
    const number = pad(LAWS.indexOf(law) + 1);
    document.title = `${law.name} — Laws of UX`;

    const fragment = template.content.cloneNode(true);
    const article = fragment.querySelector(".law");
    article.id = law.id;
    article.style.setProperty("--tile", law.color);
    article.style.setProperty("--hi", law.hi);
    article.setAttribute("aria-labelledby", `${law.id}-title`);

    fragment.querySelector(".tile__svg").innerHTML = law.svg;
    fragment.querySelector(".tile").setAttribute("role", "img");
    fragment.querySelector(".tile").setAttribute("aria-label", `Animated illustration of ${law.name}: ${law.caption}`);
    fragment.querySelector(".law__caption-text").textContent = law.caption;
    fragment.querySelector(".law__index").textContent = `Law ${number} of ${pad(LAWS.length)}`;

    const title = fragment.querySelector(".law__title");
    title.textContent = law.name;
    title.id = `${law.id}-title`;

    fragment.querySelector(".law__tagline").textContent = law.tagline;
    fragment.querySelector(".law__description").append(...law.description.map((p) => el("p", { text: p })));
    fragment.querySelector(".law__list--considerations").append(...law.considerations.map((c) => el("li", { text: c })));
    fragment.querySelector(".law__list--resources").append(
      ...law.resources.map((r) =>
        el("li", {}, [
          el("a", { class: "resource", href: r.url, target: "_blank", rel: "noopener noreferrer" }, [
            el("span", {}, [el("span", { class: "resource__title", text: r.title }), el("span", { class: "resource__source", text: r.source })]),
            el("span", { html: ARROW_ICON })
          ])
        ])
      )
    );

    const replay = fragment.querySelector(".replay");
    replay.setAttribute("aria-label", `Replay the ${law.name} animation`);

    lawsRoot.append(fragment);
  }

  const sections = [...lawsRoot.querySelectorAll(".law")];

  /* ---------------------------------------------------------------
     Motion state
     --------------------------------------------------------------- */
  const toggleLabel = toggle.querySelector(".motion-toggle__label");

  const stored = localStorage.getItem(STORAGE_KEY);
  let motionEnabled = stored ? stored === "play" : !reducedMotionQuery.matches;

  const renderToggle = () => {
    toggle.setAttribute("aria-pressed", String(!motionEnabled));
    toggleLabel.textContent = motionEnabled ? "Pause motion" : "Play motion";
    toggle.title = motionEnabled ? "Pause all animations" : "Play all animations";
  };
  renderToggle();

  if (!hasGsap) {
    // GSAP didn't load (offline?). Keep the static illustrations and hide controls that can't work.
    document.querySelectorAll(".replay").forEach((b) => (b.hidden = true));
    toggle.hidden = true;
    return;
  }

  /* ---------------------------------------------------------------
     Animation helpers
     --------------------------------------------------------------- */
  const LOOP = { paused: true, repeat: -1, repeatDelay: 1.6, defaults: { ease: "power2.out" } };

  // Set text through the timeline so repeats and scrubbing stay in sync.
  const say = (tl, node, text, position) => tl.call(() => { node.textContent = text; }, null, position);

  // fromTo that doesn't render its "from" values until the playhead reaches it.
  const ft = (tl, target, from, to, position) => tl.fromTo(target, from, { immediateRender: false, ...to }, position);

  const counterTween = (obj, key, node, format) => ({
    onUpdate: () => { node.textContent = format(obj[key]); }
  });

  /* ---------------------------------------------------------------
     The sixteen scenes
     --------------------------------------------------------------- */
  const SCENES = {
    "aesthetic-usability-effect"(svg, tl) {
      const els = svg.querySelectorAll(".au-el");
      const tri = svg.querySelector(".au-tri");
      const meter = svg.querySelector(".au-meter");
      const pct = svg.querySelector(".au-pct");
      const n = { v: 35 };

      gsap.set(els, {
        transformOrigin: "50% 50%",
        x: (i) => [-10, 8, 6, -9][i],
        y: (i) => [5, -7, 9, -5][i],
        rotation: (i) => [-5, 3, -4, 6][i],
        opacity: 0.6
      });
      gsap.set(tri, { opacity: 0.4, rotation: -20, transformOrigin: "50% 60%" });
      gsap.set(meter, { scaleX: 0.35, transformOrigin: "0 50%" });

      tl.to(els, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.inOut" }, 0.3)
        .to(tri, { opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }, 1.0)
        .to(meter, { scaleX: 0.92, duration: 1.2 }, 1.3)
        .to(n, { v: 92, duration: 1.2, ...counterTween(n, "v", pct, (v) => `${Math.round(v)}%`) }, 1.3)
        .to({}, { duration: 1.2 });
    },

    "doherty-threshold"(svg, tl) {
      const tap = svg.querySelector(".dt-tap");
      const ring = svg.querySelector(".dt-ring");
      const ms = svg.querySelector(".dt-ms");
      const resp = svg.querySelector(".dt-resp");
      const cursor = svg.querySelector(".dt-cursor");
      const status = svg.querySelector(".dt-status");
      const n = { v: 0 };
      const fmt = (v) => `${Math.round(v).toLocaleString()} ms`;

      gsap.set(cursor, { x: 96, y: 104 });
      gsap.set(tap, { transformOrigin: "50% 50%" });

      // Pass 1: slow system
      say(tl, status, "Slow system: tap…", 0.01);
      ft(tl, tap, { opacity: 1, scale: 0.4 }, { opacity: 0, scale: 1.7, duration: 0.45 }, 0.2);
      tl.to(n, { v: 1600, duration: 1.6, ease: "none", ...counterTween(n, "v", ms, fmt) }, 0.2)
        .to(ring, { strokeDashoffset: 0, duration: 0.4, ease: "none" }, 0.2)
        .to(ring, { opacity: 0.2, duration: 0.12, repeat: 9, yoyo: true }, 0.6)
        .to(cursor, { x: 170, y: 160, duration: 1.0, ease: "power1.inOut" }, 0.9)
        .to(resp, { opacity: 1, duration: 0.3 }, 1.8);
      say(tl, status, "1,600 ms: the reply lands after attention has drifted", 1.8);

      // Reset
      tl.set(resp, { opacity: 0 }, 3.6)
        .set(cursor, { x: 96, y: 104 }, 3.6)
        .set(ring, { opacity: 1, strokeDashoffset: 88 }, 3.6)
        .call(() => { n.v = 0; ms.textContent = fmt(0); }, null, 3.6);

      // Pass 2: fast system
      say(tl, status, "Fast system: tap…", 3.62);
      ft(tl, tap, { opacity: 1, scale: 0.4 }, { opacity: 0, scale: 1.7, duration: 0.45 }, 3.8);
      tl.to(n, { v: 350, duration: 0.35, ease: "none", ...counterTween(n, "v", ms, fmt) }, 3.8)
        .to(ring, { strokeDashoffset: 88 * (1 - 350 / 400), duration: 0.35, ease: "none" }, 3.8);
      ft(tl, resp, { opacity: 0, x: 8 }, { opacity: 1, x: 0, duration: 0.25 }, 4.15);
      say(tl, status, "350 ms: under the threshold, the user stays in flow", 4.15);
      tl.to({}, { duration: 1.6 });
    },

    "fittss-law"(svg, tl) {
      const cursor = svg.querySelector(".ft-cursor");
      const p1 = svg.querySelector(".ft-path1");
      const p2 = svg.querySelector(".ft-path2");
      const t1 = svg.querySelector(".ft-t1");
      const t2 = svg.querySelector(".ft-t2");
      const time1 = svg.querySelector(".ft-time1");
      const time2 = svg.querySelector(".ft-time2");
      const cap = svg.querySelector(".ft-cap");

      gsap.set(cursor, { x: 40, y: 104 });

      say(tl, cap, "Big and close: one quick movement", 0.01);
      tl.to(p1, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, 0.3)
        .to(cursor, { x: 150, y: 104, duration: 0.55, ease: "power2.inOut" }, 0.3)
        .to(t1, { scale: 1.08, duration: 0.14, yoyo: true, repeat: 1, svgOrigin: "150 104" }, 0.85)
        .to(time1, { opacity: 1, duration: 0.2 }, 0.85);

      tl.set(cursor, { x: 40, y: 104 }, 2.0);
      say(tl, cap, "Small and far: slower, with a correction at the end", 2.0);
      tl.to(p2, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 2.1)
        .to(cursor, { x: 291, y: 34, duration: 1.2, ease: "power2.inOut" }, 2.1)
        .to(cursor, { x: 284, y: 38, duration: 0.3, ease: "power1.inOut" }, 3.3)
        .to(t2, { scale: 1.3, duration: 0.14, yoyo: true, repeat: 1, svgOrigin: "284 38" }, 3.6)
        .to(time2, { opacity: 1, duration: 0.2 }, 3.6)
        .to({}, { duration: 1.4 });
    },

    "postels-law"(svg, tl) {
      const inputs = [...svg.querySelectorAll(".pl-in")];
      const outputs = [...svg.querySelectorAll(".pl-out")];
      const box = svg.querySelector(".pl-box");

      gsap.set(inputs, { transformOrigin: "50% 50%" });
      gsap.set(outputs, { scale: 0, transformOrigin: "50% 50%" });

      inputs.forEach((node, i) => {
        const cx = Number(node.dataset.cx);
        const cy = Number(node.dataset.cy);
        const t = 0.3 + i * 0.32;
        tl.to(node, { x: 160 - cx, y: 100 - cy, scale: 0.15, opacity: 0, duration: 0.7, ease: "power2.in" }, t)
          .to(box, { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1, svgOrigin: "160 100" }, t + 0.7)
          .to(outputs[i], { scale: 1, duration: 0.45, ease: "back.out(2.2)" }, t + 0.8);
      });
      tl.to({}, { duration: 1.4 });
    },

    "goal-gradient-effect"(svg, tl) {
      const stamps = [...svg.querySelectorAll(".gg-stamp")];
      const runner = svg.querySelector(".gg-runner");
      const flag = svg.querySelector(".gg-flag");
      const pace = svg.querySelector(".gg-pace");
      const gaps = [0.9, 0.8, 0.7, 0.6, 0.5, 0.42, 0.34, 0.26, 0.2];

      gsap.set(stamps, { scale: 0, transformOrigin: "50% 50%" });

      let t = 0.4;
      const times = [t];
      gaps.forEach((g) => { t += g; times.push(t); });
      const total = times[times.length - 1];

      stamps.forEach((s, i) => {
        tl.to(s, { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, times[i]);
      });
      tl.to(runner, { x: 268, duration: total - 0.4, ease: "power2.in" }, 0.4)
        .to(flag, { rotation: -12, duration: 0.18, yoyo: true, repeat: 3, svgOrigin: "292 150" }, total + 0.1)
        .to({}, { duration: 1.2 });

      say(tl, pace, "Pace: slow start", 0.01);
      say(tl, pace, "Pace: picking up", times[4]);
      say(tl, pace, "Pace: final sprint", times[7]);
      say(tl, pace, "Reward reached", total + 0.1);
    },

    "hicks-law"(svg, tl) {
      const focusA = svg.querySelector(".hk-focus-a");
      const focusB = svg.querySelector(".hk-focus-b");
      const barA = svg.querySelector(".hk-bar-a");
      const barB = svg.querySelector(".hk-bar-b");
      const checkA = svg.querySelector(".hk-check-a");
      const checkB = svg.querySelector(".hk-check-b");
      const ta = svg.querySelector(".hk-ta");
      const tb = svg.querySelector(".hk-tb");

      gsap.set([barA, barB], { scaleX: 0, transformOrigin: "0 50%" });

      // Three options: glance at two, decide.
      tl.to(focusA, { opacity: 1, duration: 0.15 }, 0.1)
        .to(barA, { scaleX: 1, duration: 0.7, ease: "none" }, 0.1)
        .to(focusA, { attr: { y: 68 }, duration: 0.2, ease: "power1.inOut" }, 0.45)
        .to(checkA, { opacity: 1, duration: 0.15 }, 0.8)
        .to(focusA, { opacity: 0, duration: 0.2 }, 0.8)
        .to(ta, { opacity: 1, duration: 0.2 }, 0.8);

      // Twelve options: the eye wanders before settling.
      const hops = [[0, 0], [1, 0], [2, 0], [2, 1], [1, 1], [0, 2], [1, 2], [2, 3]];
      tl.to(focusB, { opacity: 1, duration: 0.15 }, 0.1)
        .to(barB, { scaleX: 1, duration: 1.3, ease: "none" }, 0.1);
      hops.forEach(([c, r], i) => {
        if (i === 0) return;
        tl.to(focusB, { attr: { x: 170 + c * 36, y: 42 + r * 26 }, duration: 0.14, ease: "power1.inOut" }, 0.1 + i * 0.16);
      });
      tl.to(checkB, { opacity: 1, duration: 0.15 }, 1.4)
        .to(focusB, { opacity: 0, duration: 0.2 }, 1.4)
        .to(tb, { opacity: 1, duration: 0.2 }, 1.4)
        .to({}, { duration: 1.4 });
    },

    "jakobs-law"(svg, tl) {
      const logo = svg.querySelector(".jb-logo");
      const nav = svg.querySelector(".jb-nav");
      const search = svg.querySelector(".jb-search");
      const cards = [...svg.querySelectorAll(".jb-card")];
      const badge = svg.querySelector(".jb-badge");
      const status = svg.querySelector(".jb-status");
      const all = [logo, nav, search, ...cards];

      gsap.set(all, { transformOrigin: "50% 50%" });
      gsap.set(logo, { x: 52, y: 96 });
      gsap.set(nav, { x: -70, y: 92 });
      gsap.set(search, { y: 30, scaleX: 0.5 });
      gsap.set(cards[0], { x: 22, y: -36, rotation: 6 });
      gsap.set(cards[1], { x: -30, y: -10, rotation: -4 });
      gsap.set(cards[2], { x: -8, y: -34, rotation: 5 });
      gsap.set(badge, { scale: 0, transformOrigin: "50% 50%" });

      say(tl, status, "Unfamiliar layout: users have to relearn", 0.01);
      tl.to(all, { x: 0, y: 0, rotation: 0, scaleX: 1, duration: 1.1, stagger: 0.08, ease: "power3.inOut" }, 0.9)
        .to(badge, { scale: 1, duration: 0.4, ease: "back.out(2)" }, 2.3);
      say(tl, status, "Matches expectations: nothing to relearn", 2.3);
      tl.to({}, { duration: 1.6 });
    },

    "serial-position-effect"(svg, tl) {
      const items = [...svg.querySelectorAll(".sp-item")];
      const bars = svg.querySelectorAll(".sp-bar");
      const labs = svg.querySelectorAll(".sp-lab");
      const mid = svg.querySelector(".sp-mid");

      gsap.set(items, { scale: 0.6, opacity: 0, transformOrigin: "50% 50%" });
      gsap.set(bars, { scaleY: 0, transformOrigin: "50% 100%" });

      tl.to(items, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.6)" }, 0.1)
        .to(bars, { scaleY: 1, duration: 0.6, stagger: 0.06 }, 1.4)
        .to([items[1], items[5]], { opacity: 0.6, duration: 0.8 }, 1.4)
        .to([items[2], items[3], items[4]], { opacity: 0.3, duration: 0.8 }, 1.4)
        .to([labs, mid], { opacity: 1, duration: 0.3 }, 2.0)
        .to({}, { duration: 1.6 });
    },

    "law-of-common-region"(svg, tl) {
      const hi = [...svg.querySelectorAll(".cr-hi")];
      const r1 = svg.querySelector(".cr-r1");
      const r2 = svg.querySelector(".cr-r2");
      const lab = svg.querySelector(".cr-lab");
      const byCols = (cols) => hi.filter((h) => cols.includes(Number(h.dataset.c)));
      const left = byCols([0, 1]);
      const center = byCols([1, 2]);

      say(tl, lab, "Eight identical, evenly spaced dots", 0.01);
      tl.to(r1, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 0.8)
        .to(r1, { fillOpacity: 0.12, duration: 0.4 }, 1.6)
        .to(left, { opacity: 1, duration: 0.3, stagger: 0.05 }, 1.7);
      say(tl, lab, "A boundary makes the left four a group", 1.8);

      tl.to([r1, ...left], { opacity: 0, duration: 0.4 }, 3.8)
        .to(r2, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 4.3)
        .to(r2, { fillOpacity: 0.12, duration: 0.4 }, 5.1)
        .to(center, { opacity: 1, duration: 0.3, stagger: 0.05 }, 5.2);
      say(tl, lab, "Move the boundary and the group changes", 5.3);
      tl.to({}, { duration: 1.6 });
    },

    "law-of-proximity"(svg, tl) {
      const dots = [...svg.querySelectorAll(".px-dot")];
      const lab = svg.querySelector(".px-lab");
      const cols = (...c) => dots.filter((d) => c.includes(Number(d.dataset.c)));
      const rows = (...r) => dots.filter((d) => r.includes(Number(d.dataset.r)));

      say(tl, lab, "Even spacing: one grid", 0.01);
      tl.to(cols(0, 1), { x: -22, duration: 0.8, ease: "power3.inOut" }, 0.9)
        .to(cols(2, 3), { x: 22, duration: 0.8, ease: "power3.inOut" }, 0.9);
      say(tl, lab, "Wider horizontal gap: two groups", 1.3);
      tl.to(dots, { x: 0, duration: 0.6, ease: "power3.inOut" }, 3.1)
        .to(rows(0, 1), { y: -16, duration: 0.8, ease: "power3.inOut" }, 3.9)
        .to(rows(2, 3), { y: 16, duration: 0.8, ease: "power3.inOut" }, 3.9);
      say(tl, lab, "Wider vertical gap: two different groups", 4.3);
      tl.to({}, { duration: 1.6 });
    },

    "law-of-pragnanz"(svg, tl) {
      const mesh = svg.querySelector(".pz-mesh");
      const hex = svg.querySelector(".pz-hex");
      const circs = svg.querySelectorAll(".pz-circ");
      const lab = svg.querySelector(".pz-lab");

      say(tl, lab, "What's actually drawn: a mesh and broken arcs", 0.01);
      tl.to(mesh, { opacity: 0.1, duration: 1.1, ease: "power2.inOut" }, 1.1)
        .to(hex, { attr: { "stroke-width": 3.5 }, duration: 0.8 }, 1.1)
        .to(circs, { attr: { "stroke-dasharray": "189 0" }, duration: 1.1, ease: "power2.inOut" }, 1.1);
      say(tl, lab, "What we see: a hexagon and two circles", 1.6);
      tl.to({}, { duration: 1.8 });
    },

    "zeigarnik-effect"(svg, tl) {
      const tasks = [...svg.querySelectorAll(".zg-task")];
      const checks = tasks.map((t) => t.querySelector(".zg-check"));
      const ring = svg.querySelector(".zg-ring");
      const prog = svg.querySelector(".zg-prog");
      const ptext = svg.querySelector(".zg-ptext");
      const note = svg.querySelector(".zg-note");

      gsap.set(prog, { scaleX: 0, transformOrigin: "0 50%" });
      gsap.set(ring, { transformOrigin: "50% 50%" });

      [0, 1, 3].forEach((idx, k) => {
        const t = 0.3 + k * 0.6;
        tl.to(checks[idx], { strokeDashoffset: 0, duration: 0.3 }, t)
          .to(prog, { scaleX: (k + 1) / 4, duration: 0.3 }, t);
        say(tl, ptext, `${k + 1} of 4 done`, t + 0.1);
      });

      tl.to([tasks[0], tasks[1], tasks[3]], { opacity: 0.35, duration: 0.8 }, 2.3)
        .to(note, { opacity: 1, duration: 0.3 }, 2.5)
        .set(ring, { opacity: 0.9, scale: 1 }, 2.5)
        .to(ring, { scale: 1.6, opacity: 0, duration: 0.9, repeat: 2, ease: "power1.out" }, 2.5)
        .to(tasks[2], { x: 4, duration: 0.14, yoyo: true, repeat: 3, ease: "power1.inOut" }, 2.6)
        .to({}, { duration: 1.2 });
    },

    "law-of-similarity"(svg, tl) {
      const dots = [...svg.querySelectorAll(".sm-dot")];
      const hi = [...svg.querySelectorAll(".sm-hi")];
      const lab = svg.querySelector(".sm-lab");
      const vShape = [0, 4, 6, 8, 12].map((i) => hi[i]);
      const diagonal = [1, 7, 13, 19].map((i) => dots[i]);

      gsap.set(hi, { scale: 0.3, transformOrigin: "50% 50%" });
      gsap.set(dots, { transformOrigin: "50% 50%" });

      say(tl, lab, "A uniform grid", 0.01);
      tl.to(vShape, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.08, ease: "back.out(2)" }, 0.8);
      say(tl, lab, "Same colour: seen as one V shape", 1.4);
      tl.to(vShape, { opacity: 0, duration: 0.4 }, 3.2)
        .to(diagonal, { scale: 1.8, duration: 0.5, stagger: 0.08, ease: "back.out(1.6)" }, 3.8);
      say(tl, lab, "Same size: grouped into a line, even when apart", 4.2);
      tl.to({}, { duration: 1.6 });
    },

    "peak-end-rule"(svg, tl) {
      const path = svg.querySelector(".pe-path");
      const peak = svg.querySelector(".pe-peak");
      const peakL = svg.querySelector(".pe-peak-l");
      const end = svg.querySelector(".pe-end");
      const endL = svg.querySelector(".pe-end-l");
      const rem = svg.querySelector(".pe-rem");
      const remL = svg.querySelector(".pe-rem-l");
      const avg = svg.querySelector(".pe-avg");
      const avgL = svg.querySelector(".pe-avg-l");
      const lab = svg.querySelector(".pe-lab");

      const pts = [[40, 110], [70, 120], [100, 95], [130, 125], [160, 50], [190, 100], [220, 115], [250, 105], [290, 70]];
      const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
      const total = segs.reduce((a, b) => a + b, 0);
      const toPeak = segs.slice(0, 4).reduce((a, b) => a + b, 0);
      const draw = 2.4;

      gsap.set(path, { strokeDasharray: total, strokeDashoffset: total });
      gsap.set([peak, end], { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(rem, { scaleX: 0, transformOrigin: "0 50%" });

      say(tl, lab, "Living through it, moment by moment…", 0.01);
      tl.to(path, { strokeDashoffset: 0, duration: draw, ease: "none" }, 0.2)
        .to(peak, { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, 0.2 + draw * (toPeak / total))
        .to(peakL, { opacity: 1, duration: 0.25 }, 0.3 + draw * (toPeak / total))
        .to(end, { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, 0.2 + draw)
        .to(endL, { opacity: 1, duration: 0.25 }, 0.3 + draw)
        .to(rem, { opacity: 1, scaleX: 1, duration: 0.6 }, 3.1)
        .to(remL, { opacity: 1, duration: 0.3 }, 3.5)
        .to([avg, avgL], { opacity: 1, duration: 0.4 }, 3.9);
      say(tl, lab, "Remembered: well above the real average", 3.9);
      tl.to({}, { duration: 1.8 });
    },

    "millers-law"(svg, tl) {
      const items = [...svg.querySelectorAll(".ml-item")];
      const lab = svg.querySelector(".ml-lab");
      const startX = (i) => 44 + i * 24;
      const slotX = (s) => 40 + s * 36;

      gsap.set(items, { x: (i) => startX(i), y: 150, transformOrigin: "50% 50%" });

      say(tl, lab, "10 unrelated items", 0.01);
      items.slice(0, 7).forEach((it, i) => {
        tl.to(it, { x: slotX(i), y: 50, duration: 0.45, ease: "power2.inOut" }, 0.4 + i * 0.14);
      });
      items.slice(7).forEach((it, j) => {
        const t = 1.75 + j * 0.22;
        tl.to(it, { x: 290, y: 50, duration: 0.4, ease: "power2.in" }, t)
          .to(it, { x: 296, y: 150, rotation: 28, opacity: 0.35, duration: 0.6, ease: "bounce.out" }, t + 0.4);
      });
      say(tl, lab, "About seven stick; the rest fall out", 2.0);

      // Phase 2: chunking
      tl.set(items, { x: (i) => startX(i), y: 150, rotation: 0, opacity: 1 }, 3.8);
      say(tl, lab, "Same ten items, grouped into three chunks…", 3.8);
      const chunks = [[0, 1, 2], [3, 4, 5], [6, 7, 8, 9]];
      const chunkSlots = [1, 3, 5];
      chunks.forEach((chunk, c) => {
        chunk.forEach((idx, j) => {
          const off = (j - (chunk.length - 1) / 2) * 3;
          tl.to(items[idx], { x: slotX(chunkSlots[c]) + off, y: 50 - off, duration: 0.55, ease: "power2.inOut" }, 4.1 + (c * chunk.length + j) * 0.06);
        });
      });
      say(tl, lab, "Three chunks: all ten fit comfortably", 4.9);
      tl.to({}, { duration: 1.8 });
    },

    "teslers-law"(svg, tl) {
      const blocks = [...svg.querySelectorAll(".ts-block")];
      const cu = svg.querySelector(".ts-cu");
      const cs = svg.querySelector(".ts-cs");
      const userPos = (i) => ({ x: 48 + (i % 4) * 23, y: 52 + Math.floor(i / 4) * 26 });
      const sysPos = (i) => ({ x: 188 + (i % 4) * 23, y: 52 + Math.floor(i / 4) * 26 });

      blocks.forEach((b, i) => gsap.set(b, userPos(i)));

      const moving = [11, 10, 9, 8, 7, 6, 5, 4, 3];
      moving.forEach((idx, k) => {
        const t = 0.8 + k * 0.16;
        tl.to(blocks[idx], { ...sysPos(k), duration: 0.5, ease: "power2.inOut" }, t);
        tl.call(() => { cu.textContent = String(12 - (k + 1)); cs.textContent = String(k + 1); }, null, t + 0.3);
      });
      say(tl, cu, "12", 0.01);
      say(tl, cs, "0", 0.01);
      tl.to({}, { duration: 2.2 });
    }
  };

  /* ---------------------------------------------------------------
     Build timelines and wire them to visibility + controls
     --------------------------------------------------------------- */
  const states = [];
  const stateBySection = new Map();

  const showEndState = (tl) => {
    tl.pause();
    tl.time(tl.duration() - 0.001, false);
  };

  const sync = (state) => {
    if (motionEnabled && state.inView) {
      if (state.tl.paused()) state.tl.play();
    } else if (!state.tl.paused()) {
      state.tl.pause();
    }
  };

  sections.forEach((section) => {
    const svg = section.querySelector(".tile__svg svg");
    const build = SCENES[section.id];
    if (!svg || !build) return;

    const tl = gsap.timeline(LOOP);
    build(svg, tl);

    const state = { tl, inView: false };
    states.push(state);
    stateBySection.set(section, state);

    // When motion is globally off, hold each scene at its final frame
    // so the illustration still tells its story.
    tl.eventCallback("onRepeat", () => { if (!motionEnabled) showEndState(tl); });
    if (!motionEnabled) showEndState(tl);

    section.querySelector(".replay").addEventListener("click", () => tl.restart());
  });

  const viewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = stateBySection.get(entry.target);
        if (!state) return;
        state.inView = entry.isIntersecting;
        sync(state);
      });
    },
    { threshold: 0.2 }
  );
  sections.forEach((s) => viewObserver.observe(s));

  toggle.addEventListener("click", () => {
    motionEnabled = !motionEnabled;
    localStorage.setItem(STORAGE_KEY, motionEnabled ? "play" : "pause");
    renderToggle();
    states.forEach((s) => (motionEnabled ? sync(s) : showEndState(s.tl)));
  });

  // Keep the page honest when the tab is hidden: pause everything.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) states.forEach((s) => s.tl.pause());
    else states.forEach(sync);
  });
})();
