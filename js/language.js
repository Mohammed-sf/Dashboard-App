// Language Support Functionality

// Language selector will be fetched when needed to ensure DOM is ready.

// Use the existing translations or create a new one
window.translations = window.translations || {
    en: {
        // Common elements
        appName: 'TaskFlow',
        search: 'Search...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        
        // Login page
        login: 'Admin Login',
        username: 'Username',
        password: 'Password',
        enterUsername: 'Enter your username',
        enterPassword: 'Enter your password',
        loginButton: 'Login',
        
        // Sidebar
        home: 'Home',
        clientList: 'Client List',
        tasks: 'Tasks',
        fileUploads: 'File Uploads',
        profile: 'Profile',
        
        // Navigation
        logout: 'Logout',
        
        // Home section
        dashboard: 'Dashboard',
        welcome: 'Welcome to TaskFlow',
        welcomeSubtitle: 'Your client and task management solution',
        totalClients: 'Total Clients',
        activeTasks: 'Active Tasks',
        completedTasks: 'Completed Tasks',
        totalFiles: 'Total Files',
        recentActivity: 'Recent Activity',
        noActivities: 'No recent activities',
        
        // Profile section
        profileTitle: 'Profile',
        fullName: 'Full Name',
        email: 'Email',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        saveChanges: 'Save Changes',
        
        // Client List section
        clientListTitle: 'Client List',
        addNewClient: 'Add New Client',
        exportToExcel: 'Export to Excel',
        searchClients: 'Search clients...',
        allClients: 'All Clients',
        active: 'Active',
        inactive: 'Inactive',
        mainInfo: 'Main Info',
        cnssInfo: 'CNSS Info',
        name: 'Name',
        dgiLogin: 'DGI Login',
        phone: 'Phone',
        nif: 'N.I.F',
        ice: 'ICE',
        patent: 'PATENT',
        actions: 'Actions',
        addClient: 'Add Client',
        editClient: 'Edit Client',
        clientDetails: 'Client Details',
        businessName: 'Business Name',
        address: 'Address',
        status: 'Status',
        optionalInfo: 'Optional Information',
        dgiPassword: 'DGI Password',
        cnssLogin: 'CNSS Login',
        cnssPassword: 'CNSS Password',
        confirmDelete: 'Confirm Delete',
        deleteClientConfirm: 'Are you sure you want to delete this client? This action cannot be undone.',
        
        // Tasks section
        tasksTitle: 'Tasks',
        currentPeriod: 'Current Period:',
        showingTasksFor: 'Showing Tasks For:',
        client: 'Client',
        deadline: 'Deadline',
        notes: 'Notes',
        updateTaskStatus: 'Update Task Status',
        assignTaskToClients: 'Assign Task to Clients',
        selectClientsToAssign: 'Select clients to assign the',
        taskFor: 'task for',
        noClientsAvailable: 'No clients available',
        assignTask: 'Assign Task',
        noTasksAvailable: 'No tasks available for this period',
        noClientsAssigned: 'No clients assigned to',
        noTasksMatch: 'No tasks match your filters',
        allStatuses: 'All Statuses',
        notStarted: 'Not Started',
        inProgress: 'In Progress',
        done: 'Done',
        allDueDates: 'All Due Dates',
        upcoming: 'Upcoming',
        overdue: 'Overdue',
        thisWeek: 'This Week',
        thisMonth: 'This Month',
        searchTasks: 'Search tasks...',
        
        // File Uploads section
        fileUploadsTitle: 'File Uploads',
        uploadFile: 'Upload File',
        searchFiles: 'Search files...',
        allFiles: 'All Files',
        documents: 'Documents',
        images: 'Images',
        spreadsheets: 'Spreadsheets',
        others: 'Others',
        dragDropFiles: 'Drag & Drop files here or click to browse',
        maxFileSize: 'Maximum file size: 20MB',
        fileName: 'File Name',
        type: 'Type',
        size: 'Size',
        uploadDate: 'Upload Date',
        noFilesUploaded: 'No files uploaded',
        selectClient: 'Select Client*',
        fileCategory: 'File Category',
        description: 'Description',
        enterDescription: 'Enter file description...',
        confirmUpload: 'Upload Files',
        filePreview: 'File Preview',
        fileDetails: 'File Details',
        previewNotAvailable: 'Preview not available for this file type',
        clickToDownload: 'Click the download button to view the file',
        download: 'Download',
        
        // Notifications
        profileUpdated: 'Profile updated successfully',
        clientAdded: 'Client added successfully',
        clientUpdated: 'Client updated successfully',
        clientDeleted: 'Client deleted successfully',
        taskAssigned: 'Task assigned successfully',
        taskUpdated: 'Task status updated successfully',
        fileUploaded: 'Files uploaded successfully',
        fileDeleted: 'File deleted successfully',
        clientsExported: 'Clients exported successfully'
    },
    fr: {
        // Common elements
        appName: 'TaskFlow',
        search: 'Rechercher...',
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        edit: 'Modifier',
        add: 'Ajouter',
        
        // Login page
        login: 'Connexion Admin',
        username: 'Nom d\'utilisateur',
        password: 'Mot de passe',
        enterUsername: 'Entrez votre nom d\'utilisateur',
        enterPassword: 'Entrez votre mot de passe',
        loginButton: 'Connexion',
        
        // Sidebar
        home: 'Accueil',
        clientList: 'Liste des Clients',
        tasks: 'Tâches',
        fileUploads: 'Fichiers',
        profile: 'Profil',
        
        // Navigation
        logout: 'Déconnexion',
        
        // Home section
        dashboard: 'Tableau de Bord',
        welcome: 'Bienvenue sur TaskFlow',
        welcomeSubtitle: 'Votre solution de gestion de clients et de tâches',
        totalClients: 'Total Clients',
        activeTasks: 'Tâches Actives',
        completedTasks: 'Tâches Terminées',
        totalFiles: 'Total Fichiers',
        recentActivity: 'Activité Récente',
        noActivities: 'Aucune activité récente',
        
        // Profile section
        profileTitle: 'Profil',
        fullName: 'Nom Complet',
        email: 'Email',
        currentPassword: 'Mot de Passe Actuel',
        newPassword: 'Nouveau Mot de Passe',
        confirmPassword: 'Confirmer le Mot de Passe',
        saveChanges: 'Enregistrer les Modifications',
        
        // Client List section
        clientListTitle: 'Liste des Clients',
        addNewClient: 'Ajouter un Client',
        exportToExcel: 'Exporter vers Excel',
        searchClients: 'Rechercher des clients...',
        allClients: 'Tous les Clients',
        active: 'Actif',
        inactive: 'Inactif',
        mainInfo: 'Infos Principales',
        cnssInfo: 'Infos CNSS',
        name: 'Nom',
        dgiLogin: 'Login DGI',
        phone: 'Téléphone',
        nif: 'N.I.F',
        ice: 'ICE',
        patent: 'PATENTE',
        actions: 'Actions',
        addClient: 'Ajouter un Client',
        editClient: 'Modifier le Client',
        clientDetails: 'Détails du Client',
        businessName: 'Nom de l\'Entreprise',
        address: 'Adresse',
        status: 'Statut',
        optionalInfo: 'Informations Facultatives',
        dgiPassword: 'Mot de Passe DGI',
        cnssLogin: 'Login CNSS',
        cnssPassword: 'Mot de Passe CNSS',
        confirmDelete: 'Confirmer la Suppression',
        deleteClientConfirm: 'Êtes-vous sûr de vouloir supprimer ce client? Cette action ne peut pas être annulée.',
        
        // Tasks section
        tasksTitle: 'Tâches',
        currentPeriod: 'Période Actuelle:',
        showingTasksFor: 'Affichage des Tâches Pour:',
        client: 'Client',
        deadline: 'Échéance',
        notes: 'Notes',
        updateTaskStatus: 'Mettre à jour le Statut',
        assignTaskToClients: 'Assigner la Tâche aux Clients',
        selectClientsToAssign: 'Sélectionnez les clients pour assigner la tâche',
        taskFor: 'pour',
        noClientsAvailable: 'Aucun client disponible',
        assignTask: 'Assigner la Tâche',
        noTasksAvailable: 'Aucune tâche disponible pour cette période',
        noClientsAssigned: 'Aucun client assigné à',
        noTasksMatch: 'Aucune tâche ne correspond à vos filtres',
        allStatuses: 'Tous les Statuts',
        notStarted: 'Non Commencé',
        inProgress: 'En Cours',
        done: 'Terminé',
        allDueDates: 'Toutes les Échéances',
        upcoming: 'À Venir',
        overdue: 'En Retard',
        thisWeek: 'Cette Semaine',
        thisMonth: 'Ce Mois',
        searchTasks: 'Rechercher des tâches...',
        
        // File Uploads section
        fileUploadsTitle: 'Fichiers',
        uploadFile: 'Télécharger un Fichier',
        searchFiles: 'Rechercher des fichiers...',
        allFiles: 'Tous les Fichiers',
        documents: 'Documents',
        images: 'Images',
        spreadsheets: 'Tableurs',
        others: 'Autres',
        dragDropFiles: 'Glissez-déposez des fichiers ici ou cliquez pour parcourir',
        maxFileSize: 'Taille maximale: 20Mo',
        fileName: 'Nom du Fichier',
        type: 'Type',
        size: 'Taille',
        uploadDate: 'Date de Téléchargement',
        noFilesUploaded: 'Aucun fichier téléchargé',
        selectClient: 'Sélectionner un Client*',
        fileCategory: 'Catégorie de Fichier',
        description: 'Description',
        enterDescription: 'Entrez la description du fichier...',
        confirmUpload: 'Télécharger les Fichiers',
        filePreview: 'Aperçu du Fichier',
        fileDetails: 'Détails du Fichier',
        previewNotAvailable: 'Aperçu non disponible pour ce type de fichier',
        clickToDownload: 'Cliquez sur le bouton télécharger pour voir le fichier',
        download: 'Télécharger',
        
        // Notifications
        profileUpdated: 'Profil mis à jour avec succès',
        clientAdded: 'Client ajouté avec succès',
        clientUpdated: 'Client mis à jour avec succès',
        clientDeleted: 'Client supprimé avec succès',
        taskAssigned: 'Tâche assignée avec succès',
        taskUpdated: 'Statut de la tâche mis à jour avec succès',
        fileUploaded: 'Fichiers téléchargés avec succès',
        fileDeleted: 'Fichier supprimé avec succès',
        clientsExported: 'Clients exportés avec succès'
    }
};

// Initialize language support
document.addEventListener('DOMContentLoaded', () => {
    const langSelector = document.getElementById('language-selector'); // Define here for local scope

    // Determine initial language: 1. localStorage, 2. selector value, 3. fallback to 'en'
    let initialLanguage = localStorage.getItem('preferredLanguage');
    if (!initialLanguage || !(window.translations && window.translations[initialLanguage])) {
        initialLanguage = langSelector ? langSelector.value : 'en';
    }
    if (!(window.translations && window.translations[initialLanguage])) { // Final fallback if selector value is invalid
        initialLanguage = 'en';
    }

    // Set the language selector's value to the determined initial language
    if (langSelector) {
        langSelector.value = initialLanguage;
    }
    
    // Apply translations
    applyTranslations(initialLanguage);
    
    // Add language change event listener
    if (langSelector) {
        langSelector.addEventListener('change', () => {
            const selectedLanguage = langSelector.value;
            applyTranslations(selectedLanguage);
            localStorage.setItem('preferredLanguage', selectedLanguage);
        });
    }
});

// Apply translations to the entire application
function applyTranslations(language) {
    // Default to English if language not supported
    const currentTranslations = translations[language] || translations.en;
    
    // Update page title
    document.title = `${currentTranslations.appName} - ${currentTranslations.clientList} & ${currentTranslations.tasks}`;
    
    // Login page
    translateElement('#login-title', currentTranslations.login);
    translateElement('label[for="username"]', currentTranslations.username);
    translateElement('label[for="password"]', currentTranslations.password);
    translatePlaceholder('#username', currentTranslations.enterUsername);
    translatePlaceholder('#password', currentTranslations.enterPassword);
    translateElement('#login-btn', currentTranslations.loginButton);
    
    // Sidebar
    translateElement('.sidebar-item[data-page="home"] span', currentTranslations.home);
    translateElement('.sidebar-item[data-page="clients"] span', currentTranslations.clientList);
    translateElement('.sidebar-item[data-page="tasks"] span', currentTranslations.tasks);
    translateElement('.sidebar-item[data-page="uploads"] span', currentTranslations.fileUploads);
    translateElement('.sidebar-item[data-page="profile"] span', currentTranslations.profile);
    
    // Navbar
    translatePlaceholder('.search-input', currentTranslations.search);
    translateElement('.dropdown-item[data-page="profile"]', currentTranslations.profile);
    translateElement('#logout-btn', currentTranslations.logout);
    
    // Home page
    translateElement('#home-page h1', currentTranslations.dashboard);
    translateElement('.welcome-subtitle', currentTranslations.welcomeSubtitle);
    translateElement('.dashboard-card:nth-child(1) h3', currentTranslations.totalClients);
    translateElement('.dashboard-card:nth-child(2) h3', currentTranslations.activeTasks);
    translateElement('.dashboard-card:nth-child(3) h3', currentTranslations.completedTasks);
    translateElement('.dashboard-card:nth-child(4) h3', currentTranslations.totalFiles);
    translateElement('.recent-activity h2', currentTranslations.recentActivity);
    
    // Profile page
    translateElement('#profile-page h1', currentTranslations.profileTitle);
    translateElement('#profile-page label:nth-of-type(1)', currentTranslations.username);
    translateElement('#profile-page label:nth-of-type(2)', currentTranslations.fullName);
    translateElement('#profile-page label:nth-of-type(3)', currentTranslations.email);
    translateElement('#profile-page label:nth-of-type(4)', currentTranslations.currentPassword);
    translateElement('#profile-page label:nth-of-type(5)', currentTranslations.newPassword);
    translateElement('#profile-page label:nth-of-type(6)', currentTranslations.confirmPassword);
    translateElement('#save-profile-btn', currentTranslations.saveChanges);
    
    // Client List page
    translateElement('#clients-page h1', currentTranslations.clientListTitle);
    translateElement('#add-client-btn', currentTranslations.addNewClient);
    translateElement('#export-excel-btn', currentTranslations.exportToExcel);
    translatePlaceholder('#client-search', currentTranslations.searchClients);
    translateOption('#client-filter option[value="all"]', currentTranslations.allClients);
    translateOption('#client-filter option[value="active"]', currentTranslations.active);
    translateOption('#client-filter option[value="inactive"]', currentTranslations.inactive);
    translateElement('.tab-btn[data-tab="main-info"]', currentTranslations.mainInfo);
    translateElement('.tab-btn[data-tab="cnss-info"]', currentTranslations.cnssInfo);
    translateElement('#clients-table th:nth-child(1)', currentTranslations.name);
    translateElement('#clients-table th:nth-child(2)', currentTranslations.dgiLogin);
    translateElement('#clients-table th:nth-child(3)', currentTranslations.email);
    translateElement('#clients-table th:nth-child(4)', currentTranslations.phone);
    translateElement('#clients-table th:nth-child(5)', currentTranslations.nif);
    translateElement('#clients-table th:nth-child(6)', currentTranslations.ice);
    translateElement('#clients-table th:nth-child(7)', currentTranslations.patent);
    translateElement('#clients-table th:nth-child(8)', currentTranslations.actions);
    translateElement('#client-modal-title', currentTranslations.clientDetails);
    translateElement('#delete-confirmation-modal h2', currentTranslations.confirmDelete);
    translateElement('#delete-confirmation-modal p', currentTranslations.deleteClientConfirm);
    translateElement('#cancel-delete-btn', currentTranslations.cancel);
    translateElement('#confirm-delete-btn', currentTranslations.delete);
    
    // Tasks page
    translateElement('#tasks-page h1', currentTranslations.tasksTitle);
    translateElement('.current-period-info .current-label', currentTranslations.currentPeriod);
    translateElement('.task-period-info .current-label', currentTranslations.showingTasksFor);
    translateElement('#tasks-table th:nth-child(1)', currentTranslations.client);
    translateElement('#tasks-table th:nth-child(2)', currentTranslations.deadline);
    translateElement('#tasks-table th:nth-child(3)', currentTranslations.status);
    translateElement('#tasks-table th:nth-child(4)', currentTranslations.notes);
    translateElement('#tasks-table th:nth-child(5)', currentTranslations.actions);
    translateElement('#add-client-task-btn', currentTranslations.assignTask);
    translatePlaceholder('#task-search', currentTranslations.searchTasks);
    translateOption('#task-status-filter option[value="all"]', currentTranslations.allStatuses);
    translateOption('#task-status-filter option[value="Not Started"]', currentTranslations.notStarted);
    translateOption('#task-status-filter option[value="In Progress"]', currentTranslations.inProgress);
    translateOption('#task-status-filter option[value="Done"]', currentTranslations.done);
    translateOption('#task-due-date-filter option[value="all"]', currentTranslations.allDueDates);
    translateOption('#task-due-date-filter option[value="upcoming"]', currentTranslations.upcoming);
    translateOption('#task-due-date-filter option[value="overdue"]', currentTranslations.overdue);
    translateOption('#task-due-date-filter option[value="thisWeek"]', currentTranslations.thisWeek);
    translateOption('#task-due-date-filter option[value="thisMonth"]', currentTranslations.thisMonth);
    translateElement('#task-status-modal h2', currentTranslations.updateTaskStatus);
    translateElement('#client-task-modal h2', currentTranslations.assignTaskToClients);
    translateElement('#cancel-status-update', currentTranslations.cancel);
    translateElement('#save-status-update', currentTranslations.save);
    translateElement('#cancel-client-task', currentTranslations.cancel);
    translateElement('#assign-client-task', currentTranslations.assignTask);
    translateElement('label[for="task-status"]', currentTranslations.status);
    translateElement('label[for="task-notes"]', currentTranslations.notes);
    
    // File Uploads page
    translateElement('#uploads-page h1', currentTranslations.fileUploadsTitle);
    translateElement('#upload-file-btn', currentTranslations.uploadFile);
    translatePlaceholder('#file-search', currentTranslations.searchFiles);
    translateOption('#file-filter option[value="all"]', currentTranslations.allFiles);
    translateOption('#file-filter option[value="documents"]', currentTranslations.documents);
    translateOption('#file-filter option[value="images"]', currentTranslations.images);
    translateOption('#file-filter option[value="spreadsheets"]', currentTranslations.spreadsheets);
    translateOption('#file-filter option[value="others"]', currentTranslations.others);
    translateElement('#upload-area p', currentTranslations.dragDropFiles);
    translateElement('.dropzone-info', currentTranslations.maxFileSize);
    translateElement('#file-upload-modal h2', currentTranslations.uploadFile);
    translateElement('label[for="file-client"]', currentTranslations.selectClient);
    translateElement('label[for="file-category"]', currentTranslations.fileCategory);
    translateElement('label[for="file-description"]', currentTranslations.description);
    translatePlaceholder('#file-description', currentTranslations.enterDescription);
    translateElement('#modal-upload-area p', currentTranslations.dragDropFiles);
    translateElement('#cancel-upload', currentTranslations.cancel);
    translateElement('#confirm-upload', currentTranslations.confirmUpload);
    translateElement('#file-preview-modal .modal-header h2', currentTranslations.filePreview);
    translateElement('.file-details h3', currentTranslations.fileDetails);
    translateElement('.detail-label:nth-of-type(1)', currentTranslations.client);
    translateElement('.detail-label:nth-of-type(2)', currentTranslations.type);
    translateElement('.detail-label:nth-of-type(3)', currentTranslations.size);
    translateElement('.detail-label:nth-of-type(4)', currentTranslations.uploadDate);
    translateElement('.detail-label:nth-of-type(5)', currentTranslations.description);
    translateElement('#download-file-link', currentTranslations.download);
    translateElement('#delete-file-btn', currentTranslations.delete);
}

// Helper functions for translations
function translateElement(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

function translatePlaceholder(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.placeholder = text;
    }
}

function translateOption(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = text;
    }
}

// Function to get the current language
function getCurrentLanguage() {
    const langSelector = document.getElementById('language-selector'); // Fetch when needed
    const savedLanguage = localStorage.getItem('preferredLanguage');
    // Check if saved language is valid and exists in our translations
    if (savedLanguage && window.translations && window.translations[savedLanguage]) {
        return savedLanguage;
    }
    // Fall back to language selector's current value if valid, otherwise 'en'
    if (langSelector && window.translations && window.translations[langSelector.value]) {
        return langSelector.value;
    }
    return 'en'; // Default fallback
}

// Expose translation functions globally
// window.translations is already assigned at the top of the file.
window.getCurrentLanguage = getCurrentLanguage;
window.getTranslation = function(key, fallbackValue = null) {
    const lang = getCurrentLanguage();
    const langTranslations = (window.translations && window.translations[lang]) ? window.translations[lang] : (window.translations ? window.translations.en : {});
    
    if (langTranslations && langTranslations[key] !== undefined) {
        return langTranslations[key];
    }
    if (fallbackValue !== null) {
        return fallbackValue;
    }
    return key; // Fallback to the key itself if no translation and no fallbackValue provided
};
