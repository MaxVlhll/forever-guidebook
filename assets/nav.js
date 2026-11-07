// Barre de navigation commune et choix de faction.
// Pour ajouter un guide, ajoute-le dans GROUPS : il apparaît sur toutes les pages.
// La faction ("a", "h" ou "both") est gardée sous la clé fg-faction ; les moteurs la relisent à l'événement "factionchange".
(function () {
  var GROUPS = [
    ["Classes", [["talents.html#chaman", "Chaman"], ["talents.html#chasseur", "Chasseur"], ["talents.html#demoniste", "Démoniste"],
      ["talents.html#druide", "Druide"], ["talents.html#guerrier", "Guerrier"], ["talents.html#mage", "Mage"],
      ["talents.html#paladin", "Paladin"], ["talents.html#pretre", "Prêtre"], ["talents.html#voleur", "Voleur"]]],
    ["Fabrication", [["alchimie.html", "Alchimie"], ["couture.html", "Couture"], ["enchantement.html", "Enchantement"],
      ["forge.html", "Forge"], ["ingenierie.html", "Ingénierie"], ["travail-du-cuir.html", "Travail du cuir"]]],
    ["Récolte", [["herboristerie.html", "Herboristerie"], ["minage.html", "Minage"], ["depecage.html", "Dépeçage"]]],
    ["Secondaires", [["cuisine.html", "Cuisine"], ["secourisme.html", "Secourisme"], ["peche.html", "Pêche"]]]
  ];
  var FACTIONS = [["a", "Alliance"], ["both", "Les deux"], ["h", "Horde"]];
  var KEY = "fg-faction";
  var page = decodeURIComponent(location.pathname.split("/").pop()) || "index.html";

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
      return '<details class="nav-dd"><summary>' + g[0] + '</summary><ul>' + g[1].map(function (l) {
        return '<li><a href="' + l[0] + '">' + l[1] + "</a></li>";
      }).join("") + "</ul></details>";
    }).join("") + "</div>" +
    '<div class="fac-switch" role="group" aria-label="Faction">' + FACTIONS.map(function (f) {
      return '<button type="button" data-v="' + f[0] + '">' + f[1] + "</button>";
    }).join("") + "</div></div>";
  document.body.insertBefore(nav, document.body.firstChild);

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
