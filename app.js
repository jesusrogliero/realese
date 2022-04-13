const { app, BrowserWindow } = require('electron');
const { loadMethods } = require('./methods');
const dirs = require('./dirs');
const path = require('path');
const appdata = require('appdata-path');
const log = require('electron-log').transports.file.resolvePath = () => path.join( appdata('sbms'), 'sbms-log.log');


/*
const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
//Setup Logger
autoUpdater.logger = log;

// Setup updater events

autoUpdater.on('cheking-for-update', () => {
  console.log('Buscando Actualizaciones...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Actualizacion Disponible');
  console.log('Version: ', info.version);
  console.log('Lanzamiento el: ', info.releaseDate);
});

autoUpdater.on('update-not-available', () => {
  console.log('No hay actualizaciones disponibles');
});

autoUpdater.on('download-progress', (progress) => {
  console.log('Progress', progress);
});

autoUpdater.on('upate-donloaded', ())

*/

// funcion de inicio de la aplicacion
const main = function () {
  // cargando ventana
  const win = new BrowserWindow({
    show:false,
    minWidth: 1110,
    minHeight: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.maximize();
  win.setMenuBarVisibility(false)
  win.loadFile(dirs.public + 'index.html');


  // cargando el listado de archivos
  const fs = require('fs');
  fs.readdir(dirs.methods, (error, files) => {
    if (!error) loadMethods(files);
    else console.error(error);
  });

  win.once('ready-to-show', () => {
    win.show();
  });

};

app.whenReady().then(() => main());

