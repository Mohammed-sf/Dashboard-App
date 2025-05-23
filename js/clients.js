// Client Management Functionality
let clients = [];
let currentClientId = null;
let currentTask = null;

// DOM Elements
const clientModal = document.getElementById('client-modal');
const clientForm = document.getElementById('client-form');
const clientModalTitle = document.getElementById('client-modal-title');
const addClientBtn = document.getElementById('add-client-btn');
const exportExcelBtn = document.getElementById('export-excel-btn');
const clientSearch = document.getElementById('client-search');
const clientFilter = document.getElementById('client-filter');
const clientTabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const clientsTableBody = document.getElementById('clients-table-body');
const cnssTableBody = document.getElementById('cnss-table-body');
const deleteConfirmationModal = document.getElementById('delete-confirmation-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const taskAssignmentModal = document.getElementById('task-assignment-modal');
const taskAssignmentForm = document.getElementById('task-assignment-form');
const addTaskBtn = document.getElementById('add-task-btn');
const assignedTasksList = document.getElementById('assigned-tasks-list');
const cancelClientBtn = document.getElementById('cancel-client-btn');
const saveClientBtn = document.getElementById('save-client-btn');
const cancelTaskBtn = document.getElementById('cancel-task-btn');
const saveTaskBtn = document.getElementById('save-task-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load clients data
    loadClients();

    // Add Client Button
    addClientBtn.addEventListener('click', () => {
        openClientModal();
    });

    // Export to Excel Button
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportToExcel);
    }

    // Client Search
    if (clientSearch) {
        clientSearch.addEventListener('input', filterClients);
    }

    // Client Filter
    if (clientFilter) {
        clientFilter.addEventListener('change', filterClients);
    }

    // Tab Buttons
    if (clientTabBtns) {
        clientTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                switchClientTab(tabName);
            });
        });
    }

    // Client Form Submission
    if (clientForm) {
        clientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveClient();
        });
    }

    // Task Assignment Form Submission
    if (taskAssignmentForm) {
        taskAssignmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveTask();
        });
    }

    // Cancel buttons
    if (cancelClientBtn) {
        cancelClientBtn.addEventListener('click', closeClientModal);
    }

    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener('click', closeTaskModal);
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }

    // Confirm Delete Button
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteClient);
    }

    // Add Task Button
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', openTaskModal);
    }

    // Close modals when clicking on X
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal && modal.id === 'client-modal') {
                closeClientModal();
            } else if (modal && modal.id === 'task-assignment-modal') {
                closeTaskModal();
            } else if (modal && modal.id === 'delete-confirmation-modal') {
                closeDeleteModal();
            }
        });
    });

    // Collapsible sections
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.closest('.collapsible-section');
            section.classList.toggle('open');
        });
    });
});

// Functions

// Load clients from localStorage
function loadClients() {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
        clients = JSON.parse(savedClients);
        renderClientTables();
    }
}

// Save clients to localStorage
function saveClients() {
    localStorage.setItem('clients', JSON.stringify(clients));
}

// Render client tables
function renderClientTables() {
    renderMainClientTable();
    renderCNSSTable();
}

// Render main client table
function renderMainClientTable() {
    if (clients.length === 0) {
        clientsTableBody.innerHTML = '<tr><td colspan="8" class="empty-table">No clients available</td></tr>';
        return;
    }

    // Filter clients based on search and filter
    const searchTerm = clientSearch ? clientSearch.value.toLowerCase() : '';
    // Set default filter to 'all' if not specified
    const filterValue = clientFilter && clientFilter.value ? clientFilter.value : 'all';
    
    const filteredClients = clients.filter(client => {
        // Only filter by search term - show all clients regardless of status
        const matchesSearch = 
            client.name.toLowerCase().includes(searchTerm) ||
            (client.email && client.email.toLowerCase().includes(searchTerm)) ||
            (client.phone && client.phone.toLowerCase().includes(searchTerm)) ||
            (client.dgiLogin && client.dgiLogin.toLowerCase().includes(searchTerm));
            
        // Always return true for filter - showing all clients
        return matchesSearch;
    });

    if (filteredClients.length === 0) {
        clientsTableBody.innerHTML = '<tr><td colspan="8" class="empty-table">No matching clients found</td></tr>';
        return;
    }

    // Generate table rows
    clientsTableBody.innerHTML = filteredClients.map(client => `
        <tr>
            <td>${client.name}</td>
            <td>
                <div>Login: ${client.dgiLogin}</div>
                <div>Password: <span class="password-text">${client.dgiPassword}</span></div>
            </td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td>${client.nif || '-'}</td>
            <td>${client.ice || '-'}</td>
            <td>${client.patent || '-'}</td>
            <td class="actions-cell">
                <button class="btn-icon edit-client" data-id="${client.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete-client" data-id="${client.id}"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');

    // Add event listeners to action buttons
    document.querySelectorAll('.edit-client').forEach(btn => {
        btn.addEventListener('click', () => {
            const clientId = btn.getAttribute('data-id');
            openClientModal(clientId);
        });
    });

    document.querySelectorAll('.delete-client').forEach(btn => {
        btn.addEventListener('click', () => {
            const clientId = btn.getAttribute('data-id');
            openDeleteModal(clientId);
        });
    });
}

// Render CNSS table
function renderCNSSTable() {
    const clientsWithCNSS = clients.filter(client => client.cnssLogin && client.cnssPassword);
    
    if (clientsWithCNSS.length === 0) {
        cnssTableBody.innerHTML = '<tr><td colspan="4" class="empty-table">No CNSS information available</td></tr>';
        return;
    }

    cnssTableBody.innerHTML = clientsWithCNSS.map(client => `
        <tr>
            <td>${client.name}</td>
            <td>${client.cnssLogin}</td>
            <td>${client.cnssPassword}</td>
            <td class="actions-cell">
                <button class="btn-icon edit-client" data-id="${client.id}"><i class="fas fa-edit"></i></button>
            </td>
        </tr>
    `).join('');

    // Add event listeners to edit buttons
    document.querySelectorAll('#cnss-table-body .edit-client').forEach(btn => {
        btn.addEventListener('click', () => {
            const clientId = btn.getAttribute('data-id');
            openClientModal(clientId);
        });
    });
}

// Mask password for display
function maskPassword(password) {
    if (!password) return '';
    return '•'.repeat(password.length);
}

// Filter clients based on search and filter
function filterClients() {
    // Always show all clients regardless of status
    // We'll only filter by search term now
    renderClientTables();
}

// Switch between client tabs
function switchClientTab(tabName) {
    // Update tab buttons
    clientTabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tab content
    tabContents.forEach(content => {
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Open client modal
function openClientModal(clientId = null) {
    // Reset form
    clientForm.reset();
    document.getElementById('client-id').value = '';
    
    // Reset all task checkboxes
    document.querySelectorAll('.task-type-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Set modal title based on whether we're adding or editing
    if (clientId) {
        clientModalTitle.textContent = getTranslationSafe('editClient');
        currentClientId = clientId;
        
        // Find client
        const client = clients.find(c => c.id === clientId);
        if (client) {
            // Populate form fields
            document.getElementById('client-id').value = client.id;
            document.getElementById('client-name').value = client.name;
            document.getElementById('client-email').value = client.email;
            document.getElementById('client-phone').value = client.phone;
            // client-status element was removed, no longer setting this value in the form
            document.getElementById('client-dgi-login').value = client.dgiLogin || '';
            document.getElementById('client-dgi-password').value = client.dgiPassword || '';
            document.getElementById('client-nif').value = client.nif || '';
            document.getElementById('client-ice').value = client.ice || '';
            document.getElementById('client-patent').value = client.patent || '';
            document.getElementById('client-cnss-login').value = client.cnssLogin || '';
            document.getElementById('client-cnss-password').value = client.cnssPassword || '';
            
            // Additional fields if they exist
            if (document.getElementById('client-business-name')) {
                document.getElementById('client-business-name').value = client.businessName || '';
            }
            
            if (document.getElementById('client-address')) {
                document.getElementById('client-address').value = client.address || '';
            }
            
            // Check the task checkboxes for assigned task types
            if (typeof clientTasks === 'object') {
                // Go through each task type and check if this client is assigned
                Object.keys(clientTasks).forEach(taskType => {
                    if (clientTasks[taskType] && clientTasks[taskType].includes(client.id)) {
                        // Find the checkbox for this task type and check it
                        const checkbox = document.querySelector(`.task-type-checkbox[value="${taskType}"]`);
                        if (checkbox) {
                            checkbox.checked = true;
                        }
                    }
                });
            }
        }
    } else {
        clientModalTitle.textContent = getTranslationSafe('addClient');
        currentClientId = null;
    }
    
    // Show modal
    clientModal.classList.add('show');
}

// Close client modal
function closeClientModal() {
    clientModal.classList.remove('show');
    currentClientId = null;
}

// Open task modal
function openTaskModal() {
    // Reset form
    taskAssignmentForm.reset();
    currentTask = null;
    
    // Show modal
    taskAssignmentModal.classList.add('show');
}

// Close task modal
function closeTaskModal() {
    taskAssignmentModal.classList.remove('show');
}

// Open delete confirmation modal
function openDeleteModal(clientId) {
    currentClientId = clientId;
    deleteConfirmationModal.classList.add('show');
}

// Close delete confirmation modal
function closeDeleteModal() {
    deleteConfirmationModal.classList.remove('show');
    currentClientId = null;
}

// Save client
function saveClient() {
    const clientId = document.getElementById('client-id').value;
    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    // Status field removed - always set to active
    const dgiLogin = document.getElementById('client-dgi-login').value.trim();
    const dgiPassword = document.getElementById('client-dgi-password').value.trim();
    const nif = document.getElementById('client-nif').value.trim();
    const ice = document.getElementById('client-ice').value.trim();
    const patent = document.getElementById('client-patent').value.trim();
    const cnssLogin = document.getElementById('client-cnss-login').value.trim();
    const cnssPassword = document.getElementById('client-cnss-password').value.trim();
    
    // Validate required fields
    if (!name || !email || !phone || !dgiLogin || !dgiPassword) {
        showNotification(getTranslationSafe('pleaseCompleteRequiredFields'), 'error');
        return;
    }
    
    // Create client object
    const client = {
        id: clientId || generateId(),
        name,
        email,
        phone,
        status: 'active', // Always set to active since we removed the status field
        dgiLogin,
        dgiPassword,
        nif,
        ice,
        patent,
        cnssLogin,
        cnssPassword,
        businessName: document.getElementById('client-business-name')?.value.trim() || '',
        address: document.getElementById('client-address')?.value.trim() || '',
        createdAt: clientId ? (clients.find(c => c.id === clientId)?.createdAt || Date.now()) : Date.now(),
        updatedAt: Date.now()
    };
    
    // Get selected task types from checkboxes if they exist
    const taskTypeCheckboxes = document.querySelectorAll('.task-type-checkbox:checked');
    const selectedTaskTypes = [];
    
    if (taskTypeCheckboxes && taskTypeCheckboxes.length > 0) {
        taskTypeCheckboxes.forEach(checkbox => {
            selectedTaskTypes.push(checkbox.value);
        });
    }
    
    // Update existing client or add new one
    const isNewClient = !clientId;
    if (clientId) {
        // Update client
        const index = clients.findIndex(c => c.id === clientId);
        if (index !== -1) {
            clients[index] = client;
        }
        
        showNotification(getTranslationSafe('clientUpdated'));
        // Add activity for client update
        if (typeof addActivity === 'function') {
            addActivity('client-edit', `Client ${client.name} was updated`);
        }
    } else {
        // Add new client
        clients.push(client);
        showNotification(getTranslationSafe('clientAdded'));
        // Add activity for new client
        if (typeof addActivity === 'function') {
            addActivity('client-add', `New client ${client.name} was added`);
        }
    }
    
    // Save to localStorage
    saveClients();
    
    // Assign selected tasks to the client if we have them
    if (selectedTaskTypes.length > 0 && typeof clientTasks !== 'undefined') {
        selectedTaskTypes.forEach(taskType => {
            // Initialize this task type if it doesn't exist
            if (!clientTasks[taskType]) {
                clientTasks[taskType] = [];
            }
            
            // Add client to this task type if not already assigned
            if (!clientTasks[taskType].includes(client.id)) {
                clientTasks[taskType].push(client.id);
            }
        });
        
        // Save client task assignments
        if (typeof saveTasks === 'function') {
            saveTasks();
            // Add activity for task assignment
            if (typeof addActivity === 'function') {
                addActivity('task-assign', `Tasks assigned to client ${client.name}`);
            }
        }
    }
    
    // Update tables
    renderClientTables();
    
    // Update dashboard stats if on home page
    if (typeof updateDashboardStats === 'function') {
        updateDashboardStats();
    }
    
    // Close modal
    closeClientModal();
}

// Save task
function saveTask() {
    const taskType = document.getElementById('task-type').value;
    const dueDate = document.getElementById('task-due-date').value;
    const description = document.getElementById('task-description').value.trim();
    
    // Validate required fields
    if (!taskType || !dueDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Create task object
    const task = {
        id: generateId(),
        type: taskType,
        dueDate,
        description,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Find client
    const index = clients.findIndex(c => c.id === currentClientId);
    if (index !== -1) {
        // Initialize tasks array if it doesn't exist
        if (!clients[index].tasks) {
            clients[index].tasks = [];
        }
        
        // Add task
        clients[index].tasks.push(task);
        
        // Save to localStorage
        saveClients();
        
        // Render assigned tasks
        renderAssignedTasks(clients[index].tasks);
        
        showNotification('Task assigned successfully');
    }
    
    // Close modal
    closeTaskModal();
}

// Delete client
function deleteClient() {
    if (currentClientId) {
        // Remove client
        clients = clients.filter(c => c.id !== currentClientId);
        
        // Save to localStorage
        saveClients();
        
        // Update tables
        renderClientTables();
        
        showNotification('Client deleted successfully');
    }
    
    // Close modal
    closeDeleteModal();
}

// Render assigned tasks
function renderAssignedTasks(tasks) {
    if (!tasks || tasks.length === 0) {
        assignedTasksList.innerHTML = '<p class="no-tasks-message">No tasks assigned</p>';
        return;
    }
    
    assignedTasksList.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-info">
                <div class="task-title">${task.type}</div>
                <div class="task-due-date">Due: ${formatDate(task.dueDate)}</div>
            </div>
            <div class="task-actions">
                <button class="btn-icon delete-task" data-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-task').forEach(btn => {
        btn.addEventListener('click', () => {
            const taskId = btn.getAttribute('data-id');
            deleteTask(taskId);
        });
    });
}

// Delete task
function deleteTask(taskId) {
    // Find client
    const index = clients.findIndex(c => c.id === currentClientId);
    if (index !== -1 && clients[index].tasks) {
        // Remove task
        clients[index].tasks = clients[index].tasks.filter(t => t.id !== taskId);
        
        // Save to localStorage
        saveClients();
        
        // Render assigned tasks
        renderAssignedTasks(clients[index].tasks);
        
        showNotification('Task removed successfully');
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Export clients to Excel
function exportToExcel() {
    if (clients.length === 0) {
        showNotification('No clients to export', 'error');
        return;
    }
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add headers
    csvContent += 'Name,Email,Phone,Status,DGI Login,NIF,ICE,PATENT,CNSS Login\n';
    
    // Add client data
    clients.forEach(client => {
        csvContent += `${client.name},${client.email},${client.phone},${client.status},${client.dgiLogin},${client.nif || ''},${client.ice || ''},${client.patent || ''},${client.cnssLogin || ''}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clients_export_${formatDateForFilename(new Date())}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Remove link
    document.body.removeChild(link);
    
    showNotification('Clients exported successfully');
}

// Format date for filename
function formatDateForFilename(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
