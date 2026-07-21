# Chef Igor

Archivio personale ricette di Igor.  
PWA installabile su desktop e Android — funziona offline con cache locale.

## Stack

- Frontend: HTML5 + CSS3 + Vanilla JS (unico file `index.html`)
- Backend: Google Apps Script (Web App pubblica)
- Database: Google Sheets
- Hosting: GitHub Pages (HTTPS)

## URL

**PWA:** https://pablobongo.github.io/chef-igor/  
**Foglio Google:** https://docs.google.com/spreadsheets/d/1-1JJXobUX_UGD5PR1zCkBsFIj5koetr3b0hDVs8JfuU/edit

## Come funziona

1. Le ricette vengono proposte e guidate dalla chat Claude (progetto "Chef Igor")
2. Al termine della preparazione Claude salva la ricetta nel foglio Google via POST
3. La PWA legge le ricette dal foglio Google e le mostra con filtri e dettaglio

## File

| File | Ruolo |
|---|---|
| `index.html` | Tutta l'app — HTML, CSS, JS in un unico file |
| `manifest.json` | Configurazione PWA (nome, icone, colori) |
| `sw.js` | Service Worker — cache offline, bypass GAS |
| `icon-192.png` | Icona app 192×192px |
| `icon-512.png` | Icona app 512×512px |

## Come aggiornare il backend (Code.gs)

1. Apri [script.google.com](https://script.google.com) con account igoe.rigon
2. Modifica il codice
3. **Distribuisci → Gestisci distribuzioni → matita → Nuova versione → Distribuisci**
4. L'URL rimane lo stesso — non serve aggiornare nulla nell'app

## Come aggiornare la PWA (index.html)

1. Modifica `index.html` in locale
2. Aggiorna `CACHE_NAME` in `sw.js` (es. da `v1.0.4` a `v1.0.5`) — **obbligatorio**
3. Push su GitHub → GitHub Pages si aggiorna entro 1-2 minuti
4. Sul telefono: chiudi e riapri la PWA per scaricare il nuovo Service Worker

## Come vedere i dati grezzi

Apri il foglio Google con account igoe.rigon.  
Foglio interno: `RICETTE` — una riga per ogni ricetta preparata.  
Puoi modificare manualmente: al prossimo avvio della PWA i dati vengono riallineati.

## Cosa fare se qualcosa smette di funzionare

1. Testa il backend nel browser: `[WEBAPP_URL]?action=ping` deve rispondere `{"status":"ok",...}`
2. Testa la lettura dati: `[WEBAPP_URL]?action=getRicette` deve rispondere con JSON
3. Se GAS non risponde: Gestisci distribuzioni → aggiorna → riautorizza
4. Se la PWA non si aggiorna: F12 → Application → Service Workers → Unregister → Ctrl+Shift+R

## WEBAPP_URL

```
https://script.google.com/macros/s/AKfycbxMcHnMxtahfPscHMyjPD9-w8LGOMK6M1cEUK_gX0-pV4XElEwS3PHrnlgj9vKupJPkmw/exec
```
