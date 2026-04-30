// storage is auto-imported by WXT — no import needed

/** Whether the extension is globally enabled */
export const enabledItem = storage.defineItem<boolean>('local:uiModifierEnabled', {
  fallback: true,
});

/** Per-page style modifications { [pageKey]: { [selector]: { [cssProp]: value } } } */
export const modsItem = storage.defineItem<Record<string, any>>('local:uiModifierModifications', {
  fallback: {},
});

/** Saved style profiles { [name]: { [cssProp]: value } } */
export const profilesItem = storage.defineItem<Record<string, any>>('local:uiModifierProfiles', {
  fallback: {},
});
