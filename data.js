/* ==================================================================
   Laws of UX — content + SVG scenes
   Each law: copy, considerations, resources and the SVG markup that
   app.js animates. All SVGs share a 320×200 viewBox and use
   `currentColor` for ink and `var(--hi)` for the highlight colour.
   ================================================================== */

(function () {
  "use strict";

  // Small helpers so the dot-grid scenes don't need hand-typed circles.
  const range = (n) => Array.from({ length: n }, (_, i) => i);

  const dotGrid = ({ cls, cols, rows, x0, y0, dx, dy, r, extra = () => "" }) =>
    range(rows)
      .map((row) =>
        range(cols)
          .map((col) => {
            const cx = x0 + col * dx;
            const cy = y0 + row * dy;
            return `<circle class="${cls}" data-c="${col}" data-r="${row}" cx="${cx}" cy="${cy}" r="${r}" fill="currentColor"/>${extra(col, row, cx, cy)}`;
          })
          .join("")
      )
      .join("");

  const polygonPoints = (cx, cy, radius, sides, rotation = -90) =>
    range(sides)
      .map((i) => {
        const a = ((rotation + (360 / sides) * i) * Math.PI) / 180;
        return `${(cx + radius * Math.cos(a)).toFixed(1)},${(cy + radius * Math.sin(a)).toFixed(1)}`;
      })
      .join(" ");

  const cursorPath =
    '<path d="M0 0 L0 15 L4.2 11.4 L7.2 17.6 L10 16.3 L7 10.2 L12 9.6 Z" fill="var(--hi)" stroke="rgba(0,0,0,.55)" stroke-width=".9" stroke-linejoin="round"/>';

  const svg = (inner) =>
    `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${inner}</svg>`;

  const LAWS = [
    /* ------------------------------------------------------------ 1 */
    {
      id: "aesthetic-usability-effect",
      name: "Aesthetic-Usability Effect",
      color: "#4b5b8c",
      hi: "#ffd166",
      tagline: "Users often perceive aesthetically pleasing design as design that's more usable.",
      description: [
        "People tend to believe that things that look better also work better. An attractive interface produces a positive emotional response, and that response makes users more tolerant of small usability problems and more likely to describe the product as easy to use, even when their actual task performance hasn't changed.",
        "The effect was first measured in 1995 by Masaaki Kurosu and Kaori Kashimura at Hitachi, who found that perceived ease of use of ATM layouts correlated more strongly with their visual appeal than with their actual ease of use."
      ],
      considerations: [
        "Invest in visual polish early. Alignment, consistent spacing, and a clear type hierarchy are the cheapest ways to look (and feel) usable.",
        "Don't let it mask real problems. In usability tests, attractive prototypes can inflate satisfaction scores, so watch task completion time and errors, not just what people say.",
        "Aesthetics only buys forgiveness for minor friction. A broken core flow will surface regardless of how good the UI looks.",
        "Keep the pleasing surface honest: visual quality signals care, and users notice when the rest of the product doesn't match."
      ],
      resources: [
        { title: "Aesthetic-Usability Effect", source: "Laws of UX", url: "https://lawsofux.com/aesthetic-usability-effect/" },
        { title: "The Aesthetic-Usability Effect", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/aesthetic-usability-effect/" },
        { title: "Apparent usability vs. inherent usability (Kurosu & Kashimura, 1995)", source: "ACM Digital Library", url: "https://dl.acm.org/doi/10.1145/223355.223680" },
        { title: "Aesthetic–usability effect", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Aesthetic%E2%80%93usability_effect" }
      ],
      caption: "A misaligned layout snaps into a tidy one; the perceived-usability meter rises even though nothing functional changed.",
      svg: svg(`
        <rect x="48" y="24" width="224" height="118" rx="8" fill="none" stroke="currentColor" stroke-opacity=".35"/>
        <g fill="currentColor">
          <rect class="au-el" x="62" y="36" width="196" height="14" rx="3"/>
          <rect class="au-el" x="62" y="58" width="118" height="70" rx="4" opacity=".92"/>
          <rect class="au-el" x="190" y="58" width="68" height="31" rx="4" opacity=".92"/>
          <rect class="au-el" x="190" y="97" width="68" height="31" rx="4" opacity=".92"/>
        </g>
        <polygon class="au-tri" points="121,74 106,100 136,100" style="fill:var(--tile)"/>
        <rect x="48" y="158" width="224" height="6" rx="3" fill="currentColor" opacity=".22"/>
        <rect class="au-meter" x="48" y="158" width="224" height="6" rx="3" fill="var(--hi)"/>
        <text x="48" y="183" font-size="10.5" font-weight="600" fill="currentColor">Perceived usability</text>
        <text class="au-pct" x="272" y="183" font-size="10.5" font-weight="700" text-anchor="end" fill="currentColor">35%</text>
      `)
    },

    /* ------------------------------------------------------------ 2 */
    {
      id: "doherty-threshold",
      name: "Doherty Threshold",
      color: "#8f2f72",
      hi: "#ffd166",
      tagline: "Productivity soars when a computer and its users interact at a pace (under 400 ms) that ensures neither has to wait on the other.",
      description: [
        "In 1982 IBM researchers Walter Doherty and Ahrvind Thadani showed that when system response time dropped below roughly 400 milliseconds, users didn't just save the waiting time. They stayed in a state of flow, made fewer errors and produced disproportionately more work.",
        "Above that threshold attention drifts and short-term memory starts to decay, so every interaction costs more than the raw delay. The threshold is about responsiveness, not raw speed: an immediate acknowledgement counts even when the full result takes longer."
      ],
      considerations: [
        "Give feedback within 400 ms even when the work takes longer: optimistic UI, skeleton screens and instant button states all keep the loop closed.",
        "For waits beyond about a second, show progress. For waits beyond ten, let people do something else and notify them.",
        "Too fast can also feel wrong. A brief, purposeful delay (a 'securing your payment' state) can increase trust in a sensitive action.",
        "Measure on real devices and networks. The threshold is easy to hit on a developer laptop and easy to miss on a mid-range phone."
      ],
      resources: [
        { title: "Doherty Threshold", source: "Laws of UX", url: "https://lawsofux.com/doherty-threshold/" },
        { title: "The Economic Value of Rapid Response Time (Doherty & Thadani, 1982)", source: "IBM, archived", url: "https://jlelliotton.blogspot.com/p/the-economic-value-of-rapid-response.html" },
        { title: "Response Times: The 3 Important Limits", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/response-times-3-important-limits/" },
        { title: "Measure performance with the RAIL model", source: "web.dev", url: "https://web.dev/articles/rail" }
      ],
      caption: "Two taps on the same button. A 1.6-second reply arrives after attention has wandered; a 350 ms reply keeps the user in flow.",
      svg: svg(`
        <circle cx="38" cy="34" r="14" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="3"/>
        <circle class="dt-ring" cx="38" cy="34" r="14" fill="none" stroke="var(--hi)" stroke-width="3" stroke-linecap="round" stroke-dasharray="88" stroke-dashoffset="88" transform="rotate(-90 38 34)"/>
        <text class="dt-ms" x="60" y="38.5" font-size="13" font-weight="700" fill="currentColor">0 ms</text>
        <text x="282" y="38.5" font-size="10" font-weight="600" text-anchor="end" fill="currentColor" opacity=".7">budget: 400 ms</text>

        <rect x="36" y="78" width="92" height="38" rx="8" fill="currentColor"/>
        <text x="82" y="102" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(--tile)">Save</text>
        <circle class="dt-tap" cx="82" cy="97" r="12" fill="none" stroke="var(--hi)" stroke-width="3" opacity="0"/>
        <path d="M136 97 H168" stroke="currentColor" stroke-dasharray="3 4" stroke-opacity=".45"/>

        <g class="dt-resp" opacity="0">
          <rect x="176" y="68" width="110" height="58" rx="8" fill="currentColor"/>
          <path d="M190 97 l8 8 l16 -18" stroke="var(--tile)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="222" y="86" width="52" height="7" rx="3.5" style="fill:var(--tile)" opacity=".75"/>
          <rect x="222" y="99" width="36" height="7" rx="3.5" style="fill:var(--tile)" opacity=".4"/>
        </g>

        <g class="dt-cursor">${cursorPath}</g>

        <line x1="36" y1="150" x2="284" y2="150" stroke="currentColor" stroke-opacity=".2"/>
        <text class="dt-status" x="36" y="172" font-size="10.5" font-weight="600" fill="currentColor">Tap…</text>
      `)
    },

    /* ------------------------------------------------------------ 3 */
    {
      id: "fittss-law",
      name: "Fitts's Law",
      color: "#4f7d3b",
      hi: "#ffd166",
      tagline: "The time to acquire a target is a function of the distance to and size of the target.",
      description: [
        "Paul Fitts' 1954 model predicts that pointing at something takes longer the farther away it is and the smaller it is, and that the relationship is logarithmic: doubling a target's size helps less than you'd think, but shrinking a tiny one hurts a lot.",
        "In interfaces, large targets placed near where the pointer or thumb already is are fastest to hit. Screen edges and corners behave as if they were infinitely large, because the cursor stops there."
      ],
      considerations: [
        "Make primary actions large and put them close to where the user's attention and pointer already are.",
        "Keep touch targets at least 44×44 points, and extend the hit area beyond the visible icon when the glyph is small.",
        "Keep related actions close together, but separate destructive ones by distance so they can't be hit by accident.",
        "Use edges and corners for persistent controls (docks, menus, close buttons) and respect the thumb zone on phones."
      ],
      resources: [
        { title: "Fitts's Law", source: "Laws of UX", url: "https://lawsofux.com/fittss-law/" },
        { title: "Fitts's Law and Its Applications in UX", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/fitts-law/" },
        { title: "Fitts's Law: The Importance of Size and Distance in UI Design", source: "Interaction Design Foundation", url: "https://www.interaction-design.org/literature/article/fitts-s-law-the-importance-of-size-and-distance-in-ui-design" },
        { title: "Fitts's law", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Fitts%27s_law" }
      ],
      caption: "From the same start point, the pointer reaches a big nearby target quickly and needs a slower, corrected movement for a small distant one.",
      svg: svg(`
        <circle cx="40" cy="104" r="5" fill="currentColor"/>
        <text x="40" y="128" font-size="9.5" font-weight="600" text-anchor="middle" fill="currentColor" opacity=".8">start</text>

        <g class="ft-t1">
          <circle cx="150" cy="104" r="34" fill="none" stroke="currentColor" stroke-width="3"/>
          <circle cx="150" cy="104" r="22" fill="none" stroke="currentColor" stroke-width="3"/>
          <circle cx="150" cy="104" r="9" fill="currentColor"/>
        </g>
        <g class="ft-t2">
          <circle cx="284" cy="38" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/>
          <circle cx="284" cy="38" r="3" fill="currentColor"/>
        </g>

        <path class="ft-path1" d="M40 104 H150" stroke="var(--hi)" stroke-width="2" fill="none" stroke-dasharray="110" stroke-dashoffset="110"/>
        <path class="ft-path2" d="M40 104 L284 38" stroke="var(--hi)" stroke-width="2" fill="none" stroke-dasharray="253" stroke-dashoffset="253"/>

        <text class="ft-time1" x="150" y="160" font-size="11" font-weight="700" text-anchor="middle" fill="var(--hi)" opacity="0">0.6 s</text>
        <text class="ft-time2" x="284" y="66" font-size="11" font-weight="700" text-anchor="end" fill="var(--hi)" opacity="0">1.5 s</text>

        <g class="ft-cursor">${cursorPath}</g>
        <text class="ft-cap" x="40" y="186" font-size="10.5" font-weight="600" fill="currentColor">Big and close</text>
      `)
    },

    /* ------------------------------------------------------------ 4 */
    {
      id: "postels-law",
      name: "Postel's Law",
      color: "#3e7d5e",
      hi: "#ffd166",
      tagline: "Be liberal in what you accept, and conservative in what you send.",
      description: [
        "Also called the Robustness Principle, this line was written by Jon Postel into the 1980 specification for TCP as guidance for implementers talking to other people's software.",
        "Applied to design, it means tolerating a wide range of user input, behaviour and context, while being precise, consistent and predictable in what you present back. The system absorbs the messiness so the user doesn't have to."
      ],
      considerations: [
        "Accept input in many forms (phone numbers with or without dashes, mixed-case emails, trailing spaces, dates in several formats) and normalise it yourself.",
        "Design for varied contexts: screen sizes, input methods, assistive technologies, slow networks and unexpected navigation paths.",
        "Be strict with your output: clear copy, consistent formats, stable layouts and predictable state.",
        "Tolerance has limits. Define them for security and data quality, and when input can't be accepted, explain exactly what's wrong and how to fix it."
      ],
      resources: [
        { title: "Postel's Law", source: "Laws of UX", url: "https://lawsofux.com/postels-law/" },
        { title: "Robustness principle", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Robustness_principle" },
        { title: "RFC 761: Transmission Control Protocol (section 2.10, 'Robustness Principle')", source: "IETF", url: "https://datatracker.ietf.org/doc/html/rfc761" },
        { title: "Design for Real Life (Eric Meyer & Sara Wachter-Boettcher)", source: "A Book Apart", url: "https://abookapart.com/products/design-for-real-life" }
      ],
      caption: "Inputs of every shape are accepted on the left; the system normalises them and emits a tidy, uniform set on the right.",
      svg: svg(`
        <g fill="currentColor">
          <circle class="pl-in" data-cx="32" data-cy="42" cx="32" cy="42" r="9"/>
          <polygon class="pl-in" data-cx="66" data-cy="66" points="${polygonPoints(66, 66, 12, 3, -70)}"/>
          <rect class="pl-in" data-cx="34" data-cy="92" x="22" y="85" width="24" height="14" rx="3" transform="rotate(14 34 92)"/>
          <polygon class="pl-in" data-cx="68" data-cy="118" points="${polygonPoints(68, 118, 11, 5)}"/>
          <path class="pl-in" data-cx="34" data-cy="146" d="M22 146c0-8 6-12 12-12s14 4 12 12-6 11-13 10-11-2-11-10z"/>
          <rect class="pl-in" data-cx="66" data-cy="170" x="58" y="162" width="16" height="16" rx="2" transform="rotate(45 66 170)"/>
        </g>

        <rect class="pl-box" x="118" y="56" width="84" height="88" rx="12" fill="none" stroke="currentColor" stroke-width="2.5"/>
        <path d="M134 78 h52 l-18 24 v18 l-16 8 v-26 z" fill="currentColor" opacity=".35"/>

        <g style="fill:var(--hi)">
          ${[0, 1, 2, 3, 4, 5].map((i) => {
            const cx = 236 + (i % 2) * 36;
            const cy = 66 + Math.floor(i / 2) * 34;
            return `<polygon class="pl-out" points="${polygonPoints(cx, cy, 12, 3, 90)}"/>`;
          }).join("")}
        </g>

        <text x="50" y="192" font-size="10" font-weight="600" text-anchor="middle" fill="currentColor">liberal in</text>
        <text x="254" y="192" font-size="10" font-weight="600" text-anchor="middle" fill="currentColor">conservative out</text>
      `)
    },

    /* ------------------------------------------------------------ 5 */
    {
      id: "goal-gradient-effect",
      name: "Goal-Gradient Effect",
      color: "#2c7b78",
      hi: "#ffd166",
      tagline: "The tendency to approach a goal increases with proximity to the goal.",
      description: [
        "Clark Hull first observed in 1932 that rats ran faster the closer they got to food. Later work confirmed the same acceleration in people: motivation rises as the finish line gets nearer.",
        "A 2006 study by Kivetz, Urminsky and Zheng found café customers bought coffee more often as they neared a free drink, and that a 12-stamp card with two stamps already filled in beat a blank 10-stamp card, even though both required ten purchases."
      ],
      considerations: [
        "Show distance to the goal explicitly: progress bars, step counts, checklists and 'two more to go' messages.",
        "Give people a head start (the endowed-progress effect) to get them past the slow early phase where motivation is lowest.",
        "Break long journeys into short sub-goals so users repeatedly experience the final sprint.",
        "Never fake progress or hide how much is left. A bar that lies destroys the trust the technique depends on."
      ],
      resources: [
        { title: "Goal-Gradient Effect", source: "Laws of UX", url: "https://lawsofux.com/goal-gradient-effect/" },
        { title: "The Goal-Gradient Hypothesis Resurrected (Kivetz, Urminsky & Zheng, 2006)", source: "Journal of Marketing Research", url: "https://doi.org/10.1509/jmkr.43.1.39" },
        { title: "The Endowed Progress Effect", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/endowed-progress-effect/" },
        { title: "Goal gradient effect", source: "The Decision Lab", url: "https://thedecisionlab.com/biases/goal-gradient-effect" }
      ],
      caption: "Stamps on a loyalty card land faster and faster as the reward approaches, and the runner below accelerates toward the flag.",
      svg: svg(`
        <rect x="24" y="26" width="272" height="86" rx="10" fill="currentColor" opacity=".12"/>
        <rect x="24" y="26" width="272" height="86" rx="10" fill="none" stroke="currentColor" stroke-opacity=".4"/>
        <text x="36" y="46" font-size="10" font-weight="700" fill="currentColor" letter-spacing=".06em">LOYALTY CARD</text>
        <text x="284" y="46" font-size="10" font-weight="600" text-anchor="end" fill="currentColor" opacity=".8">10 = free</text>
        ${range(10).map((i) => {
          const cx = 52 + (i % 5) * 48;
          const cy = i < 5 ? 68 : 96;
          const goal = i === 9;
          return `
            <circle cx="${cx}" cy="${cy}" r="11" fill="none" stroke="currentColor" stroke-opacity=".4" ${goal ? 'stroke-dasharray="3 3"' : ""}/>
            <circle class="gg-stamp" cx="${cx}" cy="${cy}" r="8" fill="${goal ? "var(--hi)" : "currentColor"}"/>`;
        }).join("")}

        <line x1="24" y1="150" x2="296" y2="150" stroke="currentColor" stroke-opacity=".3" stroke-width="2"/>
        <g class="gg-flag">
          <line x1="292" y1="150" x2="292" y2="124" stroke="currentColor" stroke-width="2"/>
          <path d="M292 124 h14 l-4 6 l4 6 h-14 z" fill="var(--hi)"/>
        </g>
        <circle class="gg-runner" cx="24" cy="150" r="7" fill="var(--hi)"/>
        <text class="gg-pace" x="24" y="186" font-size="10.5" font-weight="600" fill="currentColor">Pace: slow start</text>
      `)
    },

    /* ------------------------------------------------------------ 6 */
    {
      id: "hicks-law",
      name: "Hick's Law",
      color: "#2b5c9c",
      hi: "#ffd166",
      tagline: "The time it takes to make a decision increases with the number and complexity of choices.",
      description: [
        "William Edmund Hick and Ray Hyman showed in the early 1950s that reaction time grows logarithmically with the number of equally likely options. Every additional choice adds cognitive load, slows the decision and increases the chance that someone gives up entirely.",
        "The effect is strongest when options are unfamiliar or hard to compare, which is exactly the situation new users are in."
      ],
      considerations: [
        "Minimise choices wherever response time matters: onboarding, checkout, error recovery, empty states.",
        "Use progressive disclosure to break complex tasks into smaller steps, and highlight a recommended option when there is one.",
        "Group and label options so people decide between a few categories first, then a few items.",
        "Don't oversimplify into obscurity. Expert users want breadth; keep it reachable but not the default view."
      ],
      resources: [
        { title: "Hick's Law", source: "Laws of UX", url: "https://lawsofux.com/hicks-law/" },
        { title: "Hick's Law: Making the choice easier for users", source: "Interaction Design Foundation", url: "https://www.interaction-design.org/literature/article/hick-s-law-making-the-choice-easier-for-users" },
        { title: "Simplicity Wins over Abundance of Choice", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/simplicity-vs-choice/" },
        { title: "Hick's law", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Hick%27s_law" }
      ],
      caption: "Two menus start at the same moment. With three options the choice lands quickly; with twelve, the focus wanders and the timer runs almost twice as long.",
      svg: svg(`
        <text x="32" y="30" font-size="10.5" font-weight="700" fill="currentColor">3 options</text>
        <text x="172" y="30" font-size="10.5" font-weight="700" fill="currentColor">12 options</text>
        <g fill="currentColor" opacity=".85">
          ${[44, 70, 96].map((y) => `<rect class="hk-a" x="32" y="${y}" width="100" height="18" rx="4"/>`).join("")}
          ${range(12).map((i) => `<rect class="hk-b" x="${172 + (i % 3) * 36}" y="${44 + Math.floor(i / 3) * 26}" width="28" height="18" rx="4"/>`).join("")}
        </g>
        <rect class="hk-focus-a" x="30" y="42" width="104" height="22" rx="6" fill="none" stroke="var(--hi)" stroke-width="2.5" opacity="0"/>
        <rect class="hk-focus-b" x="170" y="42" width="32" height="22" rx="6" fill="none" stroke="var(--hi)" stroke-width="2.5" opacity="0"/>
        <path class="hk-check-a" d="M38 79 l5 5 l9 -10" stroke="var(--tile)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
        <path class="hk-check-b" d="M250 123 l5 5 l9 -10" stroke="var(--tile)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>

        <text x="32" y="162" font-size="9.5" font-weight="600" fill="currentColor" opacity=".8">decision time</text>
        <text x="172" y="162" font-size="9.5" font-weight="600" fill="currentColor" opacity=".8">decision time</text>
        <rect x="32" y="168" width="100" height="6" rx="3" fill="currentColor" opacity=".22"/>
        <rect x="172" y="168" width="100" height="6" rx="3" fill="currentColor" opacity=".22"/>
        <rect class="hk-bar-a" x="32" y="168" width="100" height="6" rx="3" fill="var(--hi)"/>
        <rect class="hk-bar-b" x="172" y="168" width="100" height="6" rx="3" fill="var(--hi)"/>
        <text class="hk-ta" x="32" y="190" font-size="11" font-weight="700" fill="var(--hi)" opacity="0">0.7 s</text>
        <text class="hk-tb" x="172" y="190" font-size="11" font-weight="700" fill="var(--hi)" opacity="0">1.3 s</text>
      `)
    },

    /* ------------------------------------------------------------ 7 */
    {
      id: "jakobs-law",
      name: "Jakob's Law",
      color: "#7e7a2b",
      hi: "#ffd166",
      tagline: "Users spend most of their time on other sites, so they prefer your site to work the same way as all the other sites they already know.",
      description: [
        "Usability pioneer Jakob Nielsen formulated the law in 2000. Users arrive with mental models built everywhere else, and when your product follows the conventions they already know, they can transfer that knowledge and spend their attention on the task rather than on learning your interface.",
        "Familiarity is a feature. Novelty is a cost that has to be paid back with real value."
      ],
      considerations: [
        "Adopt established patterns for navigation, forms, carts, search and settings. Spend your novelty budget where it differentiates you.",
        "When you must change something people rely on, give them a transition: a preview, a 'switch back' option, or clear in-context guidance.",
        "Study the products your audience actually uses. Conventions differ between domains, platforms and regions.",
        "Convention is about patterns, not cloning. Match expectations at the interaction level and differentiate through content, tone and brand."
      ],
      resources: [
        { title: "Jakob's Law", source: "Laws of UX", url: "https://lawsofux.com/jakobs-law/" },
        { title: "Jakob's Law of Internet User Experience (video)", source: "Nielsen Norman Group", url: "https://www.nngroup.com/videos/jakobs-law-internet-ux/" },
        { title: "End of Web Design (Jakob Nielsen, 2000)", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/end-of-web-design/" },
        { title: "10 Usability Heuristics for User Interface Design", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/ten-usability-heuristics/" }
      ],
      caption: "The left frame shows the layout people already know. The right frame starts scrambled, then rearranges itself to match that expectation.",
      svg: svg(`
        <text x="16" y="22" font-size="10" font-weight="700" fill="currentColor" opacity=".85">Sites they know</text>
        <text x="168" y="22" font-size="10" font-weight="700" fill="currentColor" opacity=".85">Your site</text>

        <g fill="currentColor">
          <rect x="16" y="30" width="136" height="120" rx="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <rect x="26" y="40" width="24" height="8" rx="2"/>
          <rect x="100" y="41" width="12" height="6" rx="2" opacity=".8"/><rect x="116" y="41" width="12" height="6" rx="2" opacity=".8"/><rect x="132" y="41" width="12" height="6" rx="2" opacity=".8"/>
          <rect x="26" y="56" width="118" height="10" rx="5" opacity=".55"/>
          <rect x="26" y="76" width="36" height="62" rx="4" opacity=".9"/><rect x="67" y="76" width="36" height="62" rx="4" opacity=".9"/><rect x="108" y="76" width="36" height="62" rx="4" opacity=".9"/>
        </g>

        <g fill="currentColor">
          <rect x="168" y="30" width="136" height="120" rx="7" fill="none" stroke="currentColor" stroke-width="2"/>
          <rect class="jb-el jb-logo" x="178" y="40" width="24" height="8" rx="2"/>
          <g class="jb-el jb-nav"><rect x="252" y="41" width="12" height="6" rx="2" opacity=".8"/><rect x="268" y="41" width="12" height="6" rx="2" opacity=".8"/><rect x="284" y="41" width="12" height="6" rx="2" opacity=".8"/></g>
          <rect class="jb-el jb-search" x="178" y="56" width="118" height="10" rx="5" opacity=".55"/>
          <rect class="jb-el jb-card" x="178" y="76" width="36" height="62" rx="4" opacity=".9"/>
          <rect class="jb-el jb-card" x="219" y="76" width="36" height="62" rx="4" opacity=".9"/>
          <rect class="jb-el jb-card" x="260" y="76" width="36" height="62" rx="4" opacity=".9"/>
        </g>
        <g class="jb-badge" opacity="0">
          <circle cx="300" cy="34" r="11" fill="var(--hi)"/>
          <path d="M294.5 34 l4 4 l7 -8" stroke="var(--tile)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <text class="jb-status" x="168" y="180" font-size="10.5" font-weight="600" fill="currentColor">Unfamiliar layout: users have to relearn</text>
      `)
    },

    /* ------------------------------------------------------------ 8 */
    {
      id: "serial-position-effect",
      name: "Serial Position Effect",
      color: "#6a3a8d",
      hi: "#ffd166",
      tagline: "Users have a propensity to best remember the first and last items in a series.",
      description: [
        "Described by Hermann Ebbinghaus in the 1880s, the effect is really two effects. Primacy: early items get more rehearsal and move into long-term memory. Recency: the last items are still sitting in working memory when we're asked to recall.",
        "Items in the middle get neither advantage, so they are the most likely to be forgotten, skipped or overlooked."
      ],
      considerations: [
        "Put the most important or most-used actions at the start and end of navigation bars, menus and lists.",
        "Keep the middle short, or break long sequences into chunks so there are fewer 'middle' positions.",
        "In onboarding, emails and presentations, open and close with the point you want remembered.",
        "Use the effect to help people, not to bury things they need (an unsubscribe link or a cancel option hidden mid-list is a dark pattern)."
      ],
      resources: [
        { title: "Serial Position Effect", source: "Laws of UX", url: "https://lawsofux.com/serial-position-effect/" },
        { title: "Serial Position Effect: How to Create Better User Interfaces", source: "Interaction Design Foundation", url: "https://www.interaction-design.org/literature/article/serial-position-effect-how-to-create-better-user-interfaces" },
        { title: "Serial-position effect", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Serial-position_effect" },
        { title: "Memory Recognition and Recall in User Interfaces", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/recognition-and-recall/" }
      ],
      caption: "Seven items are shown, then recalled. The recall bars form a U: the first and last stay vivid while the middle fades.",
      svg: svg(`
        <text x="32" y="30" font-size="10" font-weight="700" fill="currentColor" opacity=".85">Recall</text>
        ${[70, 42, 28, 22, 28, 40, 64].map((h, i) => {
          const x = 32 + i * 38;
          return `<rect class="sp-bar" x="${x}" y="${108 - h}" width="30" height="${h}" rx="4" fill="var(--hi)"/>`;
        }).join("")}
        ${range(7).map((i) => {
          const x = 32 + i * 38;
          return `<g class="sp-item"><rect x="${x}" y="120" width="30" height="30" rx="6" fill="currentColor"/><text x="${x + 15}" y="140" font-size="12" font-weight="700" text-anchor="middle" style="fill:var(--tile)">${i + 1}</text></g>`;
        }).join("")}
        <text class="sp-lab" x="47" y="172" font-size="10" font-weight="700" text-anchor="middle" fill="var(--hi)" opacity="0">Primacy</text>
        <text class="sp-lab" x="275" y="172" font-size="10" font-weight="700" text-anchor="middle" fill="var(--hi)" opacity="0">Recency</text>
        <text class="sp-mid" x="161" y="172" font-size="10" font-weight="600" text-anchor="middle" fill="currentColor" opacity="0">middle fades</text>
      `)
    },

    /* ------------------------------------------------------------ 9 */
    {
      id: "law-of-common-region",
      name: "Law of Common Region",
      color: "#2c8a5a",
      hi: "#ffd166",
      tagline: "Elements tend to be perceived into groups if they are sharing an area with a clearly defined boundary.",
      description: [
        "A Gestalt grouping principle formalised by Stephen Palmer in 1992. A border, a background colour or a container tells the eye 'these belong together', and it is strong enough to override proximity and similarity.",
        "Cards, panels, fieldsets, table rows and toolbars all lean on it. It is also how you tell users which controls act on which content."
      ],
      considerations: [
        "Use containers to bind content to the controls that act on it, and to separate independent tasks on busy screens.",
        "Keep boundaries light. A subtle background or hairline border is usually enough; nested boxes get noisy fast.",
        "Never split related items across regions or mix unrelated items inside one. Users will assume the box is the truth.",
        "Match visual grouping with semantic grouping (headings, fieldsets, ARIA groups) so assistive technology tells the same story."
      ],
      resources: [
        { title: "Law of Common Region", source: "Laws of UX", url: "https://lawsofux.com/law-of-common-region/" },
        { title: "The Principle of Common Region: Containers Create Groupings", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/common-region/" },
        { title: "Common region: A new principle of perceptual grouping (Palmer, 1992)", source: "Cognitive Psychology", url: "https://doi.org/10.1016/0010-0285(92)90014-S" },
        { title: "Gestalt Principles", source: "Interaction Design Foundation", url: "https://www.interaction-design.org/literature/topics/gestalt-principles" }
      ],
      caption: "Eight identical, evenly spaced dots. Drawing a boundary makes four of them a group; moving the boundary makes a different four the group.",
      svg: svg(`
        ${dotGrid({ cls: "cr-dot", cols: 4, rows: 2, x0: 72, y0: 76, dx: 58, dy: 46, r: 10 })}
        ${dotGrid({ cls: "cr-hi", cols: 4, rows: 2, x0: 72, y0: 76, dx: 58, dy: 46, r: 10 }).replaceAll('fill="currentColor"', 'fill="var(--hi)" opacity="0"')}
        <rect class="cr-r1" x="46" y="50" width="130" height="98" rx="14" fill="var(--hi)" fill-opacity="0" stroke="var(--hi)" stroke-width="2.5" stroke-dasharray="460" stroke-dashoffset="460"/>
        <rect class="cr-r2" x="104" y="50" width="130" height="98" rx="14" fill="var(--hi)" fill-opacity="0" stroke="var(--hi)" stroke-width="2.5" stroke-dasharray="460" stroke-dashoffset="460"/>
        <text class="cr-lab" x="160" y="182" font-size="10.5" font-weight="600" text-anchor="middle" fill="currentColor">Eight identical dots</text>
      `)
    },

    /* ----------------------------------------------------------- 10 */
    {
      id: "law-of-proximity",
      name: "Law of Proximity",
      color: "#d1602c",
      hi: "#1b1a22",
      tagline: "Objects that are near, or proximate to each other, tend to be grouped together.",
      description: [
        "The most basic Gestalt grouping cue: things placed close together are read as related, and things placed apart are read as separate. It works before colour, before borders, and before anyone reads a label.",
        "That makes whitespace a structural tool rather than empty space. The gaps in a layout tell users where one thing ends and the next begins."
      ],
      considerations: [
        "Keep labels closer to their own field than to the next one, and helper text closer to its input than to anything else.",
        "Use a spacing scale so gaps inside a group are visibly smaller than gaps between groups.",
        "Avoid uniform spacing across unrelated items; it flattens the structure and makes everything look equally important.",
        "Try spacing before lines. Proximity is cheaper and quieter than borders and boxes."
      ],
      resources: [
        { title: "Law of Proximity", source: "Laws of UX", url: "https://lawsofux.com/law-of-proximity/" },
        { title: "Proximity Principle in Visual Design", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/gestalt-proximity/" },
        { title: "Laws of Proximity, Uniform Connectedness, and Continuation", source: "Interaction Design Foundation", url: "https://www.interaction-design.org/literature/article/laws-of-proximity-uniform-connectedness-and-continuation-gestalt-principles-2" },
        { title: "Principles of grouping", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Principles_of_grouping" }
      ],
      caption: "A uniform grid of dots. Widening a horizontal gap makes two column-groups; widening a vertical gap makes two row-groups. Nothing else changes.",
      svg: svg(`
        ${dotGrid({ cls: "px-dot", cols: 4, rows: 4, x0: 88, y0: 46, dx: 48, dy: 36, r: 9 })}
        <text class="px-lab" x="160" y="186" font-size="10.5" font-weight="600" text-anchor="middle" fill="currentColor">Even spacing: one grid</text>
      `)
    },

    /* ----------------------------------------------------------- 11 */
    {
      id: "law-of-pragnanz",
      name: "Law of Prägnanz",
      color: "#d24a8c",
      hi: "#1b1a22",
      tagline: "People will perceive and interpret ambiguous or complex images as the simplest form possible, because it requires the least cognitive effort.",
      description: [
        "Prägnanz (German for 'conciseness' or 'good figure') is the umbrella Gestalt principle. The mind reduces what it sees to the simplest, most regular and most stable interpretation it can find.",
        "Two overlapping rings are seen as two circles rather than three odd segments; a mesh of lines is seen as a hexagon with stuff inside it. Users will do this to your interface whether you plan for it or not."
      ],
      considerations: [
        "Prefer simple, regular shapes and layouts. They are recognised faster and remembered better.",
        "Strip visual noise that competes with the simple reading: decorative lines, redundant borders, gratuitous gradients.",
        "Give icons and logos strong, distinct silhouettes that survive being shrunk.",
        "Design so the simplest interpretation is the correct one. If the obvious reading of a screen is wrong, users will act on it anyway."
      ],
      resources: [
        { title: "Law of Prägnanz", source: "Laws of UX", url: "https://lawsofux.com/law-of-pragnanz/" },
        { title: "The Principles of Visual Design", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/principles-visual-design/" },
        { title: "The Law of Prägnanz (Gestalt principles)", source: "Interaction Design Foundation", url: "https://www.interaction-design.org/literature/topics/law-of-pragnanz" },
        { title: "Gestalt psychology", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Gestalt_psychology" }
      ],
      caption: "A dense mesh resolves into a plain hexagon, and fragmented arcs close into two overlapping circles: the simplest shapes the eye can settle on.",
      svg: svg(`
        <polygon class="pz-hex" points="${polygonPoints(90, 96, 46, 6)}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
        <g class="pz-mesh" stroke="currentColor" stroke-width="1.5" fill="none">
          ${(() => {
            const pts = polygonPoints(90, 96, 46, 6).split(" ").map((p) => p.split(",").map(Number));
            const inner = polygonPoints(90, 96, 22, 6, -60).split(" ").map((p) => p.split(",").map(Number));
            const lines = [];
            pts.forEach((p, i) => {
              const n = pts[(i + 1) % 6];
              lines.push(`<line x1="${p[0]}" y1="${p[1]}" x2="${inner[i][0]}" y2="${inner[i][1]}"/>`);
              lines.push(`<line x1="${n[0]}" y1="${n[1]}" x2="${inner[i][0]}" y2="${inner[i][1]}"/>`);
              lines.push(`<line x1="${inner[i][0]}" y1="${inner[i][1]}" x2="90" y2="96"/>`);
            });
            lines.push(`<polygon points="${polygonPoints(90, 96, 22, 6, -60)}"/>`);
            return lines.join("");
          })()}
        </g>

        <circle class="pz-circ" cx="212" cy="96" r="30" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="10 9" transform="rotate(10 212 96)"/>
        <circle class="pz-circ" cx="250" cy="96" r="30" fill="none" stroke="currentColor" stroke-width="2.5" stroke-dasharray="10 9" transform="rotate(-25 250 96)"/>

        <text class="pz-lab" x="160" y="180" font-size="10.5" font-weight="600" text-anchor="middle" fill="currentColor">What's actually drawn</text>
      `)
    },

    /* ----------------------------------------------------------- 12 */
    {
      id: "zeigarnik-effect",
      name: "Zeigarnik Effect",
      color: "#3a3a44",
      hi: "#ffd166",
      tagline: "People remember uncompleted or interrupted tasks better than completed tasks.",
      description: [
        "Named for psychologist Bluma Zeigarnik, who noticed in the 1920s that waiters remembered unpaid orders far better than ones that had already been settled. An unfinished task keeps a small tension alive in memory that is released only when it is completed.",
        "It is the reason open loops nag at us, and the reason a half-finished profile or a checklist with one item left pulls people back."
      ],
      considerations: [
        "Show visible progress and a clear next step (profile completion, onboarding checklists, 'resume where you left off') to invite users back.",
        "Make resuming effortless: save state, deep-link back to the exact step, and show what's left rather than what's done.",
        "Use it responsibly. Manufactured open loops, fake notifications and endless streaks turn a memory effect into a dark pattern.",
        "Let people close loops on purpose (dismiss, skip, mark done) so the interface relieves tension instead of generating it."
      ],
      resources: [
        { title: "Zeigarnik Effect", source: "Laws of UX", url: "https://lawsofux.com/zeigarnik-effect/" },
        { title: "Zeigarnik effect", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Zeigarnik_effect" },
        { title: "What Is the Zeigarnik Effect?", source: "Verywell Mind", url: "https://www.verywellmind.com/zeigarnik-effect-memory-overview-4175150" },
        { title: "Zeigarnik effect", source: "The Decision Lab", url: "https://thedecisionlab.com/biases/zeigarnik-effect" }
      ],
      caption: "Three of four tasks get ticked off and fade from attention. The one left open stays bright and keeps pulsing for it.",
      svg: svg(`
        ${[[40, 150], [72, 110], [104, 170], [136, 126]].map(([y, w], i) => `
          <g class="zg-task">
            <rect x="40" y="${y}" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>
            <path class="zg-check" d="M44 ${y + 9} l5 5 l9 -10" stroke="var(--hi)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="22" stroke-dashoffset="22"/>
            <rect x="70" y="${y + 5}" width="${w}" height="8" rx="4" fill="currentColor"/>
          </g>`).join("")}
        <circle class="zg-ring" cx="49" cy="113" r="15" fill="none" stroke="var(--hi)" stroke-width="2" opacity="0"/>

        <rect x="40" y="170" width="240" height="6" rx="3" fill="currentColor" opacity=".22"/>
        <rect class="zg-prog" x="40" y="170" width="240" height="6" rx="3" fill="var(--hi)"/>
        <text class="zg-ptext" x="40" y="192" font-size="10.5" font-weight="600" fill="currentColor">0 of 4 done</text>
        <text class="zg-note" x="280" y="192" font-size="10.5" font-weight="700" text-anchor="end" fill="var(--hi)" opacity="0">1 still open</text>
      `)
    },

    /* ----------------------------------------------------------- 13 */
    {
      id: "law-of-similarity",
      name: "Law of Similarity",
      color: "#8c3a5e",
      hi: "#ffd166",
      tagline: "The human eye tends to perceive similar elements in a design as a complete picture, shape, or group, even if those elements are separated.",
      description: [
        "Elements that share colour, shape, size, orientation or texture are perceived as related regardless of where they sit. Similarity lets you communicate structure across distance, and deliberate dissimilarity is how you make one thing stand out.",
        "It is the principle behind consistent link styling, icon families and status colours: see the pattern once, recognise it everywhere."
      ],
      considerations: [
        "Keep interactive elements visually consistent (links look like links, buttons look like buttons) so users learn the pattern once.",
        "Use dissimilarity sparingly and on purpose: one primary button per view, one accent for alerts.",
        "Don't make different things look alike (headings styled like links) or the same thing look different in different places.",
        "Pair cues: colour plus shape, icon plus label. Grouping should survive colour blindness, dark mode and greyscale printing."
      ],
      resources: [
        { title: "Law of Similarity", source: "Laws of UX", url: "https://lawsofux.com/law-of-similarity/" },
        { title: "Similarity Principle in Visual Design", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/gestalt-similarity/" },
        { title: "The Law of Similarity (Gestalt principles)", source: "Interaction Design Foundation", url: "https://www.interaction-design.org/literature/article/the-law-of-similarity-gestalt-principles-1" },
        { title: "Principles of grouping", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Principles_of_grouping" }
      ],
      caption: "In a uniform grid, a handful of dots change colour and instantly read as a V; later, a diagonal set grows larger and reads as a line.",
      svg: svg(`
        ${dotGrid({ cls: "sm-dot", cols: 5, rows: 4, x0: 64, y0: 40, dx: 48, dy: 36, r: 9 })}
        ${dotGrid({ cls: "sm-hi", cols: 5, rows: 4, x0: 64, y0: 40, dx: 48, dy: 36, r: 9 }).replaceAll('fill="currentColor"', 'fill="var(--hi)" opacity="0"')}
        <text class="sm-lab" x="160" y="186" font-size="10.5" font-weight="600" text-anchor="middle" fill="currentColor">A uniform grid</text>
      `)
    },

    /* ----------------------------------------------------------- 14 */
    {
      id: "peak-end-rule",
      name: "Peak-End Rule",
      color: "#2c3a80",
      hi: "#ffd166",
      tagline: "People judge an experience largely based on how they felt at its peak and at its end, rather than the total sum or average of every moment of the experience.",
      description: [
        "Daniel Kahneman and colleagues found that memories of an experience are dominated by its most intense moment and its final moment, and that duration matters surprisingly little. The remembering self and the experiencing self disagree.",
        "For products, a frustrating checkout can be partly redeemed by a delightful confirmation, and a great session can be soured by an awkward exit."
      ],
      considerations: [
        "Find the emotional peaks in your journey (first success, the big reveal, a moment of relief) and polish them deliberately.",
        "Design endings on purpose: confirmation screens, thank-you states, offboarding, cancellation and the last step of onboarding.",
        "Negative peaks weigh more than positive ones. Fix the single worst moment before adding delight anywhere else.",
        "Measure feeling at key moments, not just overall satisfaction, or the average will hide the moments that actually get remembered."
      ],
      resources: [
        { title: "Peak-End Rule", source: "Laws of UX", url: "https://lawsofux.com/peak-end-rule/" },
        { title: "The Peak–End Rule: How Impressions Become Memories", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/peak-end-rule/" },
        { title: "When More Pain Is Preferred to Less (Kahneman et al., 1993)", source: "Psychological Science", url: "https://doi.org/10.1111/j.1467-9280.1993.tb00589.x" },
        { title: "Peak–end rule", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Peak%E2%80%93end_rule" }
      ],
      caption: "An experience is charted over time. Memory anchors on the peak and the ending, so the remembered level sits well above the real average.",
      svg: svg(`
        <line x1="40" y1="150" x2="296" y2="150" stroke="currentColor" stroke-opacity=".35"/>
        <line x1="40" y1="30" x2="40" y2="150" stroke="currentColor" stroke-opacity=".35"/>
        <text x="36" y="36" font-size="9" font-weight="600" text-anchor="end" fill="currentColor" opacity=".7">high</text>
        <text x="36" y="151" font-size="9" font-weight="600" text-anchor="end" fill="currentColor" opacity=".7">low</text>
        <text x="296" y="165" font-size="9" font-weight="600" text-anchor="end" fill="currentColor" opacity=".7">time →</text>

        <line class="pe-avg" x1="40" y1="99" x2="296" y2="99" stroke="currentColor" stroke-opacity=".55" stroke-dasharray="2 4" opacity="0"/>
        <text class="pe-avg-l" x="290" y="116" font-size="9" font-weight="600" text-anchor="end" fill="currentColor" opacity="0">actual average</text>

        <path class="pe-path" d="M40 110 L70 120 L100 95 L130 125 L160 50 L190 100 L220 115 L250 105 L290 70" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>

        <line class="pe-rem" x1="40" y1="60" x2="296" y2="60" stroke="var(--hi)" stroke-width="2" stroke-dasharray="5 4" opacity="0"/>
        <text class="pe-rem-l" x="44" y="56" font-size="9.5" font-weight="700" fill="var(--hi)" opacity="0">remembered ≈ average of peak + end</text>

        <circle class="pe-peak" cx="160" cy="50" r="6" fill="var(--hi)"/>
        <text class="pe-peak-l" x="160" y="40" font-size="10" font-weight="700" text-anchor="middle" fill="var(--hi)" opacity="0">Peak</text>
        <circle class="pe-end" cx="290" cy="70" r="6" fill="var(--hi)"/>
        <text class="pe-end-l" x="286" y="86" font-size="10" font-weight="700" text-anchor="end" fill="var(--hi)" opacity="0">End</text>

        <text class="pe-lab" x="40" y="188" font-size="10.5" font-weight="600" fill="currentColor">Living through it…</text>
      `)
    },

    /* ----------------------------------------------------------- 15 */
    {
      id: "millers-law",
      name: "Miller's Law",
      color: "#c6493a",
      hi: "#1b1a22",
      tagline: "The average person can only keep 7 (plus or minus 2) items in their working memory.",
      description: [
        "George Miller's 1956 paper is often quoted as a hard limit of seven. His real point was about chunking: we can hold only a handful of meaningful units in working memory, but each unit can carry more information when it is organised. Later research puts the practical number closer to four chunks.",
        "The design lesson is less 'never show more than seven things' and more 'don't make people hold things in their head'."
      ],
      considerations: [
        "Chunk content: phone numbers, card numbers, long codes, dense forms and long lists all read better in small groups.",
        "Don't treat seven as a rule for menu length. Navigation is scanned, not memorised; clarity and grouping matter more than count.",
        "Avoid making users carry information between screens. Show the order total on the payment step, the password rules next to the field.",
        "Favour recognition over recall: visible options, sensible defaults and recently used items all reduce memory load."
      ],
      resources: [
        { title: "Miller's Law", source: "Laws of UX", url: "https://lawsofux.com/millers-law/" },
        { title: "The Magical Number Seven, Plus or Minus Two (Miller, 1956)", source: "Classics in the History of Psychology", url: "https://psychclassics.yorku.ca/Miller/" },
        { title: "Short-Term Memory and Web Usability", source: "Nielsen Norman Group", url: "https://www.nngroup.com/articles/short-term-memory-and-web-usability/" },
        { title: "The Magical Number Seven, Plus or Minus Two", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two" }
      ],
      caption: "Ten loose items are pushed into working memory: roughly seven stick and the rest fall out. Regrouped into three chunks, all ten fit.",
      svg: svg(`
        <text x="36" y="34" font-size="10" font-weight="700" fill="currentColor" letter-spacing=".04em">WORKING MEMORY · 7 ± 2 SLOTS</text>
        ${range(7).map((i) => `<rect x="${36 + i * 36}" y="46" width="28" height="28" rx="6" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-dasharray="4 3"/>`).join("")}
        ${range(10).map((i) => `
          <g class="ml-item">
            <rect width="20" height="20" rx="4" fill="var(--hi)"/>
            <text x="10" y="14" font-size="10" font-weight="700" text-anchor="middle" fill="currentColor">${i}</text>
          </g>`).join("")}
        <text class="ml-lab" x="36" y="190" font-size="10.5" font-weight="600" fill="currentColor">10 unrelated items</text>
      `)
    },

    /* ----------------------------------------------------------- 16 */
    {
      id: "teslers-law",
      name: "Tesler's Law",
      color: "#1f7f82",
      hi: "#ffd166",
      tagline: "Also known as the Law of Conservation of Complexity: for any system there is a certain amount of complexity which cannot be reduced.",
      description: [
        "While at Xerox PARC in the mid-1980s, Larry Tesler argued that every application has an irreducible core of complexity. The only question is who deals with it: the people building the product, or the people using it.",
        "Good design moves as much of that burden as possible away from the user and into the system, where it is handled once instead of by every person on every use."
      ],
      considerations: [
        "Absorb complexity in the system: smart defaults, auto-detection, inference, remembering previous choices, and doing the maths for people.",
        "Spend engineering effort to save user effort, especially on tasks repeated many times by many people.",
        "Know when to stop. Over-simplifying hides necessary control and makes edge cases impossible; some complexity belongs with the user.",
        "Be honest about the trade-off. Complexity you move into code becomes something the team must build, test and maintain."
      ],
      resources: [
        { title: "Tesler's Law", source: "Laws of UX", url: "https://lawsofux.com/teslers-law/" },
        { title: "Law of conservation of complexity", source: "Wikipedia", url: "https://en.wikipedia.org/wiki/Law_of_conservation_of_complexity" },
        { title: "Tesler's Law (video)", source: "Nielsen Norman Group", url: "https://www.nngroup.com/videos/teslers-law/" },
        { title: "Laws of UX: Using Psychology to Design Better Products & Services (Jon Yablonski)", source: "O'Reilly", url: "https://www.oreilly.com/library/view/laws-of-ux/9781492055303/" }
      ],
      caption: "Twelve blocks of complexity. The total never changes; design simply moves most of it from the user's side to the system's side.",
      svg: svg(`
        <text x="90" y="32" font-size="10.5" font-weight="700" text-anchor="middle" fill="currentColor">User</text>
        <text x="230" y="32" font-size="10.5" font-weight="700" text-anchor="middle" fill="currentColor">System</text>
        <rect x="40" y="42" width="100" height="110" rx="10" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="1.5"/>
        <rect x="180" y="42" width="100" height="110" rx="10" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="1.5"/>
        <path d="M148 97 h24 m-6 -6 l6 6 l-6 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".6"/>
        ${range(12).map(() => `<rect class="ts-block" width="20" height="20" rx="4" fill="var(--hi)"/>`).join("")}
        <text class="ts-cu" x="90" y="172" font-size="11" font-weight="700" text-anchor="middle" fill="currentColor">12</text>
        <text class="ts-cs" x="230" y="172" font-size="11" font-weight="700" text-anchor="middle" fill="currentColor">0</text>
        <text x="160" y="192" font-size="10" font-weight="600" text-anchor="middle" fill="currentColor" opacity=".85">Total complexity: 12 · constant</text>
      `)
    }
  ];

  window.UX_LAWS = LAWS;
})();
