// Shared price-list helpers — used by the Astro pages and by scripts/cjenik.mjs.
// Single source of truth: src/data/cjenik.json
import fs from 'node:fs'
import path from 'node:path'

export const CJENICI_DIR = path.resolve('public/cjenici')
export const CSV_HEADER =
  'naziv_usluge;maloprodajna_cijena;posebni_oblik_prodaje;naziv_posebnog_oblika;sidrena_cijena'

export function loadCjenik() {
  return JSON.parse(fs.readFileSync(path.resolve('src/data/cjenik.json'), 'utf8'))
}

// 50 → "50,00"
export const formatCijena = (n) => n.toFixed(2).replace('.', ',')

// "2026-09-10" → "10. 9. 2026."
export function formatDatum(iso) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return `${d}. ${m}. ${y}.`
}

// Filename-safe: no spaces, no diacritics
export function slug(s) {
  return s
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Service name as it appears in the CSV (category prefix + duration where relevant)
export function csvNaziv(kategorija, usluga) {
  return `${kategorija.csv_prefiks ?? ''}${usluga.naziv}${usluga.trajanje ? ` ${usluga.trajanje}` : ''}`
}

const csvField = (v) => (/[";\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)

// UTF-8 with BOM so Excel detects the encoding and shows č/ć/š/ž/đ correctly
export function buildCsv(cjenik) {
  const rows = cjenik.kategorije.flatMap((k) =>
    k.usluge.map((u) =>
      [
        csvNaziv(k, u),
        formatCijena(u.cijena),
        u.posebni_oblik_prodaje ? 'DA' : 'NE',
        u.posebni_oblik_prodaje ? u.naziv_posebnog_oblika : '',
        formatCijena(u.sidrena_cijena),
      ].map(csvField).join(';'),
    ),
  )
  return '﻿' + [CSV_HEADER, ...rows].join('\r\n') + '\r\n'
}

// salon_Miramarska-cesta-24-Zagreb_PJ1_0001_2026-11-17T07-00.csv
export function csvFilename(cjenik, broj, objava) {
  const { oblik, adresa, oznaka } = cjenik.objekt
  const ts = objava.slice(0, 16).replace(':', '-')
  return `${slug(oblik)}_${slug(adresa)}_${slug(oznaka)}_${String(broj).padStart(4, '0')}_${ts}.csv`
}

const FILE_RE = /_(\d{4})_(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})\.csv$/

// All published CSVs, newest (highest broj pohrane) first
export function listObjave() {
  if (!fs.existsSync(CJENICI_DIR)) return []
  return fs
    .readdirSync(CJENICI_DIR)
    .map((file) => {
      const m = file.match(FILE_RE)
      return m && { file, broj: Number(m[1]), objava: `${m[2]}T${m[3]}:${m[4]}` }
    })
    .filter(Boolean)
    .sort((a, b) => b.broj - a.broj)
}
