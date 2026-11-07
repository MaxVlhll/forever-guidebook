// Calculateur commun des guides de métier de fabrication.
// La page définit avant ce script : var CONFIG = { key, src, sub, steps, train, trainA, done300, groupTitles, trainMsg?, trainMsgA? }.
// train / trainMsg : Horde ; trainA / trainMsgA : Alliance. Dans les notes, {comp} {exp} {art} sont remplacés par le maître de la faction choisie.
// steps : f (de), t (à), r (recette), n (fabrications), m (matériaux par fabrication),
//         out (intermédiaire produit), p (après la bêta), note, alt, once/onceName (outil à fabriquer une fois).
(function () {
  var C = CONFIG, SRC = C.src, SUB = C.sub || {}, STEPS = C.steps, KEY = C.key;
  var RANKS = C.ranks || [
    { name: "Apprenti", from: 1, to: 75, req: "Dès le départ · plafond 75" },
    { name: "Compagnon", from: 75, to: 150, req: "Dès 50 en compétence, niveau 10 · plafond 150" },
    { name: "Expert", from: 150, to: 225, req: "Dès 125 en compétence, niveau 20 · plafond 225" },
    { name: "Artisan", from: 225, to: 300, req: "Dès 200 en compétence, niveau 35 · plafond 300" }
  ];
  // Faction choisie dans la barre de navigation : "a", "h" ou "both" (les deux).
  function fac() { try { return localStorage.getItem("fg-faction") || "both"; } catch (e) { return "both"; } }
  function pick(h, a) {
    var f = fac();
    if (!a || f === "h" || a === h) return h || "";
    if (!h || f === "a") return a;
    return '<span class="fac h">Horde</span> ' + h + ' <span class="fac a">Alliance</span> ' + a;
  }
  var TA = C.trainA || {};
  function trainer(k) { return pick(C.train[k], TA[k]); }
  function msg(k) {
    if (C.trainMsg) return pick(C.trainMsg[k], (C.trainMsgA || {})[k]);
    var rank = { comp: "Compagnon (niveau 10)", exp: "Expert (niveau 20)", art: "Artisan (niveau 35)" }[k];
    return "Si ce n'est pas fait, apprends le rang " + rank + " : " + trainer(k) + ".";
  }
  function fill(t) { return t.replace(/\{(comp|exp|art)\}/g, function (_, k) { return trainer(k); }); }
  var $skill = document.getElementById("skill"), $target = document.getElementById("target");

  function load() {
    try {
      var s = localStorage.getItem(KEY + "-skill"), t = localStorage.getItem(KEY + "-target");
      if (s) $skill.value = s;
      if (t) $target.value = t;
    } catch (e) {}
  }
  function save(s, t) { try { localStorage.setItem(KEY + "-skill", s); localStorage.setItem(KEY + "-target", t); } catch (e) {} }
  function clamp(v) { v = parseInt(v, 10); if (isNaN(v)) v = 1; return Math.max(1, Math.min(300, v)); }
  function remaining(st, skill, target) {
    var lo = Math.max(st.f, skill), hi = Math.min(st.t, target);
    if (hi <= lo) return 0;
    return Math.ceil(st.n * (hi - lo) / (st.t - st.f));
  }
  function fmtMats(m) { return Object.keys(m).map(function (k) { return m[k] + " " + k; }).join(" · "); }

  function renderPath(skill) {
    var html = "";
    RANKS.forEach(function (rk) {
      html += '<div class="rank"><div class="rank-head"><h3>' + rk.name + ' <span style="color:var(--muted);font-family:var(--font-body);font-weight:400">' + rk.from + "–" + rk.to + '</span></h3><span class="req">' + rk.req + '</span></div><div class="steps">';
      STEPS.filter(function (s) { return s.f >= rk.from && s.f < rk.to; }).forEach(function (s) {
        var done = skill >= s.t, cur = skill >= s.f && skill < s.t;
        var notes = (s.note ? '<p class="note">' + fill(s.note) + "</p>" : "") +
          (s.once ? '<p class="note">Outil à fabriquer une fois avant cette étape : ' + s.onceName + " (" + fmtMats(s.once) + ").</p>" : "") +
          (s.alt ? '<p class="alt">' + fill(s.alt) + "</p>" : "");
        html += '<article class="step' + (done ? " done" : "") + (cur ? " current" : "") + '">' +
          '<div class="range">' + s.f + "–" + s.t + "</div>" +
          '<div class="title"><span class="name">' + s.r + '</span><span class="count">× ' + s.n + "</span>" +
          (cur ? '<span class="here">Tu es ici</span><span class="left">encore ~' + remaining(s, skill, 300) + "</span>" : "") +
          (s.p ? '<span class="prov">à vérifier</span>' : "") + "</div>" +
          '<div class="mats">Par fabrication : ' + fmtMats(s.m) + "</div>" +
          (notes ? '<div class="notes">' + notes + "</div>" : "") + "</article>";
      });
      html += "</div></div>";
    });
    document.getElementById("path").innerHTML = html;
  }

  function renderNow(skill) {
    var cur = STEPS.filter(function (s) { return skill >= s.f && skill < s.t; })[0];
    var next = cur ? STEPS[STEPS.indexOf(cur) + 1] : null;
    var train = "";
    if (skill >= 50 && skill < 75) train = msg("comp");
    else if (skill >= 125 && skill < 150) train = msg("exp");
    else if (skill >= 200 && skill < 225) train = msg("art");
    var h = "";
    if (skill >= 300) h = '<span class="big">' + C.done300 + "</span>";
    else if (cur) {
      h = '<span class="tag" style="margin:0">Maintenant</span><span class="big">' + cur.r + " · encore ~" + remaining(cur, skill, 300) + " fabrications jusqu'à " + cur.t + "</span>" +
        "<span>Par fabrication : " + fmtMats(cur.m) + "</span>" +
        (cur.once && skill <= cur.f ? "<span>Avant de commencer : fabrique " + cur.onceName + ".</span>" : "") +
        (next ? '<span style="color:var(--muted)">Ensuite : ' + next.r + " (" + next.f + "–" + next.t + ")</span>" : "");
    }
    if (train) h += '<span class="train">' + train + "</span>";
    document.getElementById("now").innerHTML = h;
    document.getElementById("fill").style.width = (Math.min(skill, 300) / 300 * 100) + "%";
  }

  function computeShop(skill, target) {
    var need = {}, produced = {};
    STEPS.forEach(function (s) {
      if (s.once && skill <= s.f && s.f < target) Object.keys(s.once).forEach(function (mat) { need[mat] = (need[mat] || 0) + s.once[mat]; });
      var k = remaining(s, skill, target);
      if (!k) return;
      Object.keys(s.m).forEach(function (mat) { need[mat] = (need[mat] || 0) + s.m[mat] * k; });
      if (s.out) produced[s.out] = (produced[s.out] || 0) + k;
    });
    var groups = { farm: [], vendor: [], ah: [], craft: [] }, raw = {};
    Object.keys(need).forEach(function (mat) {
      if (SRC[mat] === "craft") {
        var extra = Math.max(0, need[mat] - (produced[mat] || 0));
        var sub = !produced[mat] ? (SUB[mat] ? "à fabriquer toi-même" : "à fabriquer à part")
          : extra > 0 ? ("dont " + extra + " à fabriquer en plus de celles de l'étape dédiée") : "fabriquées en montant, garde-les";
        groups.craft.push({ k: mat, q: need[mat], sub: sub });
        if (extra > 0 && SUB[mat]) Object.keys(SUB[mat]).forEach(function (r) { raw[r] = (raw[r] || 0) + SUB[mat][r] * extra; });
      } else raw[mat] = (raw[mat] || 0) + need[mat];
    });
    Object.keys(raw).forEach(function (mat) { groups[SRC[mat] || "ah"].push({ k: mat, q: raw[mat] }); });
    return groups;
  }
  window.__computeShop = computeShop;

  function renderShop(skill, target) {
    var groups = computeShop(skill, target), out = "";
    ["farm", "vendor", "ah", "craft"].forEach(function (g) {
      if (!groups[g].length) return;
      groups[g].sort(function (a, b) { return b.q - a.q; });
      out += '<div class="shop-col"><h3>' + C.groupTitles[g] + "</h3><ul>" + groups[g].map(function (x) {
        return "<li><span>" + x.k + (x.sub ? '<span class="sub">' + x.sub + "</span>" : "") + '</span><span class="q">' + x.q + "</span></li>";
      }).join("") + "</ul></div>";
    });
    document.getElementById("shop-sub").textContent = skill >= target
      ? "Tu as déjà atteint cet objectif : choisis un palier plus haut."
      : "De " + skill + " à " + target + ", en suivant le parcours ci-dessous. Ajoute 10 à 15 % de marge pour les fabrications malchanceuses.";
    document.getElementById("shop").innerHTML = out || '<p class="empty">Rien à prévoir pour cet objectif.</p>';
  }

  function update() {
    var s = clamp($skill.value), t = parseInt($target.value, 10);
    save(s, t); renderNow(s); renderPath(s); renderShop(s, t);
  }
  load();
  $skill.addEventListener("input", update);
  $skill.addEventListener("change", function () { $skill.value = clamp($skill.value); update(); });
  $target.addEventListener("change", update);
  document.getElementById("minus").addEventListener("click", function () { $skill.value = clamp(clamp($skill.value) - 5); update(); });
  document.getElementById("plus").addEventListener("click", function () { $skill.value = clamp(clamp($skill.value) + 5); update(); });
  window.addEventListener("factionchange", update);
  update();
})();
