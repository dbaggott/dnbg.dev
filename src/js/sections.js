// Gives each section link in the panel --share: how much of a reading band,
// a strip across the screen a little above its middle, its section holds. A
// section taller than the band holds all of it while the band is inside it,
// so even a short section has a moment as the only large link; crossing into
// the next, the share moves across in proportion. The CSS sizes the links by it.

const BAND_HEIGHT_REM = 12;
const BAND_CENTRE = 0.4; // of the screen's height, from the top

const links = [...document.querySelectorAll(".sections a")];
const sections = links.map((link) => document.querySelector(link.hash));

function update() {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const centre = window.innerHeight * BAND_CENTRE;
  const bandTop = centre - (BAND_HEIGHT_REM * rem) / 2;
  const bandBottom = centre + (BAND_HEIGHT_REM * rem) / 2;

  const held = sections.map((section) => {
    const { top, bottom } = section.getBoundingClientRect();
    return Math.max(0, Math.min(bottom, bandBottom) - Math.max(top, bandTop));
  });
  const total = held.reduce((sum, height) => sum + height, 0);
  links.forEach((link, i) => {
    link.style.setProperty("--share", total ? (held[i] / total).toFixed(3) : "0");
  });
}

let scheduled = false;
function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    update();
  });
}

addEventListener("scroll", schedule, { passive: true });
addEventListener("resize", schedule);
update();
