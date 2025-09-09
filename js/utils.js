/**
 * Utility functions for the Medical Inspection Reports System
 * 
 * This module contains helper functions for data validation, formatting,
 * and other common operations used throughout the application.
 * 
 * @author Tarek Zhran
 * @version 1.0.0
 */

// =============================================================================
// Constants
// =============================================================================

/**
 * Array of Arabic month names
 * @type {Array<string>}
 */
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
               'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

/**
 * Array of Arabic day names
 * @type {Array<string>}
 */
const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// =============================================================================
// Data Validation Functions
// =============================================================================

/**
 * Validates that a string is not empty and contains valid characters
 * @param {string} str - The string to validate
 * @returns {boolean} True if the string is valid, false otherwise
 */
function isValidString(str) {
    return typeof str === 'string' && str.trim().length > 0;
}

/**
 * Validates a date string
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean} True if the date is valid, false otherwise
 */
function isValidDate(dateString) {
    if (!dateString || typeof dateString !== 'string') {
        return false;
    }
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

/**
 * Validates a time string
 * @param {string} timeString - Time in HH:MM format
 * @returns {boolean} True if the time is valid, false otherwise
 */
function isValidTime(timeString) {
    if (!timeString || typeof timeString !== 'string') {
        return false;
    }
    
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
}

/**
 * Validates an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if the email is valid, false otherwise
 */
function isValidEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if the phone number is valid, false otherwise
 */
function isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') {
        return false;
    }
    
    // Simple Egyptian phone number validation
    const phoneRegex = /^(\+2)?01[0-9]{9}$/;
    return phoneRegex.test(phone);
}

// =============================================================================
// Formatting Functions
// =============================================================================

/**
 * Formats a date string into Arabic format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date in Arabic
 */
function formatDate(dateString) {
    try {
        if (!isValidDate(dateString)) {
            throw new Error('Invalid date format');
        }
        
        const dateObj = new Date(dateString);
        const dayName = DAYS[dateObj.getDay()];
        return `${dayName}، ${dateObj.getDate()} ${MONTHS[dateObj.getMonth()]}، ${dateObj.getFullYear()}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'تاريخ غير محدد';
    }
}

/**
 * Formats a time string
 * @param {string} timeString - Time in HH:MM format
 * @returns {string} Formatted time
 */
function formatTime(timeString) {
    if (!isValidTime(timeString)) {
        return '00:00';
    }
    return timeString;
}

/**
 * Formats a number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number with commas
 */
function formatNumber(num) {
    if (typeof num !== 'number') {
        return num;
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Truncates a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length of the string
 * @param {string} suffix - Suffix to append if truncated
 * @returns {string} Truncated string
 */
function truncateString(str, maxLength, suffix = '...') {
    if (typeof str !== 'string' || str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength) + suffix;
}

// =============================================================================
// Security Functions
// =============================================================================

/**
 * Escapes HTML characters to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (text === null || text === undefined) {
        return '';
    }
    
    if (typeof text !== 'string') {
        return String(text);
    }
    
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { 
        return map[m] || m; 
    });
}

/**
 * Sanitizes user input by removing potentially dangerous characters
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return input;
    }
    
    // Remove script tags and other potentially dangerous content
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+="[^"]*"/gi, '')
                .replace(/on\w+='[^']*'/gi, '')
                .trim();
}

/**
 * Generates a unique report ID based on report data
 * @param {Object} data - Report data
 * @returns {string} Unique report ID
 */
function generateReportId(data) {
    try {
        if (!data || typeof data !== 'object') {
            return 'unknown_report';
        }
        
        const inspectorName = data.inspectorName || '';
        const location = data.location || '';
        const date = data.date || '';
        const time = data.time || '';
        
        const reportString = `${inspectorName}_${location}_${date}_${time}`;
        
        if (typeof btoa === 'function') {
            return btoa(reportString).replace(/[^a-zA-Z0-9]/g, '');
        } else {
            return reportString.replace(/[^a-zA-Z0-9]/g, '');
        }
    } catch (error) {
        console.error('Error generating report ID:', error);
        return 'error_report_id';
    }
}

// =============================================================================
// DOM Utility Functions
// =============================================================================

/**
 * Shows a loading overlay with optional message
 * @param {boolean} show - Whether to show or hide the overlay
 * @param {string} message - Optional message to display
 */
function showLoading(show = true, message = 'جاري المعالجة...') {
    try {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            const content = overlay.querySelector('.loading-content h3');
            if (content) {
                content.textContent = message;
            }
            
            if (show) {
                overlay.style.display = 'flex';
                overlay.classList.add('fade-in');
                // Prevent body scrolling when loading overlay is shown
                document.body.style.overflow = 'hidden';
            } else {
                overlay.style.display = 'none';
                overlay.classList.remove('fade-in');
                // Restore body scrolling
                document.body.style.overflow = '';
            }
        }
    } catch (error) {
        console.error('Error showing loading overlay:', error);
    }
}

/**
 * Hides the loading overlay
 */
function hideLoading() {
    showLoading(false);
}

/**
 * Shows a status message to the user
 * @param {string} message - Message to display
 * @param {string} type - Type of message ('success' or 'error')
 */
function showStatus(message, type) {
    try {
        if (!message || !type) {
            console.error('Invalid parameters for showStatus');
            return;
        }
        
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                ${escapeHtml(message)}
            `;
            statusMessage.className = `status-message status-${type}`;
            statusMessage.style.display = 'block';
            statusMessage.classList.add('slide-up');
            
            // Add ARIA attributes for accessibility
            statusMessage.setAttribute('role', type === 'success' ? 'status' : 'alert');
            statusMessage.setAttribute('aria-live', type === 'success' ? 'polite' : 'assertive');
            
            // Auto-hide after 6 seconds
            setTimeout(() => {
                if (statusMessage) {
                    statusMessage.style.display = 'none';
                    statusMessage.classList.remove('slide-up');
                }
            }, 6000);
        }
    } catch (error) {
        console.error('Error showing status message:', error);
    }
}

/**
 * Scrolls to an element with smooth animation
 * @param {string} elementId - ID of the element to scroll to
 * @param {Object} options - Scroll options
 */
function scrollToElement(elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: options.block || 'start',
            inline: options.inline || 'nearest'
        });
    }
}

/**
 * Adds a CSS class to an element
 * @param {string} elementId - ID of the element
 * @param {string} className - CSS class to add
 */
function addClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Removes a CSS class from an element
 * @param {string} elementId - ID of the element
 * @param {string} className - CSS class to remove
 */
function removeClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove(className);
    }
}

// =============================================================================
// Export Functions
// =============================================================================

// Export all functions for use in other modules
export {
    // Constants
    MONTHS,
    DAYS,
    
    // Validation functions
    isValidString,
    isValidDate,
    isValidTime,
    isValidEmail,
    isValidPhone,
    
    // Formatting functions
    formatDate,
    formatTime,
    formatNumber,
    truncateString,
    
    // Security functions
    escapeHtml,
    sanitizeInput,
    generateReportId,
    
    // DOM utility functions
    showLoading,
    hideLoading,
    showStatus,
    scrollToElement,
    addClass,
    removeClass
};