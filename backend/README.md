# Backend Impianto Fotovoltaico

Backend Python (FastAPI) che fa da bridge autenticato tra il front-end e l'API JADA.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# poi apri .env e inserisci email/password JADA reali + plant_id/plant_unique_code
```

## Avvio

```bash
uvicorn app.main:app --reload
```

- `GET /health` → verifica che il server sia su
- `GET /alarms` → proxy grezzo verso JADA (STEP 1, da rifinire)

## Stato del progetto

- [x] Client JADA con gestione sessione a cookie + re-login automatico su 401
- [x] Primo endpoint `/alarms` (proxy grezzo, non ancora trasformato per il front-end)
- [ ] Modelli Pydantic per Allarme (forma pulita per il front-end)
- [ ] Endpoint produzione (`/charts/plant/real-expected`)
- [ ] Trasformazione dati allarmi + produzione nella forma attesa dal front-end
- [ ] Endpoint anagrafica impianto/inverter (statici)
- [ ] Integrazione MQTT (da definire il suo ruolo esatto nel progetto)

## Note architetturali

- JADA usa autenticazione a **cookie di sessione**, non bearer token: il client
  mantiene un'unica sessione (`httpx.Client`) condivisa da tutto il backend.
- `GET /alarms` su JADA richiede parametri di paginazione "stile DevExtreme"
  (skip/take/filter/sort ecc.) anche solo per ottenere la lista completa.
