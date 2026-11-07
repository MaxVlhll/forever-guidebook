// Moteur commun des guides de récolte (minage, herboristerie, dépeçage, pêche).
// La page définit avant ce script : var CONFIG = { key, tiers: [{ f, t, res: [..], zones: [[nom, info, "a" | "h"?]], horde, alliance, note, p }], train, trainA, done300 }.
// Zones : "a" = Alliance, "h" = Horde, rien = contestée ou neutre. horde / alliance : conseil propre à chaque faction.
(function () {
  var C = CONFIG, T = C.tiers, $skill = document.getElementById("skill");
  // Faction choisie dans la barre de navigation : "a", "h" ou "both" (les deux).
  function fac() { try { return localStorage.getItem("fg-faction") || "both"; } catch (e) { return "both"; } }
  function pick(h, a) {
    var f = fac();
    if (!a || f === "h" || a === h) return h || "";
    if (!h || f === "a") return a;
    return '<span class="fac h">Horde</span> ' + h + ' <span class="fac a">Alliance</span> ' + a;
  }
  function clamp(v) { v = parseInt(v, 10); if (isNaN(v)) v = 1; return Math.max(1, Math.min(300, v)); }
  try { var s0 = localStorage.getItem(C.key + "-skill"); if (s0) $skill.value = s0; } catch (e) {}
  function zones(z) {
    return z.map(function (x) {
      var side = x[2] === "a" ? " a" : x[2] === "h" ? " h" : "";
      return '<span class="zone' + side + '"' + (side ? ' title="Zone ' + (x[2] === "a" ? "Alliance" : "Horde") + '"' : "") + ">" + x[0] + (x[1] ? " <small>" + x[1] + "</small>" : "") + "</span>";
    }).join("");
  }
  function advice(t) { return pick(t.horde, t.alliance); }
  function ownZones(t) {
    var f = fac();
    return t.zones.filter(function (z) { return f === "both" || !z[2] || z[2] === f; }).map(function (z) { return z[0]; }).join(", ");
  }
  function render(skill) {
    var html = "";
    T.forEach(function (t) {
      var done = skill >= t.t, cur = skill >= t.f && skill < t.t;
      html += '<article class="tier' + (done ? " done" : "") + (cur ? " current" : "") + '"><div class="range">' + t.f + "–" + t.t + "</div>" +
        '<div class="res">' + t.res.map(function (r, i) { return i === 0 ? "<b>" + r + "</b>" : '<span style="color:var(--muted)">' + r + "</span>"; }).join(" · ") +
        (cur ? ' <span class="here">Tu es ici</span>' : "") + (t.p ? ' <span class="prov">après la bêta</span>' : "") + "</div>" +
        '<div class="zones">' + zones(t.zones) + "</div>" +
        (advice(t) || t.note ? '<p class="note">' + (advice(t) ? advice(t) + " " : "") + (t.note || "") + "</p>" : "") + "</article>";
    });
    document.getElementById("tiers").innerHTML = html;
    var cur = T.filter(function (t) { return skill >= t.f && skill < t.t; })[0];
    var next = cur ? T[T.indexOf(cur) + 1] : null, h = "";
    if (skill >= 300) h = '<span class="big">' + C.done300 + "</span>";
    else if (cur) {
      h = '<span class="tag" style="margin:0">Maintenant</span><span class="big">' + cur.res[0] + "</span>" +
        "<span>" + [advice(cur), ownZones(cur)].filter(Boolean).join(" · Aussi : ") + "</span>" +
        (next ? '<span style="color:var(--muted)">Dès ' + next.f + " : " + next.res[0] + "</span>" : "");
    }
    var tr = "";
    var TA = C.trainA || {}, k = skill >= 50 && skill < 75 ? "comp" : skill >= 125 && skill < 150 ? "exp" : skill >= 200 && skill < 225 ? "art" : "";
    if (k) tr = pick(C.train[k], TA[k]);
    if (tr) h += '<span class="train">' + tr + "</span>";
    document.getElementById("now").innerHTML = h;
    document.getElementById("fill").style.width = (skill / 300 * 100) + "%";
    try { localStorage.setItem(C.key + "-skill", skill); } catch (e) {}
  }
  function update() { render(clamp($skill.value)); }
  window.addEventListener("factionchange", update);
  $skill.addEventListener("input", update);
  $skill.addEventListener("change", function () { $skill.value = clamp($skill.value); update(); });
  document.getElementById("minus").addEventListener("click", function () { $skill.value = clamp(clamp($skill.value) - 5); update(); });
  document.getElementById("plus").addEventListener("click", function () { $skill.value = clamp(clamp($skill.value) + 5); update(); });
  update();
})();
