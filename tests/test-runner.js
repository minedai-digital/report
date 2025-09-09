/**
 * Simple test runner for the Medical Inspection Reports System
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
                remove: () => {}
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
    formatDate,
    formatTime,
    escapeHtml,
    generateReportId
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