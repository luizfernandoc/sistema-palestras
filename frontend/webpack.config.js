const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Configurar MIME types
  config.devServer = config.devServer || {};
  config.devServer.headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/javascript'
  };
  
  return config;
};