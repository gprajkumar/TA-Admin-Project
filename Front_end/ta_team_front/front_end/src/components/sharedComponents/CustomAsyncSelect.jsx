import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";

const CustomAsyncSelect = ({
  placeholder,
  loadOptions,
  onChange,
  name,
  error,
}) => {
  const [localError, setLocalError] = useState(error);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  return (
    <div>
      <AsyncSelect
        cacheOptions
        defaultOptions={[]}
        loadOptions={loadOptions}
        onChange={(selectedOption) => {
          if (onChange) {
            onChange({
              target: {
                name,
                value: selectedOption ? selectedOption.value : "",
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
