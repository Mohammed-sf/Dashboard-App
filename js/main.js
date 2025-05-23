// DOM Elements
const loginPage = document.getElementById('login-page');
const mainApp = document.getElementById('main-app');
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const sidebarItems = document.querySelectorAll('.sidebar-item');
const contentPages = document.querySelectorAll('.content-page');
const profileDropdownItems = document.querySelectorAll('.dropdown-item');
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const sidebar = document.querySelector('.sidebar');
const languageSelector = document.getElementById('language-selector');
const userName = document.getElementById('user-name');
const profileName = document.getElementById('profile-name');
const welcomeName = document.getElementById('welcome-name');

// Notification system
function showNotification(message, type = 'success') {
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

// User credentials (in a real app, this would be handled server-side)
const validUsers = [
    { username: 'john', password: '123456', fullName: 'John Smith', email: 'john@taskflow.com' },
    { username: 'gabriel', password: '123456', fullName: 'Gabriel Garcia', email: 'gabriel@taskflow.com' }
];

// Current user
let currentUser = null;

// Language translations
const translations = {
    en: {
        login: 'Admin Login',
        dashboard: 'Dashboard',
        clients: 'Client List',
        tasks: 'Tasks',
        uploads: 'File Uploads',
        profile: 'Profile',
        logout: 'Logout',
        search: 'Search...',
        noClients: 'No clients available',
        noTasks: 'No tasks available',
        noFiles: 'No files uploaded',
        dragDrop: 'Drag & Drop files here or click to browse',
        totalClients: 'Total Clients',
        activeTasks: 'Active Tasks',
        completedTasks: 'Completed Tasks',
        totalFiles: 'Total Files',
        recentActivity: 'Recent Activity',
        noActivities: 'No recent activities',
        saveChanges: 'Save Changes'
    },
    fr: {
        login: 'Connexion Admin',
        dashboard: 'Tableau de Bord',
        clients: 'Liste des Clients',
        tasks: 'Tâches',
        uploads: 'Téléchargements',
        profile: 'Profil',
        logout: 'Déconnexion',
        search: 'Rechercher...',
        noClients: 'Aucun client disponible',
        noTasks: 'Aucune tâche disponible',
        noFiles: 'Aucun fichier téléchargé',
        dragDrop: 'Glissez-déposez des fichiers ici ou cliquez pour parcourir',
        totalClients: 'Total des Clients',
        activeTasks: 'Tâches Actives',
        completedTasks: 'Tâches Terminées',
        totalFiles: 'Total des Fichiers',
        recentActivity: 'Activité Récente',
        noActivities: 'Aucune activité récente',
        saveChanges: 'Enregistrer les Modifications'
    }
};

// Current language
let currentLanguage = 'en';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    checkLoginState();
    
    // Login Form Submission
    loginBtn.addEventListener('click', handleLogin);
    
    // Enter key for login
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    });
    
    // Logout Button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Load data when app initializes
    if (typeof loadClients === 'function') {
        loadClients();
    }
    
    // Sidebar Navigation
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            switchPage(page);
        });
    });
    
    // Profile dropdown navigation
    profileDropdownItems.forEach(item => {
        if (item.getAttribute('data-page')) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                switchPage(page);
            });
        }
    });
    
    // Toggle sidebar on mobile
    toggleSidebarBtn.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('collapsed');
        document.querySelector('.main-content').classList.toggle('expanded');
    });
    
    // Language switcher
    languageSelector.addEventListener('change', () => {
        currentLanguage = languageSelector.value;
        updateLanguage();
    });
    
    // Profile form submission
    document.getElementById('save-profile-btn').addEventListener('click', handleProfileUpdate);
});

// Functions
// Check if user is logged in
function checkLoginState() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            const storedUser = validUsers.find(u => u.username === user.username);
            
            if (storedUser) {
                // Update the stored user with any changes from validUsers
                currentUser = { ...storedUser, ...user };
                loginPage.classList.remove('active');
                loginPage.classList.add('hidden');
                mainApp.classList.remove('hidden');
                
                // Update user info in UI
                updateUserInfo(currentUser);
                
                // Show home page by default
                switchPage('home');
            }
        } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('user');
        }
    }
}

function updateUserInfo(user) {
    // Update user name display
    userName.textContent = user.fullName || user.username;
    
    // Update welcome message on home page
    if (welcomeName) {
        welcomeName.textContent = user.fullName || user.username;
    }
    
    // Update profile page info
    profileName.textContent = user.fullName;
    document.getElementById('profile-username').value = user.username;
    document.getElementById('profile-fullname').value = user.fullName;
    document.getElementById('profile-email-input').value = user.email;
    
    // Any other user info updates would go here
}

// Update recent activity on the dashboard
function updateRecentActivity() {
    // Get the activity container
    const activityContainer = document.querySelector('.activity-list');
    if (!activityContainer) return;
    
    // Get recent activities from localStorage
    let activities = [];
    const savedActivities = localStorage.getItem('recentActivities');
    
    if (savedActivities) {
        try {
            activities = JSON.parse(savedActivities);
        } catch (e) {
            console.error('Error parsing recent activities:', e);
        }
    }
    
    // Sort activities by timestamp (newest first)
    activities.sort((a, b) => b.timestamp - a.timestamp);
    
    // Limit to the 5 most recent activities
    activities = activities.slice(0, 5);
    
    // Check if there are any activities
    if (activities.length === 0) {
        activityContainer.innerHTML = `<div class="empty-list">${getTranslationSafe('noActivities')}</div>`;
        return;
    }
    
    // Clear existing activities
    activityContainer.innerHTML = '';
    
    // Add activities to the container
    activities.forEach(activity => {
        // Format the timestamp
        const date = new Date(activity.timestamp);
        const formattedDate = formatDate(date);
        
        // Create activity item
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        // Set icon based on activity type
        let icon = 'fa-info-circle';
        let color = 'info';
        
        switch (activity.type) {
            case 'client-add':
                icon = 'fa-user-plus';
                color = 'success';
                break;
            case 'client-edit':
                icon = 'fa-user-edit';
                color = 'primary';
                break;
            case 'client-delete':
                icon = 'fa-user-times';
                color = 'danger';
                break;
            case 'task-assign':
                icon = 'fa-tasks';
                color = 'primary';
                break;
            case 'task-update':
                icon = 'fa-check-circle';
                color = 'success';
                break;
            case 'file-upload':
                icon = 'fa-file-upload';
                color = 'info';
                break;
            case 'file-delete':
                icon = 'fa-file-times';
                color = 'danger';
                break;
        }
        
        // Create activity content
        activityItem.innerHTML = `
            <div class="activity-icon ${color}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.message}</div>
                <div class="activity-time">${formattedDate}</div>
            </div>
        `;
        
        // Add to container
        activityContainer.appendChild(activityItem);
    });
}

// Add a new activity to recent activities
function addActivity(type, message) {
    // Create activity object
    const activity = {
        type,
        message,
        timestamp: Date.now()
    };
    
    // Get existing activities
    let activities = [];
    const savedActivities = localStorage.getItem('recentActivities');
    
    if (savedActivities) {
        try {
            activities = JSON.parse(savedActivities);
        } catch (e) {
            console.error('Error parsing recent activities:', e);
        }
    }
    
    // Add new activity
    activities.push(activity);
    
    // Limit to 20 activities (we'll only display 5, but keep more for history)
    if (activities.length > 20) {
        activities = activities.slice(-20);
    }
    
    // Save to localStorage
    localStorage.setItem('recentActivities', JSON.stringify(activities));
    
    // Update the dashboard if we're on the home page
    if (document.querySelector('#home-page.active')) {
        updateRecentActivity();
    }
}

// Update dashboard statistics on the home page
function updateDashboardStats() {
    // Get dashboard card elements
    const totalClientsCard = document.querySelector('.dashboard-card:nth-child(1) .card-value');
    const activeTasksCard = document.querySelector('.dashboard-card:nth-child(2) .card-value');
    const completedTasksCard = document.querySelector('.dashboard-card:nth-child(3) .card-value');
    const totalFilesCard = document.querySelector('.dashboard-card:nth-child(4) .card-value');
    
    // Calculate stats
    // 1. Total Clients
    const clientsCount = Array.isArray(clients) ? clients.length : 0;
    
    // 2. Active Tasks (not done)
    let activeTasks = 0;
    let completedTasks = 0;
    
    // Count tasks by status
    if (typeof clientTasks === 'object' && clientTasks) {
        Object.keys(clientTasks).forEach(taskType => {
            // Get all client tasks
            const clientsWithTasks = clientTasks[taskType] || [];
            const clientTaskCount = clientsWithTasks.length;
            
            // Count active tasks (status not 'Done')
            if (yearlyTasks && yearlyTasks[currentYear] && yearlyTasks[currentYear][taskType]) {
                yearlyTasks[currentYear][taskType].forEach(task => {
                    // Check each client assigned to this task
                    clientsWithTasks.forEach(clientId => {
                        // If client has this task and status is tracked
                        if (task.clientStatuses && task.clientStatuses[clientId]) {
                            if (task.clientStatuses[clientId].status === 'Done') {
                                completedTasks++;
                            } else {
                                activeTasks++;
                            }
                        } else {
                            // Task exists but no status means it's active/not started
                            activeTasks++;
                        }
                    });
                });
            }
        });
    }
    
    // 3. Total Files
    let filesCount = 0;
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
        try {
            const files = JSON.parse(savedFiles);
            filesCount = files.length;
        } catch (e) {
            console.error('Error parsing uploaded files:', e);
        }
    }
    
    // Update the dashboard cards
    if (totalClientsCard) totalClientsCard.textContent = clientsCount;
    if (activeTasksCard) activeTasksCard.textContent = activeTasks;
    if (completedTasksCard) completedTasksCard.textContent = completedTasks;
    if (totalFilesCard) totalFilesCard.textContent = filesCount;
    
    // Update recent activity
    updateRecentActivity();
}

function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Check if user exists
    const user = validUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Set current user
        currentUser = { ...user };
        
        // Show main app
        loginPage.classList.remove('active');
        loginPage.classList.add('hidden');
        mainApp.classList.remove('hidden');
        
        // Save login state with consistent key
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Update user info in UI
        updateUserInfo(currentUser);
        
        // Reset form
        usernameInput.value = '';
        passwordInput.value = '';
        loginError.textContent = '';
        
        // Show home page by default
        switchPage('home');
    } else {
        loginError.textContent = getTranslationSafe('invalidCredentials') || 'Invalid username or password';
    }
}

function handleLogout() {
    mainApp.classList.add('hidden');
    loginPage.classList.remove('hidden');
    loginPage.classList.add('active');
    currentUser = null;
    
    // Remove stored user from local storage
    localStorage.removeItem('user');
}

function switchPage(page) {
    // Update sidebar active state
    sidebarItems.forEach(item => {
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update content pages
    contentPages.forEach(contentPage => {
        if (contentPage.id === `${page}-page`) {
            contentPage.classList.add('active');
        } else {
            contentPage.classList.remove('active');
        }
    });
    
    // Perform additional page-specific actions
    switch (page) {
        case 'home':
            // Update home page dashboard cards
            updateDashboardStats();
            break;
            
        case 'clients':
            // Make sure clients are loaded
            if (typeof loadClients === 'function') {
                loadClients();
            }
            break;
            
        case 'tasks':
            // Update task display and load tasks
            if (typeof loadTasks === 'function') {
                loadTasks();
            }
            if (typeof renderTasks === 'function') {
                renderTasks();
            }
            break;
            
        case 'uploads':
            // Initialize file upload section
            if (typeof initFileUploads === 'function') {
                initFileUploads();
            }
            break;
            
        case 'profile':
            // Make sure profile info is up to date
            if (currentUser) {
                updateUserInfo(currentUser);
            }
            break;
    }
    
    // Apply current language translations to the active page
    if (typeof applyTranslations === 'function') {
        applyTranslations(getCurrentLanguage());
    }
}

function updateLanguage() {
    const lang = translations[currentLanguage];
    
    // Update static text elements
    document.getElementById('login-title').textContent = lang.login;
    document.querySelector('.search-input').placeholder = lang.search;
    document.querySelector('.dropzone p').textContent = lang.dragDrop;
    
    // Update sidebar text
    document.querySelector('[data-page="home"] span').textContent = lang.dashboard;
    document.querySelector('[data-page="clients"] span').textContent = lang.clients;
    document.querySelector('[data-page="tasks"] span').textContent = lang.tasks;
    document.querySelector('[data-page="uploads"] span').textContent = lang.uploads;
    document.querySelector('[data-page="profile"] span').textContent = lang.profile;
    
    // Update dropdown menu
    document.querySelector('.dropdown-item[data-page="profile"]').textContent = lang.profile;
    document.getElementById('logout-btn').textContent = lang.logout;
    
    // Update dashboard headings
    document.querySelector('#home-page h1').textContent = lang.dashboard;
    document.querySelector('#clients-page h1').textContent = lang.clients;
    document.querySelector('#tasks-page h1').textContent = lang.tasks;
    document.querySelector('#uploads-page h1').textContent = lang.uploads;
    document.querySelector('#profile-page h1').textContent = lang.profile;
    
    // Update dashboard cards
    document.querySelector('.dashboard-card:nth-child(1) h3').textContent = lang.totalClients;
    document.querySelector('.dashboard-card:nth-child(2) h3').textContent = lang.activeTasks;
    document.querySelector('.dashboard-card:nth-child(3) h3').textContent = lang.completedTasks;
    document.querySelector('.dashboard-card:nth-child(4) h3').textContent = lang.totalFiles;
    
    // Update recent activity
    document.querySelector('.recent-activity h2').textContent = lang.recentActivity;
    document.querySelector('.activity-list p').textContent = lang.noActivities;
    
    // Update empty table messages
    document.querySelector('#clients-page .empty-table').textContent = lang.noClients;
    document.querySelector('#tasks-page .empty-table').textContent = lang.noTasks;
    document.querySelector('#uploads-page .empty-table').textContent = lang.noFiles;
    
    // Update buttons
    document.querySelector('#profile-page .btn-primary').textContent = lang.saveChanges;
}

// Data storage
const taskflowData = {
    clients: [],
    tasks: [],
    files: [],
    activities: []
};

// Local storage functions
function saveData() {
    localStorage.setItem('taskflowData', JSON.stringify(taskflowData));
}

function loadData() {
    const savedData = localStorage.getItem('taskflowData');
    if (savedData) {
        Object.assign(taskflowData, JSON.parse(savedData));
        updateDashboard();
    }
}

function updateDashboard() {
    // Update dashboard counts
    document.querySelector('.dashboard-card:nth-child(1) .card-value').textContent = taskflowData.clients.length;
    
    const activeTasks = taskflowData.tasks.filter(task => task.status !== 'Completed').length;
    document.querySelector('.dashboard-card:nth-child(2) .card-value').textContent = activeTasks;
    
    const completedTasks = taskflowData.tasks.filter(task => task.status === 'Completed').length;
    document.querySelector('.dashboard-card:nth-child(3) .card-value').textContent = completedTasks;
    
    document.querySelector('.dashboard-card:nth-child(4) .card-value').textContent = taskflowData.files.length;
    
    // More dashboard updates would go here in a full implementation
}

// Handle profile update
function handleProfileUpdate() {
    const username = document.getElementById('profile-username').value.trim();
    const fullName = document.getElementById('profile-fullname').value.trim();
    const email = document.getElementById('profile-email-input').value.trim();
    const currentPassword = document.getElementById('profile-current-password').value.trim();
    const newPassword = document.getElementById('profile-new-password').value.trim();
    const confirmPassword = document.getElementById('profile-confirm-password').value.trim();
    const profileError = document.getElementById('profile-error');
    
    // Reset error message
    profileError.textContent = '';
    
    // Basic validation
    if (!username || !fullName || !email) {
        profileError.textContent = 'Username, full name, and email are required';
        return;
    }
    
    // Validate current password if attempting to change password
    if (newPassword || confirmPassword) {
        if (!currentPassword) {
            profileError.textContent = 'Current password is required to set a new password';
            return;
        }
        
        if (currentPassword !== currentUser.password) {
            profileError.textContent = 'Current password is incorrect';
            return;
        }
        
        if (newPassword !== confirmPassword) {
            profileError.textContent = 'New passwords do not match';
            return;
        }
        
        if (newPassword.length < 6) {
            profileError.textContent = 'New password must be at least 6 characters';
            return;
        }
    }
    
    // Check if username already exists (if changing username)
    if (username !== currentUser.username) {
        const userExists = validUsers.some(user => 
            user.username === username && user.username !== currentUser.username
        );
        
        if (userExists) {
            profileError.textContent = 'Username already exists';
            return;
        }
    }
    
    // Update the user in validUsers array (in a real app, this would be a server update)
    for (let i = 0; i < validUsers.length; i++) {
        if (validUsers[i].username === currentUser.username) {
            // Update the user
            validUsers[i].username = username;
            validUsers[i].fullName = fullName;
            validUsers[i].email = email;
            
            if (newPassword) {
                validUsers[i].password = newPassword;
            }
            
            // Update current user
            currentUser = { ...validUsers[i] };
            break;
        }
    }
    
    // Update UI
    updateUserInfo(currentUser);
    
    // Update localStorage
    localStorage.setItem('taskflow_user', JSON.stringify(currentUser));
    
    // Show notification
    showNotification('Profile updated successfully');
    
    // Clear password fields
    document.getElementById('profile-current-password').value = '';
    document.getElementById('profile-new-password').value = '';
    document.getElementById('profile-confirm-password').value = '';
    
    // Navigate to home page
    switchPage('home');
}

// Load data on startup
loadData();
