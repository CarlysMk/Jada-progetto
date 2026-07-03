"""
Client verso l'API JADA
Questo client:
1. Mantiene un'unica sessione HTTP 
2. Fa login automaticamente alla prima richiesta
3. Se una richiesta torna 401 (sessione scaduta), rifà login e
   ripete la richiesta

"""

import logging

import httpx

import truststore

from app.config import settings

truststore.inject_into_ssl()

logger = logging.getLogger(__name__)


class JadaAuthError(Exception):
    """Quando login fallisce"""


class JadaClient:
    def __init__(self) -> None:
        # httpx.Client mantiene automaticamente i cookie tra le richieste
        # (cookie jar persistente), esattamente quello che ci serve.
        self._client = httpx.Client(base_url=settings.jada_base_url, timeout=15.0)
        self._authenticated = False

    def login(self) -> None:
        """Effettua il login su JADA e salva il cookie di sessione"""
        response = self._client.post(
            "/auth/login",
            json={
                "email": settings.jada_email,
                "password": settings.jada_password,
                "rememberMe": True,
            },
        )

        if response.status_code != 200:
            self._authenticated = False
            raise JadaAuthError(
                f"Login JADA fallito: {response.status_code} {response.text}"
            )

        self._authenticated = True
        logger.info("Login JADA effettuato con successo")

    def _ensure_authenticated(self) -> None:
        if not self._authenticated:
            self.login()

    def request(self, method: str, path: str, **kwargs) -> httpx.Response:
        """
        Esegue una richiesta autenticata verso JADA.
        Se la sessione è scaduta (401), rifà login e riprova
        """
        self._ensure_authenticated()

        response = self._client.request(method, path, **kwargs)

        if response.status_code == 401:
            logger.info("Sessione JADA scaduta, rifaccio login e ritento")
            self.login()
            response = self._client.request(method, path, **kwargs)

        response.raise_for_status()
        return response

    def get(self, path: str, params: dict | None = None) -> httpx.Response:
        return self.request("GET", path, params=params)

    def post(self, path: str, json: dict | None = None) -> httpx.Response:
        return self.request("POST", path, json=json)

    def close(self) -> None:
        self._client.close()


# Istanza singola condivisa da tutta l'app (una sola sessione verso JADA)
jada_client = JadaClient()
