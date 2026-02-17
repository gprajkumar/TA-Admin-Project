import React from "react";
import Select from "react-select";
import { Form } from "react-bootstrap";

const MultiSelectComponent = ({
  name,
  label,
  options,
  handleChange,
  selectedData,
  errors,
  viewtype = false,
}) => {
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      height: "38px",
      minHeight: "38px",
      borderColor: "#ced4da",
      borderRadius: "0.375rem",
      fontSize: "1rem",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"
        : base.boxShadow,
      "&:hover": { borderColor: "#86b7fe" },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 8px" }),
    input: (base) => ({ ...base, margin: 0, padding: 0 }),
    indicatorsContainer: (base) => ({ ...base, height: "38px" }),
  };

  const values = selectedData?.[name] || [];
  const hasError = !!errors?.[name];

  const selectOptions = [
    { value: 0, label: "Select All", isDisabled: false },
    ...(options || []).map((opt) => ({
      value: opt.id,
      label: opt.name,
      isDisabled: values.includes(0),
    })),
  ];

  const selectedOptions = values.includes(0)
    ? [selectOptions.find((opt) => opt.value === 0)]
    : values
        .map((val) => selectOptions.find((opt) => opt.value === val))
        .filter(Boolean);

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fs-6">
        {label} <span style={{ color: "red" }}>*</span>:
      </Form.Label>

      <Select
        classNamePrefix="my-select"
        isMulti
        options={selectOptions}
        value={selectedOptions}
        isDisabled={viewtype}
        onChange={(selected) => {
          const picked = selected ? selected.map((opt) => opt.value) : [];
          const newValues = picked.includes(0) ? [0] : picked.filter((v) => v !== 0);
          handleChange({ target: { name, value: newValues } });
        }}
        placeholder={`Select ${label}`}
        isClearable
        styles={{
          ...customSelectStyles,
          control: (base, state) => {
            const ctrl = customSelectStyles.control(base, state);
            return {
              ...ctrl,
              borderColor: hasError ? "#dc3545" : ctrl.borderColor,
              boxShadow: hasError
                ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
                : ctrl.boxShadow,
            };
          },
        }}
      />

      {hasError && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {errors[name]}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default MultiSelectComponent;
