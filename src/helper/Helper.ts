const CURRENT_URL = (): string => {
  let origin: string =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  origin = origin === "" ? process.env.DOMAIN || "" : origin;

  return origin;
};

export default {
  CURRENT_URL,
};
