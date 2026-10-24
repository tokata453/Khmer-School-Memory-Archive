import { entryFields, provinces, schoolLevels } from "../lib/entry-form.js";

export default function EntryFields({ values, errors, onChange }) {
  return entryFields.map(([name, label, max, kind, required, help]) => {
    const props = { id: name, name, value: values[name] ?? "", required, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : help ? `${name}-help` : undefined, onChange };
    const options = name === "province" ? provinces.map((value) => [value, value]) : schoolLevels;
    return (
      <div className="form-field" key={name}>
        <label htmlFor={name}>{label}{required ? " *" : ""}</label>
        {kind === "select" ? <select {...props}><option value="">Select… / ជ្រើសរើស…</option>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select> : kind === "textarea" ? <textarea {...props} maxLength={max} rows={name === "story" ? 8 : 3} /> : <input {...props} type={kind} maxLength={max || undefined} min={name === "memory_year" ? 1900 : undefined} max={name === "memory_year" ? new Date().getFullYear() : undefined} step={name === "memory_year" ? 1 : undefined} />}
        {help ? <p className="field-help" id={`${name}-help`}>{help}</p> : null}
        {errors[name] ? <p className="field-error" id={`${name}-error`}>{errors[name]}</p> : null}
      </div>
    );
  });
}
