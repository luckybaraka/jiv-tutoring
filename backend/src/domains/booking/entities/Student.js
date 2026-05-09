const { ValidationError } = require('../../../shared/errors');

class Student {
  constructor({ name, age, gradeOrClass, learningChallenges = '' }) {
    if (!name || name.trim().length < 2) {
      throw new ValidationError('Student name is required');
    }
    if (!age || age < 3 || age > 25) {
      throw new ValidationError('Student age must be between 3 and 25');
    }
    if (!gradeOrClass) {
      throw new ValidationError('Grade or class is required');
    }

    this.name = name.trim();
    this.age = age;
    this.gradeOrClass = gradeOrClass;
    this.learningChallenges = learningChallenges;
  }

  toJSON() {
    return {
      name: this.name,
      age: this.age,
      gradeOrClass: this.gradeOrClass,
      learningChallenges: this.learningChallenges,
    };
  }
}

module.exports = Student;
