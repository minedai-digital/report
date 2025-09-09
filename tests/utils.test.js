/**
 * Unit tests for utility functions
 */

// Mock DOM elements for testing
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

// Import functions to test
import {
    isValidString,
    isValidDate,
    isValidTime,
    formatDate,
    formatTime,
    escapeHtml,
    generateReportId
} from '../js/utils.js';

// Test cases
describe('Utility Functions', () => {
    describe('isValidString', () => {
        test('should return true for valid strings', () => {
            expect(isValidString('test')).toBe(true);
            expect(isValidString(' hello ')).toBe(true);
        });

        test('should return false for invalid strings', () => {
            expect(isValidString('')).toBe(false);
            expect(isValidString('   ')).toBe(false);
            expect(isValidString(null)).toBe(false);
            expect(isValidString(undefined)).toBe(false);
            expect(isValidString(123)).toBe(false);
        });
    });

    describe('isValidDate', () => {
        test('should return true for valid dates', () => {
            expect(isValidDate('2023-01-01')).toBe(true);
            expect(isValidDate('2023-12-31')).toBe(true);
        });

        test('should return false for invalid dates', () => {
            expect(isValidDate('')).toBe(false);
            expect(isValidDate('invalid')).toBe(false);
            expect(isValidDate('2023-13-01')).toBe(false);
            expect(isValidDate(null)).toBe(false);
            expect(isValidDate(undefined)).toBe(false);
            expect(isValidDate(123)).toBe(false);
        });
    });

    describe('isValidTime', () => {
        test('should return true for valid times', () => {
            expect(isValidTime('12:30')).toBe(true);
            expect(isValidTime('00:00')).toBe(true);
            expect(isValidTime('23:59')).toBe(true);
        });

        test('should return false for invalid times', () => {
            expect(isValidTime('')).toBe(false);
            expect(isValidTime('invalid')).toBe(false);
            expect(isValidTime('25:00')).toBe(false);
            expect(isValidTime('12:60')).toBe(false);
            expect(isValidTime(null)).toBe(false);
            expect(isValidTime(undefined)).toBe(false);
            expect(isValidTime(123)).toBe(false);
        });
    });

    describe('formatDate', () => {
        test('should format valid dates correctly', () => {
            // Note: This test may need adjustment based on the actual implementation
            expect(formatDate('2023-01-01')).toContain('2023');
        });

        test('should handle invalid dates gracefully', () => {
            expect(formatDate('invalid')).toBe('تاريخ غير محدد');
            expect(formatDate('')).toBe('تاريخ غير محدد');
        });
    });

    describe('formatTime', () => {
        test('should format valid times correctly', () => {
            expect(formatTime('12:30')).toBe('12:30');
        });

        test('should handle invalid times gracefully', () => {
            expect(formatTime('invalid')).toBe('00:00');
            expect(formatTime('')).toBe('00:00');
        });
    });

    describe('escapeHtml', () => {
        test('should escape HTML characters', () => {
            expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
            expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
            expect(escapeHtml("'test'")).toBe('&#039;test&#039;');
            expect(escapeHtml('&test&')).toBe('&amp;test&amp;');
        });

        test('should handle edge cases', () => {
            expect(escapeHtml(null)).toBe('');
            expect(escapeHtml(undefined)).toBe('');
            expect(escapeHtml('')).toBe('');
        });
    });

    describe('generateReportId', () => {
        test('should generate a report ID', () => {
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

        test('should handle invalid data gracefully', () => {
            expect(generateReportId(null)).toBe('unknown_report');
            expect(generateReportId(undefined)).toBe('unknown_report');
            expect(generateReportId('invalid')).toBe('error_report_id');
        });
    });
});