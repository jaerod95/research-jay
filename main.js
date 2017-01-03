const {app,BrowserWindow,session,ipcMain,Notification} = require('electron');
let win
let gather

app.on('window-all-closed', () => {
  app.quit();
})

app.on('ready', () => {
  const {width, height} = require('electron').screen.getPrimaryDisplay().workAreaSize
  gather = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    show: true,
    backgroundColor: '#21252b'
  });
  gather.loadURL('file://' + __dirname + '/index.html');
  gather.openDevTools();
  gather.on('closed', () => {
    gather = null;
  });


  /*win = new BrowserWindow({
    width: width * .25,
    width: height,
    x: width * .4,
    y: 0,
    show: false,
    backgroundColor: '#21252b'
  });
  win.once('ready-to-show', () => {
    win.show()
  });
  win.loadURL('file://' + __dirname + '/jr_interpreter.html');
  win.openDevTools();
  win.on('closed', () => {
    win = null;
  });*/
});
