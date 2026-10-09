// Gives each section link in the panel --share: the part of the screen its
// section fills, as a fraction of all the section content on screen. The CSS
// sizes the links by it.

const links = [...document.querySelectorAll(".sections a")];
const sections = links.map((link) => document.querySelector(link.hash));

function update() {
  const viewport = window.innerHeight;
  const shown = sections.map((section) => {
    const { top, bottom } = section.getBoundingClientRect();
    return Math.max(0, Math.min(bottom, viewport) - Math.max(top, 0));
  });
  const total = shown.reduce((sum, height) => sum + height, 0);
  links.forEach((link, i) => {
    link.style.setProperty("--share", total ? (shown[i] / total).toFixed(3) : "0");
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
