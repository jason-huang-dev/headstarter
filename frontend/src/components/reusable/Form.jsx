import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * Form component renders a dynamic form based on the provided field configuration.
 * 
 * Make sure that `<value>` matches in 
 *    `formFields: {name: "<value>", ...}`
 *    and 
 *    `fields: {<value>: <initial value>, ...}`
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.fields - An array of field configurations to render form inputs.
 * @param {Object} props.formFields - Initial values for the form fields.
 * @param {ReactNode} [props.children] - Optional child components to be rendered within the form.
 */
const Form = ({ fields, formFields, children }) => {
  const [formDetails, setFormDetails] = useState(formFields);
  const [errors, setErrors] = useState({});

  const handleFormInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormDetails(prevDetails => ({
      ...prevDetails,
      [name]: fieldValue
    }));
    
    // Perform validation on change
    validateField(name, fieldValue);
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

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form Submitted:", formDetails);
    } else {
      console.log("Form has validation errors:", errors);
    }
  };

  const filteredFields = fields.filter((field, index) => {
    if (field.ifPrev) {
      return index === 0 || formDetails[fields[index - 1].name];
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
        const { type, name, label, placeholder, options, required, className, labelAfter, onKeyDown, onChange, validate } = field;

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
                {typeof option === 'function' 
                  ? option({ formDetails, setFormDetails }) 
                  : option}
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
