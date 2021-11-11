const { app, BrowserWindow, Menu } = require('electron')
const remoteMain = require("@electron/remote/main");

remoteMain.initialize();
const isDev = require('electron-is-dev')
const Store = require('electron-store')
const menuTemp = require('./src/temp/menuTemp')

Store.initRenderer()
let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 650,
    minWidth: 600,
    webPreferences: {
      nodeIntegration: true, //别的页面（不是主进程）允许访问node 
      enableRemoteModule: true, //允许访问主进程的方法 
      contextIsolation:false //配合nodeIntegration实现访问node
    }
  }) 
  remoteMain.enable(mainWindow.webContents);

  const urlLocation = isDev ? "http://localhost:3000" : 'myUrl'
  mainWindow.loadURL(urlLocation)

  // 添加自定义的原生菜单
  const menu = Menu.buildFromTemplate(menuTemp)
  Menu.setApplicationMenu(menu)
})