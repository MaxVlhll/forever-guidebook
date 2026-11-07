// Barre de navigation commune et choix de faction.
// Pour ajouter un guide, ajoute-le dans GROUPS : il apparaît sur toutes les pages.
// La faction ("a", "h" ou "both") est gardée sous la clé fg-faction ; les moteurs la relisent à l'événement "factionchange".
// Langues : français à la racine, les autres dans en/, es/, de/ avec les mêmes noms de fichiers.
// Les libellés sont "fr|en|es|de|it|pt|ru" (même ordre que LANGS).
(function () {
  var LANGS = [["fr", "Français"], ["en", "English"], ["es", "Español"], ["de", "Deutsch"], ["it", "Italiano"], ["pt", "Português"], ["ru", "Русский"]];
  var LANG = document.documentElement.lang, LI = Math.max(0, LANGS.map(function (l) { return l[0]; }).indexOf(LANG));
  function T(s) { var p = s.split("|"); return p[LI] || p[0]; }
  var GROUPS = [
    ["Classes|Classes|Clases|Klassen|Classi|Classes|Классы", [
      ["talents.html#chaman", "Chaman|Shaman|Chamán|Schamane|Sciamano|Xamã|Шаман"],
      ["talents.html#chasseur", "Chasseur|Hunter|Cazador|Jäger|Cacciatore|Caçador|Охотник"],
      ["talents.html#demoniste", "Démoniste|Warlock|Brujo|Hexenmeister|Stregone|Bruxo|Чернокнижник"],
      ["talents.html#druide", "Druide|Druid|Druida|Druide|Druido|Druida|Друид"],
      ["talents.html#guerrier", "Guerrier|Warrior|Guerrero|Krieger|Guerriero|Guerreiro|Воин"],
      ["talents.html#mage", "Mage|Mage|Mago|Magier|Mago|Mago|Маг"],
      ["talents.html#paladin", "Paladin|Paladin|Paladín|Paladin|Paladino|Paladino|Паладин"],
      ["talents.html#pretre", "Prêtre|Priest|Sacerdote|Priester|Sacerdote|Sacerdote|Жрец"],
      ["talents.html#voleur", "Voleur|Rogue|Pícaro|Schurke|Ladro|Ladino|Разбойник"]]],
    ["Fabrication|Crafting|Fabricación|Herstellung|Creazione|Produção|Производство", [
      ["alchimie.html", "Alchimie|Alchemy|Alquimia|Alchemie|Alchimia|Alquimia|Алхимия"],
      ["couture.html", "Couture|Tailoring|Sastrería|Schneiderei|Sartoria|Alfaiataria|Портняжное дело"],
      ["enchantement.html", "Enchantement|Enchanting|Encantamiento|Verzauberkunst|Incantamento|Encantamento|Наложение чар"],
      ["forge.html", "Forge|Blacksmithing|Herrería|Schmiedekunst|Forgiatura|Ferraria|Кузнечное дело"],
      ["ingenierie.html", "Ingénierie|Engineering|Ingeniería|Ingenieurskunst|Ingegneria|Engenharia|Инженерное дело"],
      ["travail-du-cuir.html", "Travail du cuir|Leatherworking|Peletería|Lederverarbeitung|Conciatura|Couraria|Кожевничество"]]],
    ["Récolte|Gathering|Recolección|Sammeln|Raccolta|Coleta|Сбор", [
      ["herboristerie.html", "Herboristerie|Herbalism|Herboristería|Kräuterkunde|Erbalismo|Herborismo|Травничество"],
      ["minage.html", "Minage|Mining|Minería|Bergbau|Estrazione|Mineração|Горное дело"],
      ["depecage.html", "Dépeçage|Skinning|Desuello|Kürschnerei|Scuoiatura|Esfolamento|Снятие шкур"]]],
    ["Secondaires|Secondary|Secundarias|Sekundär|Secondarie|Secundárias|Вторичные", [
      ["cuisine.html", "Cuisine|Cooking|Cocina|Kochkunst|Cucina|Culinária|Кулинария"],
      ["secourisme.html", "Secourisme|First Aid|Primeros auxilios|Erste Hilfe|Primo soccorso|Primeiros Socorros|Первая помощь"],
      ["peche.html", "Pêche|Fishing|Pesca|Angeln|Pesca|Pesca|Рыбная ловля"]]]
  ];
  var FACTIONS = [["a", "Alliance|Alliance|Alianza|Allianz|Alleanza|Aliança|Альянс"], ["both", "Les deux|Both|Ambas|Beide|Entrambe|Ambas|Обе"],
    ["h", "Horde|Horde|Horda|Horde|Orda|Horda|Орда"]];
  var KEY = "fg-faction";
  var page = decodeURIComponent(location.pathname.split("/").pop()) || "index.html";
  if (!/^[a-z0-9-]+\.html$/.test(page)) page = "index.html"; // jamais de texte libre de l'URL dans le HTML
  function langHref(l) { return (LI ? "../" : "") + (l === "fr" ? "" : l + "/") + page; }

  function getFaction() { try { return localStorage.getItem(KEY) || "both"; } catch (e) { return "both"; } }
  function isHere(href) {
    var p = href.split("#");
    return p[0] === page && (!p[1] || ("#" + p[1]) === (location.hash || "#chasseur"));
  }

  var nav = document.createElement("nav");
  nav.className = "sitenav";
  nav.setAttribute("aria-label", "Guides");
  nav.innerHTML = '<div class="sitenav-in"><a class="brand" href="index.html">Forever Guidebook</a>' +
    '<div class="nav-groups">' + GROUPS.map(function (g) {
      return '<details class="nav-dd"><summary>' + T(g[0]) + '</summary><ul>' + g[1].map(function (l) {
        return '<li><a href="' + l[0] + '">' + T(l[1]) + "</a></li>";
      }).join("") + "</ul></details>";
    }).join("") + "</div>" +
    '<div class="fac-switch" role="group" aria-label="Faction">' + FACTIONS.map(function (f) {
      return '<button type="button" data-v="' + f[0] + '">' + T(f[1]) + "</button>";
    }).join("") + "</div>" +
    '<details class="nav-dd lang-dd"><summary aria-label="Language">' + LANGS[LI][0].toUpperCase() + "</summary><ul>" +
    LANGS.filter(function (l, i) { return i !== LI; }).map(function (l) {
      return '<li><a data-l="' + l[0] + '" hreflang="' + l[0] + '" lang="' + l[0] + '" href="' + langHref(l[0]) + '">' + l[1] + "</a></li>";
    }).join("") + "</ul></details></div>";
  document.body.insertBefore(nav, document.body.firstChild);
  // Les liens de langue gardent la classe affichée sur la page des talents.
  var $langs = nav.querySelectorAll(".lang-dd a");
  function syncLang() { $langs.forEach(function (a) { a.href = langHref(a.dataset.l) + location.hash; }); }
  syncLang();
  window.addEventListener("hashchange", syncLang);

  var dds = nav.querySelectorAll(".nav-dd");
  function markCurrent() {
    dds.forEach(function (d) {
      var any = false;
      d.querySelectorAll("a").forEach(function (a) {
        var on = isHere(a.getAttribute("href"));
        if (on) { a.setAttribute("aria-current", "page"); any = true; } else a.removeAttribute("aria-current");
      });
      d.classList.toggle("cur", any);
    });
  }
  markCurrent();
  window.addEventListener("hashchange", markCurrent);

  // Un seul menu ouvert à la fois ; clic ailleurs, Échap ou choix d'un lien referment.
  function closeAll(except) { dds.forEach(function (d) { if (d !== except) d.open = false; }); }
  dds.forEach(function (d) { d.addEventListener("toggle", function () { if (d.open) closeAll(d); }); });
  document.addEventListener("click", function (e) { if (!nav.contains(e.target) || e.target.closest(".nav-dd a")) closeAll(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  var btns = nav.querySelectorAll(".fac-switch button");
  function applyFaction(v) {
    document.body.setAttribute("data-faction", v);
    btns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.v === v ? "true" : "false"); });
  }
  applyFaction(getFaction());
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      try { localStorage.setItem(KEY, b.dataset.v); } catch (e) {}
      applyFaction(b.dataset.v);
      window.dispatchEvent(new Event("factionchange"));
    });
  });
})();
