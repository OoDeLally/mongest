import { MongoProjection } from 'mongest-projection';

const isInclusionProjection = (proj: MongoProjection): boolean => {
  for (const key in proj) {
    const value = proj[key];
    if (value) {
      return true;
    }
  }
  return false;
};

export const includeKeyInProjection = (key: string, proj: MongoProjection): MongoProjection => {
  if (isInclusionProjection(proj)) {
    return { ...proj, [key]: 1 };
  } else {
    const { [key]: _, ...rest } = proj;
    return rest;
  }
};
