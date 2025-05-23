// Search and Filter Functionality

// DOM Elements
const navbarSearchInput = document.querySelector('.search-input');
const navbarSearchBtn = document.querySelector('.search-btn');

// Client List Search/Filter Elements
const clientSearchInput = document.getElementById('client-search');
const clientFilterSelect = document.getElementById('client-filter');

// Task Search/Filter Elements
const taskSearchInput = document.getElementById('task-search');
const taskStatusFilter = document.getElementById('task-status-filter');
const taskDueDateFilter = document.getElementById('task-due-date-filter');
const taskTypeFilter = document.getElementById('task-type-filter');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Navbar Search
    if (navbarSearchInput) {
        navbarSearchInput.addEventListener('input', handleNavbarSearch);
    }
    
    if (navbarSearchBtn) {
        navbarSearchBtn.addEventListener('click', () => {
            handleNavbarSearch({ target: navbarSearchInput });
        });
    }
    
    // Client List Search/Filter
    if (clientSearchInput) {
        clientSearchInput.addEventListener('input', () => {
            if (typeof filterClients === 'function') {
                filterClients();
            }
        });
    }
    
    if (clientFilterSelect) {
        clientFilterSelect.addEventListener('change', () => {
            if (typeof filterClients === 'function') {
                filterClients();
            }
        });
    }
    
    // Task Search/Filter
    if (taskSearchInput) {
        taskSearchInput.addEventListener('input', () => {
            if (typeof filterTasks === 'function') {
                filterTasks();
            }
        });
    }
    
    if (taskStatusFilter) {
        taskStatusFilter.addEventListener('change', () => {
            if (typeof filterTasks === 'function') {
                filterTasks();
            }
        });
    }
    
    if (taskDueDateFilter) {
        taskDueDateFilter.addEventListener('change', () => {
            if (typeof filterTasks === 'function') {
                filterTasks();
            }
        });
    }
    
    if (taskTypeFilter) {
        taskTypeFilter.addEventListener('change', () => {
            if (typeof filterTasks === 'function') {
                filterTasks();
            }
        });
    }
});

// Handle Navbar Search
function handleNavbarSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) return;
    
    // Search through clients
    const clientsMatch = searchClients(searchTerm);
    
    // Search through tasks
    const tasksMatch = searchTasks(searchTerm);
    
    // Switch to the section with matches
    if (clientsMatch && !tasksMatch) {
        // More client matches, switch to clients page
        if (typeof switchPage === 'function') {
            switchPage('clients');
        }
    } else if (tasksMatch && !clientsMatch) {
        // More task matches, switch to tasks page
        if (typeof switchPage === 'function') {
            switchPage('tasks');
        }
    } else if (clientsMatch && tasksMatch) {
        // Both have matches, switch to the one with more matches
        if (clientsMatch >= tasksMatch) {
            if (typeof switchPage === 'function') {
                switchPage('clients');
            }
        } else {
            if (typeof switchPage === 'function') {
                switchPage('tasks');
            }
        }
    }
}

// Search clients
function searchClients(searchTerm) {
    const allClients = JSON.parse(localStorage.getItem('clients') || '[]');
    let matchCount = 0;
    
    // Filter clients based on search term
    const filteredClients = allClients.filter(client => {
        const nameMatch = client.name && client.name.toLowerCase().includes(searchTerm);
        const nifMatch = client.nif && client.nif.toLowerCase().includes(searchTerm);
        const iceMatch = client.ice && client.ice.toLowerCase().includes(searchTerm);
        const patentMatch = client.patent && client.patent.toLowerCase().includes(searchTerm);
        const businessNameMatch = client.businessName && client.businessName.toLowerCase().includes(searchTerm);
        const emailMatch = client.email && client.email.toLowerCase().includes(searchTerm);
        
        const isMatch = nameMatch || nifMatch || iceMatch || patentMatch || businessNameMatch || emailMatch;
        if (isMatch) matchCount++;
        return isMatch;
    });
    
    // Update the client table if the function exists
    if (typeof renderClientTable === 'function') {
        renderClientTable(filteredClients);
    }
    
    return matchCount;
}

// Search tasks
function searchTasks(searchTerm) {
    const yearlyTasks = JSON.parse(localStorage.getItem('yearlyTasks') || '{}');
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    let matchCount = 0;
    let matchedTasks = [];
    
    // Go through all task types and years
    for (const year in yearlyTasks) {
        for (const taskType in yearlyTasks[year]) {
            const tasks = yearlyTasks[year][taskType];
            
            // Filter tasks based on search term
            const filteredTasks = tasks.filter(task => {
                // Get client info for the task
                const clientId = task.clientId;
                const client = clients.find(c => c.id === clientId);
                const clientName = client ? client.name : '';
                
                const clientMatch = clientName.toLowerCase().includes(searchTerm);
                const statusMatch = task.status && task.status.toLowerCase().includes(searchTerm);
                const periodMatch = task.period && task.period.toLowerCase().includes(searchTerm);
                const notesMatch = task.notes && task.notes.toLowerCase().includes(searchTerm);
                const taskTypeMatch = taskType.toLowerCase().includes(searchTerm);
                
                const isMatch = clientMatch || statusMatch || periodMatch || notesMatch || taskTypeMatch;
                if (isMatch) {
                    matchCount++;
                    matchedTasks.push({
                        ...task,
                        taskType,
                        year,
                        clientName
                    });
                }
                return isMatch;
            });
        }
    }
    
    // If there are matches, switch to the task type with the most matches
    if (matchCount > 0) {
        const taskTypeCounts = {};
        
        // Count matches by task type
        matchedTasks.forEach(task => {
            if (!taskTypeCounts[task.taskType]) {
                taskTypeCounts[task.taskType] = 0;
            }
            taskTypeCounts[task.taskType]++;
        });
        
        // Find the task type with the most matches
        let maxCount = 0;
        let maxTaskType = '';
        
        for (const taskType in taskTypeCounts) {
            if (taskTypeCounts[taskType] > maxCount) {
                maxCount = taskTypeCounts[taskType];
                maxTaskType = taskType;
            }
        }
        
        // Switch to the task type with the most matches
        if (maxTaskType && typeof switchTaskType === 'function') {
            switchTaskType(maxTaskType);
        }
    }
    
    return matchCount;
}
