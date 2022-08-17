const { app, BrowserWindow } = require('electron');

class Client {
    async init() {
        await app.whenReady();

        this.createWindow();
        this.registerEvents();
    }

    registerEvents() {
        // Exit the client if all windows are closed, except for MacOS.
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') app.quit();
        });
        // Open a new window if none are open, but the client is running.
        // Relevent for MacOS.
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });
    }

    createWindow() {
        const window = new BrowserWindow({
            width: 800,
            height: 600,
        });

        window.loadFile('src/index.html');
    }
}

new Client().init();