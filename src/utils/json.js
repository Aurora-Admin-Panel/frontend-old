export const isJSON = (jsonLike) => {
  try {
    return jsonLike && JSON.parse(jsonLike);
  } catch (e) {
    return false;
  }
};
