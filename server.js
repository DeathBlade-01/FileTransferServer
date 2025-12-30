const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Use original filename with timestamp to prevent conflicts
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${sanitized}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve PWA files

// Store clipboard data in memory
let clipboardData = { text: '' };

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Upload file endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  console.log(`File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);
  res.json({ 
    success: true, 
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// List files endpoint
app.get('/files', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read files' });
    }
    
    const fileDetails = files.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      
      // Extract original filename (remove timestamp prefix)
      const originalName = filename.replace(/^\d+-/, '');
      
      return {
        name: filename,
        displayName: originalName,
        size: stats.size,
        modified: stats.mtime
      };
    });
    
    res.json({ files: fileDetails });
  });
});

// Download file endpoint
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  // Security check - prevent directory traversal
  if (!filePath.startsWith(uploadsDir)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Extract original filename for download
  const originalName = filename.replace(/^\d+-/, '');
  
  res.download(filePath, originalName, (err) => {
    if (err) {
      console.error('Download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
    } else {
      console.log(`File downloaded: ${filename}`);
    }
  });
});

// Delete file endpoint
app.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  // Security check
  if (!filePath.startsWith(uploadsDir)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete file' });
    }
    console.log(`File deleted: ${filename}`);
    res.json({ success: true });
  });
});

// Clipboard sync endpoints
app.post('/clipboard', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid text data' });
  }
  
  clipboardData.text = text;
  clipboardData.timestamp = Date.now();
  console.log('Clipboard updated:', text.substring(0, 50) + '...');
  
  res.json({ success: true });
});

app.get('/clipboard', (req, res) => {
  res.json(clipboardData);
});

// Get local IP address
async function getLocalIpAddress(retries=10,delay = 2500) {

// call os outside to prevent recalls
	const os = require('os')
	for(let i=0;i<retries;i++){
		const interfaces = os.networkInterfaces();
  		for (const name of Object.keys(interfaces)) {
    			for (const iface of interfaces[name]) {
     			 // Skip internal and non-IPv4 addresses
      				if (iface.family === 'IPv4' && !iface.internal) {
        				return iface.address;
     				 }
    			}
  		}

	console.log(`Not found IP address in try: ${i+1}/${retries}`);
	await new Promise(res=> setTimeout(res,delay));

	}
	console.log('Waited for so long... No networks found... :(');
    return 'localhost'; // IF IP is not found after so many attempts
}

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  const localIp = await getLocalIpAddress(10,2500);
  console.log('\n===========================================');
  console.log('📁 File Transfer Server Started');
  console.log('===========================================');
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://${localIp}:${PORT}`);
  console.log('===========================================');
  console.log(`\nUse the Network URL on your mobile device`);
  console.log('Make sure both devices are on the same WiFi\n');
});
