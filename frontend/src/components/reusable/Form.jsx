import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from '.';

/**
 * Form component renders a dynamic form based on the provided field configuration.
 * * Make sure that \<value\> matches in 
 *    `formField: {name: "\<value\>", ...}`
 *    and 
 *    `fields: {\<value\>: \<inital value\>, ...}`
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
    console.log(name, " : ", value)
    setFormDetails(prevDetails => ({
      ...prevDetails,
      [name]: fieldValue
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.validate) {
        const errorMessage = field.validate(formDetails[field.name]);
        if (errorMessage) {
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

  // Filter fields based on their conditions
  const filteredFields = fields.filter((field, index) => {
    if (field.ifPrev) {
      return index === 0 || formDetails[fields[index - 1].name];
    }
    return true;
  });

  // Pass state and handlers to children as props
  const childrenWithProps = React.Children.map(children, (child) =>
    React.cloneElement(child, { formDetails, setFormDetails })
  );

  return (
    <div className="p-4">
      {filteredFields.map((field) => {
        const { type, name, label, placeholder, options, required, className, labelAfter, onKeyDown } = field;

        return (
          <div key={name} className={`mb-4 ${className || ''}`}>
            {label && !labelAfter && <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>}
            {type === "select" ? (
              <select
                name={name}
                value={formDetails[name] || ""}
                onChange={handleFormInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required={required === true}
              >
                <option value="" disabled>
                  {placeholder}
                </option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : type === "checkbox" ? (
              <input
                type={type}
                name={name}
                checked={formDetails[name] || false}
                onChange={handleFormInputChange}
                required={required === true}
                className="mr-2"
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formDetails[name] || ""}
                onChange={handleFormInputChange}
                placeholder={placeholder}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onKeyDown={onKeyDown}
                required={required === true}
              />
            )}
            {label && labelAfter && <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>}
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
          </div>
        );
      })}
      {childrenWithProps}
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

Form.propTypes = {
  fields: PropTypes.array.isRequired,
  formFields: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export default Form;
