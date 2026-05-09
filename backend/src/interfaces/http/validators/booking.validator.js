const Joi = require('joi');

const studentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  age: Joi.number().integer().min(3).max(25).required(),
  gradeOrClass: Joi.string().required(),
  learningChallenges: Joi.string().allow('').max(500),
});

const createBookingSchema = Joi.object({
  parent: Joi.object({
    fullName: Joi.string().min(2).max(150).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^(\+?254|0)(7|1)\d{8}$/)
      .required()
      .messages({
        'string.pattern.base':
          'Phone must be a valid Kenyan number (e.g., 0726555444 or +254726555444)',
      }),
  }).required(),

  students: Joi.array().items(studentSchema).min(1).max(5).required(),

  sessionType: Joi.string().valid('INDIVIDUAL', 'GROUP').required(),
  curriculum: Joi.string().valid('CBC', 'IGCSE').required(),
  subjects: Joi.array().items(Joi.string()).min(1).required(),

  scheduledDate: Joi.date().iso().greater('now').required(),
  timeSlot: Joi.object({
    startTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
    durationMinutes: Joi.number().valid(45, 60, 90).default(45),
  }).required(),

  notes: Joi.string().allow('').max(1000),
  isFreeTrialed: Joi.boolean().default(true),
})
  // Cross-field validation: GROUP needs 2-5 students, INDIVIDUAL needs exactly 1
  .custom((value, helpers) => {
    if (value.sessionType === 'GROUP' && (value.students.length < 2 || value.students.length > 5)) {
      return helpers.error('any.invalid', {
        message: 'Group sessions require 2 to 5 students',
      });
    }
    if (value.sessionType === 'INDIVIDUAL' && value.students.length !== 1) {
      return helpers.error('any.invalid', {
        message: 'Individual sessions require exactly 1 student',
      });
    }
    return value;
  });

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow(''),
  message: Joi.string().min(5).max(2000).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = { createBookingSchema, contactSchema, loginSchema };
