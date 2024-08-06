import Validator from 'validator';
import isEmpty from './is-empty';

const validateProjectInput = (data) => {
  const errors = {};
  data.title = !isEmpty(data.title) ? data.title : '';
  data.category = !isEmpty(data.category) ? data.category : '';
  data.concept = !isEmpty(data.concept) ? data.concept : '';
  data.tools = !isEmpty(data.tools) ? data.tools : [];
  data.fonts = !isEmpty(data.fonts) ? data.fonts : [];
  data.colors = !isEmpty(data.colors) ? data.colors : [];
  data.main_image = !isEmpty(data.main_image) ? data.main_image : '';
  data.concept_image = !isEmpty(data.concept_image) ? data.concept_image : '';
  data.live_url = !isEmpty(data.live_url) ? data.live_url : '';
  data.source_url = !isEmpty(data.source_url) ? data.source_url : '';

  if (!Validator.isLength(data.title, { min: 2, max: 50 })) {
    errors.title = 'Title must be between 2 to 50 chars';
  }

  if (Validator.isEmpty(data.title)) {
    errors.name = 'Title field is required';
  }

  if (Validator.isEmpty(data.category)) {
    errors.type = 'Type is required';
  }

  if (Validator.isEmpty(data.concept)) {
    errors.concept = 'Concept is required';
  }

  if (data.tools.length === 0) {
    errors.tools = 'Enter almost one tool';
  }

  if (data.fonts.length === 0) {
    errors.fonts = 'Enter almost one font';
  }

  if (data.colors.length === 0) {
    errors.colors = 'Enter almost one color';
  }

  if (Validator.isEmpty(data.main_image)) {
    errors.main_image = 'Main image is required';
  }

  if (Validator.isEmpty(data.concept_image)) {
    errors.concept_image = 'Concept image is required';
  }

  if (Validator.isEmpty(data.live_url)) {
    errors.live_url = 'Live url is required';
  }

  if (Validator.isEmpty(data.source_url)) {
    errors.source_url = 'Source url is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateProjectInput;
