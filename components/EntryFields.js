import { entryFields, provinces, schoolLevels } from "../lib/entry-form.js";
import ComboBox from "./ComboBox.js";

const styles = {
  field: { display: "grid", gap: "var(--space-2)" }, label: { fontFamily: "var(--font-interface)", fontSize: "var(--text-label)", fontWeight: 750, letterSpacing: ".035em" }, control: { width: "100%", padding: "13px", border: "1px solid var(--rule)", borderRadius: 0, color: "var(--carbon)", background: "var(--paper)", font: "inherit" }, textarea: { resize: "vertical" }, help: { margin: 0, fontSize: "0.9rem", color: "var(--muted)" }, error: { margin: 0, fontSize: "0.9rem", color: "var(--vermilion)" },
};

export default function EntryFields({ className, values, errors, form, onChange, names }) {
  return <div className={className}>{entryFields.filter(([name]) => !names || names.includes(name)).map(([name, max, kind, required]) => {
    const label = form.fields[name];
    const help = form.help[name];
    const props = { id: name, name, value: values[name] ?? "", required, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : help ? `${name}-help` : undefined, onChange };
    const options = name === "province" ? provinces.map((value) => [value, value]) : schoolLevels.map((value) => [value, form.levels[value]]);
    return (
      <div className={`form-field form-field-${name}`} style={styles.field} key={name}>
        <label style={styles.label} htmlFor={name}>{label}{required ? " *" : ""}</label>
        {kind === "select" ? <ComboBox id={name} name={name} value={props.value} options={options.map(([value, label]) => ({ value, label }))} placeholder={form.select} noResultsLabel={form.select} required={required} ariaInvalid={props["aria-invalid"]} ariaDescribedBy={props["aria-describedby"]} onChange={(value) => onChange({ target: { name, value } })} /> : kind === "textarea" ? <textarea {...props} style={{ ...styles.control, ...styles.textarea }} maxLength={max} rows={name === "story" ? 8 : 3} /> : <input {...props} style={styles.control} type={kind} maxLength={max || undefined} min={name === "memory_year" ? 1900 : undefined} max={name === "memory_year" ? new Date().getFullYear() : undefined} step={name === "memory_year" ? 1 : undefined} />}
        {help ? <p className="field-help" style={styles.help} id={`${name}-help`}>{help}</p> : null}
        {errors[name] ? <p className="field-error" style={styles.error} id={`${name}-error`}>{errors[name]}</p> : null}
      </div>
    );
  })}</div>;
}
