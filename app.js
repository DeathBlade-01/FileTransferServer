// State
let serverUrl = localStorage.getItem('serverUrl') || '';
let isConnected = false;

// DOM Elements
const elements = {
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  settingsBtn: document.getElementById('settingsBtn'),
  settingsPanel: document.getElementById('settingsPanel'),
  serverUrlInput: document.getElementById('serverUrl'),
  saveSettings: document.getElementById('saveSettings'),
  autoDetect: document.getElementById('autoDetect'),
  alert: document.getElementById('alert'),
  tabs: document.querySelectorAll('.tab'),
  tabContents: document.querySelectorAll('.tab-content'),
  uploadZone: document.getElementById('uploadZone'),
  fileInput: document.getElementById('fileInput'),
  refreshFiles: document.getElementById('refreshFiles'),
  fileList: document.getElementById('fileList'),
  clipboardInput: document.getElementById('clipboardInput'),
  syncClipboard: document.getElementById('syncClipboard'),
  clipboardOutput: document.getElementById('clipboardOutput'),
  copyClipboard: document.getElementById('copyClipboard'),
  pasteArea: document.getElementById('pasteArea')
};

// Initialize
init();

function init() {
  elements.serverUrlInput.value = serverUrl;
  attachEventListeners();
  
  if (serverUrl) {
    checkConnection();
    startAutoRefresh();
  } else {
    showSettings();
  }
}

function attachEventListeners() {
  // Settings
  elements.settingsBtn.addEventListener('click', toggleSettings);
  elements.saveSettings.addEventListener('click', saveSettings);
  elements.autoDetect.addEventListener('click', autoDetectServer);
  
  // Tabs
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
  
  // Upload
  elements.fileInput.addEventListener('change', handleFileUpload);
  elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
  
  // Drag and drop
  elements.uploadZone.addEventListener('dragover', handleDragOver);
  elements.uploadZone.addEventListener('dragleave', handleDragLeave);
  elements.uploadZone.addEventListener('drop', handleDrop);
  
  // Download
  elements.refreshFiles.addEventListener('click', fetchFiles);
  
  // Clipboard text
  elements.syncClipboard.addEventListener('click', uploadClipboard);
  elements.copyClipboard.addEventListener('click', copyToClipboard);
  
  // Clipboard paste (for images) - use document level to catch all pastes
  document.addEventListener('paste', handlePaste);
  
  // Focus indicator for paste area
  elements.pasteArea.addEventListener('click', () => {
    elements.pasteArea.focus();
  });
}

function showSettings() {
  elements.settingsPanel.classList.add('active');
}

function hideSettings() {
  elements.settingsPanel.classList.remove('active');
}

function toggleSettings() {
  elements.settingsPanel.classList.toggle('active');
}

async function autoDetectServer() {
  showAlert('🔍 Auto-detecting server...', 'success');
  
  // Try common local IP patterns
  const commonIPs = [
    'http://192.168.1.4:3000',
    'http://192.168.0.4:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ];
  
  for (const url of commonIPs) {
    try {
      const response = await fetch(`${url}/health`, { 
        method: 'GET',
        mode: 'cors',
        signal: AbortSignal.timeout(2000)
      });
      
      if (response.ok) {
        elements.serverUrlInput.value = url;
        showAlert(`✓ Found server at ${url}`, 'success');
        return;
      }
    } catch (error) {
      // Continue to next IP
    }
  }
  
  // Default to 192.168.1.4:3000 if nothing found
  elements.serverUrlInput.value = 'http://192.168.1.4:3000';
  showAlert('Set to default: http://192.168.1.4:3000', 'success');
}

function saveSettings() {
  const url = elements.serverUrlInput.value.trim();
  if (!url) {
    showAlert('Please enter a server URL', 'warning');
    return;
  }
  
  serverUrl = url;
  localStorage.setItem('serverUrl', url);
  hideSettings();
  checkConnection();
  startAutoRefresh();
  showAlert('Settings saved!', 'success');
}

async function checkConnection() {
  try {
    const response = await fetch(`${serverUrl}/health`, { 
      method: 'GET',
      mode: 'cors'
    });
    isConnected = response.ok;
  } catch (error) {
    isConnected = false;
  }
  updateConnectionStatus();
}

function updateConnectionStatus() {
  if (isConnected) {
    elements.statusDot.classList.add('connected');
    elements.statusText.textContent = 'Connected';
  } else {
    elements.statusDot.classList.remove('connected');
    elements.statusText.textContent = 'Disconnected';
  }
}

function switchTab(tabName) {
  // Update tabs
  elements.tabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  
  // Update content
  elements.tabContents.forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`${tabName}Tab`).classList.add('active');
  
  // Load data
  if (tabName === 'download') {
    fetchFiles();
  } else if (tabName === 'clipboard') {
    fetchClipboard();
  }
}

function handleDragOver(e) {
  e.preventDefault();
  elements.uploadZone.classList.add('dragging');
}

function handleDragLeave(e) {
  e.preventDefault();
  elements.uploadZone.classList.remove('dragging');
}

function handleDrop(e) {
  e.preventDefault();
  elements.uploadZone.classList.remove('dragging');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    uploadFiles(files);
  }
}

async function handleFileUpload(e) {
  const files = e.target.files;
  if (files.length > 0) {
    await uploadFiles(files);
    e.target.value = '';
  }
}

async function uploadFiles(files) {
  if (!isConnected) {
    showAlert('Not connected to server. Check settings.', 'warning');
    return;
  }
  
  for (let file of files) {
    await uploadSingleFile(file);
  }
}

async function uploadSingleFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    showAlert(`Uploading ${file.name}...`, 'success');
    
    const response = await fetch(`${serverUrl}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      showAlert(`✓ ${file.name} uploaded successfully!`, 'success');
    } else {
      showAlert(`✗ Failed to upload ${file.name}`, 'warning');
    }
  } catch (error) {
    showAlert(`✗ Upload failed: ${error.message}`, 'warning');
  }
}

async function fetchFiles() {
  if (!isConnected) return;
  
  try {
    const response = await fetch(`${serverUrl}/files`);
    if (response.ok) {
      const data = await response.json();
      displayFiles(data.files || []);
    }
  } catch (error) {
    console.error('Failed to fetch files:', error);
  }
}

function displayFiles(files) {
  if (files.length === 0) {
    elements.fileList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔭</div>
        <p>No files available</p>
      </div>
    `;
    return;
  }
  
  elements.fileList.innerHTML = files.map(file => `
    <div class="file-item">
      <div class="file-info">
        <div class="file-name" title="${escapeHtml(file.displayName)}">${escapeHtml(file.displayName)}</div>
        <div class="file-size">${formatFileSize(file.size)}</div>
      </div>
      <div class="file-actions">
        <button class="btn btn-primary btn-small" onclick="downloadFile('${escapeHtml(file.name)}', '${escapeHtml(file.displayName)}')">
          Download
        </button>
        <button class="btn btn-danger btn-small" onclick="deleteFile('${escapeHtml(file.name)}', '${escapeHtml(file.displayName)}')">
          Delete
        </button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function downloadFile(filename, displayName) {
  try {
    const response = await fetch(`${serverUrl}/download/${encodeURIComponent(filename)}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = displayName || filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showAlert('✓ File downloaded!', 'success');
  } catch (error) {
    showAlert('✗ Download failed', 'warning');
  }
}

async function deleteFile(filename, displayName) {
  if (!confirm(`Delete ${displayName || filename}?`)) return;
  
  try {
    await fetch(`${serverUrl}/delete/${encodeURIComponent(filename)}`, { 
      method: 'DELETE' 
    });
    showAlert('✓ File deleted', 'success');
    fetchFiles();
  } catch (error) {
    showAlert('✗ Delete failed', 'warning');
  }
}

async function handlePaste(e) {
  // Only handle paste when in clipboard tab
  const activeTab = document.querySelector('.tab.active');
  if (!activeTab || activeTab.dataset.tab !== 'clipboard') {
    return;
  }
  
  const items = e.clipboardData.items;
  
  for (let item of items) {
    // Handle images
    if (item.type.indexOf('image') !== -1) {
      e.preventDefault();
      
      if (!isConnected) {
        showAlert('Not connected to server. Check settings.', 'warning');
        return;
      }
      
      const blob = item.getAsFile();
      const timestamp = Date.now();
      const filename = `screenshot-${timestamp}.png`;
      
      // Create a File object from blob
      const file = new File([blob], filename, { type: blob.type });
      
      showAlert('📸 Image detected! Uploading...', 'success');
      await uploadSingleFile(file);
      return;
    }
  }
}

async function uploadClipboard() {
  const text = elements.clipboardInput.value.trim();
  if (!text) {
    showAlert('Please enter some text', 'warning');
    return;
  }
  
  if (!isConnected) {
    showAlert('Not connected to server', 'warning');
    return;
  }
  
  try {
    const response = await fetch(`${serverUrl}/clipboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    
    if (response.ok) {
      elements.clipboardInput.value = '';
      showAlert('✓ Clipboard synced!', 'success');
    }
  } catch (error) {
    showAlert('✗ Sync failed', 'warning');
  }
}

async function fetchClipboard() {
  if (!isConnected) return;
  
  try {
    const response = await fetch(`${serverUrl}/clipboard`);
    if (response.ok) {
      const data = await response.json();
      const text = data.text || '';
      elements.clipboardOutput.textContent = text;
      
      if (text) {
        elements.copyClipboard.style.display = 'block';
      } else {
        elements.copyClipboard.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Failed to fetch clipboard:', error);
  }
}

function copyToClipboard() {
  const text = elements.clipboardOutput.textContent;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showAlert('✓ Copied to clipboard!', 'success');
    });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showAlert('✓ Copied to clipboard!', 'success');
  }
}

function showAlert(message, type) {
  elements.alert.textContent = message;
  elements.alert.className = `alert ${type} active`;
  
  setTimeout(() => {
    elements.alert.classList.remove('active');
  }, 3000);
}

function startAutoRefresh() {
  // Check connection every 5 seconds
  setInterval(checkConnection, 5000);
  
  // Auto-refresh based on active tab
  setInterval(() => {
    if (!isConnected) return;
    
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
      if (activeTab.dataset.tab === 'download') {
        fetchFiles();
      } else if (activeTab.dataset.tab === 'clipboard') {
        fetchClipboard();
      }
    }
  }, 3000);
}

// Expose functions to window for inline onclick handlers
window.downloadFile = downloadFile;
window.deleteFile = deleteFile;