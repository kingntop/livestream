const path = require("path");
const electron = require('electron')
const {
  BrowserWindow
} = require("electron"); // https://www.electronjs.org/docs/api/browser-window

const windowStateKeeper = require('electron-window-state');
let Axis =  readPostionFile();

exports.createBrowserWindow = () => {

  const maxiSize = electron.screen.getPrimaryDisplay().workAreaSize
  return new BrowserWindow({
    alwaysOnTop: true,
    // width: maxiSize.width,
    // height: maxiSize.height,
    width: Axis.w,
    height: Axis.h,
    maxHeight: maxiSize.height*10,
    x : Axis.x,
    y : Axis.y,
    icon: path.join(__dirname, "assets/icons/win/icon.ico"),
    titleBarStyle: 'hidden',
    // frame: false,
    // autoHideMenuBar: true,
    // "fullscreen": true,
    backgroundColor: "#fff",
    webPreferences: {
      nativeWindowOpen: true,
      devTools: true, // false if you want to remove dev tools access for the user
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
};

function readPostionFile() {
  const os = require('os');
  const fs = require('fs');
  try {
    const dataBuffer = fs.readFileSync(os.homedir() + '\\' + 'settings.json');
    const dataJSON = dataBuffer.toString();
    console.log('x,y', JSON.parse(dataJSON));
    return JSON.parse(dataJSON);
  } catch (error) {
    return {
      x: 0,
      y: 0,
      w: 1024,
      h: 768,
      lock: 'N'
    }
    console.error(error);
  }
}