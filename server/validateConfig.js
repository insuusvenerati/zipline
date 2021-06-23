const Logger = require('../src/lib/logger');

function dot(str, obj) {
  return str.split('.').reduce((a,b) => a[b], obj);
}

const path = (path, type) => ({ path, type });

module.exports = async config => {
  const paths = [
    path('core.secure', 'boolean'),
    path('core.secret', 'string'),
    path('core.host', 'string'),
    path('core.port', 'number'),
    path('database.type', 'string'),
    path('database.url', 'string'),
    path('uploader.route', 'string'),
    path('uploader.embed_route', 'string'),
    path('uploader.length', 'number'),
    path('uploader.directory', 'string')
  ];

  let errors = 0;

  for (let i = 0, L = paths.length; i !== L; ++i) {
    const path = paths[i];
    const value = dot(path.path, config);
    if (value === undefined) {
      Logger.get('config').error(`there was no ${path.path} in config`);
      ++errors;
    }
    const type = typeof value;

    if (value !== undefined && type !== path.type) {
      Logger.get('config').error(`expected ${path.type} on ${path.path}, but got ${type}`);
      ++errors;
    }
  }

  if (errors !== 0) {
    Logger.get('config').error(`exiting due to ${errors} errors`);
    process.exit(1);
  }  
};