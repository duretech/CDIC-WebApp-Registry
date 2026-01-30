export const loadRuntimeConfig = async () => {
  const response = await fetch(`${process.env.PUBLIC_URL}/runtime-config.json`);
  const config = await response.json();
  window.RUNTIME_CONFIG = config; // global access
};

  