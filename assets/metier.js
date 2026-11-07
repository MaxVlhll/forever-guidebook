// Calculateur commun des guides de métier de fabrication.
// La page définit avant ce script : var CONFIG = { key, src, sub, steps, train, trainA, done300, groupTitles, trainMsg?, trainMsgA? }.
// train / trainMsg : Horde ; trainA / trainMsgA : Alliance. Dans les notes, {comp} {exp} {art} sont remplacés par le maître de la faction choisie.
// steps : f (de), t (à), r (recette), n (fabrications), m (matériaux par fabrication),
//         out (intermédiaire produit), p (après la bêta), note, alt, once/onceName (outil à fabriquer une fois).
(function () {
  var C = CONFIG, SRC = C.src, SUB = C.sub || {}, STEPS = C.steps, KEY = C.key;
  // Langue de la page (<html lang="en|es|de">, français par défaut).
  var LANG = document.documentElement.lang;
  function L(fr, en, es, de, it, pt, ru) { return { en: en, es: es, de: de, it: it, pt: pt, ru: ru }[LANG] || fr; }
  var RANKS = C.ranks || (LANG === "es" ? [
    { name: "Aprendiz", from: 1, to: 75, req: "Desde el principio · tope 75" },
    { name: "Oficial", from: 75, to: 150, req: "Desde habilidad 50, nivel 10 · tope 150" },
    { name: "Experto", from: 150, to: 225, req: "Desde habilidad 125, nivel 20 · tope 225" },
    { name: "Artesano", from: 225, to: 300, req: "Desde habilidad 200, nivel 35 · tope 300" }
  ] : LANG === "de" ? [
    { name: "Lehrling", from: 1, to: 75, req: "Von Anfang an · Obergrenze 75" },
    { name: "Geselle", from: 75, to: 150, req: "Ab Fertigkeit 50, Stufe 10 · Obergrenze 150" },
    { name: "Experte", from: 150, to: 225, req: "Ab Fertigkeit 125, Stufe 20 · Obergrenze 225" },
    { name: "Fachmann", from: 225, to: 300, req: "Ab Fertigkeit 200, Stufe 35 · Obergrenze 300" }
  ] : LANG === "it" ? [
    { name: "Apprendista", from: 1, to: 75, req: "Dall'inizio · massimo 75" },
    { name: "Garzone", from: 75, to: 150, req: "Da abilità 50, livello 10 · massimo 150" },
    { name: "Esperto", from: 150, to: 225, req: "Da abilità 125, livello 20 · massimo 225" },
    { name: "Artigiano", from: 225, to: 300, req: "Da abilità 200, livello 35 · massimo 300" }
  ] : LANG === "pt" ? [
    { name: "Aprendiz", from: 1, to: 75, req: "Desde o início · limite 75" },
    { name: "Artífice", from: 75, to: 150, req: "A partir de perícia 50, nível 10 · limite 150" },
    { name: "Especialista", from: 150, to: 225, req: "A partir de perícia 125, nível 20 · limite 225" },
    { name: "Artesão", from: 225, to: 300, req: "A partir de perícia 200, nível 35 · limite 300" }
  ] : LANG === "ru" ? [
    { name: "Ученик", from: 1, to: 75, req: "С самого начала · предел 75" },
    { name: "Подмастерье", from: 75, to: 150, req: "С навыка 50, уровень 10 · предел 150" },
    { name: "Умелец", from: 150, to: 225, req: "С навыка 125, уровень 20 · предел 225" },
    { name: "Искусник", from: 225, to: 300, req: "С навыка 200, уровень 35 · предел 300" }
  ] : LANG === "en" ? [
    { name: "Apprentice", from: 1, to: 75, req: "From the start · cap 75" },
    { name: "Journeyman", from: 75, to: 150, req: "From skill 50, level 10 · cap 150" },
    { name: "Expert", from: 150, to: 225, req: "From skill 125, level 20 · cap 225" },
    { name: "Artisan", from: 225, to: 300, req: "From skill 200, level 35 · cap 300" }
  ] : [
    { name: "Apprenti", from: 1, to: 75, req: "Dès le départ · plafond 75" },
    { name: "Compagnon", from: 75, to: 150, req: "Dès 50 en compétence, niveau 10 · plafond 150" },
    { name: "Expert", from: 150, to: 225, req: "Dès 125 en compétence, niveau 20 · plafond 225" },
    { name: "Artisan", from: 225, to: 300, req: "Dès 200 en compétence, niveau 35 · plafond 300" }
  ]);
  // Faction choisie dans la barre de navigation : "a", "h" ou "both" (les deux).
  function fac() { try { return localStorage.getItem("fg-faction") || "both"; } catch (e) { return "both"; } }
  function pick(h, a) {
    var f = fac();
    if (!a || f === "h" || a === h) return h || "";
    if (!h || f === "a") return a;
    return '<span class="fac h">' + L("Horde", "Horde", "Horda", "Horde", "Orda", "Horda", "Орда") + '</span> ' + h + ' <span class="fac a">' + L("Alliance", "Alliance", "Alianza", "Allianz", "Alleanza", "Aliança", "Альянс") + '</span> ' + a;
  }
  var TA = C.trainA || {};
  function trainer(k) { return pick(C.train[k], TA[k]); }
  function msg(k) {
    if (C.trainMsg) return pick(C.trainMsg[k], (C.trainMsgA || {})[k]);
    if (LANG === "en") return "If you haven't yet, learn " + { comp: "Journeyman (level 10)", exp: "Expert (level 20)", art: "Artisan (level 35)" }[k] + ": " + trainer(k) + ".";
    if (LANG === "es") return "Si aún no lo has hecho, aprende " + { comp: "Oficial (nivel 10)", exp: "Experto (nivel 20)", art: "Artesano (nivel 35)" }[k] + ": " + trainer(k) + ".";
    if (LANG === "it") return "Se non l'hai ancora fatto, impara " + { comp: "Garzone (livello 10)", exp: "Esperto (livello 20)", art: "Artigiano (livello 35)" }[k] + ": " + trainer(k) + ".";
    if (LANG === "pt") return "Se ainda não fez, aprenda " + { comp: "Artífice (nível 10)", exp: "Especialista (nível 20)", art: "Artesão (nível 35)" }[k] + ": " + trainer(k) + ".";
    if (LANG === "ru") return "Если ещё не сделали, изучите ранг " + { comp: "Подмастерье (уровень 10)", exp: "Умелец (уровень 20)", art: "Искусник (уровень 35)" }[k] + ": " + trainer(k) + ".";
    if (LANG === "de") return "Falls noch nicht geschehen, lerne " + { comp: "Geselle (Stufe 10)", exp: "Experte (Stufe 20)", art: "Fachmann (Stufe 35)" }[k] + ": " + trainer(k) + ".";
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
          (s.once ? '<p class="note">' + L('Outil à fabriquer une fois avant cette étape : ', 'Tool to craft once before this step: ', 'Herramienta que fabricar una vez antes de este paso: ', 'Vor diesem Schritt einmal herzustellendes Werkzeug: ', 'Strumento da creare una volta prima di questo passo: ', 'Ferramenta a produzir uma vez antes desta etapa: ', 'Инструмент, который нужно создать один раз перед этим шагом: ') + s.onceName + " (" + fmtMats(s.once) + ").</p>" : "") +
          (s.alt ? '<p class="alt">' + fill(s.alt) + "</p>" : "");
        html += '<article class="step' + (done ? " done" : "") + (cur ? " current" : "") + '">' +
          '<div class="range">' + s.f + "–" + s.t + "</div>" +
          '<div class="title"><span class="name">' + s.r + '</span><span class="count">× ' + s.n + "</span>" +
          (cur ? '<span class="here">' + L('Tu es ici', 'You are here', 'Estás aquí', 'Du bist hier', 'Sei qui', 'Você está aqui', 'Вы здесь') + '</span><span class="left">' + L('encore ~', '~', 'aún ~', 'noch ~', 'ancora ~', 'faltam ~', 'ещё ~') + remaining(s, skill, 300) + L('', ' left', '', '', '', '', '') + "</span>" : "") +
          (s.p ? '<span class="prov">' + L('à vérifier', 'to verify', 'por verificar', 'zu prüfen', 'da verificare', 'a verificar', 'проверить') + '</span>' : "") + "</div>" +
          '<div class="mats">' + L('Par fabrication : ', 'Per craft: ', 'Por fabricación: ', 'Pro Herstellung: ', 'Per creazione: ', 'Por produção: ', 'За создание: ') + fmtMats(s.m) + "</div>" +
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
      h = '<span class="tag" style="margin:0">' + L('Maintenant', 'Now', 'Ahora', 'Jetzt', 'Ora', 'Agora', 'Сейчас') + '</span><span class="big">' + cur.r + L(" · encore ~", " · ~", " · aún ~", " · noch ~", " · ancora ~", " · faltam ~", " · ещё ~") + remaining(cur, skill, 300) + L(" fabrications jusqu'à ", " crafts to ", " fabricaciones hasta ", " Herstellungen bis ", " creazioni fino a ", " produções até ", " созданий до ") + cur.t + "</span>" +
        "<span>" + L("Par fabrication : ", "Per craft: ", "Por fabricación: ", "Pro Herstellung: ", "Per creazione: ", "Por produção: ", "За создание: ") + fmtMats(cur.m) + "</span>" +
        (cur.once && skill <= cur.f ? "<span>" + L("Avant de commencer : fabrique ", "Before you start, craft ", "Antes de empezar, fabrica ", "Stell vor dem Start her: ", "Prima di iniziare, crea ", "Antes de começar, produza ", "Перед началом создайте ") + cur.onceName + ".</span>" : "") +
        (next ? '<span style="color:var(--muted)">' + L('Ensuite : ', 'Next: ', 'Después: ', 'Danach: ', 'Poi: ', 'Depois: ', 'Далее: ') + next.r + " (" + next.f + "–" + next.t + ")</span>" : "");
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
        var sub = !produced[mat] ? (SUB[mat] ? L("à fabriquer toi-même", "craft them yourself", "fabrícalos tú mismo", "selbst herstellen", "da creare tu stesso", "produza você mesmo", "создайте сами") : L("à fabriquer à part", "craft separately", "fabricar aparte", "separat herstellen", "da creare a parte", "produzir à parte", "создать отдельно"))
          : extra > 0 ? L("dont " + extra + " à fabriquer en plus de celles de l'étape dédiée", extra + " more than the dedicated step makes", extra + " más de los que hace el paso dedicado", extra + " mehr, als der eigene Schritt herstellt", extra + " in più di quelli del passo dedicato", extra + " a mais do que a etapa dedicada produz", "на " + extra + " больше, чем даёт отдельный шаг") : L("fabriquées en montant, garde-les", "made while levelling, keep them", "hechos al subir, guárdalos", "beim Leveln hergestellt, aufheben", "creati salendo, tienili", "produzidos ao subir, guarde-os", "созданы при прокачке, сохраните их");
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
      ? L("Tu as déjà atteint cet objectif : choisis un palier plus haut.", "You already reached this goal: pick a higher one.", "Ya alcanzaste este objetivo: elige uno más alto.", "Dieses Ziel hast du schon erreicht: Wähle ein höheres.", "Hai già raggiunto questo obiettivo: scegline uno più alto.", "Você já atingiu esta meta: escolha uma mais alta.", "Эта цель уже достигнута: выберите более высокую.")
      : L("De " + skill + " à " + target + ", en suivant le parcours ci-dessous. Ajoute 10 à 15 % de marge pour les fabrications malchanceuses.", "From " + skill + " to " + target + ", following the path below. Add 10–15% for unlucky crafts.", "De " + skill + " a " + target + ", siguiendo la ruta de abajo. Añade un 10–15 % por las fabricaciones con mala suerte.", "Von " + skill + " bis " + target + ", nach dem Weg unten. Plane 10–15 % mehr für Pech beim Herstellen ein.", "Da " + skill + " a " + target + ", seguendo il percorso qui sotto. Aggiungi il 10–15% per le creazioni sfortunate.", "De " + skill + " a " + target + ", seguindo o caminho abaixo. Adicione 10–15% para produções sem sorte.", "С " + skill + " до " + target + " по пути ниже. Добавьте 10–15% на неудачные создания.");
    document.getElementById("shop").innerHTML = out || '<p class="empty">' + L('Rien à prévoir pour cet objectif.', 'Nothing needed for this goal.', 'Nada que preparar para este objetivo.', 'Für dieses Ziel brauchst du nichts.', 'Niente da preparare per questo obiettivo.', 'Nada a preparar para esta meta.', 'Для этой цели ничего не нужно.') + '</p>';
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
