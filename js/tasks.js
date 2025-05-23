// Task Management Functionality

// Helper function to get the previous month (for declaration tasks)
function getPreviousMonth(month) {
    return month === 0 ? 11 : month - 1; // If January (0), return December (11), else return previous month
}

// Initialize task variables
let yearlyTasks = {};
let clientTasks = {};
let currentTaskType = 'TVA Mensuel';
let currentYear = new Date().getFullYear().toString();
let currentMonth = new Date().getMonth(); // 0-indexed month (0 = January)
let displayMonth = getPreviousMonth(currentMonth); // Always show previous month's tasks for declarations

// Make sure clientTasks is initialized early
function initTasks() {
    // Load tasks data from localStorage
    const savedClientTasks = localStorage.getItem('clientTasks');
    if (savedClientTasks) {
        clientTasks = JSON.parse(savedClientTasks);
    } else {
        clientTasks = {};
        // Initialize for all task types
        ['TVA Mensuel', 'TVA Trimestrielle', 'CNSS', 'IS', 'IR', 'Patent', 'Etat 9000', 'Acompte'].forEach(type => {
            clientTasks[type] = [];
        });
    }
    
    // Load yearly tasks
    const savedYearlyTasks = localStorage.getItem('yearlyTasks');
    if (savedYearlyTasks) {
        yearlyTasks = JSON.parse(savedYearlyTasks);
    } else {
        yearlyTasks = {};
    }
}
// clients array is already defined in clients.js

// Task type definitions with their deadlines
const taskTypes = {
    'TVA Mensuel': {
        periods: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        getDeadline: (year, period) => {
            // 31st of next month
            const periodIndex = taskTypes['TVA Mensuel'].periods.indexOf(period);
            const nextMonthIndex = (periodIndex + 1) % 12;
            const deadlineMonth = nextMonthIndex + 1; // 1-based month
            const nextYear = nextMonthIndex === 0 ? parseInt(year) + 1 : year;
            
            // Check if the deadline month has 31 days
            return `${nextYear}-${String(deadlineMonth).padStart(2, '0')}-31`;
        }
    },
    'TVA Trimestrielle': {
        periods: ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'],
        getDeadline: (year, period) => {
            // 31st after quarter
            switch(period) {
                case 'Q1 (Jan-Mar)': return `${year}-04-30`;
                case 'Q2 (Apr-Jun)': return `${year}-07-31`;
                case 'Q3 (Jul-Sep)': return `${year}-10-31`;
                case 'Q4 (Oct-Dec)': return `${parseInt(year) + 1}-01-31`;
            }
        }
    },
    'CNSS': {
        periods: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        getDeadline: (year, period) => {
            // 21st to 10th of next month
            const periodIndex = taskTypes['CNSS'].periods.indexOf(period);
            const nextMonthIndex = (periodIndex + 1) % 12;
            const deadlineMonth = nextMonthIndex + 1; // 1-based month
            const nextYear = nextMonthIndex === 0 ? parseInt(year) + 1 : year;
            
            return `${nextYear}-${String(deadlineMonth).padStart(2, '0')}-10`;
        }
    },
    'IS': {
        periods: ['Annual'],
        getDeadline: (year) => `${parseInt(year) + 1}-03-31` // 31/03 of next year
    },
    'IR': {
        periods: ['Annual'],
        getDeadline: (year) => `${parseInt(year) + 1}-04-30` // 30/04 of next year
    },
    'Acompte': {
        periods: ['Q1', 'Q2', 'Q3', 'Q4'],
        getDeadline: (year, period) => {
            // Q1: 31/03, Q2: 30/06, Q3: 30/09, Q4: 31/12
            switch(period) {
                case 'Q1': return `${year}-03-31`;
                case 'Q2': return `${year}-06-30`;
                case 'Q3': return `${year}-09-30`;
                case 'Q4': return `${year}-12-31`;
            }
        }
    },
    'Patent': {
        periods: ['Annual'],
        getDeadline: (year) => `${year}-06-30` // 30/06
    },
    'Etat 9000': {
        periods: ['Annual'],
        getDeadline: (year) => {
            // 28/02 or 29/02 for leap years
            const nextYear = parseInt(year) + 1;
            const isLeapYear = (nextYear % 4 === 0 && nextYear % 100 !== 0) || nextYear % 400 === 0;
            const day = isLeapYear ? '29' : '28';
            return `${nextYear}-02-${day}`;
        }
    }
};

// DOM Elements
const currentMonthYearDisplay = document.getElementById('current-month-year');
const taskPeriodDisplay = document.getElementById('task-period-display');
const taskTypeBtns = document.querySelectorAll('.task-type-btn');
const taskListTitle = document.getElementById('task-list-title');
const tasksTableBody = document.getElementById('tasks-table-body');
const addClientTaskBtn = document.getElementById('add-client-task-btn');
const taskStatusModal = document.getElementById('task-status-modal');
const taskStatusForm = document.getElementById('task-status-form');
const updateTaskId = document.getElementById('update-task-id');
const updateTaskType = document.getElementById('update-task-type');
const updateClientId = document.getElementById('update-client-id');
const taskStatus = document.getElementById('task-status');
const taskNotes = document.getElementById('task-notes');
const cancelStatusUpdate = document.getElementById('cancel-status-update');
const saveStatusUpdate = document.getElementById('save-status-update');

// Client Task Modal Elements
const clientTaskModal = document.getElementById('client-task-modal');
const taskTypeDisplay = document.getElementById('task-type-display');
const taskPeriodLabel = document.getElementById('task-period-label');
const selectAllClientsCheckbox = document.getElementById('select-all-clients');
const clientSelectionBody = document.getElementById('client-selection-body');
const cancelClientTaskBtn = document.getElementById('cancel-client-task');
const assignClientTaskBtn = document.getElementById('assign-client-task');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Call initTasks to ensure clientTasks and yearlyTasks are properly initialized first
    initTasks();
    // Initialize task variables
    loadTasks();
    
    // We need to ensure clients are loaded before rendering tasks
    // This function is defined in clients.js
    if (typeof loadClients === 'function') {
        loadClients();
    }
    
    // Get DOM elements month/year display
    const currentDate = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Set display values
    currentMonthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Set current declaration period based on task type
    updateDeclarationPeriod();
    
    // Render initial tasks
    renderTasks();
    
    // Task Type Buttons
    taskTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const taskType = btn.getAttribute('data-type');
            switchTaskType(taskType);
        });
    });
    
    // Add Client Task Button
    if (addClientTaskBtn) {
        addClientTaskBtn.addEventListener('click', openClientTaskModal);
    }
    
    // Task Status Form Submission
    taskStatusForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateTaskStatusAndNotes();
    });
    
    // Cancel Status Update
    cancelStatusUpdate.addEventListener('click', closeTaskStatusModal);
    
    // Select All Clients Checkbox
    if (selectAllClientsCheckbox) {
        selectAllClientsCheckbox.addEventListener('change', () => {
            const checkboxes = document.querySelectorAll('#client-selection-body input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllClientsCheckbox.checked;
            });
        });
    }
    
    // Cancel Client Task Button
    if (cancelClientTaskBtn) {
        cancelClientTaskBtn.addEventListener('click', closeClientTaskModal);
    }
    
    // Assign Client Task Button
    if (assignClientTaskBtn) {
        assignClientTaskBtn.addEventListener('click', assignClientTasks);
    }
    
    // Close modals when clicking on X
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                if (modal.id === 'task-status-modal') {
                    closeTaskStatusModal();
                } else if (modal.id === 'client-task-modal') {
                    closeClientTaskModal();
                }
            }
        });
    });
});

// Functions

// Load clients from localStorage
function loadClients() {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
        clients = JSON.parse(savedClients);
    }
}

// Load tasks from localStorage
function loadTasks() {
    // Call our initialization function
    initTasks();
    
    // Make sure we have at least an empty array for each task type
    if (!clientTasks['TVA Mensuel']) clientTasks['TVA Mensuel'] = [];
    if (!clientTasks['TVA Trimestrielle']) clientTasks['TVA Trimestrielle'] = [];
    if (!clientTasks['CNSS']) clientTasks['CNSS'] = [];
    if (!clientTasks['IS']) clientTasks['IS'] = [];
    if (!clientTasks['IR']) clientTasks['IR'] = [];
    if (!clientTasks['Patent']) clientTasks['Patent'] = [];
    if (!clientTasks['Etat 9000']) clientTasks['Etat 9000'] = [];
    if (!clientTasks['Acompte']) clientTasks['Acompte'] = [];
}

// Update the declaration period based on current month and task type
function updateDeclarationPeriod() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let declarationPeriod = '';
    let declarationYear = currentYear;
    
    switch (currentTaskType) {
        case 'TVA Mensuel':
            // Always show previous month for declarations
            // This ensures that when in May 2025, we see April 2025 tasks
            displayMonth = getPreviousMonth(currentMonth);
            declarationYear = displayMonth === 11 && currentMonth === 0 ? (parseInt(currentYear) - 1).toString() : currentYear;
            declarationPeriod = monthNames[displayMonth] + ' ' + declarationYear;
            
            // Update task list title to show it's for the previous month
            if (taskListTitle) {
                taskListTitle.textContent = `${currentTaskType} - ${declarationPeriod}`;
            }
            break;
            
        case 'TVA Trimestrielle':
            // Current quarter
            const currentQuarter = Math.floor(currentMonth / 3) + 1;
            const quarterMap = {
                1: 'Q1 (Jan-Mar)',
                2: 'Q2 (Apr-Jun)',
                3: 'Q3 (Jul-Sep)',
                4: 'Q4 (Oct-Dec)'
            };
            declarationPeriod = quarterMap[currentQuarter] + ' ' + currentYear;
            break;
            
        case 'CNSS':
            // Previous month (same as TVA Mensuel)
            displayMonth = getPreviousMonth(currentMonth);
            declarationYear = displayMonth === 11 && currentMonth === 0 ? (parseInt(currentYear) - 1).toString() : currentYear;
            declarationPeriod = monthNames[displayMonth] + ' ' + declarationYear;
            
            // Update task list title to show it's for the previous month
            if (taskListTitle) {
                taskListTitle.textContent = `${currentTaskType} - ${declarationPeriod}`;
            }
            break;
            
        case 'IS':
        case 'IR':
        case 'Patent':
        case 'Etat 9000':
            // Annual
            declarationPeriod = 'Annual ' + currentYear;
            break;
            
        case 'Acompte':
            // Current quarter for Acompte
            const acompteQuarter = Math.floor(currentMonth / 3) + 1;
            declarationPeriod = 'Q' + acompteQuarter + ' ' + currentYear;
            break;
    }
    
    // Update UI
    if (taskPeriodDisplay) {
        taskPeriodDisplay.textContent = declarationPeriod;
    }
    
    if (taskListTitle) {
        taskListTitle.textContent = `${currentTaskType} - ${declarationPeriod}`;
    }
    
    return declarationPeriod;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('yearlyTasks', JSON.stringify(yearlyTasks));
    localStorage.setItem('clientTasks', JSON.stringify(clientTasks));
}

// Switch task type
function switchTaskType(taskType) {
    // Update current task type
    currentTaskType = taskType;
    
    // Update active button
    taskTypeBtns.forEach(btn => {
        if (btn.getAttribute('data-type') === taskType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update declaration period for the selected task type
    updateDeclarationPeriod();
    
    // Render tasks
    renderTasks();
}

// Render tasks
function renderTasks() {
    // First ensure clientTasks is initialized
    if (!clientTasks) clientTasks = {};
    if (!clientTasks[currentTaskType]) clientTasks[currentTaskType] = [];
    
    // Update task list title
    if (taskListTitle) {
        taskListTitle.textContent = `${currentTaskType} - ${currentYear}`;
    }
    
    // Get the current period for this task type (e.g., 'April' for TVA Mensuel)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentPeriod = monthNames[displayMonth];
    
    // Create tasks for all assigned clients if needed
    if (clientTasks[currentTaskType] && clientTasks[currentTaskType].length > 0) {
        // Make sure the structure exists
        if (!yearlyTasks[currentYear]) yearlyTasks[currentYear] = {};
        if (!yearlyTasks[currentYear][currentTaskType]) yearlyTasks[currentYear][currentTaskType] = [];
        
        // Create tasks for each client for this period
        clientTasks[currentTaskType].forEach(clientId => {
            const client = clients.find(c => c.id === clientId);
            if (client) {
                const taskId = `${currentTaskType}-${currentYear}-${currentPeriod}-${clientId}`;
                const existingTask = yearlyTasks[currentYear][currentTaskType].find(t => t.id === taskId);
                
                if (!existingTask) {
                    // Calculate deadline
                    let deadline = null;
                    if (taskTypes[currentTaskType] && taskTypes[currentTaskType].getDeadline) {
                        deadline = taskTypes[currentTaskType].getDeadline(currentYear, currentPeriod);
                    }
                    
                    // Create task
                    const task = {
                        id: taskId,
                        type: currentTaskType,
                        period: currentPeriod,
                        year: currentYear,
                        deadline: deadline,
                        clientStatuses: {
                            [clientId]: {
                                status: 'Not Started',
                                notes: '',
                                lastUpdated: Date.now()
                            }
                        }
                    };
                    
                    yearlyTasks[currentYear][currentTaskType].push(task);
                }
            }
        });
        
        // Save tasks
        saveTasks();
    }
    
    // Check if tasks exist for current year and type
    if (!yearlyTasks[currentYear] || !yearlyTasks[currentYear][currentTaskType] || yearlyTasks[currentYear][currentTaskType].length === 0) {
        if (tasksTableBody) {
            tasksTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-table">No tasks available for ${currentTaskType} in ${currentYear}. Click "Create Year Tasks" to create them.</td>
                </tr>
            `;
        }
        return;
    }
    
    // Get the current declaration period
    const declarationPeriod = taskPeriodDisplay.textContent;
    
    // Find clients assigned to the current task type
    const assignedClients = [];
    
    // Check if we have client tasks for this task type
    if (clientTasks[currentTaskType]) {
        // Find clients who are assigned to this task type
        clients.forEach(client => {
            if (clientTasks[currentTaskType].includes(client.id)) {
                assignedClients.push(client);
            }
        });
    }
    
    // Check if any clients are assigned to this task type
    if (assignedClients.length === 0) {
        tasksTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">No clients assigned to ${currentTaskType}</td>
            </tr>
        `;
        return;
    }
    
    // Determine the appropriate period based on task type
    let period;
    if (['TVA Mensuel', 'CNSS'].includes(currentTaskType)) {
        // Extract month from declaration period (e.g., "April 2025")
        period = declarationPeriod.split(' ')[0];
    } else if (currentTaskType === 'TVA Trimestrielle') {
        // Extract quarter from declaration period (e.g., "Q2 (Apr-Jun) 2025")
        period = declarationPeriod.split(' ')[0] + ' ' + declarationPeriod.split(' ')[1];
    } else if (currentTaskType === 'Acompte') {
        // Extract quarter from declaration period (e.g., "Q1 2025")
        period = declarationPeriod.split(' ')[0];
    } else {
        // Annual tasks
        period = 'Annual';
    }
    
    // Get tasks for the selected period
    function getTasksForPeriod(taskType, period) {
        if (!yearlyTasks[currentYear] || !yearlyTasks[currentYear][taskType]) {
            return [];
        }
        
        return yearlyTasks[currentYear][taskType].filter(task => task.period === period);
    }

    // Create tasks for a specific period and task type
    function createTasksForPeriod(taskType, period) {
        // Make sure the structures exist
        if (!yearlyTasks[currentYear]) {
            yearlyTasks[currentYear] = {};
        }
        
        if (!yearlyTasks[currentYear][taskType]) {
            yearlyTasks[currentYear][taskType] = [];
        }
        
        // Get clients assigned to this task type
        if (!clientTasks[taskType]) {
            clientTasks[taskType] = [];
        }
        
        // For each client assigned to this task type, create a task if it doesn't exist
        clientTasks[taskType].forEach(clientId => {
            const client = clients.find(c => c.id === clientId);
            if (client) {
                // Generate unique task ID
                const taskId = `${taskType}-${currentYear}-${period}-${clientId}`;
                
                // Check if task already exists
                const existingTask = yearlyTasks[currentYear][taskType].find(t => t.id === taskId);
                
                if (!existingTask) {
                    // Calculate deadline based on task type
                    let deadline = null;
                    if (taskTypes[taskType] && taskTypes[taskType].getDeadline) {
                        deadline = taskTypes[taskType].getDeadline(currentYear, period);
                    }
                    
                    // Create new task
                    const task = {
                        id: taskId,
                        type: taskType,
                        period: period,
                        year: currentYear,
                        deadline: deadline,
                        clientStatuses: {
                            [clientId]: {
                                status: 'Not Started',
                                notes: '',
                                lastUpdated: Date.now()
                            }
                        }
                    };
                    
                    // Add task to yearly tasks
                    yearlyTasks[currentYear][taskType].push(task);
                }
            }
        });
        
        // Save tasks
        saveTasks();
    }

    // Initialize tasks for the period if they don't exist
    if (!yearlyTasks[currentYear]) {
        yearlyTasks[currentYear] = {};
    }
    
    if (!yearlyTasks[currentYear][currentTaskType]) {
        yearlyTasks[currentYear][currentTaskType] = [];
    }
    
    // Check if we have tasks for each assigned client
    let clientTasks = [];
    assignedClients.forEach(client => {
        // Generate task ID for this client and period
        const taskId = generateTaskId(currentTaskType, currentYear, period, client.id);
        
        // Check if task exists
        let task = yearlyTasks[currentYear][currentTaskType].find(t => t.id === taskId);
        
        if (!task) {
            // Create task for this client
            task = createTaskForClient(client, period);
            yearlyTasks[currentYear][currentTaskType].push(task);
        }
        
        clientTasks.push({
            ...task,
            clientName: client.name,
            clientId: client.id
        });
    });
    
    // Save tasks
    saveTasks();
    
    // Render client tasks
    if (clientTasks.length === 0) {
        tasksTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">No tasks available for this period</td>
            </tr>
        `;
        return;
    }
    
    // Render tasks
    tasksTableBody.innerHTML = clientTasks.map(task => {
        const statusClass = {
            'Not Started': 'status-not-started',
            'In Progress': 'status-in-progress',
            'Done': 'status-done'
        }[task.status] || '';
        
        return `
            <tr>
                <td>${task.clientName}</td>
                <td>${formatDate(task.deadline)}</td>
                <td>
                    <span class="status-badge ${statusClass}">${task.status}</span>
                </td>
                <td>${task.notes || '-'}</td>
                <td>
                    <button class="btn-icon update-task-status" data-id="${task.id}" data-type="${currentTaskType}" data-client-id="${task.clientId}">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.update-task-status').forEach(btn => {
        btn.addEventListener('click', () => {
            const taskId = btn.getAttribute('data-id');
            const taskType = btn.getAttribute('data-type');
            const clientId = btn.getAttribute('data-client-id');
            openTaskStatusModal(taskId, taskType, clientId);
        });
    });
}

// Create year tasks
function createYearTasks() {
    // Check if tasks already exist for the selected year
    if (yearlyTasks[currentYear] && yearlyTasks[currentYear][currentTaskType] && yearlyTasks[currentYear][currentTaskType].length > 0) {
        const confirmCreate = confirm(`Tasks for ${currentTaskType} in ${currentYear} already exist. Do you want to recreate them? This will reset all statuses and notes.`);
        if (!confirmCreate) return;
    }
    
    // Initialize year if it doesn't exist
    if (!yearlyTasks[currentYear]) {
        yearlyTasks[currentYear] = {};
    }
    
    // Create tasks for current type
    const typeConfig = taskTypes[currentTaskType];
    yearlyTasks[currentYear][currentTaskType] = typeConfig.periods.map(period => {
        const deadline = typeof typeConfig.getDeadline === 'function' && typeConfig.periods.length > 1 
            ? typeConfig.getDeadline(currentYear, period)
            : typeConfig.getDeadline(currentYear);
            
        return {
            id: `${currentTaskType}-${currentYear}-${period}`.replace(/[^a-zA-Z0-9]/g, '-'),
            period: period,
            deadline: deadline,
            status: 'Not Started',
            notes: '',
            createdAt: new Date().toISOString()
        };
    });
    
    // Save tasks
    saveTasks();
    
    // Render tasks
    renderTasks();
    
    // Show notification
    showNotification(`Tasks for ${currentTaskType} in ${currentYear} created successfully`);
}

// Open task status modal
function openTaskStatusModal(taskId, taskType, clientId) {
    // Find task
    const task = yearlyTasks[currentYear][taskType].find(t => t.id === taskId);
    if (!task) return;
    
    // Find client
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    // Populate form
    updateTaskId.value = taskId;
    updateTaskType.value = taskType;
    updateClientId.value = clientId;
    taskStatus.value = task.status;
    taskNotes.value = task.notes || '';
    
    // Update modal title to include client name
    const modalTitle = document.querySelector('#task-status-modal .modal-header h2');
    if (modalTitle) {
        modalTitle.textContent = `Update Task Status: ${client.name}`;
    }
    
    // Show modal
    taskStatusModal.classList.add('show');
}

// Close task status modal
function closeTaskStatusModal() {
    taskStatusModal.classList.remove('show');
}

// Update task status and notes
function updateTaskStatusAndNotes() {
    const taskId = updateTaskId.value;
    const taskType = updateTaskType.value;
    const clientId = updateClientId.value;
    const status = taskStatus.value;
    const notes = taskNotes.value.trim();
    
    // Find task
    const taskIndex = yearlyTasks[currentYear][taskType].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    // Update task
    yearlyTasks[currentYear][taskType][taskIndex].status = status;
    yearlyTasks[currentYear][taskType][taskIndex].notes = notes;
    yearlyTasks[currentYear][taskType][taskIndex].updatedAt = new Date().toISOString();
    
    // Save tasks
    saveTasks();
    
    // Render tasks
    renderTasks();
    
    // Close modal
    closeTaskStatusModal();
    
    // Find client name
    const client = clients.find(c => c.id === clientId);
    const clientName = client ? client.name : 'Client';
    
    // Show notification
    showNotification(`Task status for ${clientName} updated successfully`);
}

// Client Task Modal Functions

// Open client task modal
function openClientTaskModal() {
    // Update modal title with current task type and period
    if (taskTypeDisplay) {
        taskTypeDisplay.textContent = currentTaskType;
    }
    
    if (taskPeriodLabel) {
        taskPeriodLabel.textContent = taskPeriodDisplay.textContent;
    }
    
    // Load clients into the selection table
    loadClientSelectionTable();
    
    // Show modal
    if (clientTaskModal) {
        clientTaskModal.classList.add('show');
    }
}

// Close client task modal
function closeClientTaskModal() {
    // Reset the select all checkbox
    if (selectAllClientsCheckbox) {
        selectAllClientsCheckbox.checked = false;
    }
    
    // Close modal
    if (clientTaskModal) {
        clientTaskModal.classList.remove('show');
    }
}

// Load clients into the selection table
function loadClientSelectionTable() {
    if (!clientSelectionBody) return;
    
    // Check if we have clients
    if (clients.length === 0) {
        clientSelectionBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-table">No clients available</td>
            </tr>
        `;
        return;
    }
    
    // Make sure clientTasks[currentTaskType] exists
    if (!clientTasks[currentTaskType]) {
        clientTasks[currentTaskType] = [];
    }
    
    // Get assigned clients for this task type
    const assignedClientIds = clientTasks[currentTaskType] || [];
    
    // Render clients
    clientSelectionBody.innerHTML = clients.map(client => {
        const isChecked = assignedClientIds.includes(client.id);
        const currentStatus = isChecked ? 'Assigned' : 'Not Assigned';
        const statusClass = isChecked ? 'status-done' : 'status-not-started';
        
        return `
            <tr>
                <td>
                    <input type="checkbox" data-id="${client.id}" ${isChecked ? 'checked' : ''}>
                </td>
                <td>${client.name}</td>
                <td>${client.email || '-'}</td>
                <td><span class="status-badge ${statusClass}">${currentStatus}</span></td>
            </tr>
        `;
    }).join('');
}

// Assign client tasks to selected task type
function assignClientTasks() {
    // Get selected clients
    const selectedClientIds = [];
    document.querySelectorAll('#client-selection-body input[type="checkbox"]:checked').forEach(checkbox => {
        selectedClientIds.push(checkbox.getAttribute('data-id'));
    });
    
    // If no clients selected, show error
    if (selectedClientIds.length === 0) {
        showNotification('Please select at least one client', 'error');
        return;
    }
    
    // Add clients to the task type
    if (!clientTasks[currentTaskType]) {
        clientTasks[currentTaskType] = [];
    }
    
    // Add selected clients
    selectedClientIds.forEach(clientId => {
        if (!clientTasks[currentTaskType].includes(clientId)) {
            clientTasks[currentTaskType].push(clientId);
        }
    });
    
    // Make sure we have yearly tasks initialized for the current year and task type
    if (!yearlyTasks[currentYear]) {
        yearlyTasks[currentYear] = {};
    }
    
    if (!yearlyTasks[currentYear][currentTaskType]) {
        yearlyTasks[currentYear][currentTaskType] = [];
    }
    
    // Create tasks for each client if they don't exist already
    // This is important for TVA Mensuel to show tasks for previous month (April when in May)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const period = monthNames[displayMonth];
    
    // For each selected client, create a task for the current period if it doesn't exist
    selectedClientIds.forEach(clientId => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            // Generate unique task ID
            const taskId = `${currentTaskType}-${currentYear}-${period}-${clientId}`;
            
            // Check if task already exists
            const existingTask = yearlyTasks[currentYear][currentTaskType].find(t => t.id === taskId);
            
            if (!existingTask) {
                // Calculate deadline based on task type
                let deadline = null;
                if (taskTypes[currentTaskType] && taskTypes[currentTaskType].getDeadline) {
                    deadline = taskTypes[currentTaskType].getDeadline(currentYear, period);
                }
                
                // Create new task
                const task = {
                    id: taskId,
                    type: currentTaskType,
                    period: period,
                    year: currentYear,
                    deadline: deadline,
                    clientStatuses: {
                        [clientId]: {
                            status: 'Not Started',
                            notes: '',
                            lastUpdated: Date.now()
                        }
                    }
                };
                
                // Add task to yearly tasks
                yearlyTasks[currentYear][currentTaskType].push(task);
            }
        }
    });
    
    // Save tasks
    saveTasks();
    
    // Close modal
    closeClientTaskModal();
    
    // Show notification
    showNotification(`Assigned ${selectedClientIds.length} clients to ${currentTaskType}`);
    
    // Update task display
    renderTasks();
}

function filterTasks() {
    // Get filter values
    const searchTerm = document.getElementById('task-search')?.value.toLowerCase().trim() || '';
    const statusFilter = document.getElementById('task-status-filter')?.value || 'all';
    const dueDateFilter = document.getElementById('task-due-date-filter')?.value || 'all';
    
    // Get current declaration period
    const declarationPeriod = taskPeriodDisplay.textContent;
    
    // Find clients assigned to the current task type
    const assignedClients = [];
    
    // Check if we have client tasks for this task type
    if (clientTasks[currentTaskType]) {
        // Find clients who are assigned to this task type
        clients.forEach(client => {
            if (clientTasks[currentTaskType].includes(client.id)) {
                assignedClients.push(client);
            }
        });
    }
    
    // If no clients are assigned, show empty table
    if (assignedClients.length === 0) {
        tasksTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">No clients assigned to ${currentTaskType}</td>
            </tr>
        `;
        return;
    }
    
    // Determine the appropriate period based on task type
    let period;
    if (['TVA Mensuel', 'CNSS'].includes(currentTaskType)) {
        // Extract month from declaration period (e.g., "April 2025")
        period = declarationPeriod.split(' ')[0];
    } else if (currentTaskType === 'TVA Trimestrielle') {
        // Extract quarter from declaration period (e.g., "Q2 (Apr-Jun) 2025")
        period = declarationPeriod.split(' ')[0] + ' ' + declarationPeriod.split(' ')[1];
    } else if (currentTaskType === 'Acompte') {
        // Extract quarter from declaration period (e.g., "Q1 2025")
        period = declarationPeriod.split(' ')[0];
    } else {
        // Annual tasks
        period = 'Annual';
    }
    
    // Get tasks for all assigned clients
    let clientTasksArray = [];
    assignedClients.forEach(client => {
        // Generate task ID for this client and period
        const taskId = generateTaskId(currentTaskType, currentYear, period, client.id);
        
        // Check if task exists
        let task = yearlyTasks[currentYear]?.[currentTaskType]?.find(t => t.id === taskId);
        
        if (task) {
            clientTasksArray.push({
                ...task,
                clientName: client.name,
                clientId: client.id
            });
        }
    });
    
    // Apply filters
    const today = new Date();
    const oneWeekLater = new Date(today);
    oneWeekLater.setDate(today.getDate() + 7);
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);
    
    // Apply search and filters
    clientTasksArray = clientTasksArray.filter(task => {
        // Search term filter
        const clientNameMatch = task.clientName.toLowerCase().includes(searchTerm);
        const statusMatch = task.status.toLowerCase().includes(searchTerm);
        const notesMatch = (task.notes || '').toLowerCase().includes(searchTerm);
        const searchMatch = !searchTerm || clientNameMatch || statusMatch || notesMatch;
        
        // Status filter
        const statusFilterMatch = statusFilter === 'all' || task.status === statusFilter;
        
        // Due date filter
        let dueDateFilterMatch = true;
        const taskDueDate = new Date(task.deadline);
        
        if (dueDateFilter !== 'all') {
            switch (dueDateFilter) {
                case 'upcoming':
                    dueDateFilterMatch = taskDueDate > today;
                    break;
                case 'overdue':
                    dueDateFilterMatch = taskDueDate < today;
                    break;
                case 'thisWeek':
                    dueDateFilterMatch = taskDueDate >= today && taskDueDate <= oneWeekLater;
                    break;
                case 'thisMonth':
                    dueDateFilterMatch = taskDueDate >= today && taskDueDate <= oneMonthLater;
                    break;
            }
        }
        
        return searchMatch && statusFilterMatch && dueDateFilterMatch;
    });
    
    // Render filtered tasks
    if (clientTasksArray.length === 0) {
        tasksTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-table">No tasks match your filters</td>
            </tr>
        `;
        return;
    }
    
    // Render tasks
    tasksTableBody.innerHTML = clientTasksArray.map(task => {
        const statusClass = {
            'Not Started': 'status-not-started',
            'In Progress': 'status-in-progress',
            'Done': 'status-done'
        }[task.status] || '';
        
        return `
            <tr>
                <td>${task.clientName}</td>
                <td>${formatDate(task.deadline)}</td>
                <td>
                    <span class="status-badge ${statusClass}">${task.status}</span>
                </td>
                <td>${task.notes || '-'}</td>
                <td>
                    <button class="btn-icon update-task-status" data-id="${task.id}" data-type="${currentTaskType}" data-client-id="${task.clientId}">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add event listeners to action buttons
    document.querySelectorAll('.update-task-status').forEach(btn => {
        btn.addEventListener('click', () => {
            const taskId = btn.getAttribute('data-id');
            const taskType = btn.getAttribute('data-type');
            const clientId = btn.getAttribute('data-client-id');
            openTaskStatusModal(taskId, taskType, clientId);
        });
    });
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    });
}

// Generate ID
function generateTaskId(taskType, year, period, clientId) {
    return `${taskType}-${year}-${period}-${clientId}`.replace(/[^a-zA-Z0-9]/g, '-');
}

// Create a task for a client
function createTaskForClient(client, period) {
    const taskId = generateTaskId(currentTaskType, currentYear, period, client.id);
    const deadline = getTaskDeadline(currentTaskType, currentYear, period);
    
    return {
        id: taskId,
        period: period,
        deadline: deadline,
        status: 'Not Started',
        notes: '',
        clientId: client.id,
        createdAt: new Date().toISOString()
    };
}

// Get task deadline based on task type and period
function getTaskDeadline(taskType, year, period) {
    const typeConfig = taskTypes[taskType];
    
    if (!typeConfig) return null;
    
    if (taskType === 'TVA Mensuel' || taskType === 'CNSS') {
        // Monthly tasks
        return typeConfig.getDeadline(year, period);
    } else if (taskType === 'TVA Trimestrielle' || taskType === 'Acompte') {
        // Quarterly tasks
        return typeConfig.getDeadline(year, period);
    } else {
        // Annual tasks
        return typeConfig.getDeadline(year);
    }
}
