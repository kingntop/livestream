// Electron
const {
  app,
  Menu,
  Tray,
  remote
} = require("electron");

const electron = require('electron')

const {
  BrowserWindow
} = require("electron");

const path = require("path");

const electronLocalshortcut = require('electron-localshortcut');
const windowStateKeeper = require('electron-window-state');
// This method will be called when Electron has finished initialization and is ready to create browser windows
app.allowRendererProcessReuse = true;
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}

let Axis = {
  x: 0,
  y: 0,
  w: 1600,
  h: 1200,
  lock: 'N'
}

Axis = readPostionFile();

createBrowserWindow = () => {
  const maxiSize = electron.screen.getPrimaryDisplay().workAreaSize
  return new BrowserWindow({
    alwaysOnTop: true,
    // width: maxiSize.width,
    // height: maxiSize.height,
    width: Axis.w,
    height: Axis.h,
    x: Axis.x,
    y: Axis.y,
    maxHeight: maxiSize.height * 10,
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
      nodeIntegration: true
      // preload: path.join(__dirname, 'preload.js'),
    },
  });
};

app.on("ready", () => {
  // Main window
  // const window = require("./src/window");
  // mainWindow = window.createBrowserWindow(app);
  // const window ={};
  const mainWindow = createBrowserWindow(app);
  // mainWindow.loadURL("https://makerseok.github.io/pwa-video-player/");
  mainWindow.loadURL("https://makerseok.github.io/pwa-player/");

  // mainWindow.webContents.on('did-fail-load', () => {
  //   // mainWindow.loadURL('https://makerseok.github.io/tmp-pwa-video-player/')
  //   console.log('did-fail-load')
  //   location.reload()
  // })
  // mainWindow.webContents.on('crashed', (event, killed) => {
  //   setImmediate(() => {
  //     console.log('crash-ed', event, killed)
  //     mainWindow.reload();
  //   })
  // });
  // mainWindow.webContents.on('render-process-gone', (e, details) => {
  //   console.log('render-process-gone', e, details)
  //   mainWindow.reload();
  // });

  mainWindow.on('resize', function () {
    const size = mainWindow.getSize();
    // console.log('size', size)
    Axis.w = size[0];
    Axis.h = size[1];
    writePostionFile();
  });

  mainWindow.on('move', function () {
    const position = mainWindow.getPosition();
    if (Axis.lock == 'N') {
      Axis.x = position[0];
      Axis.y = position[1];
      writePostionFile();
    } else {
      mainWindow.setPosition(Axis.x, Axis.y);
    }
  });

  // Keyboard shortcut handlers
  const handleF12 = () => {
    console.log('F12 is pressed')
    const size = mainWindow.getSize();
    console.log('size', size)

    Axis.w = size[0];
    Axis.h = size[1];
    writePostionFile();
  };
  const handleF5 = () => {
    console.log('F5 is pressed')
    mainWindow.reload();
  };

  // const handleF6 = () => {
  //   function fn1() {
  //     // `name` is not declared
  //     var name = new Array(999999999)
  //   }
  //   fn1()
  //   console.log('F6 is pressed')
  // };
  const handleF10 = () => {
    console.log('F10 is pressed')
    Axis.lock = 'Y';
    writePostionFile();
  };
  const handleF9 = () => {
    console.log('pos', mainWindow.getPosition())
    console.log('F9 is pressed')
    Axis.lock = 'N';
    writePostionFile();
  };
  const handleArrowKeys = async (direction) => {
    switch (direction) {
      case 'Up':
        Axis.y -= 1;
        break;
      case 'Down':
        Axis.y += 1;
        break;
      case 'Right':
        Axis.x += 1;
        break;
      case 'Left':
        Axis.x -= 1;
        break;
      default:
        break;
    }

    if (Axis.lock == 'N') {
      mainWindow.setPosition(Axis.x, Axis.y);
      writePostionFile();
    }
  };
  // Register keyboard shortcuts
  electronLocalshortcut.register(mainWindow, 'F12', handleF12);
  electronLocalshortcut.register(mainWindow, 'F5', handleF5);
  electronLocalshortcut.register(mainWindow, 'F10', handleF10);
  electronLocalshortcut.register(mainWindow, 'F9', handleF9);
  // electronLocalshortcut.register(mainWindow, 'F6', handleF6);
  electronLocalshortcut.register(mainWindow, 'Up', () => handleArrowKeys('Up'));
  electronLocalshortcut.register(mainWindow, 'Down', () => handleArrowKeys('Down'));
  electronLocalshortcut.register(mainWindow, 'Right', () => handleArrowKeys('Right'));
  electronLocalshortcut.register(mainWindow, 'Left', () => handleArrowKeys('Left'));
  // Menu (for standard keyboard shortcuts)
  const menu = require("./src/menu");
  const template = menu.createTemplate(app.name);
  const builtMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(builtMenu);

});
app.once('ready-to-show', () => {
  // mainWindow.maximize()
})
// Quit when all windows are closed.
app.on("window-all-closed", () => {
  app.quit();
});

function writePostionFile() {
  const fs = require("fs");
  const os = require('os');
  // console.log('axis', Axis)
  fs.writeFile((os.homedir() + '\\' + 'settings.json'), JSON.stringify(Axis), "utf-8", (error, data) => {
    if (error) {
      console.error("error: " + error);
    }
  });
}

function readPostionFile() {
  const fs = require('fs');
  const os = require('os');

  try {
    const dataBuffer = fs.readFileSync(os.homedir() + '\\' + 'settings.json');
    const dataJSON = dataBuffer.toString();
    // Axis = JSON.parse(dataJSON);
    return JSON.parse(dataJSON);
    // return JSON.parse(dataJSON);
    console.log('main.js', Axis);
  } catch (error) {
    // console.error(error);
    Axis = {
      x: 0,
      y: 0,
      w: 1600,
      h: 1200,
      lock: 'N'
    }
    console.log('main.js', Axis);
    writePostionFile(Axis)
    return Axis;
    // console.error(error);
  }
}