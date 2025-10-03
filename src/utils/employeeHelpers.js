import {t} from './i18n.js';
import {DEPARTMENTS, POSITIONS} from '../store/slices/employeesSlice.js';

/**
 * Get localized department name
 * @param {string} departmentKey - Department key (analytics, tech)
 * @returns {string} Localized department name
 */
export const getDepartmentName = (departmentKey) => {
  if (!departmentKey) return '';
  return t(`departments.${departmentKey}`, departmentKey);
};

/**
 * Get localized position name
 * @param {string} positionKey - Position key (junior, medior, senior)
 * @returns {string} Localized position name
 */
export const getPositionName = (positionKey) => {
  if (!positionKey) return '';
  return t(`positions.${positionKey}`, positionKey);
};

/**
 * Get all available departments with their localized names
 * @returns {Array} Array of {key, label} objects
 */
export const getDepartmentOptions = () => {
  return Object.values(DEPARTMENTS).map((key) => ({
    key,
    label: getDepartmentName(key),
  }));
};

/**
 * Get all available positions with their localized names
 * @returns {Array} Array of {key, label} objects
 */
export const getPositionOptions = () => {
  return Object.values(POSITIONS).map((key) => ({
    key,
    label: getPositionName(key),
  }));
};
