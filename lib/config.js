const env = process.env.YAC_ENV || 'dev';

const dev = {
  env: 'dev',
  redis: {
    host: process.env.YAC_RED_HOST || 'redis-stream',
    port: parseInt(process.env.YAC_RED_PORT, 10) || 6379,
  },
  conf_file: process.env.YAC_CFG_FILE || 'cfg.yml',
};
const test = {
  env: 'dev',
  redis: {
    host: process.env.YAC_RED_HOST || 'redis-stream',
    port: parseInt(process.env.YAC_RED_PORT, 10) || 6379,
  },
  conf_file: process.env.YAC_CFG_FILE || '../tests/cfg.yml',
};

const config = {
  dev, test,
};

module.exports = config[env];
