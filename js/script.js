// Global variables
let userData = {
    teacherName: '',
    educationOffice: '',
    school: '',
    academicYear: ''
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserData();
});

// Initialize the application
function initializeApp() {
    console.log('تم تحميل التطبيق بنجاح');
    
    // Set default active tab
    const homeTab = document.querySelector('[data-tab="home"]');
    const homeContent = document.getElementById('home');
    
    if (homeTab && homeContent) {
        homeTab.classList.add('active');
        homeContent.classList.add('active');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Basic info form
    const basicInfoForm = document.querySelector('.basic-info-form');
    if (basicInfoForm) {
        basicInfoForm.addEventListener('submit', handleBasicInfoSubmit);
    }

    // Auto-save on input change
    const formInputs = document.querySelectorAll('#teacherName, #educationOffice, #school, #academicYear');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            userData[this.id] = this.value;
            updateHeaderDisplay();
        });
    });
}

// Switch between tabs
function switchTab(targetTab) {
    // Remove active class from all tabs and content
    const allTabs = document.querySelectorAll('.nav-tab');
    const allContent = document.querySelectorAll('.tab-content');
    
    allTabs.forEach(tab => tab.classList.remove('active'));
    allContent.forEach(content => content.classList.remove('active'));
    
    // Add active class to target tab and content
    const targetTabElement = document.querySelector(`[data-tab="${targetTab}"]`);
    const targetContent = document.getElementById(targetTab);
    
    if (targetTabElement && targetContent) {
        targetTabElement.classList.add('active');
        targetContent.classList.add('active');
        
        // Scroll to top when switching tabs
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Handle basic info form submission
function handleBasicInfoSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Update userData object
    userData.teacherName = formData.get('teacherName');
    userData.educationOffice = formData.get('educationOffice');
    userData.school = formData.get('school');
    userData.academicYear = formData.get('academicYear');
    
    // Save to localStorage
    saveUserData();
    
    // Update header display
    updateHeaderDisplay();
    
    // Show success message
    showNotification('تم حفظ البيانات بنجاح!', 'success');
}

// Update header display with user data
function updateHeaderDisplay() {
    const teacherNameDisplay = document.getElementById('teacherNameDisplay');
    const educationOfficeDisplay = document.getElementById('educationOfficeDisplay');
    const schoolDisplay = document.getElementById('schoolDisplay');
    const academicYearDisplay = document.getElementById('academicYearDisplay');
    
    if (teacherNameDisplay) {
        teacherNameDisplay.textContent = userData.teacherName || '';
    }
    
    if (educationOfficeDisplay) {
        educationOfficeDisplay.textContent = userData.educationOffice || 'غير محدد';
    }
    
    if (schoolDisplay) {
        schoolDisplay.textContent = userData.school || 'غير محدد';
    }
    
    if (academicYearDisplay) {
        academicYearDisplay.textContent = userData.academicYear || 'غير محدد';
    }
}

// Save user data to localStorage
function saveUserData() {
    try {
        localStorage.setItem('teacherPerformanceData', JSON.stringify(userData));
        console.log('تم حفظ البيانات في التخزين المحلي');
    } catch (error) {
        console.error('خطأ في حفظ البيانات:', error);
        showNotification('حدث خطأ في حفظ البيانات', 'error');
    }
}

// Load user data from localStorage
function loadUserData() {
    try {
        const savedData = localStorage.getItem('teacherPerformanceData');
        if (savedData) {
            userData = JSON.parse(savedData);
            
            // Fill form fields
            const teacherNameInput = document.getElementById('teacherName');
            const educationOfficeInput = document.getElementById('educationOffice');
            const schoolInput = document.getElementById('school');
            const academicYearInput = document.getElementById('academicYear');
            
            if (teacherNameInput) teacherNameInput.value = userData.teacherName || '';
            if (educationOfficeInput) educationOfficeInput.value = userData.educationOffice || '';
            if (schoolInput) schoolInput.value = userData.school || '';
            if (academicYearInput) academicYearInput.value = userData.academicYear || '';
            
            // Update header display
            updateHeaderDisplay();
            
            console.log('تم تحميل البيانات من التخزين المحلي');
        }
    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-family: 'Cairo', sans-serif;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility function to format date
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    return new Intl.DateTimeFormat('ar-SA', options).format(date);
}

// Utility function to validate form data
function validateFormData(data) {
    const errors = [];
    
    if (!data.teacherName || data.teacherName.trim().length < 2) {
        errors.push('اسم المعلم مطلوب ويجب أن يكون أكثر من حرفين');
    }
    
    if (!data.educationOffice || data.educationOffice.trim().length < 2) {
        errors.push('الإدارة التعليمية مطلوبة');
    }
    
    if (!data.school || data.school.trim().length < 2) {
        errors.push('اسم المدرسة مطلوب');
    }
    
    if (!data.academicYear || data.academicYear.trim().length < 4) {
        errors.push('العام الدراسي مطلوب');
    }
    
    return errors;
}

// Export functions for use in other modules (if needed)
window.TeacherPerformanceApp = {
    switchTab,
    saveUserData,
    loadUserData,
    updateHeaderDisplay,
    showNotification,
    userData
};



// CV Page Functions
let cvData = {
    basicInfo: {},
    license: null,
    certificates: [],
    courses: []
};

// Initialize CV page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupCVEventListeners();
    loadCVData();
});

// Setup CV event listeners
function setupCVEventListeners() {
    // Basic info form
    const basicInfoForm = document.getElementById('basicInfoForm');
    if (basicInfoForm) {
        basicInfoForm.addEventListener('submit', handleBasicInfoSubmit);
    }

    // License upload
    const licenseUpload = document.getElementById('licenseUpload');
    const licenseFile = document.getElementById('licenseFile');
    if (licenseUpload && licenseFile) {
        licenseUpload.addEventListener('click', () => licenseFile.click());
        licenseFile.addEventListener('change', handleLicenseUpload);
    }

    // Certificates upload
    const certificatesUpload = document.getElementById('certificatesUpload');
    const certificatesFile = document.getElementById('certificatesFile');
    if (certificatesUpload && certificatesFile) {
        certificatesUpload.addEventListener('click', () => certificatesFile.click());
        certificatesFile.addEventListener('change', handleCertificatesUpload);
    }

    // Drag and drop for file uploads
    setupDragAndDrop();
}

// Handle basic info form submission
function handleBasicInfoSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    cvData.basicInfo = {
        fullName: formData.get('fullName'),
        nationalId: formData.get('nationalId'),
        birthDate: formData.get('birthDate'),
        qualification: formData.get('qualification'),
        specialization: formData.get('specialization'),
        experience: formData.get('experience')
    };
    
    saveCVData();
    showNotification('تم حفظ البيانات الأساسية بنجاح!', 'success');
}

// Handle license file upload
function handleLicenseUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showNotification('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            cvData.license = {
                name: file.name,
                type: file.type,
                data: e.target.result
            };
            
            displayLicensePreview(cvData.license);
            saveCVData();
            showNotification('تم رفع الرخصة المهنية بنجاح!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Handle certificates upload
function handleCertificatesUpload(event) {
    const files = Array.from(event.target.files);
    
    if (cvData.certificates.length + files.length > 8) {
        showNotification('لا يمكن رفع أكثر من 8 شهادات', 'error');
        return;
    }
    
    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            showNotification(`حجم الملف ${file.name} كبير جداً. الحد الأقصى 5 ميجابايت.`, 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const certificate = {
                id: Date.now() + Math.random(),
                name: file.name,
                type: file.type,
                data: e.target.result
            };
            
            cvData.certificates.push(certificate);
            displayCertificatesPreview();
            saveCVData();
        };
        reader.readAsDataURL(file);
    });
    
    showNotification('تم رفع الشهادات بنجاح!', 'success');
}

// Display license preview
function displayLicensePreview(license) {
    const preview = document.getElementById('licensePreview');
    if (!preview) return;
    
    preview.innerHTML = `
        <div class="file-item" onclick="openModal('${license.data}', '${license.name}')">
            ${license.type.startsWith('image/') ? 
                `<img src="${license.data}" alt="${license.name}">` :
                `<div class="file-icon">📄</div>`
            }
            <div class="file-info">${license.name}</div>
            <button class="remove-file" onclick="removeLicense(event)">×</button>
        </div>
    `;
}

// Display certificates preview
function displayCertificatesPreview() {
    const preview = document.getElementById('certificatesPreview');
    if (!preview) return;
    
    preview.innerHTML = cvData.certificates.map(cert => `
        <div class="file-item" onclick="openModal('${cert.data}', '${cert.name}')">
            ${cert.type.startsWith('image/') ? 
                `<img src="${cert.data}" alt="${cert.name}">` :
                `<div class="file-icon">📄</div>`
            }
            <div class="file-info">${cert.name}</div>
            <button class="remove-file" onclick="removeCertificate(event, '${cert.id}')">×</button>
        </div>
    `).join('');
}

// Remove license
function removeLicense(event) {
    event.stopPropagation();
    cvData.license = null;
    document.getElementById('licensePreview').innerHTML = '';
    saveCVData();
    showNotification('تم حذف الرخصة المهنية', 'info');
}

// Remove certificate
function removeCertificate(event, certId) {
    event.stopPropagation();
    cvData.certificates = cvData.certificates.filter(cert => cert.id != certId);
    displayCertificatesPreview();
    saveCVData();
    showNotification('تم حذف الشهادة', 'info');
}

// Add new course
function addCourse() {
    const container = document.getElementById('coursesContainer');
    const courseItem = document.createElement('div');
    courseItem.className = 'course-item';
    courseItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>اسم الدورة:</label>
                <input type="text" name="courseName" placeholder="اسم الدورة التدريبية">
            </div>
            <div class="form-group">
                <label>الجهة المنظمة:</label>
                <input type="text" name="courseOrganizer" placeholder="الجهة المنظمة">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>تاريخ الدورة:</label>
                <input type="date" name="courseDate">
            </div>
            <div class="form-group">
                <label>عدد الساعات:</label>
                <input type="number" name="courseHours" min="1" placeholder="عدد الساعات">
            </div>
        </div>
        <button type="button" class="remove-course-btn" onclick="removeCourse(this)">حذف الدورة</button>
    `;
    container.appendChild(courseItem);
}

// Remove course
function removeCourse(button) {
    const courseItem = button.closest('.course-item');
    const container = document.getElementById('coursesContainer');
    
    if (container.children.length > 1) {
        courseItem.remove();
    } else {
        showNotification('يجب الاحتفاظ بدورة واحدة على الأقل', 'error');
    }
}

// Save courses
function saveCourses() {
    const courseItems = document.querySelectorAll('.course-item');
    cvData.courses = [];
    
    courseItems.forEach(item => {
        const courseName = item.querySelector('[name="courseName"]').value;
        const courseOrganizer = item.querySelector('[name="courseOrganizer"]').value;
        const courseDate = item.querySelector('[name="courseDate"]').value;
        const courseHours = item.querySelector('[name="courseHours"]').value;
        
        if (courseName || courseOrganizer || courseDate || courseHours) {
            cvData.courses.push({
                name: courseName,
                organizer: courseOrganizer,
                date: courseDate,
                hours: courseHours
            });
        }
    });
    
    saveCVData();
    showNotification('تم حفظ الدورات التدريبية بنجاح!', 'success');
}

// Setup drag and drop
function setupDragAndDrop() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (this.id === 'licenseUpload' && files.length > 0) {
                document.getElementById('licenseFile').files = files;
                handleLicenseUpload({ target: { files: files } });
            } else if (this.id === 'certificatesUpload' && files.length > 0) {
                document.getElementById('certificatesFile').files = files;
                handleCertificatesUpload({ target: { files: files } });
            }
        });
    });
}

// Open modal for file preview
function openModal(src, title) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="closeModal()">&times;</span>
            ${src.startsWith('data:image/') ? 
                `<img src="${src}" alt="${title}">` :
                `<iframe src="${src}" width="100%" height="600px" title="${title}"></iframe>`
            }
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'none';
        setTimeout(() => modal.remove(), 300);
    }
}

// Save CV data to localStorage
function saveCVData() {
    try {
        localStorage.setItem('teacherCVData', JSON.stringify(cvData));
        console.log('تم حفظ بيانات السيرة الذاتية');
    } catch (error) {
        console.error('خطأ في حفظ بيانات السيرة الذاتية:', error);
        showNotification('حدث خطأ في حفظ البيانات', 'error');
    }
}

// Load CV data from localStorage
function loadCVData() {
    try {
        const savedData = localStorage.getItem('teacherCVData');
        if (savedData) {
            cvData = JSON.parse(savedData);
            
            // Fill basic info form
            if (cvData.basicInfo) {
                Object.keys(cvData.basicInfo).forEach(key => {
                    const input = document.getElementById(key);
                    if (input) {
                        input.value = cvData.basicInfo[key] || '';
                    }
                });
            }
            
            // Display license preview
            if (cvData.license) {
                displayLicensePreview(cvData.license);
            }
            
            // Display certificates preview
            if (cvData.certificates && cvData.certificates.length > 0) {
                displayCertificatesPreview();
            }
            
            // Load courses
            if (cvData.courses && cvData.courses.length > 0) {
                loadCourses();
            }
            
            console.log('تم تحميل بيانات السيرة الذاتية');
        }
    } catch (error) {
        console.error('خطأ في تحميل بيانات السيرة الذاتية:', error);
    }
}

// Load courses from saved data
function loadCourses() {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = '';
    
    cvData.courses.forEach((course, index) => {
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        courseItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>اسم الدورة:</label>
                    <input type="text" name="courseName" value="${course.name || ''}" placeholder="اسم الدورة التدريبية">
                </div>
                <div class="form-group">
                    <label>الجهة المنظمة:</label>
                    <input type="text" name="courseOrganizer" value="${course.organizer || ''}" placeholder="الجهة المنظمة">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>تاريخ الدورة:</label>
                    <input type="date" name="courseDate" value="${course.date || ''}">
                </div>
                <div class="form-group">
                    <label>عدد الساعات:</label>
                    <input type="number" name="courseHours" value="${course.hours || ''}" min="1" placeholder="عدد الساعات">
                </div>
            </div>
            <button type="button" class="remove-course-btn" onclick="removeCourse(this)">حذف الدورة</button>
        `;
        container.appendChild(courseItem);
    });
    
    // Add at least one course item if none exist
    if (cvData.courses.length === 0) {
        addCourse();
    }
}


// Performance Page Functions
let performanceData = {
    ratings: {},
    notes: {},
    files: {}
};

// Performance weights for calculation
const performanceWeights = {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 5, 9: 5, 10: 10, 11: 10
};

// Initialize performance page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupPerformanceEventListeners();
    loadPerformanceData();
});

// Setup performance event listeners
function setupPerformanceEventListeners() {
    // Load existing data on page load
    loadPerformanceData();
}

// Toggle note section
function toggleNote(itemId) {
    const noteSection = document.getElementById(`note-${itemId}`);
    if (noteSection) {
        if (noteSection.style.display === 'none' || noteSection.style.display === '') {
            noteSection.style.display = 'block';
            // Focus on textarea
            const textarea = noteSection.querySelector('textarea');
            if (textarea) {
                setTimeout(() => textarea.focus(), 100);
            }
        } else {
            noteSection.style.display = 'none';
        }
    }
}

// Open file upload
function openFileUpload(itemId) {
    const fileInput = document.getElementById(`files-${itemId}`);
    if (fileInput) {
        fileInput.click();
    }
}

// Save note
function saveNote(itemId, value) {
    performanceData.notes[itemId] = value;
    savePerformanceData();
    showNotification(`تم حفظ ملاحظة البند ${itemId}`, 'success');
}

// Update rating
function updateRating(itemId, rating) {
    performanceData.ratings[itemId] = rating;
    calculateOverallRating();
    savePerformanceData();
    showNotification(`تم تحديث تقييم البند ${itemId}`, 'success');
}

// Handle file upload for performance items
function handleFileUpload(itemId, files) {
    if (!performanceData.files[itemId]) {
        performanceData.files[itemId] = [];
    }
    
    Array.from(files).forEach(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showNotification(`حجم الملف ${file.name} كبير جداً. الحد الأقصى 10 ميجابايت.`, 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileData = {
                id: Date.now() + Math.random(),
                name: file.name,
                type: file.type,
                data: e.target.result,
                itemId: itemId
            };
            
            performanceData.files[itemId].push(fileData);
            displayPerformanceFiles(itemId);
            savePerformanceData();
        };
        reader.readAsDataURL(file);
    });
    
    showNotification(`تم رفع الملفات للبند ${itemId} بنجاح!`, 'success');
}

// Display performance files
function displayPerformanceFiles(itemId) {
    const preview = document.getElementById(`preview-${itemId}`);
    if (!preview || !performanceData.files[itemId]) return;
    
    preview.innerHTML = performanceData.files[itemId].map(file => `
        <div class="file-item" onclick="openModal('${file.data}', '${file.name}')">
            ${file.type.startsWith('image/') ? 
                `<img src="${file.data}" alt="${file.name}">` :
                `<div class="file-icon" style="display: flex; align-items: center; justify-content: center; height: 80px; background: #f8f9fa; color: #666; font-size: 2rem;">📄</div>`
            }
            <div class="file-info">${file.name}</div>
            <button class="remove-file" onclick="removePerformanceFile(event, ${itemId}, '${file.id}')">×</button>
        </div>
    `).join('');
}

// Remove performance file
function removePerformanceFile(event, itemId, fileId) {
    event.stopPropagation();
    if (performanceData.files[itemId]) {
        performanceData.files[itemId] = performanceData.files[itemId].filter(file => file.id != fileId);
        displayPerformanceFiles(itemId);
        savePerformanceData();
        showNotification(`تم حذف الملف من البند ${itemId}`, 'info');
    }
}

// Calculate overall rating
function calculateOverallRating() {
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.keys(performanceWeights).forEach(itemId => {
        const rating = performanceData.ratings[itemId];
        const weight = performanceWeights[itemId];
        
        if (rating) {
            totalScore += (rating * weight);
            totalWeight += weight;
        }
    });
    
    const overallScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;
    const percentage = (overallScore / 5) * 100;
    
    // Update display
    const scoreElement = document.getElementById('overallScore');
    const percentageElement = document.getElementById('overallPercentage');
    
    if (scoreElement) {
        scoreElement.textContent = overallScore.toFixed(2);
    }
    
    if (percentageElement) {
        percentageElement.textContent = `${percentage.toFixed(1)}%`;
        
        // Color coding based on percentage
        if (percentage >= 90) {
            percentageElement.style.color = '#28a745'; // Green
        } else if (percentage >= 80) {
            percentageElement.style.color = '#ffc107'; // Yellow
        } else if (percentage >= 70) {
            percentageElement.style.color = '#fd7e14'; // Orange
        } else {
            percentageElement.style.color = '#dc3545'; // Red
        }
    }
    
    return { score: overallScore, percentage: percentage };
}

// Save all performance data
function saveAllPerformanceData() {
    // Collect all notes
    document.querySelectorAll('.note-section textarea').forEach(textarea => {
        const noteId = textarea.closest('.note-section').id.split('-')[1];
        if (textarea.value.trim()) {
            performanceData.notes[noteId] = textarea.value;
        }
    });
    
    savePerformanceData();
    
    const result = calculateOverallRating();
    showNotification(`تم حفظ جميع بيانات شواهد الأداء الوظيفي! النتيجة الإجمالية: ${result.score.toFixed(2)}/5.00 (${result.percentage.toFixed(1)}%)`, 'success');
}

// Save performance data to localStorage
function savePerformanceData() {
    try {
        localStorage.setItem('teacherPerformanceData', JSON.stringify(performanceData));
        console.log('تم حفظ بيانات شواهد الأداء الوظيفي');
    } catch (error) {
        console.error('خطأ في حفظ بيانات شواهد الأداء الوظيفي:', error);
        showNotification('حدث خطأ في حفظ البيانات', 'error');
    }
}

// Load performance data from localStorage
function loadPerformanceData() {
    try {
        const savedData = localStorage.getItem('teacherPerformanceData');
        if (savedData) {
            performanceData = JSON.parse(savedData);
            
            // Load ratings
            Object.keys(performanceData.ratings).forEach(itemId => {
                const rating = performanceData.ratings[itemId];
                const radioButton = document.querySelector(`input[name="rating-${itemId}"][value="${rating}"]`);
                if (radioButton) {
                    radioButton.checked = true;
                }
            });
            
            // Load notes
            Object.keys(performanceData.notes).forEach(itemId => {
                const noteSection = document.getElementById(`note-${itemId}`);
                if (noteSection) {
                    const textarea = noteSection.querySelector('textarea');
                    if (textarea) {
                        textarea.value = performanceData.notes[itemId];
                    }
                }
            });
            
            // Load files
            Object.keys(performanceData.files).forEach(itemId => {
                if (performanceData.files[itemId] && performanceData.files[itemId].length > 0) {
                    displayPerformanceFiles(itemId);
                }
            });
            
            // Calculate and display overall rating
            calculateOverallRating();
            
            console.log('تم تحميل بيانات شواهد الأداء الوظيفي');
        }
    } catch (error) {
        console.error('خطأ في تحميل بيانات شواهد الأداء الوظيفي:', error);
    }
}

// Get performance summary for reports
function getPerformanceSummary() {
    const summary = {
        overallRating: calculateOverallRating(),
        itemRatings: {},
        totalNotes: Object.keys(performanceData.notes).length,
        totalFiles: Object.values(performanceData.files).reduce((total, files) => total + files.length, 0)
    };
    
    Object.keys(performanceWeights).forEach(itemId => {
        summary.itemRatings[itemId] = {
            rating: performanceData.ratings[itemId] || 0,
            weight: performanceWeights[itemId],
            hasNote: !!performanceData.notes[itemId],
            fileCount: performanceData.files[itemId] ? performanceData.files[itemId].length : 0
        };
    });
    
    return summary;
}

// Export performance data
function exportPerformanceData() {
    const summary = getPerformanceSummary();
    const exportData = {
        timestamp: new Date().toISOString(),
        summary: summary,
        fullData: performanceData
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `teacher_performance_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('تم تصدير بيانات شواهد الأداء الوظيفي', 'success');
}

// Validate performance data
function validatePerformanceData() {
    const errors = [];
    
    // Check if all items have ratings
    Object.keys(performanceWeights).forEach(itemId => {
        if (!performanceData.ratings[itemId]) {
            errors.push(`البند ${itemId} لا يحتوي على تقييم`);
        }
    });
    
    // Check if there are sufficient files/evidence
    const itemsWithoutFiles = Object.keys(performanceWeights).filter(itemId => {
        return !performanceData.files[itemId] || performanceData.files[itemId].length === 0;
    });
    
    if (itemsWithoutFiles.length > 0) {
        errors.push(`البنود التالية لا تحتوي على شواهد: ${itemsWithoutFiles.join(', ')}`);
    }
    
    return errors;
}

// Add to global scope for external access
window.PerformanceModule = {
    saveAllPerformanceData,
    exportPerformanceData,
    getPerformanceSummary,
    validatePerformanceData,
    performanceData
};


// Documentation and Improvement Pages Functions
let documentationData = {
    followUps: []
};

let improvementData = {
    plans: []
};

// Initialize documentation and improvement pages
document.addEventListener('DOMContentLoaded', function() {
    setupDocumentationEventListeners();
    loadDocumentationData();
    loadImprovementData();
});

// Setup documentation event listeners
function setupDocumentationEventListeners() {
    // Load existing data on page load
    loadDocumentationData();
    loadImprovementData();
}

// Add new follow-up
function addFollowUp() {
    const container = document.getElementById('followUpsContainer');
    const followUpItem = document.createElement('div');
    followUpItem.className = 'follow-up-item';
    followUpItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>المتابعة:</label>
                <textarea name="followUpText" placeholder="اكتب تفاصيل المتابعة هنا..." rows="4"></textarea>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>التوصيات:</label>
                <textarea name="recommendations" placeholder="اكتب التوصيات هنا..." rows="3"></textarea>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>اسم المتابع:</label>
                <input type="text" name="followerName" placeholder="اسم المتابع">
            </div>
            <div class="form-group">
                <label>تاريخ المتابعة:</label>
                <input type="date" name="followUpDate">
            </div>
        </div>
        <button type="button" class="remove-followup-btn" onclick="removeFollowUp(this)">حذف المتابعة</button>
    `;
    container.appendChild(followUpItem);
}

// Remove follow-up
function removeFollowUp(button) {
    const followUpItem = button.closest('.follow-up-item');
    const container = document.getElementById('followUpsContainer');
    
    if (container.children.length > 1) {
        followUpItem.remove();
    } else {
        showNotification('يجب الاحتفاظ بمتابعة واحدة على الأقل', 'error');
    }
}

// Save follow-ups
function saveFollowUps() {
    const followUpItems = document.querySelectorAll('.follow-up-item');
    documentationData.followUps = [];
    
    followUpItems.forEach((item, index) => {
        const followUpText = item.querySelector('[name="followUpText"]').value;
        const recommendations = item.querySelector('[name="recommendations"]').value;
        const followerName = item.querySelector('[name="followerName"]').value;
        const followUpDate = item.querySelector('[name="followUpDate"]').value;
        
        if (followUpText || recommendations || followerName || followUpDate) {
            documentationData.followUps.push({
                id: Date.now() + index,
                followUpText: followUpText,
                recommendations: recommendations,
                followerName: followerName,
                followUpDate: followUpDate,
                createdAt: new Date().toISOString()
            });
        }
    });
    
    saveDocumentationData();
    showNotification('تم حفظ جميع المتابعات بنجاح!', 'success');
}

// Add new improvement plan
function addImprovementPlan() {
    const container = document.getElementById('improvementPlansContainer');
    const planItem = document.createElement('div');
    planItem.className = 'improvement-plan-item';
    planItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>مجال التحسين:</label>
                <select name="improvementArea">
                    <option value="">اختر مجال التحسين</option>
                    <option value="1">أداء الواجبات الوظيفية</option>
                    <option value="2">التفاعل مع المجتمع المهني</option>
                    <option value="3">التفاعل مع أولياء الأمور</option>
                    <option value="4">تنويع استراتيجيات التدريس</option>
                    <option value="5">تحسين نتائج المتعلمين</option>
                    <option value="6">إعداد وتنفيذ خطة التعلم</option>
                    <option value="7">توظيف التقنيات والوسائل</option>
                    <option value="8">تهيئة البيئة التعليمية</option>
                    <option value="9">الإدارة الصفية</option>
                    <option value="10">تحليل نتائج المتعلمين</option>
                    <option value="11">تنوع أساليب التقويم</option>
                </select>
            </div>
            <div class="form-group">
                <label>أولوية التحسين:</label>
                <select name="priority">
                    <option value="">اختر الأولوية</option>
                    <option value="عالية">عالية</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="منخفضة">منخفضة</option>
                </select>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>هدف التحسين:</label>
                <textarea name="improvementGoal" placeholder="اكتب هدف التحسين المراد تحقيقه..." rows="3"></textarea>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>الإجراءات المقترحة:</label>
                <textarea name="proposedActions" placeholder="اكتب الإجراءات والخطوات المقترحة للتحسين..." rows="4"></textarea>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group">
                <label>تاريخ البداية:</label>
                <input type="date" name="startDate">
            </div>
            <div class="form-group">
                <label>تاريخ النهاية:</label>
                <input type="date" name="endDate">
            </div>
        </div>
        
        <button type="button" class="remove-plan-btn" onclick="removeImprovementPlan(this)">حذف خطة التحسين</button>
    `;
    container.appendChild(planItem);
    updatePriorityStyles();
}

// Remove improvement plan
function removeImprovementPlan(button) {
    const planItem = button.closest('.improvement-plan-item');
    const container = document.getElementById('improvementPlansContainer');
    
    if (container.children.length > 1) {
        planItem.remove();
        updateImprovementSummary();
    } else {
        showNotification('يجب الاحتفاظ بخطة تحسين واحدة على الأقل', 'error');
    }
}

// Save improvement plans
function saveImprovementPlans() {
    const planItems = document.querySelectorAll('.improvement-plan-item');
    improvementData.plans = [];
    
    planItems.forEach((item, index) => {
        const improvementArea = item.querySelector('[name="improvementArea"]').value;
        const priority = item.querySelector('[name="priority"]').value;
        const improvementGoal = item.querySelector('[name="improvementGoal"]').value;
        const proposedActions = item.querySelector('[name="proposedActions"]').value;
        const startDate = item.querySelector('[name="startDate"]').value;
        const endDate = item.querySelector('[name="endDate"]').value;
        
        if (improvementArea || priority || improvementGoal || proposedActions || startDate || endDate) {
            improvementData.plans.push({
                id: Date.now() + index,
                improvementArea: improvementArea,
                priority: priority,
                improvementGoal: improvementGoal,
                proposedActions: proposedActions,
                startDate: startDate,
                endDate: endDate,
                createdAt: new Date().toISOString()
            });
        }
    });
    
    saveImprovementData();
    updateImprovementSummary();
    updatePriorityStyles();
    showNotification('تم حفظ جميع خطط التحسين بنجاح!', 'success');
}

// Update priority styles
function updatePriorityStyles() {
    const planItems = document.querySelectorAll('.improvement-plan-item');
    
    planItems.forEach(item => {
        const prioritySelect = item.querySelector('[name="priority"]');
        const priority = prioritySelect.value;
        
        // Remove existing priority classes
        item.classList.remove('priority-high', 'priority-medium', 'priority-low');
        
        // Add appropriate priority class
        if (priority === 'عالية') {
            item.classList.add('priority-high');
        } else if (priority === 'متوسطة') {
            item.classList.add('priority-medium');
        } else if (priority === 'منخفضة') {
            item.classList.add('priority-low');
        }
        
        // Add event listener for future changes
        prioritySelect.addEventListener('change', function() {
            updatePriorityStyles();
        });
    });
}

// Update improvement summary
function updateImprovementSummary() {
    const planItems = document.querySelectorAll('.improvement-plan-item');
    let totalPlans = 0;
    let highPriorityPlans = 0;
    let activePlans = 0;
    
    const currentDate = new Date();
    
    planItems.forEach(item => {
        const priority = item.querySelector('[name="priority"]').value;
        const startDate = item.querySelector('[name="startDate"]').value;
        const endDate = item.querySelector('[name="endDate"]').value;
        
        if (priority || startDate || endDate) {
            totalPlans++;
            
            if (priority === 'عالية') {
                highPriorityPlans++;
            }
            
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                
                if (currentDate >= start && currentDate <= end) {
                    activePlans++;
                }
            }
        }
    });
    
    // Update summary display
    const totalPlansElement = document.getElementById('totalPlans');
    const highPriorityPlansElement = document.getElementById('highPriorityPlans');
    const activePlansElement = document.getElementById('activePlans');
    
    if (totalPlansElement) totalPlansElement.textContent = totalPlans;
    if (highPriorityPlansElement) highPriorityPlansElement.textContent = highPriorityPlans;
    if (activePlansElement) activePlansElement.textContent = activePlans;
}

// Save documentation data to localStorage
function saveDocumentationData() {
    try {
        localStorage.setItem('teacherDocumentationData', JSON.stringify(documentationData));
        console.log('تم حفظ بيانات التوثيق والمتابعة');
    } catch (error) {
        console.error('خطأ في حفظ بيانات التوثيق والمتابعة:', error);
        showNotification('حدث خطأ في حفظ البيانات', 'error');
    }
}

// Save improvement data to localStorage
function saveImprovementData() {
    try {
        localStorage.setItem('teacherImprovementData', JSON.stringify(improvementData));
        console.log('تم حفظ بيانات خطط التحسين');
    } catch (error) {
        console.error('خطأ في حفظ بيانات خطط التحسين:', error);
        showNotification('حدث خطأ في حفظ البيانات', 'error');
    }
}

// Load documentation data from localStorage
function loadDocumentationData() {
    try {
        const savedData = localStorage.getItem('teacherDocumentationData');
        if (savedData) {
            documentationData = JSON.parse(savedData);
            
            if (documentationData.followUps && documentationData.followUps.length > 0) {
                loadFollowUps();
            }
            
            console.log('تم تحميل بيانات التوثيق والمتابعة');
        }
    } catch (error) {
        console.error('خطأ في تحميل بيانات التوثيق والمتابعة:', error);
    }
}

// Load improvement data from localStorage
function loadImprovementData() {
    try {
        const savedData = localStorage.getItem('teacherImprovementData');
        if (savedData) {
            improvementData = JSON.parse(savedData);
            
            if (improvementData.plans && improvementData.plans.length > 0) {
                loadImprovementPlans();
            }
            
            console.log('تم تحميل بيانات خطط التحسين');
        }
    } catch (error) {
        console.error('خطأ في تحميل بيانات خطط التحسين:', error);
    }
}

// Load follow-ups from saved data
function loadFollowUps() {
    const container = document.getElementById('followUpsContainer');
    container.innerHTML = '';
    
    documentationData.followUps.forEach((followUp, index) => {
        const followUpItem = document.createElement('div');
        followUpItem.className = 'follow-up-item';
        followUpItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>المتابعة:</label>
                    <textarea name="followUpText" placeholder="اكتب تفاصيل المتابعة هنا..." rows="4">${followUp.followUpText || ''}</textarea>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>التوصيات:</label>
                    <textarea name="recommendations" placeholder="اكتب التوصيات هنا..." rows="3">${followUp.recommendations || ''}</textarea>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>اسم المتابع:</label>
                    <input type="text" name="followerName" placeholder="اسم المتابع" value="${followUp.followerName || ''}">
                </div>
                <div class="form-group">
                    <label>تاريخ المتابعة:</label>
                    <input type="date" name="followUpDate" value="${followUp.followUpDate || ''}">
                </div>
            </div>
            <button type="button" class="remove-followup-btn" onclick="removeFollowUp(this)">حذف المتابعة</button>
        `;
        container.appendChild(followUpItem);
    });
    
    // Add at least one follow-up item if none exist
    if (documentationData.followUps.length === 0) {
        addFollowUp();
    }
}

// Load improvement plans from saved data
function loadImprovementPlans() {
    const container = document.getElementById('improvementPlansContainer');
    container.innerHTML = '';
    
    improvementData.plans.forEach((plan, index) => {
        const planItem = document.createElement('div');
        planItem.className = 'improvement-plan-item';
        planItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>مجال التحسين:</label>
                    <select name="improvementArea">
                        <option value="">اختر مجال التحسين</option>
                        <option value="1" ${plan.improvementArea === '1' ? 'selected' : ''}>أداء الواجبات الوظيفية</option>
                        <option value="2" ${plan.improvementArea === '2' ? 'selected' : ''}>التفاعل مع المجتمع المهني</option>
                        <option value="3" ${plan.improvementArea === '3' ? 'selected' : ''}>التفاعل مع أولياء الأمور</option>
                        <option value="4" ${plan.improvementArea === '4' ? 'selected' : ''}>تنويع استراتيجيات التدريس</option>
                        <option value="5" ${plan.improvementArea === '5' ? 'selected' : ''}>تحسين نتائج المتعلمين</option>
                        <option value="6" ${plan.improvementArea === '6' ? 'selected' : ''}>إعداد وتنفيذ خطة التعلم</option>
                        <option value="7" ${plan.improvementArea === '7' ? 'selected' : ''}>توظيف التقنيات والوسائل</option>
                        <option value="8" ${plan.improvementArea === '8' ? 'selected' : ''}>تهيئة البيئة التعليمية</option>
                        <option value="9" ${plan.improvementArea === '9' ? 'selected' : ''}>الإدارة الصفية</option>
                        <option value="10" ${plan.improvementArea === '10' ? 'selected' : ''}>تحليل نتائج المتعلمين</option>
                        <option value="11" ${plan.improvementArea === '11' ? 'selected' : ''}>تنوع أساليب التقويم</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>أولوية التحسين:</label>
                    <select name="priority">
                        <option value="">اختر الأولوية</option>
                        <option value="عالية" ${plan.priority === 'عالية' ? 'selected' : ''}>عالية</option>
                        <option value="متوسطة" ${plan.priority === 'متوسطة' ? 'selected' : ''}>متوسطة</option>
                        <option value="منخفضة" ${plan.priority === 'منخفضة' ? 'selected' : ''}>منخفضة</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>هدف التحسين:</label>
                    <textarea name="improvementGoal" placeholder="اكتب هدف التحسين المراد تحقيقه..." rows="3">${plan.improvementGoal || ''}</textarea>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>الإجراءات المقترحة:</label>
                    <textarea name="proposedActions" placeholder="اكتب الإجراءات والخطوات المقترحة للتحسين..." rows="4">${plan.proposedActions || ''}</textarea>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>تاريخ البداية:</label>
                    <input type="date" name="startDate" value="${plan.startDate || ''}">
                </div>
                <div class="form-group">
                    <label>تاريخ النهاية:</label>
                    <input type="date" name="endDate" value="${plan.endDate || ''}">
                </div>
            </div>
            
            <button type="button" class="remove-plan-btn" onclick="removeImprovementPlan(this)">حذف خطة التحسين</button>
        `;
        container.appendChild(planItem);
    });
    
    // Add at least one plan item if none exist
    if (improvementData.plans.length === 0) {
        addImprovementPlan();
    }
    
    // Update styles and summary
    updatePriorityStyles();
    updateImprovementSummary();
}

// Add to global scope for external access
window.DocumentationModule = {
    saveFollowUps,
    saveImprovementPlans,
    documentationData,
    improvementData
};


// Enhanced Database Integration
// Update existing save functions to use the enhanced database manager

// Override existing save functions
const originalSaveUserData = saveUserData;
const originalSaveCVData = saveCVData;
const originalSavePerformanceData = savePerformanceData;
const originalSaveDocumentationData = saveDocumentationData;
const originalSaveImprovementData = saveImprovementData;

// Enhanced save user data
async function saveUserData() {
    const userData = {
        teacherName: document.getElementById('teacherName')?.value || '',
        teacherNumber: document.getElementById('teacherNumber')?.value || '',
        school: document.getElementById('school')?.value || '',
        subject: document.getElementById('subject')?.value || '',
        educationOffice: document.getElementById('educationOffice')?.value || '',
        lastUpdated: new Date().toISOString()
    };

    try {
        const result = await window.enhancedSave.saveUserData(userData);
        updateHeaderFromUserData();
        
        if (result.firebase) {
            showNotification('تم حفظ البيانات الأساسية وتزامنها مع السحابة!', 'success');
        } else {
            showNotification('تم حفظ البيانات الأساسية محلياً!', 'success');
        }
    } catch (error) {
        console.error('Error saving user data:', error);
        showNotification('حدث خطأ في حفظ البيانات', 'error');
    }
}

// Enhanced save CV data
async function saveCVData() {
    try {
        const result = await window.enhancedSave.saveCVData(cvData);
        
        if (result.firebase) {
            showNotification('تم حفظ بيانات السيرة الذاتية وتزامنها مع السحابة!', 'success');
        } else {
            showNotification('تم حفظ بيانات السيرة الذاتية محلياً!', 'success');
        }
    } catch (error) {
        console.error('Error saving CV data:', error);
        showNotification('حدث خطأ في حفظ بيانات السيرة الذاتية', 'error');
    }
}

// Enhanced save performance data
async function savePerformanceData() {
    try {
        const result = await window.enhancedSave.savePerformanceData(performanceData);
        
        if (result.firebase) {
            console.log('Performance data synced to cloud');
        } else {
            console.log('Performance data saved locally');
        }
    } catch (error) {
        console.error('Error saving performance data:', error);
    }
}

// Enhanced save documentation data
async function saveDocumentationData() {
    try {
        const result = await window.enhancedSave.saveDocumentationData(documentationData);
        
        if (result.firebase) {
            console.log('Documentation data synced to cloud');
        } else {
            console.log('Documentation data saved locally');
        }
    } catch (error) {
        console.error('Error saving documentation data:', error);
    }
}

// Enhanced save improvement data
async function saveImprovementData() {
    try {
        const result = await window.enhancedSave.saveImprovementData(improvementData);
        
        if (result.firebase) {
            console.log('Improvement data synced to cloud');
        } else {
            console.log('Improvement data saved locally');
        }
    } catch (error) {
        console.error('Error saving improvement data:', error);
    }
}

// Enhanced load functions
async function loadUserData() {
    try {
        const userData = await window.enhancedLoad.loadUserData();
        if (userData) {
            document.getElementById('teacherName').value = userData.teacherName || '';
            document.getElementById('teacherNumber').value = userData.teacherNumber || '';
            document.getElementById('school').value = userData.school || '';
            document.getElementById('subject').value = userData.subject || '';
            document.getElementById('educationOffice').value = userData.educationOffice || '';
            updateHeaderFromUserData();
            console.log('User data loaded successfully');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function loadCVData() {
    try {
        const savedCVData = await window.enhancedLoad.loadCVData();
        if (savedCVData) {
            cvData = savedCVData;
            displayCVFiles();
            loadTrainingCourses();
            console.log('CV data loaded successfully');
        }
    } catch (error) {
        console.error('Error loading CV data:', error);
    }
}

async function loadPerformanceData() {
    try {
        const savedPerformanceData = await window.enhancedLoad.loadPerformanceData();
        if (savedPerformanceData) {
            performanceData = savedPerformanceData;
            
            // Load ratings
            Object.keys(performanceData.ratings).forEach(itemId => {
                const rating = performanceData.ratings[itemId];
                const radioButton = document.querySelector(`input[name="rating-${itemId}"][value="${rating}"]`);
                if (radioButton) {
                    radioButton.checked = true;
                }
            });
            
            // Load notes
            Object.keys(performanceData.notes).forEach(itemId => {
                const noteSection = document.getElementById(`note-${itemId}`);
                if (noteSection) {
                    const textarea = noteSection.querySelector('textarea');
                    if (textarea) {
                        textarea.value = performanceData.notes[itemId];
                    }
                }
            });
            
            // Load files
            Object.keys(performanceData.files).forEach(itemId => {
                if (performanceData.files[itemId] && performanceData.files[itemId].length > 0) {
                    displayPerformanceFiles(itemId);
                }
            });
            
            calculateOverallRating();
            console.log('Performance data loaded successfully');
        }
    } catch (error) {
        console.error('Error loading performance data:', error);
    }
}

async function loadDocumentationData() {
    try {
        const savedDocumentationData = await window.enhancedLoad.loadDocumentationData();
        if (savedDocumentationData) {
            documentationData = savedDocumentationData;
            if (documentationData.followUps && documentationData.followUps.length > 0) {
                loadFollowUps();
            }
            console.log('Documentation data loaded successfully');
        }
    } catch (error) {
        console.error('Error loading documentation data:', error);
    }
}

async function loadImprovementData() {
    try {
        const savedImprovementData = await window.enhancedLoad.loadImprovementData();
        if (savedImprovementData) {
            improvementData = savedImprovementData;
            if (improvementData.plans && improvementData.plans.length > 0) {
                loadImprovementPlans();
            }
            console.log('Improvement data loaded successfully');
        }
    } catch (error) {
        console.error('Error loading improvement data:', error);
    }
}

// Global data export function
async function exportAllData() {
    try {
        const exportData = await window.dbManager.exportAllData();
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `teacher_portfolio_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showNotification('تم تصدير جميع البيانات بنجاح!', 'success');
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('حدث خطأ في تصدير البيانات', 'error');
    }
}

// Global data import function
async function importAllData(file) {
    try {
        const text = await file.text();
        const importData = JSON.parse(text);
        
        const results = await window.dbManager.importData(importData);
        
        // Reload all data
        await loadUserData();
        await loadCVData();
        await loadPerformanceData();
        await loadDocumentationData();
        await loadImprovementData();
        
        showNotification('تم استيراد جميع البيانات بنجاح!', 'success');
    } catch (error) {
        console.error('Error importing data:', error);
        showNotification('حدث خطأ في استيراد البيانات', 'error');
    }
}

// Sync status display
function showSyncStatus() {
    const status = window.dbManager.getSyncStatus();
    const statusText = status.firebaseAvailable ? 
        'متصل بالسحابة - يتم التزامن تلقائياً' : 
        'غير متصل بالسحابة - يتم الحفظ محلياً فقط';
    
    showNotification(`حالة التزامن: ${statusText}`, 'info');
}

// Initialize enhanced database functions on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load all data on page load
    setTimeout(async () => {
        await loadUserData();
        await loadCVData();
        await loadPerformanceData();
        await loadDocumentationData();
        await loadImprovementData();
    }, 1000);
    
    // Show sync status
    setTimeout(() => {
        showSyncStatus();
    }, 2000);
});

// Add global functions to window
window.TeacherPortfolio = {
    exportAllData,
    importAllData,
    showSyncStatus,
    clearAllData: () => window.dbManager.clearAllData()
};

