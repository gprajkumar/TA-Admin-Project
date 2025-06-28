import Select from "react-select";
import { Form } from "react-bootstrap";
const Dropdown_component = ({name, label, options, value, error, onSelect}) =>
{
const selectOptions = (options || []).map((opt) => ({
    value: opt.id,
    label: opt.name,
  }));

  const selectedOption = selectOptions.find(
    (opt) => opt.value === value
   
  );
 
  const hasError = !!error;

  return (
    <Form.Group className="mb-3">
      <Form.Label className="fs-6">{label}<span style={{ color: "red" }}>*</span>:</Form.Label>
      <Select
        classNamePrefix="my-select"
        options={selectOptions}
        value={selectedOption || null}
       
        onChange={(selected) => {
          if(selected)
          {
            onSelect({name,value:selected.value});
          }
          else
          {
             onSelect({name,value:""});
          }
        }}
        placeholder={`Select ${label}`}
        isClearable
        styles={{
          control: (base) => ({
            ...base,
            borderColor: hasError ? "#dc3545" : base.borderColor,
            boxShadow: hasError
              ? "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
              : base.boxShadow,
            '&:hover': {
              borderColor: hasError ? "#dc3545" : base.borderColor,
            },
          }),
        }}
      />
      {hasError && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}
export default Dropdown_component;