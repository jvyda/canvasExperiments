const electron = require('electron');
const path = require('path');
const url = require('url');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let wins = [];

function createWindow() {
    if(process.argv.length > 1)
    {
        // The /p option tells us to display the screen saver in the tiny preview window in the Screen Saver Settings dialog.
        if(process.argv[2] === "/p")
        {
            electron.app.quit();
            return;
        }

        // The /S option is passed when the user chooses Configure from the .scr file context menu (although we don't see this in practice).
        // The /c:# option is passed when the user clicks Settings... in the Screen Saver Settings dialog.
        if((process.argv[2] === "/S")
            || process.argv[2].match(/^\/c/))
        {
            electron.dialog.showMessageBox({ message: "This screen saver has no options that you can set.", buttons: [ "OK" ] });
            electron.app.quit();
            return;
        }

        //electron.dialog.showMessageBox({ message: process.argv.join("\n"), buttons: [ "OK" ] });
    }
    electron.screen.getAllDisplays().forEach(function(screen){
       let win = new electron.BrowserWindow({x: screen.bounds.x,y: screen.bounds.y, frame: false});
        win.setFullScreen(true);
        win.maximize();
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }));

        //win.webContents.openDevTools();

        win.on('closed', () => {
            win = null
        });
        wins.push(win);
    });
    // for some reason, there is no global key event, but only for specific keys
    let exitKeys = ['F1', 'F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                    '~', '!', '@', '#', '$',
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
                    'Plus', 'Space', 'Tab', 'Backspace', 'Delete', 'Insert', 'Return', 'Up', 'Down', 'Left', 'Right', 'Home', 'End', 'PageUp', 'PageDown', 'Escape',
                    'VolumeUp', 'VolumeDown', 'VolumeMute', 'MediaNextTrack', 'MediaPreviousTrack', 'MediaStop', 'MediaPlayPause', 'PrintScreen'
    ];
    for(let i = 0; i < exitKeys.length; i++) {
        electron.globalShortcut.register(exitKeys[i], function(){
            electron.app.quit();
        })
    }

}

electron.app.on('ready', createWindow);

// Quit when all windows are closed.
electron.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron.app.quit();
        electron.globalShortcut.unregisterAll();
    }
});

electron.app.on('activate', () => {
    if (win.length === null) {
        createWindow()
    }
});
