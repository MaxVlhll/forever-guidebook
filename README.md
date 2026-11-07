# Forever Guidebook

Site statique de guides de fan en français pour WoW Forever, Alliance et Horde : 12 métiers (1 → 300) et talents de leveling des 9 classes.

## Mettre en ligne sur GitHub Pages

1. Crée un dépôt sur GitHub (par exemple `forever-guidebook`) et pousse le contenu de ce dossier à la racine.
2. Dans le dépôt : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`.
3. Le site est en ligne quelques minutes plus tard à l'adresse `https://<ton-pseudo>.github.io/forever-guidebook/`.

Tous les liens sont relatifs : le site marche aussi bien en sous-dossier GitHub Pages qu'en ouvrant `index.html` en local.

## Structure

- `index.html` : accueil.
- `<metier>.html` : un guide par métier. Les données du parcours sont dans le `var CONFIG = {...}` en bas de chaque page.
- `talents.html` : talents de leveling. Les données sont dans `var CLASSES = {...}`.
- `assets/site.css` : styles communs. Chaque page ne redéfinit que ses couleurs (`:root` en haut de la page).
- `assets/metier.js` : calculateur des métiers de fabrication (étapes, « tu es ici », liste de courses).
- `assets/recolte.js` : moteur des métiers de récolte (paliers et zones).
- `assets/nav.js` : barre de navigation (menus par groupe) et choix de faction. Ajoute un guide dans `GROUPS` pour qu'il apparaisse sur toutes les pages.
- `assets/icons/` : icônes des talents (images Wowhead, propriété de Blizzard Entertainment).

## Factions

Le choix Alliance / Horde / les deux est gardé dans le navigateur (`fg-faction`). Dans le HTML, un bloc `data-f="a"` ou `data-f="h"` n'est visible que pour sa faction. Dans les `CONFIG` : `train` et `trainMsg` pour la Horde, `trainA` et `trainMsgA` pour l'Alliance ; les notes peuvent citer `{comp}`, `{exp}`, `{art}` pour afficher le maître de la faction choisie. Pour la récolte, les zones portent `"a"` ou `"h"` et chaque palier peut avoir un conseil `horde` et `alliance`.
- `.nojekyll` : dit à GitHub Pages de servir les fichiers tels quels.

Les anciennes pages faites dans l'appli de bureau sont dans `_originaux/`. Elles ne sont pas liées au site et peuvent être supprimées.

## Langues

- Français à la racine, anglais dans `en/`, avec les mêmes noms de fichiers. Le bouton FR/EN de la barre ouvre la même page dans l'autre langue.
- `assets/nav.js`, `assets/metier.js` et `assets/recolte.js` lisent `<html lang>` et choisissent leurs textes (`L("français", "english")`).
- Une modification de contenu se fait dans les deux versions. Les noms d'objets et de PNJ anglais sont ceux de Classic. Ceux propres à Forever sont traduits depuis le client français.
