// Get the process env.
const env = process.env;

const path = require('path');
const { app, BrowserWindow } = require('electron');
const config = require(path.join(__dirname, 'app.config'));

let mainWindow;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow(config.electron.mainWindow);

    // Show the window when ready and focus it
    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            mainWindow.show();
            mainWindow.focus();
            if (config.electron.devtools === true) {
                mainWindow.webContents.openDevTools();
            }
        }, 1000);
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    // Load the localhost of the app.
    if (env.NODE_ENV === 'development') {
        const port = config.port.browsersync || 3000;
        mainWindow.loadURL(`http://localhost:${port}`);
    } else {
        mainWindow.loadFile(
            path.join(__dirname, 'app', 'public', 'index.html'),
        );
    }
};

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow();
    }
});
