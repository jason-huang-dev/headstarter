'use client'
import PropTypes from 'prop-types';
import React, { useState } from 'react';
/**
 * Renders a dynamic form based on the provided field configuration.
 * 
 * Ensure that the `name` in `fields` matches the keys in `formFields`.
 * 
 * Example:
 * formFields: { name: "<value>", ... }
 * fields: { <value>: <initial value>, ... }
 *  * 
* @component
 * @param {Object} props - The component properties.
 * @param {Array<Object>} props.fields - Configuration array for form fields, where each object defines an input field.
 * @param {string} props.fields.type - The type of the input element (e.g., "text", "checkbox", "select").
 * @param {string} props.fields.name - The name attribute for the input element, used as a key in `formFields`.
 * @param {string} [props.fields.label] - The label text displayed above or beside the input element.
 * @param {string} [props.fields.placeholder] - Placeholder text displayed inside the input element (applies to "text" and "select").
 * @param {Array<Object>|Function} [props.fields.options] - The options for a "select" field, or a function that returns options dynamically.
 * @param {boolean} [props.fields.required] - Whether the input field is required for form submission.
 * @param {string} [props.fields.className] - Custom CSS classes for styling the field container.
 * @param {boolean} [props.fields.labelAfter] - If true, displays the label after the input (useful for checkboxes).
 * @param {Function} [props.fields.onKeyDown] - Custom event handler for the `onKeyDown` event.
 * @param {Function} [props.fields.onChange] - Custom event handler for the `onChange` event, allowing additional logic beyond default handling.
 * @param {Function} [props.fields.validate] - Validation function that returns true for valid inputs or an error message string for invalid inputs.
 * @param {string} [props.fields.option_key] - The key to use for the value in the `options` array when the field is of type "select".
 * @param {string} [props.fields.option_label] - The key to use for the label in the `options` array when the field is of type "select".
 * @param {Object} props.formFields - Initial values for the form fields, where keys match the `name` properties in the `fields` array.
 * @param {ReactNode|Function} [props.children] - Optional child components or a render function, which can be used to extend the form functionality.
 */
const Form = ({ fields, formFields, children }) => {
  // State management for form data and validation errors.
  const [formDetails, setFormDetails] = useState(formFields);
  const [errors, setErrors] = useState({});

  /**
   * Handles changes to form inputs and validates fields.
   * @param {Event} e - Input change event.
   */
  const handleFormInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormDetails(prevDetails => ({
      ...prevDetails,
      [name]: fieldValue
    }));
    validateField(name, fieldValue);
  };

  /**
   * Validates a specific field.
   * @param {String} name - Field name.
   * @param {Object} value - Field value.
   */
  const validateField = (name, value) => {
    const field = fields.find(f => f.name === name);
    if (field && field.validate) {
      const errorMessage = field.validate(value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: errorMessage === true ? '' : errorMessage
      }));
    }
  };

  /**
   * Validates all fields and returns whether the form is valid.
   * @return {boolean} - True if valid, false otherwise.
   */
  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.validate) {
        const errorMessage = field.validate(formDetails[field.name]);
        if (errorMessage !== true) {
          newErrors[field.name] = errorMessage;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission after validation.
   */
  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form Submitted:", formDetails);
    } else {
      console.log("Validation Errors:", errors);
    }
  };

  /**
   * Filters fields for conditional rendering.
   * @return {Array<Object>} - Filtered fields to render.
   */
  const filteredFields = fields.filter((field, index) => {
    if (field.ifPrev) {
      return index === 0 || formDetails[fields[index - 1].name];
    }
    return true;
  });

  /**
   * Handles changes and triggers custom logic if provided.
   * @param {Event} e - Input change event.
   * @param {Function} onChange - Custom change handler.
   * @param {Function} validate - Custom validation function.
   */
  const handleChange = (e, onChange, validate) => {
    if (onChange) {
      onChange(e, formDetails, setFormDetails, validate);
    } else {
      handleFormInputChange(e);
    }
  };

  return (
    <div className="p-4">
      {filteredFields.map((field) => {
        const {
          type, name, label, placeholder, options, required,
          className, labelAfter, onKeyDown, onChange, validate,
          option_key, option_label
        } = field;

        return (
          <div key={name} className={`mb-4 ${className || ''}`}>
            {label && !labelAfter && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            {type === "select" ? (
              <select
                name={name}
                value={formDetails[name] || ""}
                onChange={(e) => handleChange(e, onChange, validate)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required={required}
              >
                <option value="" disabled>{placeholder}</option>
                {typeof options === 'function' 
                  ? options({ formDetails, setFormDetails }) 
                  : options.map((option) => (
                      <option key={option[option_key]} value={option[option_key]}>
                        {option[option_label]}
                      </option>
                    ))
                }
              </select>
            ) : type === "checkbox" ? (
              <input
                type={type}
                name={name}
                checked={formDetails[name] || false}
                onChange={(e) => handleChange(e, onChange, validate)}
                required={required}
                className="mr-2"
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formDetails[name] || ""}
                onChange={(e) => handleChange(e, onChange, validate)}
                placeholder={placeholder}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onKeyDown={(e) => {
                  if (onKeyDown) {
                    onKeyDown(e, formDetails, setFormDetails, validate);
                  }
                }}
                required={required}
              />
            )}
            {label && labelAfter && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
          </div>
        );
      })}
      {typeof children === 'function' 
        ? children({ formDetails, setFormDetails }) 
        : children}
    </div>
  );
};

Form.propTypes = {
  fields: PropTypes.array.isRequired,
  formFields: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]),
};

export default Form;
