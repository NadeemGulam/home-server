// Schema validation
const Joi = require('joi');

module.exports = {
  validate: (schema, data) => schema.validate(data)
};
