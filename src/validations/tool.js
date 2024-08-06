import Validator from 'validator';
import isEmpty from './is-empty';

const validateToolInput = (data) => {
  const errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.icon = !isEmpty(data.icon) ? data.icon : '';

  if (!Validator.isLength(data.name, { min: 2, max: 50 })) {
    errors.name = 'Name must be between 2 to 50 chars';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (Validator.isEmpty(data.icon)) {
    errors.icon = 'Icon is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateToolInput;
