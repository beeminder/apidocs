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
};

export const LEGACY_HASH_SHIM =
  `(function(){var m=${JSON.stringify(LEGACY_ANCHORS)};` +
  `if(location.pathname!=='/'&&location.pathname!=='/index.html')return;` +
  `var t=m[location.hash.slice(1)];if(t)location.replace(t);})();`;
