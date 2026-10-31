import { entryFields, provinces, schoolLevels } from "../lib/entry-form.js";
import ComboBox from "./ComboBox.js";

const styles = {
  field: { display: "grid", gap: "var(--space-1)" }, labelRow: { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "baseline" }, label: { fontFamily: "var(--font-interface)", fontSize: "var(--text-label)", fontWeight: 750, letterSpacing: ".035em" }, count: { color: "var(--muted)", fontFamily: "var(--font-interface)", fontSize: "0.75rem", fontWeight: 500, whiteSpace: "nowrap" }, required: { color: "var(--vermilion)" }, control: { width: "100%", padding: "13px", border: "1px solid var(--rule)", borderRadius: 0, color: "var(--carbon)", background: "var(--paper)", font: "inherit" }, textarea: { resize: "vertical" }, help: { margin: 0, color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.4 }, error: { margin: 0, fontSize: "0.9rem", color: "var(--vermilion)" },
};

export default function EntryFields({ className, language, values, errors, form, onChange, names, disabled }) {
  return <div className={`entry-fields ${className || ""}`}>{entryFields.filter(([name]) => !names || names.includes(name)).map(([name, max, kind, required]) => {
    const label = form.fields[name];
    const help = form.help[name];
    const value = values[name] ?? "";
    const numberFormat = new Intl.NumberFormat(language === "km" ? "km-KH" : "en-US");
    const countId = max && kind !== "number" ? `${name}-count` : undefined;
    const describedBy = [errors[name] ? `${name}-error` : help ? `${name}-help` : null, countId].filter(Boolean).join(" ") || undefined;
    const props = { id: name, name, value, required, disabled, "aria-invalid": Boolean(errors[name]), "aria-describedby": describedBy, onChange };
    const options = name === "province" ? provinces.map((value) => [value, value]) : schoolLevels.map((value) => [value, form.levels[value]]);
    return (
      <div className={`form-field form-field-${name}${errors[name] ? " has-error" : ""}`} style={styles.field} key={name}>
        <div style={styles.labelRow}><label style={styles.label} htmlFor={name}>{label}{required ? <> <span style={styles.required}>*</span></> : ""}</label>{countId ? <span style={styles.count} id={countId} aria-label={form.characterCount.replace("{current}", numberFormat.format(value.length)).replace("{max}", numberFormat.format(max))}>{numberFormat.format(value.length)} / {numberFormat.format(max)}</span> : null}</div>
        {kind === "select" ? <ComboBox id={name} name={name} value={props.value} options={options.map(([value, label]) => ({ value, label }))} placeholder={form.select} noResultsLabel={form.select} required={required} disabled={disabled} ariaInvalid={props["aria-invalid"]} ariaDescribedBy={props["aria-describedby"]} onChange={(value) => onChange({ target: { name, value } })} /> : kind === "textarea" ? <textarea {...props} style={{ ...styles.control, ...styles.textarea }} maxLength={max} rows={name === "story" ? 8 : 3} /> : <input {...props} style={styles.control} type={kind} maxLength={max || undefined} min={name === "memory_year" ? 1900 : undefined} max={name === "memory_year" ? new Date().getFullYear() : undefined} step={name === "memory_year" ? 1 : undefined} />}
        {help ? <p className="field-help" style={styles.help} id={`${name}-help`}>{help}</p> : null}
        {errors[name] ? <p className="field-error" style={styles.error} id={`${name}-error`}>{errors[name]}</p> : null}
      </div>
    );
  })}</div>;
}
