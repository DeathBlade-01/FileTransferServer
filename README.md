File Transfer PWA

A Progressive Web App for seamless file and clipboard sharing across devices on your local network. Perfect for quickly transferring files, screenshots, and text between your phone, tablet, and computer without cloud services or cables.

This project is primarily aimed for transferring files between devices connected on a common trusted network, without relying on additional software.
## API References


| API Reference | Parameters (Type if any)    | Response                |
| :-------- | :------- | :------------------------- |
| `GET /health` | ` Returns the server status and timestamp.` |`{  "status": "ok", "timestamp": 1234567890} `|
| `POST /upload` | `file (multipart/form-data) ` |` {  "success": true,  "filename": "1234567890-myfile.pdf",  "originalName": "myfile.pdf",  "size": 1024000}`|
| `GET /files` | `file (multipart/form-data) ` |` {  "files": [    {      "name": "1234567890-myfile.pdf",      "displayName": "myfile.pdf",      "size": 1024000,      "modified": "2026-01-01T12:00:00.000Z"    }  ]}`|
| `GET /download/${filename}` | `filename (string) ` |` Returns the file as a download attachment.`|
| `DELETE /delete/${filename}` | `filename (string) ` |` {  "success": true}`|
| `POST /clipboard` | `text (string) ` |` {  "success": true} (Request Body - {  "text": "Your clipboard content here"} )`|
| `GET /clipboard` | `text (string) ` |`{  "text": "Synced clipboard content",  "timestamp": 1234567890}`|




## Demo

Insert gif or link to demo


## Deployment
### Server Deployment (Ubuntu/Linux)

#### 1. Install Node.js and npm:

    sudo apt update
    
    sudo apt install nodejs npm


#### 2. Clone or copy project files to your server:


    mkdir ~/file-transfer

    cd ~/file-transfer

    # Copy index.html, app.js, sw.js, server.js, manifest.json, and icons


#### 3, Install Dependancies

    npm install express multer cors


#### 4. Start the Server

    node server.js

#### 5. Optional(But Preferred) - Run as a background service using PM2:

    sudo npm install -g pm2
    pm2 start server.js --name file-transfer
    pm2 startup
    pm2 save


#### 6. Access the app:

    - Server will display URLs on startup
    - Open http://YOUR_LOCAL_IP:3000 on any device on the same WiFi network



### Client Deployment (Mobile/Desktop) 

The PWA can be installed directly from the browser:

Open the server URL in your browser (Chrome/Safari/Edge)
Look for "Install App" or "Add to Home Screen" prompt
The app will work offline after first load
## Features

- **No cloud required** - All transfers happen locally on your network
- **Dark mode interface** - Modern, eye-friendly UI optimized for any lighting
- **Cross-platform sync** - Works on iOS, Android, Windows, Mac, Linux
- **Instant file transfer** - Upload and download files up to 100MB across devices
- **Clipboard sync** - Share text snippets between devices in seconds
- **Screenshot sharing** - Paste images directly (Ctrl+V/Cmd+V) to upload
- **Offline capable** - PWA works without internet once installed
- **Auto-discovery** - Automatically detects server on local network
- **Drag and drop** - Intuitive file uploads with drag-and-drop support
- **Real-time status** - Live connection indicator and auto-refresh




## FAQ

#### Q. How do I find my server's IP address?

**A.** When you start the server with node server.js, it automatically displays both the local and network IP addresses in the console. The network IP (usually starting with 192.168.x.x) is what you'll use on other devices. Both devices must be connected to the same WiFi network.

#### Q. Is my data secure? Can others access my files??

**A.** Your files are only accessible on your local network - they never leave your WiFi and don't go through the internet. However, anyone on your WiFi network can access the server if they know the IP address. For sensitive files, only use this on trusted networks (like your home WiFi), not public WiFi.


#### Q. What file types and sizes are supported?

**A.** All file types are supported. The current limit is 100MB per file, which can be adjusted in server.js by changing the limits: { fileSize: ... } value in the multer configuration. For very large files, consider increasing this limit or splitting files.

#### Q. Why can't my phone connect to the server?

**A.** Make sure:

- Both devices are on the **same WiFi network (not mobile data)**
- Your firewall isn't blocking port 3000
- You're using the **network IP address (192.168.x.x:3000), not localhost**
- The **server is running** (check the terminal where you started it)
- Try the "Auto-Detect" button in settings

#### Q. Can I use this over the internet, not just local WiFi?

**A.** Not by default - it's designed for local network use. To access over the internet, you'd need to set up port forwarding on your router and use a dynamic DNS service, but this isn't recommended for security reasons unless you add authentication.



## Installation

### Prerequisites

    node --version  # Should be v14 or higher
    npm --version   # Should be v6 or higher
    
### Install and Run


#### 1. Download/clone the project:

    git clone https://github.com/DeathBlade-01/FileTransferServer.git
    cd file-transfer


#### 2. Install server dependencies:

    npm install express multer cors

#### 3. Start the server:

    node server.js
