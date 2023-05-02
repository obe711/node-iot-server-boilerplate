/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */

const pick = (object: Record<string, unknown>, keys: string[]): Record<string, unknown> => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick;
