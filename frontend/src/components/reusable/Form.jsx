import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

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
 * @param {string} props.fields.type - The type of the input element (e.g., "text", "checkbox", "select", "file").
 * @param {string} props.fields.accept - The allowed file types if the field type is "file"
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
  const [formDetails, setFormDetails] = useState(formFields);
  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState({});

  useEffect(() => {
    // Set initial repeat day based on start date
    if (formDetails.start && formDetails.repeat_type === 'WEEKLY') {
      const startDate = new Date(formDetails.start);
      const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][startDate.getDay()];
      setFormDetails(prev => ({
        ...prev,
        repeat_days: [dayOfWeek]
      }));
    }
  }, [formDetails.start, formDetails.repeat_type]);

  const handleFormInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
      setFormDetails(prevDetails => ({
        ...prevDetails,
        [name]: files[0]
      }));
    } 
    else if (type === 'checkbox' && name.includes('[')) {
      const [fieldName, fieldValue] = name.replace(']', '').split('[');
      setFormDetails(prevDetails => {
        const currentValues = prevDetails[fieldName] || [];
        let updatedValues;
        
        if (fieldName === 'repeat_days') {
          const startDate = new Date(prevDetails.start);
          const startDayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][startDate.getDay()];
          
          if (fieldValue === startDayOfWeek) {
            // Don't allow unchecking the start date's day
            updatedValues = currentValues;
          } else {
            updatedValues = checked
              ? [...currentValues, fieldValue]
              : currentValues.filter(v => v !== fieldValue);
          }
          
          // Ensure start date's day is always included
          if (!updatedValues.includes(startDayOfWeek)) {
            updatedValues.push(startDayOfWeek);
          }
        } else {
          updatedValues = checked
            ? [...currentValues, fieldValue]
            : currentValues.filter(v => v !== fieldValue);
        }
        
        return { ...prevDetails, [fieldName]: updatedValues };
      });
    }
    else {
      let fieldValue = type === 'checkbox' ? checked : value;

      if (name === 'start') {
        // Reset repeat_days when start date changes
        setFormDetails(prevDetails => ({
          ...prevDetails,
          [name]: fieldValue,
          repeat_days: []
        }));
      } else {
        setFormDetails(prevDetails => ({
          ...prevDetails,
          [name]: fieldValue
        }));
      }

      const field = fields.find(f => f.name === name);
      if (field && field.maxLength) {
        setCharCount(prevCount => ({
          ...prevCount,
          [name]: field.maxLength - value.length
        }));
      }

      validateField(name, fieldValue);
    }
  };

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

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && field.validate) {
        const errorMessage = field.validate(formDetails[field.name]);
        if (errorMessage !== true) {
          newErrors[field.name] = errorMessage;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submissionData = { ...formDetails };
      
      // Ensure cal_id is a number
      submissionData.cal_id = parseInt(submissionData.cal_id, 10);
  
      // Handle repeat_days for weekly repeats
      if (submissionData.repeat_type === 'WEEKLY' && Array.isArray(submissionData.repeat_days)) {
        submissionData.repeat_days = submissionData.repeat_days.filter(day => day !== false);
      } else {
        delete submissionData.repeat_days;
      }
  
      // Remove repeat_until if repeat_type is NONE
      if (submissionData.repeat_type === 'NONE') {
        delete submissionData.repeat_until;
      }
  
      // Here you would typically send submissionData to your server
      console.log("Form Submitted:", submissionData);
      // Call your API function here, e.g., createEvent(submissionData)
    } else {
      console.log("Validation Errors:", errors);
    }
  };

  const filteredFields = fields.filter((field) => {
    if (field.ifPrev) {
      if (typeof field.ifPrev === 'function') {
        return field.ifPrev(formDetails);
      }
      return formDetails[fields[fields.indexOf(field) - 1].name];
    }
    return true;
  });

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
          className, labelAfter, onKeyDown, onChange, validate, accept,
          option_key, option_label, maxLength
        } = field;

        return (
          <div key={name} className={`mb-4 ${className || ''}`}>
            {label && !labelAfter && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            {type === "select" ? (
              /* For to input type select */
              <select
                name={name}
                value={formDetails[name] || ""}
                onChange={(e) => handleChange(e, onChange, validate)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required={required}
              >
                <option value="" disabled>{placeholder || "Select an option"}</option>
                {typeof options === 'function' 
                  ? options({ formDetails, setFormDetails }).map((option) => (
                      <option key={option.value || option[option_key]} value={option.value || option[option_key]}>
                        {option.label || option[option_label]}
                      </option>
                    ))
                  : options.map((option) => (
                      <option key={option.value || option[option_key]} value={option.value || option[option_key]}>
                        {option.label || option[option_label]}
                      </option>
                    ))
                }
              </select>
            ) : type === "checkbox-group" ? (
              <div className={field.className || "flex flex-wrap gap-2"}>
                {field.options.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={`${name}[${option.value}]`}
                      value={option.value}
                      checked={formDetails[name]?.includes(option.value) || false}
                      onChange={handleFormInputChange}
                      className="form-checkbox"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            ) :  type === "checkbox" ? (
              /* For to input type checkbox */
              <input
                type={type}
                name={name}
                checked={formDetails[name] || false}
                onChange={(e) => handleChange(e, onChange, validate)}
                required={required}
                className="mr-2"
              />
            ) : type === "file" ? (
              /* For to input type file */
              <>
                <input
                  type={type}
                  name={name}
                  id="fileInput"
                  onChange={(e) => handleChange(e, onChange, validate)}
                  accept={accept}
                  required={required}
                  className="mr-2 hidden"
                />
                {/* Custom button to trigger file input */}
                <label
                htmlFor="fileInput"
                className="cursor-pointer inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  {formDetails[name] ? `Selected: ${formDetails[name].name}` : 'Upload a file'}
                </label>
              </>
            ) : (
            /* Defaults to input type text */
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
              maxLength={maxLength}
            />
            )}

            {label && labelAfter && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            {maxLength && (
              <p className="text-gray-500 text-sm mt-1">
                {charCount[name] !== undefined ? `${charCount[name]} characters left` : `${maxLength} characters allowed`}
              </p>
            )}
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
          </div>
        );
      })}
      {typeof children === 'function' 
        ? children({ formDetails, setFormDetails , validateForm}) 
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