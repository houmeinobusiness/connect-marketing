// Fail closed: only the explicit release build is indexable.
export const isPublicBuild = import.meta.env.MODE === 'release' && !import.meta.env.DEV;
