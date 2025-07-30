// Database Management System
// Handles both Firebase and localStorage operations

class DatabaseManager {
    constructor() {
        this.userId = this.generateUserId();
        this.isFirebaseAvailable = typeof firebase !== 'undefined' && window.FirebaseDB;
        this.syncInterval = 30000; // 30 seconds
        this.setupAutoSync();
    }

    // Generate unique user ID
    generateUserId() {
        let userId = localStorage.getItem('teacherUserId');
        if (!userId) {
            userId = 'teacher_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('teacherUserId', userId);
        }
        return userId;
    }

    // Setup automatic sync with Firebase
    setupAutoSync() {
        if (this.isFirebaseAvailable) {
            setInterval(() => {
                this.syncAllData();
            }, this.syncInterval);
        }
    }

    // Save data with fallback to localStorage
    async saveData(collection, data) {
        const localKey = `teacher${collection.charAt(0).toUpperCase() + collection.slice(1)}Data`;
        
        // Always save to localStorage first
        try {
            localStorage.setItem(localKey, JSON.stringify(data));
            console.log(`Data saved to localStorage: ${collection}`);
        } catch (error) {
            console.error(`Error saving to localStorage: ${collection}`, error);
        }

        // Try to save to Firebase if available
        if (this.isFirebaseAvailable) {
            try {
                const saveMethod = `save${collection.charAt(0).toUpperCase() + collection.slice(1)}Data`;
                const success = await window.FirebaseDB[saveMethod](this.userId, data);
                if (success) {
                    console.log(`Data synced to Firebase: ${collection}`);
                    return { local: true, firebase: true };
                }
            } catch (error) {
                console.error(`Error saving to Firebase: ${collection}`, error);
            }
        }

        return { local: true, firebase: false };
    }

    // Load data with fallback to localStorage
    async loadData(collection) {
        const localKey = `teacher${collection.charAt(0).toUpperCase() + collection.slice(1)}Data`;
        let data = null;

        // Try to load from Firebase first if available
        if (this.isFirebaseAvailable) {
            try {
                const loadMethod = `load${collection.charAt(0).toUpperCase() + collection.slice(1)}Data`;
                data = await window.FirebaseDB[loadMethod](this.userId);
                if (data) {
                    console.log(`Data loaded from Firebase: ${collection}`);
                    // Update localStorage with Firebase data
                    localStorage.setItem(localKey, JSON.stringify(data));
                    return data;
                }
            } catch (error) {
                console.error(`Error loading from Firebase: ${collection}`, error);
            }
        }

        // Fallback to localStorage
        try {
            const localData = localStorage.getItem(localKey);
            if (localData) {
                data = JSON.parse(localData);
                console.log(`Data loaded from localStorage: ${collection}`);
            }
        } catch (error) {
            console.error(`Error loading from localStorage: ${collection}`, error);
        }

        return data;
    }

    // Upload file with fallback to localStorage
    async uploadFile(fileName, fileData) {
        // Always save to localStorage
        const fileKey = `teacherFile_${fileName}_${Date.now()}`;
        try {
            localStorage.setItem(fileKey, fileData);
            console.log(`File saved to localStorage: ${fileName}`);
        } catch (error) {
            console.error(`Error saving file to localStorage: ${fileName}`, error);
        }

        // Try to upload to Firebase Storage if available
        if (this.isFirebaseAvailable) {
            try {
                const downloadURL = await window.FirebaseDB.uploadFile(this.userId, fileName, fileData);
                if (downloadURL) {
                    console.log(`File uploaded to Firebase Storage: ${fileName}`);
                    return { local: fileKey, firebase: downloadURL };
                }
            } catch (error) {
                console.error(`Error uploading file to Firebase Storage: ${fileName}`, error);
            }
        }

        return { local: fileKey, firebase: null };
    }

    // Sync all data to Firebase
    async syncAllData() {
        if (!this.isFirebaseAvailable) return;

        const collections = ['user', 'cv', 'performance', 'documentation', 'improvement'];
        
        for (const collection of collections) {
            try {
                const localKey = `teacher${collection.charAt(0).toUpperCase() + collection.slice(1)}Data`;
                const localData = localStorage.getItem(localKey);
                
                if (localData) {
                    const data = JSON.parse(localData);
                    const saveMethod = `save${collection.charAt(0).toUpperCase() + collection.slice(1)}Data`;
                    await window.FirebaseDB[saveMethod](this.userId, data);
                }
            } catch (error) {
                console.error(`Error syncing ${collection} data:`, error);
            }
        }
        
        console.log('Data sync completed');
    }

    // Get sync status
    getSyncStatus() {
        return {
            userId: this.userId,
            firebaseAvailable: this.isFirebaseAvailable,
            lastSync: new Date().toISOString()
        };
    }

    // Export all data
    async exportAllData() {
        const exportData = {
            userId: this.userId,
            timestamp: new Date().toISOString(),
            data: {}
        };

        const collections = ['user', 'cv', 'performance', 'documentation', 'improvement'];
        
        for (const collection of collections) {
            const data = await this.loadData(collection);
            if (data) {
                exportData.data[collection] = data;
            }
        }

        return exportData;
    }

    // Import data
    async importData(importData) {
        if (!importData.data) {
            throw new Error('Invalid import data format');
        }

        const results = {};
        
        for (const [collection, data] of Object.entries(importData.data)) {
            try {
                const result = await this.saveData(collection, data);
                results[collection] = result;
            } catch (error) {
                console.error(`Error importing ${collection} data:`, error);
                results[collection] = { error: error.message };
            }
        }

        return results;
    }

    // Clear all data
    async clearAllData() {
        const collections = ['user', 'cv', 'performance', 'documentation', 'improvement'];
        
        // Clear localStorage
        collections.forEach(collection => {
            const localKey = `teacher${collection.charAt(0).toUpperCase() + collection.slice(1)}Data`;
            localStorage.removeItem(localKey);
        });

        // Clear Firebase if available
        if (this.isFirebaseAvailable) {
            try {
                for (const collection of collections) {
                    const saveMethod = `save${collection.charAt(0).toUpperCase() + collection.slice(1)}Data`;
                    await window.FirebaseDB[saveMethod](this.userId, {});
                }
            } catch (error) {
                console.error('Error clearing Firebase data:', error);
            }
        }

        console.log('All data cleared');
    }
}

// Create global database manager instance
window.dbManager = new DatabaseManager();

// Enhanced save functions for each module
window.enhancedSave = {
    async saveUserData(data) {
        return await window.dbManager.saveData('user', data);
    },

    async saveCVData(data) {
        return await window.dbManager.saveData('cv', data);
    },

    async savePerformanceData(data) {
        return await window.dbManager.saveData('performance', data);
    },

    async saveDocumentationData(data) {
        return await window.dbManager.saveData('documentation', data);
    },

    async saveImprovementData(data) {
        return await window.dbManager.saveData('improvement', data);
    }
};

// Enhanced load functions for each module
window.enhancedLoad = {
    async loadUserData() {
        return await window.dbManager.loadData('user');
    },

    async loadCVData() {
        return await window.dbManager.loadData('cv');
    },

    async loadPerformanceData() {
        return await window.dbManager.loadData('performance');
    },

    async loadDocumentationData() {
        return await window.dbManager.loadData('documentation');
    },

    async loadImprovementData() {
        return await window.dbManager.loadData('improvement');
    }
};

console.log('Database Manager initialized');
console.log('User ID:', window.dbManager.userId);
console.log('Firebase available:', window.dbManager.isFirebaseAvailable);

