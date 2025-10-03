import {
  getDepartmentName,
  getPositionName,
  getDepartmentOptions,
  getPositionOptions,
} from '../src/utils/employeeHelpers.js';
import {DEPARTMENTS, POSITIONS} from '../src/store/slices/employeesSlice.js';
import {initI18n} from '../src/utils/i18n.js';
import {assert} from '@open-wc/testing';

suite('Employee Helpers', () => {
  suiteSetup(async () => {
    await initI18n();
  });
  suite('getDepartmentName', () => {
    test('returns localized department name for analytics', () => {
      const result = getDepartmentName(DEPARTMENTS.ANALYTICS);
      assert.isString(result);
      assert.isTrue(result.length > 0);
    });

    test('returns localized department name for tech', () => {
      const result = getDepartmentName(DEPARTMENTS.TECH);
      assert.isString(result);
      assert.isTrue(result.length > 0);
    });

    test('returns empty string for null/undefined', () => {
      assert.equal(getDepartmentName(null), '');
      assert.equal(getDepartmentName(undefined), '');
      assert.equal(getDepartmentName(''), '');
    });

    test('returns fallback for unknown department', () => {
      const unknownKey = 'unknown';
      const result = getDepartmentName(unknownKey);
      assert.equal(result, unknownKey);
    });
  });

  suite('getPositionName', () => {
    test('returns localized position name for junior', () => {
      const result = getPositionName(POSITIONS.JUNIOR);
      assert.isString(result);
      assert.isTrue(result.length > 0);
    });

    test('returns localized position name for medior', () => {
      const result = getPositionName(POSITIONS.MEDIOR);
      assert.isString(result);
      assert.isTrue(result.length > 0);
    });

    test('returns localized position name for senior', () => {
      const result = getPositionName(POSITIONS.SENIOR);
      assert.isString(result);
      assert.isTrue(result.length > 0);
    });

    test('returns empty string for null/undefined', () => {
      assert.equal(getPositionName(null), '');
      assert.equal(getPositionName(undefined), '');
      assert.equal(getPositionName(''), '');
    });

    test('returns fallback for unknown position', () => {
      const unknownKey = 'unknown';
      const result = getPositionName(unknownKey);
      assert.equal(result, unknownKey);
    });
  });

  suite('getDepartmentOptions', () => {
    test('returns array of department options', () => {
      const options = getDepartmentOptions();
      assert.isArray(options);
      assert.equal(options.length, 2);
    });

    test('each option has key and label properties', () => {
      const options = getDepartmentOptions();
      options.forEach((option) => {
        assert.property(option, 'key');
        assert.property(option, 'label');
        assert.isString(option.key);
        assert.isString(option.label);
        assert.isTrue(option.label.length > 0);
      });
    });

    test('includes all department keys', () => {
      const options = getDepartmentOptions();
      const keys = options.map((opt) => opt.key);
      assert.include(keys, DEPARTMENTS.ANALYTICS);
      assert.include(keys, DEPARTMENTS.TECH);
    });
  });

  suite('getPositionOptions', () => {
    test('returns array of position options', () => {
      const options = getPositionOptions();
      assert.isArray(options);
      assert.equal(options.length, 3);
    });

    test('each option has key and label properties', () => {
      const options = getPositionOptions();
      options.forEach((option) => {
        assert.property(option, 'key');
        assert.property(option, 'label');
        assert.isString(option.key);
        assert.isString(option.label);
        assert.isTrue(option.label.length > 0);
      });
    });

    test('includes all position keys', () => {
      const options = getPositionOptions();
      const keys = options.map((opt) => opt.key);
      assert.include(keys, POSITIONS.JUNIOR);
      assert.include(keys, POSITIONS.MEDIOR);
      assert.include(keys, POSITIONS.SENIOR);
    });
  });

  suite('Integration with i18n', () => {
    test('department names change with language context', () => {
      const analyticsName = getDepartmentName(DEPARTMENTS.ANALYTICS);
      const techName = getDepartmentName(DEPARTMENTS.TECH);

      assert.notEqual(analyticsName, DEPARTMENTS.ANALYTICS);
      assert.notEqual(techName, DEPARTMENTS.TECH);
    });

    test('position names change with language context', () => {
      const juniorName = getPositionName(POSITIONS.JUNIOR);
      const mediorName = getPositionName(POSITIONS.MEDIOR);
      const seniorName = getPositionName(POSITIONS.SENIOR);

      assert.notEqual(juniorName, POSITIONS.JUNIOR);
      assert.notEqual(mediorName, POSITIONS.MEDIOR);
      assert.notEqual(seniorName, POSITIONS.SENIOR);
    });
  });
});
