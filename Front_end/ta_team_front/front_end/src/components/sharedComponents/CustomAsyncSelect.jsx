import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";

const CustomAsyncSelect = ({
  placeholder,
  loadOptions,
  onChange,
  name,
  error,
  defaultOptions = [],
  value,
  isDisabled = false,
}) => {
  const [localError, setLocalError] = useState(error);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const controlledProps = value !== undefined ? { value } : {};

  return (
    <div>
      <AsyncSelect
        cacheOptions
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        isDisabled={isDisabled}
        {...controlledProps}
        onChange={(selectedOption) => {
          if (onChange) {
            onChange({
              target: {
                name,
                value: selectedOption ? selectedOption.value : "",
                selectedOption: selectedOption || null,
              },
            });
          }
          if (selectedOption) {
            setLocalError(""); // clear error once a value is picked
          }
        }}
        isClearable
        placeholder={placeholder}
        styles={{
          control: (provided, state) => ({
            ...provided,
            borderColor: localError ? "red" : provided.borderColor,
            boxShadow: localError
              ? "0 0 0 1px red"
              : state.isFocused
              ? provided.boxShadow
              : "none",
            "&:hover": {
              borderColor: localError ? "red" : provided.borderColor,
            },
          }),
        }}
      />

      {localError && (
        <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {localError}
        </div>
      )}
    </div>
  );
};

export default CustomAsyncSelect;
