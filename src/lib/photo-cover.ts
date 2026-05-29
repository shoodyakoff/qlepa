export const PHOTO_COVER_ALIAS = "cover";
export const PHOTO_COVER_PRESET = "outdoor-editorial-arrow";

export function normalizePromptPreset(preset: string): string {
  return preset === PHOTO_COVER_ALIAS ? PHOTO_COVER_PRESET : preset;
}
