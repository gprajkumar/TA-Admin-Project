import Select, { components } from "react-select";
const BaseMenuList = components.MenuList;
import { Form } from "react-bootstrap";

// ── Theme tokens ──────────────────────────────────────────────────────────────
const G = {
  primary:      "#045533",   // dark green — buttons, accents
  primaryHover: "#033d26",   // darker on hover
  primaryLight: "#e6f4ef",   // very light green — tag background
  primaryBorder:"#a3d4be",   // muted green — tag border
  primaryText:  "#045533",   // dark green text on light bg
  focusShadow:  "rgba(4,85,51,0.2)",
  focusBorder:  "#04aa6d",   // mid-green border on focus
  menuHeader:   "#f0f9f5",   // faint green tint for menu header bg
  headerBorder: "#c8e8d8",
  hoverRow:     "#f0f9f5",   // row hover bg
  countText:    "#3a7d5e",   // muted green for "N of M selected"
};

// ── Custom Option: label + checkbox ──────────────────────────────────────────
const Option = ({ children, isSelected, innerProps, innerRef, isFocused }) => (
  <div
    ref={innerRef}
    {...innerProps}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "8px 12px",
      cursor: "pointer",
      backgroundColor: isFocused ? G.hoverRow : "white",
      transition: "background 0.15s",
    }}
  >
    <input
      type="checkbox"
      checked={isSelected}
      onChange={() => {}}
      style={{
        accentColor: G.primary,
        width: "15px",
        height: "15px",
        cursor: "pointer",
        flexShrink: 0,
      }}
    />
    <span style={{ fontSize: "0.9rem", color: "#212529" }}>{children}</span>
  </div>
);

// ── Custom Tag (MultiValue) ───────────────────────────────────────────────────
const MultiValue = ({ children, removeProps }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      backgroundColor: G.primaryLight,
      color: G.primaryText,
      border: `1px solid ${G.primaryBorder}`,
      borderRadius: "20px",
      padding: "2px 8px",
      fontSize: "0.78rem",
      fontWeight: 500,
      margin: "2px",
    }}
  >
    {children}
    <span
      {...removeProps}
      style={{
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "0.85rem",
        lineHeight: 1,
        color: G.primary,
        marginLeft: "2px",
      }}
    >
      ×
    </span>
  </div>
);

// ── Overflow badge: "+3 more" when tags overflow ──────────────────────────────
const MultiValueContainer = ({ selectProps, data, children }) => {
  const allSelected = selectProps.value;
  const index = allSelected.findIndex((v) => v.value === data.value);
  const MAX_VISIBLE = 2;

  if (index < MAX_VISIBLE) return children;
  if (index === MAX_VISIBLE) {
    const overflow = allSelected.length - MAX_VISIBLE;
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: G.primary,
          color: "white",
          borderRadius: "20px",
          padding: "2px 10px",
          fontSize: "0.78rem",
          fontWeight: 600,
          margin: "2px",
        }}
      >
        +{overflow} more
      </div>
    );
  }
  return null;
};

// ── Menu header: Select All / Clear All ──────────────────────────────────────
const MenuList = ({ children, selectProps, ...rest }) => {
  const { options, value, onChange } = selectProps;
  const allSelected = value?.length === options.length;

  const handleSelectAll = () => onChange(allSelected ? [] : [...options]);

  return (
    <BaseMenuList {...rest} selectProps={selectProps}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 12px",
          borderBottom: `1px solid ${G.headerBorder}`,
          backgroundColor: G.menuHeader,
        }}
      >
        <span style={{ fontSize: "0.78rem", color: G.countText, fontWeight: 500 }}>
          {value?.length || 0} of {options.length} selected
        </span>
        <button
          type="button"
          onClick={handleSelectAll}
          style={{
            background: "none",
            border: "none",
            color: G.primary,
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
          }}
        >
          {allSelected ? "Clear All" : "Select All"}
        </button>
      </div>
      {children}
    </BaseMenuList>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
/**
 * MultiSelect — modern multi-select dropdown
 *
 * Props:
 *   name        {string}   field name
 *   label       {string}   label text
 *   options     {Array}    [{ id, name }]
 *   value       {Array}    selected ids  e.g. [1, 3]
 *   onChange    {Function} called with { target: { name, value: [id, ...] } }
 *   error       {string}   validation error message
 *   required    {boolean}
 *   disabled    {boolean}
 *   placeholder {string}
 */
const MultiSelect = ({
  name,
  label,
  options = [],
  value = [],
  onChange,
  error,
  required = false,
  disabled = false,
  placeholder,
}) => {
  const hasError = !!error;

  const selectOptions = options.map((opt) => ({
    value: opt.id,
    label: opt.name,
  }));

  const selectedOptions = selectOptions.filter((opt) => value.includes(opt.value));

  const handleChange = (selected) => {
    const ids = selected ? selected.map((opt) => opt.value) : [];
    onChange({ target: { name, value: ids } });
  };

  return (
    <Form.Group className="mb-3">
      {label && (
        <Form.Label className="fs-6">
          {label}
          {required && <span style={{ color: "red" }}> *</span>}:
        </Form.Label>
      )}

      <Select
        isMulti
        isDisabled={disabled}
        options={selectOptions}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder || `Select ${label || "options"}`}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        isClearable={false}
        components={{ Option, MultiValue, MultiValueContainer, MenuList }}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "38px",
            borderColor: hasError
              ? "#dc3545"
              : state.isFocused
              ? G.focusBorder
              : "#ced4da",
            borderRadius: "0.375rem",
            boxShadow: hasError
              ? "0 0 0 0.2rem rgba(220,53,69,.25)"
              : state.isFocused
              ? `0 0 0 0.2rem ${G.focusShadow}`
              : "none",
            "&:hover": {
              borderColor: hasError ? "#dc3545" : G.focusBorder,
            },
            flexWrap: "wrap",
          }),
          valueContainer: (base) => ({
            ...base,
            padding: "4px 8px",
            gap: "2px",
          }),
          menu: (base) => ({
            ...base,
            borderRadius: "0.5rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            overflow: "hidden",
            border: `1px solid ${G.headerBorder}`,
          }),
          menuPortal: (base) => ({ ...base, zIndex: 999999 }),
          option: () => ({}),
          multiValue: () => ({}),
          multiValueLabel: () => ({}),
          multiValueRemove: () => ({}),
          placeholder: (base) => ({ ...base, color: "#adb5bd", fontSize: "0.9rem" }),
          input: (base) => ({ ...base, fontSize: "0.9rem" }),
          dropdownIndicator: (base, state) => ({
            ...base,
            color: G.primary,
            transition: "transform 0.2s",
            transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
          }),
          indicatorSeparator: () => ({ display: "none" }),
        }}
      />

      {hasError && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default MultiSelect;
