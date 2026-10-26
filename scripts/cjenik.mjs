// Generates the machine-readable price list (public/cjenici/*.csv) from src/data/cjenik.json.
//
// - If the newest published CSV already matches the JSON, nothing is written.
// - Otherwise a NEW file is created with the next broj pohrane and the `objava` timestamp.
// - Old files are never touched (the archive stays committed in the repo).
// - On CI (Vercel) a missing CSV fails the build: it must be generated locally and committed,
//   otherwise the archive numbering would drift between deploys.
import fs from 'node:fs'
import path from 'node:path'
import { CJENICI_DIR, loadCjenik, buildCsv, csvFilename, listObjave } from '../src/lib/cjenik.mjs'

const cjenik = loadCjenik()
const csv = buildCsv(cjenik)
const [zadnja] = listObjave()

if (zadnja && fs.readFileSync(path.join(CJENICI_DIR, zadnja.file), 'utf8') === csv) {
  console.log(`[cjenik] Bez promjena — važeći cjenik: ${zadnja.file}`)
  process.exit(0)
}

if (process.env.CI || process.env.VERCEL) {
  console.error(
    '[cjenik] src/data/cjenik.json se razlikuje od zadnjeg objavljenog CSV-a.\n' +
      '         Pokreni lokalno `npm run cjenik` i commitaj novu datoteku iz public/cjenici/.',
  )
  process.exit(1)
}

if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(cjenik.objava ?? '')) {
  console.error('[cjenik] Polje "objava" mora biti u obliku YYYY-MM-DDTHH:MM (npr. 2026-11-17T07:00).')
  process.exit(1)
}
if (zadnja && cjenik.objava <= zadnja.objava) {
  console.error(
    `[cjenik] Cijene su promijenjene, ali "objava" (${cjenik.objava}) nije novija od zadnje objave ` +
      `(${zadnja.objava}). Postavi "objava" na datum i vrijeme kad nove cijene počinju vrijediti.`,
  )
  process.exit(1)
}

const file = csvFilename(cjenik, (zadnja?.broj ?? 0) + 1, cjenik.objava)
fs.mkdirSync(CJENICI_DIR, { recursive: true })
fs.writeFileSync(path.join(CJENICI_DIR, file), csv, 'utf8')
console.log(`[cjenik] Nova objava: public/cjenici/${file} — ne zaboravi je commitati.`)
