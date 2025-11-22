const { withStaticPlugin } = require('@expo/config-plugins');

// This is necessary because Skia's setup script for web might be missing or failing
// We need to ensure the WASM file is available.
// For now, we will assume the user might need to run the setup script manually if it exists.

module.exports = (config) => {
  if (!config.web) config.web = {};
  if (!config.web.bundler) config.web.bundler = 'metro';
  return config;
};
