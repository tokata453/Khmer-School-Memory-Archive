"use client";

import { useState } from "react";
import ComboBox from "./ComboBox.js";
import { schoolLevels } from "../lib/entry-form.js";

export default function HomeSearch({ archive, form, header, comboBox }) {
  const [schoolLevel, setSchoolLevel] = useState("");
  return <form className="home-search" action="/archive" method="get">
    <label className="sr-only" htmlFor="home-search-query">{archive.searchLabel}</label>
    <input id="home-search-query" name="q" type="search" placeholder={archive.placeholder} />
    <label className="sr-only" htmlFor="home-school-level">{archive.schoolLevel}</label>
    <ComboBox id="home-school-level" name="schoolLevel" value={schoolLevel} options={[{ value: "", label: archive.allSchoolLevels }, ...schoolLevels.map((value) => ({ value, label: form.levels[value] }))]} placeholder={archive.allSchoolLevels} noResultsLabel={comboBox.noOptions} onChange={setSchoolLevel} />
    <button type="submit">{header.search}</button>
  </form>;
}