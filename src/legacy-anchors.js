// Frozen map of the single-page Slate anchors that existed at api.beeminder.com/#<anchor>
// before the split into pages. This is a historical compatibility table, NOT derived from
// current content: if a heading is renamed later, old inbound links must still route here.
// Do not regenerate this from the markdown. Add new entries only for anchors that were
// live on the Slate site.
export const LEGACY_ANCHORS = {
  auth: '/authentication/',
  registerapp: '/authentication/#registerapp',
  authurl: '/authentication/#authurl',
  storetoken: '/authentication/#storetoken',
  tokenparam: '/authentication/#tokenparam',
  deauth: '/authentication/#deauth',
  autofetch: '/authentication/#autofetch',
  user: '/user/',
  getuser: '/user/#getuser',
  redirectuser: '/user/#redirectuser',
  goal: '/goal/',
  getgoal: '/goal/#getgoal',
  getgoals: '/goal/#getgoals',
  getarchivedgoals: '/goal/#getarchivedgoals',
  creategoal: '/goal/#creategoal',
  putgoal: '/goal/#putgoal',
  refresh: '/goal/#refresh',
  dialroad: '/goal/#dialroad',
  shortcircuit: '/goal/#shortcircuit',
  stepdown: '/goal/#stepdown',
  cancelstepdown: '/goal/#cancelstepdown',
  unclebutton: '/goal/#unclebutton',
  ratchet: '/goal/#ratchet',
  'one-of-three': '/goal/#one-of-three',
  'goal-types': '/goal/#goal-types',
  datapoint: '/datapoint/',
  dataall: '/datapoint/#dataall',
  postdata: '/datapoint/#postdata',
  postdatas: '/datapoint/#postdatas',
  putdata: '/datapoint/#putdata',
  deletedata: '/datapoint/#deletedata',
  charge: '/charge/',
  postcharge: '/charge/#postcharge',
  goalcharge: '/charge/#goalcharge',
  webhooks: '/webhooks/',
  // The two Slate `includes:` had plain markdown h1s rather than raw HTML with an explicit
  // id, so Slate slugified them. "Errors" resolved to the Ratchet subsection rather than
  // the Errors page, because the ratchet "### Errors" came first in document order on the
  // single page -- so that is where this redirect goes. Faithful, not tidier.
  errors: '/goal/#errors',
  'url-based-goal-creation': '/url-goal-creation/',
};

// JSON.stringify does not escape anything that is special inside a <script> element, and
// Astro concatenates head-script content into the document unescaped. The map is a frozen
// literal today, so nothing here can break out -- but escape anyway, so that if it is ever
// fed from a non-literal source a value containing </script> or a line separator cannot.
const inlineSafe = value => JSON.stringify(value)
  .replace(/</g, '\\u003c')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029');

export const LEGACY_HASH_SHIM =
  `(function(){var m=Object.assign(Object.create(null),${inlineSafe(LEGACY_ANCHORS)});` +
  `if(location.pathname!=='/'&&location.pathname!=='/index.html')return;` +
  // A null-prototype map matters: a plain object would resolve #__proto__, #constructor
  // and #toString to inherited values, and location.replace would coerce those to a
  // nonsense same-origin path instead of leaving the reader where they are.
  `var t=m[location.hash.slice(1)];if(typeof t==='string')location.replace(t);})();`;
