import { entryFields } from "../lib/entry-form.js";

export default function EntryFields({ values, errors, onChange }) {
  return entryFields.map(([name, label, max, kind]) => {
    const props = {
      id: name,
      name,
      value: values[name] || "",
      maxLength: max,
      required: true,
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
      onChange,
    };
    return (
      <div className="form-field" key={name}>
        <label htmlFor={name}>{label}</label>
        {kind === "textarea" ? <textarea {...props} rows={name === "excerpt" ? 3 : 6} /> : <input {...props} />}
        {errors[name] ? <p className="field-error" id={`${name}-error`}>{errors[name]}</p> : null}
      </div>
    );
  });
}
