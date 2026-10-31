"use client";

import { useEffect, useId, useRef, useState } from "react";
import { filterComboBoxOptions } from "../lib/combo-box.js";

export default function ComboBox({ id, name, value, options, placeholder, noResultsLabel, required, disabled, ariaInvalid, ariaDescribedBy, onChange }) {
  const listboxId = useId();
  const root = useRef(null);
  const selected = options.find((option) => option.value === value);
  const [text, setText] = useState(selected?.label || "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [filtering, setFiltering] = useState(false);
  const filtered = filtering ? filterComboBoxOptions(options, text) : options;

  useEffect(() => setText(selected?.label || ""), [selected?.label]);
  useEffect(() => { if (disabled) setOpen(false); }, [disabled]);
  useEffect(() => {
    function close(event) { if (!root.current?.contains(event.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function choose(option) { if (disabled) return; onChange(option.value); setText(option.label); setFiltering(false); setOpen(false); setActive(-1); }
  function handleChange(event) { const next = event.target.value; setText(next); setFiltering(true); setOpen(true); setActive(-1); if (!next) onChange(""); }
  function handleKeyDown(event) {
    if (event.key === "Escape") { setOpen(false); setFiltering(false); setText(selected?.label || ""); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault(); setFiltering(false); setOpen(true);
      setActive((current) => current < 0 ? event.key === "ArrowDown" ? 0 : filtered.length - 1 : Math.max(0, Math.min(filtered.length - 1, current + (event.key === "ArrowDown" ? 1 : -1))));
    } else if (event.key === "Enter" && open && filtered[active]) { event.preventDefault(); choose(filtered[active]); }
  }
  function handleBlur() { window.setTimeout(() => { if (!root.current?.contains(document.activeElement)) { setOpen(false); setFiltering(false); setText(selected?.label || ""); } }, 0); }

  return <div className="combo-box" ref={root}>
    <input type="hidden" name={name} value={value} />
    <input id={id} className="combo-box-input" role="combobox" aria-autocomplete="list" aria-controls={listboxId} aria-expanded={open} aria-activedescendant={active >= 0 ? `${listboxId}-${active}` : undefined} aria-invalid={ariaInvalid || undefined} aria-describedby={ariaDescribedBy} value={text} placeholder={placeholder} required={required} disabled={disabled} onChange={handleChange} onFocus={() => { setFiltering(false); setOpen(true); }} onClick={() => { setFiltering(false); setOpen(true); }} onKeyDown={handleKeyDown} onBlur={handleBlur} />
    {open ? <ul id={listboxId} className="combo-box-list" role="listbox">
      {filtered.length ? filtered.map((option, index) => <li id={`${listboxId}-${index}`} className={index === active ? "is-active" : ""} role="option" aria-selected={option.value === value} key={option.value} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(option)}>{option.label}</li>) : <li className="combo-box-empty" role="status">{noResultsLabel}</li>}
    </ul> : null}
  </div>;
}