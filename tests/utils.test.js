/**
 * Unit tests for utility functions in the Medical Inspection Reports System
 */

// Simple test framework
let passedTests = 0;
let failedTests = 0;

function runTest(description, testFn) {
    try {
        testFn();
        console.log(`  ✓ ${description}`);
        passedTests++;
    } catch (error) {
        console.log(`  ✗ ${description}`);
        console.log(`    Error: ${error.message}`);
        failedTests++;
    }
}

function expect(actual) {
    return {
        toBe: (expected) => {
            if (actual !== expected) {
                throw new Error(`Expected ${expected} but got ${actual}`);
            }
        },
        toContain: (expected) => {
            if (!actual.includes(expected)) {
                throw new Error(`Expected ${actual} to contain ${expected}`);
            }
        },
        toBeGreaterThan: (expected) => {
            if (actual <= expected) {
                throw new Error(`Expected ${actual} to be greater than ${expected}`);
            }
        },
        toBeLessThan: (expected) => {
            if (actual >= expected) {
                throw new Error(`Expected ${actual} to be less than ${expected}`);
            }
        }
    };
}

// Mock DOM for testing
const mockDOM = {
    getElementById: (id) => {
        return {
            style: {},
            classList: {
                add: () => {},
                remove: () => {},
                toggle: () => {},
                contains: () => false
            }
        };
    }
};

// Mock document for testing
global.document = mockDOM;

// Import utility functions
import {
    isValidString,
    isValidDate,
    isValidTime,
    isValidEmail,
    isValidPhone,
    isPositiveInteger,
    isInRange,
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    truncateString,
    escapeHtml,
    sanitizeInput,
    generateReportId,
    validateAndSanitizeString,
    showLoading,
    hideLoading,
    showStatus,
    scrollToElement,
    addClass,
    removeClass,
    toggleClass,
    hasClass
} from '../js/utils.js';

console.log('Running tests for Medical Inspection Reports System...\n');

console.log('\nTesting isValidString function:');
runTest('should return true for valid strings', () => {
    expect(isValidString('test')).toBe(true);
    expect(isValidString(' hello ')).toBe(true);
});

runTest('should return false for invalid strings', () => {
    expect(isValidString('')).toBe(false);
    expect(isValidString('   ')).toBe(false);
    expect(isValidString(null)).toBe(false);
    expect(isValidString(undefined)).toBe(false);
    expect(isValidString(123)).toBe(false);
});

console.log('\nTesting isValidDate function:');
runTest('should return true for valid dates', () => {
    expect(isValidDate('2023-01-01')).toBe(true);
    expect(isValidDate('2023-12-31')).toBe(true);
});

runTest('should return false for invalid dates', () => {
    expect(isValidDate('')).toBe(false);
    expect(isValidDate('invalid')).toBe(false);
    expect(isValidDate('2023-13-01')).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
    expect(isValidDate(123)).toBe(false);
});

console.log('\nTesting isValidTime function:');
runTest('should return true for valid times', () => {
    expect(isValidTime('12:30')).toBe(true);
    expect(isValidTime('00:00')).toBe(true);
    expect(isValidTime('23:59')).toBe(true);
});

runTest('should return false for invalid times', () => {
    expect(isValidTime('')).toBe(false);
    expect(isValidTime('invalid')).toBe(false);
    expect(isValidTime('25:00')).toBe(false);
    expect(isValidTime('12:60')).toBe(false);
    expect(isValidTime(null)).toBe(false);
    expect(isValidTime(undefined)).toBe(false);
    expect(isValidTime(123)).toBe(false);
});

console.log('\nTesting isValidEmail function:');
runTest('should return true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
});

runTest('should return false for invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(123)).toBe(false);
});

console.log('\nTesting isValidPhone function:');
runTest('should return true for valid Egyptian phone numbers', () => {
    expect(isValidPhone('01234567890')).toBe(true);
    expect(isValidPhone('+201234567890')).toBe(true);
    expect(isValidPhone('01012345678')).toBe(true);
});

runTest('should return false for invalid phone numbers', () => {
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone('invalid')).toBe(false);
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone(null)).toBe(false);
    expect(isValidPhone(undefined)).toBe(false);
    expect(isValidPhone(123)).toBe(false);
});

console.log('\nTesting isPositiveInteger function:');
runTest('should return true for positive integers', () => {
    expect(isPositiveInteger(1)).toBe(true);
    expect(isPositiveInteger(100)).toBe(true);
    expect(isPositiveInteger(999)).toBe(true);
});

runTest('should return false for non-positive integers', () => {
    expect(isPositiveInteger(0)).toBe(false);
    expect(isPositiveInteger(-1)).toBe(false);
    expect(isPositiveInteger(1.5)).toBe(false);
    expect(isPositiveInteger('1')).toBe(false);
    expect(isPositiveInteger(null)).toBe(false);
});

console.log('\nTesting isInRange function:');
runTest('should return true for values within range', () => {
    expect(isInRange(5, 1, 10)).toBe(true);
    expect(isInRange(1, 1, 10)).toBe(true);
    expect(isInRange(10, 1, 10)).toBe(true);
});

runTest('should return false for values outside range', () => {
    expect(isInRange(0, 1, 10)).toBe(false);
    expect(isInRange(11, 1, 10)).toBe(false);
    expect(isInRange('5', 1, 10)).toBe(false);
    expect(isInRange(null, 1, 10)).toBe(false);
});

console.log('\nTesting formatDate function:');
runTest('should handle invalid dates gracefully', () => {
    expect(formatDate('invalid')).toBe('تاريخ غير محدد');
    expect(formatDate('')).toBe('تاريخ غير محدد');
});

console.log('\nTesting formatTime function:');
runTest('should handle invalid times gracefully', () => {
    expect(formatTime('invalid')).toBe('00:00');
    expect(formatTime('')).toBe('00:00');
});

console.log('\nTesting formatNumber function:');
runTest('should format numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(1234.56)).toBe('1,234.56');
});

runTest('should handle non-numbers gracefully', () => {
    expect(formatNumber('test')).toBe('test');
    expect(formatNumber(null)).toBe(null);
});

console.log('\nTesting formatCurrency function:');
runTest('should format currency values', () => {
    expect(formatCurrency(1000)).toBe('1,000 EGP');
    expect(formatCurrency(1000000, 'USD')).toBe('1,000,000 USD');
});

runTest('should handle non-numbers gracefully', () => {
    expect(formatCurrency('test')).toBe('test');
    expect(formatCurrency(null)).toBe(null);
});

console.log('\nTesting truncateString function:');
runTest('should truncate strings correctly', () => {
    expect(truncateString('This is a long string', 10)).toBe('This is a ...');
    expect(truncateString('Short', 10)).toBe('Short');
    expect(truncateString('Exact length', 12)).toBe('Exact length');
});

console.log('\nTesting escapeHtml function:');
runTest('should escape HTML characters', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
    expect(escapeHtml("'test'")).toBe('&#039;test&#039;');
    expect(escapeHtml('&test&')).toBe('&amp;test&amp;');
});

runTest('should handle edge cases', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml('')).toBe('');
});

console.log('\nTesting sanitizeInput function:');
runTest('should sanitize input strings', () => {
    expect(sanitizeInput('<script>alert("test")</script>')).toBe('');
    expect(sanitizeInput('javascript:alert("test")')).toBe(':alert("test")');
    expect(sanitizeInput('normal text')).toBe('normal text');
});

console.log('\nTesting generateReportId function:');
runTest('should generate a report ID', () => {
    const data = {
        inspectorName: 'Test Inspector',
        location: 'Test Location',
        date: '2023-01-01',
        time: '12:00'
    };
    
    const id = generateReportId(data);
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
});

runTest('should handle invalid data gracefully', () => {
    expect(generateReportId(null)).toBe('unknown_report');
    expect(generateReportId(undefined)).toBe('unknown_report');
});

console.log('\nTesting validateAndSanitizeString function:');
runTest('should validate and sanitize strings', () => {
    expect(validateAndSanitizeString('  test  ')).toBe('test');
    expect(validateAndSanitizeString('<script>alert("test")</script>')).toBe('');
    expect(validateAndSanitizeString('')).toBe('');
});

console.log(`\n\nTest Results:`);
console.log(`=============`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Total:  ${passedTests + failedTests}`);

if (failedTests === 0) {
    console.log('\n🎉 All tests passed!');
} else {
    console.log(`\n❌ ${failedTests} test(s) failed.`);
}