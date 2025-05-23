// File Uploads Functionality
let uploadedFiles = [];
let selectedFiles = [];

// DOM Elements
const uploadFileBtn = document.getElementById('upload-file-btn');
const fileUploadModal = document.getElementById('file-upload-modal');
const fileUploadForm = document.getElementById('file-upload-form');
const fileClientSelect = document.getElementById('file-client');
const fileCategorySelect = document.getElementById('file-category');
const fileDescription = document.getElementById('file-description');
const fileInput = document.getElementById('file-input');
const modalFileInput = document.getElementById('modal-file-input');
const uploadArea = document.getElementById('upload-area');
const modalUploadArea = document.getElementById('modal-upload-area');
const selectedFilesList = document.getElementById('selected-files-list');
const cancelUploadBtn = document.getElementById('cancel-upload');
const confirmUploadBtn = document.getElementById('confirm-upload');
const filesTableBody = document.getElementById('files-table-body');
const fileSearch = document.getElementById('file-search');
const fileFilter = document.getElementById('file-filter');

// File Preview Modal Elements
const filePreviewModal = document.getElementById('file-preview-modal');
const previewFileName = document.getElementById('preview-file-name');
const previewClient = document.getElementById('preview-client');
const previewType = document.getElementById('preview-type');
const previewSize = document.getElementById('preview-size');
const previewDate = document.getElementById('preview-date');
const previewDescription = document.getElementById('preview-description');
const previewContent = document.getElementById('file-preview-content');
const downloadFileLink = document.getElementById('download-file-link');
const deleteFileBtn = document.getElementById('delete-file-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load uploaded files from localStorage
    loadFiles();
    
    // Populate client dropdown
    populateClientDropdown();
    
    // Render initial files table
    renderFilesTable();
    
    // Event Listeners
    
    // Upload File button
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', openFileUploadModal);
    }
    
    // Cancel Upload button
    if (cancelUploadBtn) {
        cancelUploadBtn.addEventListener('click', closeFileUploadModal);
    }
    
    // Form submission
    if (fileUploadForm) {
        fileUploadForm.addEventListener('submit', handleFileUpload);
    }
    
    // File input change events
    if (fileInput) {
        fileInput.addEventListener('change', (e) => handleFileSelection(e.target.files, false));
        setupDropzone(uploadArea, fileInput, false);
    }
    
    if (modalFileInput) {
        modalFileInput.addEventListener('change', (e) => handleFileSelection(e.target.files, true));
        setupDropzone(modalUploadArea, modalFileInput, true);
    }
    
    // File search and filter
    if (fileSearch) {
        fileSearch.addEventListener('input', renderFilesTable);
    }
    
    if (fileFilter) {
        fileFilter.addEventListener('change', renderFilesTable);
    }
    
    // Delete file button
    if (deleteFileBtn) {
        deleteFileBtn.addEventListener('click', deleteCurrentFile);
    }
    
    // Close modals when clicking on X
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                if (modal.id === 'file-upload-modal') {
                    closeFileUploadModal();
                } else if (modal.id === 'file-preview-modal') {
                    closeFilePreviewModal();
                }
            }
        });
    });
});

// Functions

// Load files from localStorage
function loadFiles() {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
        try {
            uploadedFiles = JSON.parse(savedFiles);
        } catch (error) {
            console.error('Error loading files from localStorage:', error);
            uploadedFiles = [];
        }
    }
}

// Save files to localStorage
function saveFiles() {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
}

// Populate client dropdown
function populateClientDropdown() {
    if (!fileClientSelect) return;
    
    // Clear existing options except the default
    while (fileClientSelect.options.length > 1) {
        fileClientSelect.remove(1);
    }
    
    // Use the global clients array (defined in clients.js)
    if (typeof clients !== 'undefined' && clients && clients.length > 0) {
        // Add client options
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.name} (${client.businessName || 'N/A'})`;
            fileClientSelect.appendChild(option);
        });
    } else {
        // Fallback: Get clients from localStorage if global variable is not available
        const localClients = JSON.parse(localStorage.getItem('clients') || '[]');
        
        // Add client options
        localClients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = `${client.name} (${client.businessName || 'N/A'})`;
            fileClientSelect.appendChild(option);
        });
    }
}

// Load uploaded files from localStorage
function loadUploadedFiles() {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
        try {
            uploadedFiles = JSON.parse(savedFiles);
        } catch (error) {
            console.error('Error parsing saved files:', error);
            uploadedFiles = [];
        }
    } else {
        uploadedFiles = [];
    }
}

// Initialize file uploads
function initFileUploads() {
    // Initial load of uploaded files
    loadUploadedFiles();
    renderFilesTable(); // Changed from renderFileList to renderFilesTable which is the correct function name
    
    // Populate client dropdown
    populateClientDropdown();
    
    // Attach event listeners
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', openFileUploadModal);
    }
    
    if (fileUploadForm) {
        fileUploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            uploadFiles();
        });
    }
    
    if (cancelUpload) {
        cancelUpload.addEventListener('click', closeFileUploadModal);
    }
    
    if (confirmUpload) {
        confirmUpload.addEventListener('click', uploadFiles);
    }
    
    if (fileSearch) {
        fileSearch.addEventListener('input', filterFiles);
    }
    
    if (fileFilter) {
        fileFilter.addEventListener('change', filterFiles);
    }
}

// Open file upload modal
function openFileUploadModal() {
    // Reset form
    fileUploadForm.reset();
    selectedFiles = [];
    selectedFilesList.innerHTML = '';
    
    // Populate client dropdown
    populateClientDropdown();
    
    // Show modal
    fileUploadModal.classList.add('show');
}

// Close file upload modal
function closeFileUploadModal() {
    fileUploadModal.classList.remove('show');
    selectedFiles = [];
}

// Setup dropzone functionality
function setupDropzone(dropzone, input, isModal) {
    if (!dropzone || !input) return;
    
    // Click on dropzone to trigger file input
    dropzone.addEventListener('click', () => {
        input.click();
    });
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight dropzone when dragging over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.add('highlight');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.remove('highlight');
        }, false);
    });
    
    // Handle dropped files
    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFileSelection(files, isModal);
    }, false);
}

// Handle file selection
function handleFileSelection(files, isModal) {
    if (!files || files.length === 0) return;
    
    // Check file size (max 20MB)
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    const validFiles = Array.from(files).filter(file => file.size <= MAX_SIZE);
    
    if (validFiles.length < files.length) {
        showNotification('Some files exceeded the 20MB limit and were not added', 'error');
    }
    
    if (validFiles.length === 0) return;
    
    // Store selected files
    if (isModal) {
        // Add to selected files for modal
        selectedFiles = [...selectedFiles, ...validFiles];
        displaySelectedFiles();
    } else {
        // Direct upload from main dropzone
        selectedFiles = validFiles;
        openFileUploadModal();
        displaySelectedFiles();
    }
}

// Display selected files in the modal
function displaySelectedFiles() {
    if (!selectedFilesList) return;
    
    selectedFilesList.innerHTML = '';
    
    if (selectedFiles.length === 0) {
        selectedFilesList.innerHTML = '<p class="no-files">No files selected</p>';
        return;
    }
    
    // Create file list
    const fileList = document.createElement('ul');
    fileList.className = 'selected-files-ul';
    
    selectedFiles.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'selected-file-item';
        
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        
        const fileName = document.createElement('span');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        
        const fileSize = document.createElement('span');
        fileSize.className = 'file-size';
        fileSize.textContent = formatFileSize(file.size);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-file';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Remove file';
        removeBtn.addEventListener('click', () => {
            selectedFiles.splice(index, 1);
            displaySelectedFiles();
        });
        
        fileInfo.appendChild(fileName);
        fileInfo.appendChild(fileSize);
        listItem.appendChild(fileInfo);
        listItem.appendChild(removeBtn);
        fileList.appendChild(listItem);
    });
    
    selectedFilesList.appendChild(fileList);
}

// Handle file upload form submission
function handleFileUpload(e) {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
        showNotification('Please select at least one file to upload', 'error');
        return;
    }
    
    const clientId = fileClientSelect.value;
    if (!clientId) {
        showNotification('Please select a client', 'error');
        return;
    }
    
    // Get client details
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const client = clients.find(c => c.id === clientId);
    
    if (!client) {
        showNotification('Selected client not found', 'error');
        return;
    }
    
    // Get form values
    const category = fileCategorySelect.value;
    const description = fileDescription.value.trim();
    
    // Process each file
    selectedFiles.forEach(file => {
        // Create a new file entry
        const newFile = {
            id: generateFileId(),
            name: file.name,
            type: getFileType(file),
            size: file.size,
            uploadDate: new Date().toISOString(),
            clientId: clientId,
            clientName: client.name,
            category: category,
            description: description,
            dataUrl: null
        };
        
        // Read file as data URL (base64)
        const reader = new FileReader();
        reader.onload = function(event) {
            newFile.dataUrl = event.target.result;
            
            // Add to uploaded files
            uploadedFiles.push(newFile);
            
            // Save to localStorage
            saveFiles();
            
            // If this is the last file, close modal and refresh table
            if (selectedFiles.indexOf(file) === selectedFiles.length - 1) {
                renderFilesTable();
                closeFileUploadModal();
                showNotification('Files uploaded successfully');
            }
        };
        reader.readAsDataURL(file);
    });
}

// Render files table
function renderFilesTable() {
    if (!filesTableBody) return;
    
    // Get search and filter values
    const searchTerm = fileSearch ? fileSearch.value.toLowerCase() : '';
    const filterValue = fileFilter ? fileFilter.value : 'all';
    
    // Filter files
    let filteredFiles = [...uploadedFiles];
    
    // Apply search filter
    if (searchTerm) {
        filteredFiles = filteredFiles.filter(file => 
            file.name.toLowerCase().includes(searchTerm) || 
            file.clientName.toLowerCase().includes(searchTerm) ||
            (file.description && file.description.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply category filter
    if (filterValue !== 'all') {
        filteredFiles = filteredFiles.filter(file => {
            if (filterValue === 'documents') {
                return file.type === 'document' || file.type === 'pdf';
            } else if (filterValue === 'images') {
                return file.type === 'image';
            } else if (filterValue === 'spreadsheets') {
                return file.type === 'spreadsheet';
            } else if (filterValue === 'others') {
                return file.type !== 'document' && file.type !== 'pdf' && 
                       file.type !== 'image' && file.type !== 'spreadsheet';
            }
            return true;
        });
    }
    
    // Sort files by upload date (newest first)
    filteredFiles.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    // Render table
    if (filteredFiles.length === 0) {
        filesTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-table">No files found</td>
            </tr>
        `;
        return;
    }
    
    filesTableBody.innerHTML = filteredFiles.map(file => {
        return `
            <tr>
                <td>
                    <div class="file-name-cell">
                        <i class="fas ${getFileIcon(file.type)}"></i>
                        <span>${file.name}</span>
                    </div>
                </td>
                <td>${formatFileType(file.type)}</td>
                <td>${formatFileSize(file.size)}</td>
                <td>${formatDate(file.uploadDate)}</td>
                <td>${file.clientName}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon preview-file" data-id="${file.id}" title="Preview">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon download-file" data-id="${file.id}" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn-icon delete-file" data-id="${file.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.preview-file').forEach(btn => {
        btn.addEventListener('click', () => {
            const fileId = btn.getAttribute('data-id');
            openFilePreviewModal(fileId);
        });
    });
    
    document.querySelectorAll('.download-file').forEach(btn => {
        btn.addEventListener('click', () => {
            const fileId = btn.getAttribute('data-id');
            downloadFile(fileId);
        });
    });
    
    document.querySelectorAll('.delete-file').forEach(btn => {
        btn.addEventListener('click', () => {
            const fileId = btn.getAttribute('data-id');
            confirmDeleteFile(fileId);
        });
    });
}

// Open file preview modal
function openFilePreviewModal(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;
    
    // Populate file details
    previewFileName.textContent = file.name;
    previewClient.textContent = file.clientName;
    previewType.textContent = formatFileType(file.type);
    previewSize.textContent = formatFileSize(file.size);
    previewDate.textContent = formatDate(file.uploadDate);
    previewDescription.textContent = file.description || '-';
    
    // Set download link
    downloadFileLink.href = file.dataUrl;
    downloadFileLink.download = file.name;
    
    // Set file ID for delete button
    deleteFileBtn.setAttribute('data-id', file.id);
    
    // Render preview content based on file type
    renderPreviewContent(file);
    
    // Show modal
    filePreviewModal.classList.add('show');
}

// Render preview content based on file type
function renderPreviewContent(file) {
    previewContent.innerHTML = '';
    
    if (file.type === 'image') {
        // Image preview
        const img = document.createElement('img');
        img.src = file.dataUrl;
        img.alt = file.name;
        img.className = 'preview-image';
        previewContent.appendChild(img);
    } else if (file.type === 'pdf') {
        // PDF preview
        const iframe = document.createElement('iframe');
        iframe.src = file.dataUrl;
        iframe.className = 'preview-pdf';
        previewContent.appendChild(iframe);
    } else {
        // Generic file preview (icon)
        previewContent.innerHTML = `
            <div class="file-icon-preview">
                <i class="fas ${getFileIcon(file.type)} fa-5x"></i>
                <p>Preview not available for this file type</p>
                <p>Click the download button to view the file</p>
            </div>
        `;
    }
}

// Close file preview modal
function closeFilePreviewModal() {
    filePreviewModal.classList.remove('show');
}

// Download file
function downloadFile(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file || !file.dataUrl) return;
    
    const link = document.createElement('a');
    link.href = file.dataUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Confirm delete file
function confirmDeleteFile(fileId) {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;
    
    const confirmDelete = confirm(`Are you sure you want to delete "${file.name}"?`);
    if (confirmDelete) {
        deleteFile(fileId);
    }
}

// Delete file
function deleteFile(fileId) {
    const fileIndex = uploadedFiles.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;
    
    uploadedFiles.splice(fileIndex, 1);
    saveFiles();
    renderFilesTable();
    
    // Close preview modal if open
    closeFilePreviewModal();
    
    showNotification('File deleted successfully');
}

// Delete current file (from preview modal)
function deleteCurrentFile() {
    const fileId = deleteFileBtn.getAttribute('data-id');
    if (!fileId) return;
    
    confirmDeleteFile(fileId);
}

// Helper Functions

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get file type based on file extension
function getFileType(file) {
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Document types
    if (['pdf'].includes(extension)) {
        return 'pdf';
    } else if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension)) {
        return 'document';
    }
    
    // Image types
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
        return 'image';
    }
    
    // Spreadsheet types
    if (['xls', 'xlsx', 'csv', 'ods'].includes(extension)) {
        return 'spreadsheet';
    }
    
    return 'other';
}

// Get file icon
function getFileIcon(fileType) {
    switch (fileType) {
        case 'pdf':
            return 'fa-file-pdf';
        case 'document':
            return 'fa-file-word';
        case 'image':
            return 'fa-file-image';
        case 'spreadsheet':
            return 'fa-file-excel';
        default:
            return 'fa-file';
    }
}

// Format file type for display
function formatFileType(fileType) {
    switch (fileType) {
        case 'pdf':
            return 'PDF';
        case 'document':
            return 'Document';
        case 'image':
            return 'Image';
        case 'spreadsheet':
            return 'Spreadsheet';
        default:
            return 'Other';
    }
}

// Generate unique file ID
function generateFileId() {
    return 'file-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Show notification
function showNotification(message, type = 'success') {
    // Create a notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}
