import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, TextField, Stack, IconButton,
  CircularProgress, Alert, TablePagination,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import EventIcon from '@mui/icons-material/Event';
import SelezioneStato from '../util/selezioneStato';
import type { StatoFiltro } from '../util/selezioneStato';
import GenericaRicerca from '../util/genericaRicerca';
import SelezioneLivello from '../util/selezioneLivello';
import type { LivelloFiltro } from '../util/selezioneLivello';
import BasicDatePicker from '../util/BasicDatePicker';
import CambioBot from '../util/cambiobot';
import { getAllarmi } from '../api/client';
import type { Allarme, Livello } from '../types/allarme';
import { formattaData } from '../util/formattaData';
import { useDebounce } from '../util/useDebounce';

const Colore_Livello: Record<string, Livello> = {
  red: 'Major',
  orange: 'Warning',
  yellow: 'Minor'
};

const altezza_intestazione = 56;

export default function TabellaUtenti() {
  const [allarmi, setAllarmi] = useState<Allarme[]>([]);
  const [totale, setTotale] = useState(0);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null> (null);

  const [ricercaGlobale, setRicercaGlobale] = useState('');
  const [statoFiltro, setStatoFiltro] = useState<StatoFiltro>('');
  const [livelloFiltro, setLivelloFiltro] = useState<LivelloFiltro>('');
  const [ricercaImpianto, setRicercaImpianto] = useState('');
  const [ricercaAzienda, setRicercaAzienda] = useState('');
  const [ricercaGruppo, setRicercaGruppo] = useState('');
  const [ricercaDispositivo, setRicercaDispositivo] = useState('');
  const [ricercaDescrizione, setRicercaDescrizione] = useState('');
  const [dataInizioFiltro, setDataInizioFiltro] = useState<Dayjs | null>(null);
  const [dataFineFiltro, setDataFineFiltro] = useState<Dayjs | null>(null);

  const [pagina, setPagina] = useState(0);
  const [righePerPagina, setRighePerPagina] = useState(10);

  const ricercaGlobaleD = useDebounce(ricercaGlobale);
  const ricercaImpiantoD = useDebounce(ricercaImpianto);
  const ricercaAziendaD = useDebounce(ricercaAzienda);
  const ricercaGruppoD = useDebounce(ricercaGruppo);
  const ricercaDispositivoD = useDebounce(ricercaDispositivo);
  const ricercaDescrizioneD = useDebounce(ricercaDescrizione);

  useEffect(() => {
    setPagina(0);
  }, [
    statoFiltro, livelloFiltro, ricercaGlobaleD, 
    ricercaImpiantoD, ricercaAziendaD, ricercaGruppoD, ricercaDispositivoD, ricercaDescrizioneD,
    dataInizioFiltro, dataFineFiltro,
  ]);

  useEffect(() => {
    let annullato = false;
    setCaricamento(true);

    getAllarmi({
      skip: pagina * righePerPagina,
      take: righePerPagina,
      stato: statoFiltro === 'on' || statoFiltro === 'off' ? statoFiltro : undefined,
      livello: livelloFiltro && livelloFiltro !== 'tutto' ? Colore_Livello[livelloFiltro] : undefined,
      impianto: ricercaImpiantoD || undefined,
      azienda: ricercaAziendaD || undefined,
      gruppo: ricercaGruppoD || undefined,
      dispositivo: ricercaDispositivoD || undefined,
      descrizione: ricercaDescrizioneD || undefined,
      ricerca: ricercaGlobaleD || undefined,
      dataInizio: dataInizioFiltro ? dataInizioFiltro.format('YYYY-MM-DD') : undefined,
      dataFine: dataFineFiltro ? dataFineFiltro.format('YYYY-MM-DD') : undefined,
    })
      .then((risultato) => {
        if (!annullato) {
          setAllarmi(risultato.items);
          setTotale(risultato.total);
        }
      })
      .catch((err) => {
        if (!annullato) setErrore(err.message);
      })
      .finally(() => {
        if (!annullato) setCaricamento(false);
      });

    return () => {annullato = true;};
  }, [
    pagina, righePerPagina, statoFiltro, livelloFiltro,
    ricercaGlobaleD, ricercaImpiantoD, ricercaAziendaD, ricercaGruppoD,
    ricercaDispositivoD, ricercaDescrizioneD, dataInizioFiltro, dataFineFiltro,
  ]);

  const handleCambioPagina = (_evento: unknown, nuovaPagina: number) => {
    setPagina(nuovaPagina);
  };
  const handleCambioRighePerPagina = (
    evento: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRighePerPagina(parseInt(evento.target.value, 10));
    setPagina(0);
  };
 
  return (
    <>
    <h1 className='text-white text-3xl pl-8 font-sans'>Allarmi</h1>

    <Stack direction="row">

      <Box novalidate autoComplete="off">
        <TextField placeholder="Cerca..." variant="filled"
        value={ricercaGlobale}
        onChange={(e) => setRicercaGlobale(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{color:'white'}} />
              </InputAdornment>
              ),
            },
          }}
      
          sx={{
            mt: 4,
            ml: 4,
            width:350,
            height:85,
            '& .MuiFilledInput-root': {
              height: 55,
              backgroundColor: '#223244',
              color:'white',
              paddingBottom: 1.5,
            },
            '& .MuiFilledInput-root:hover': {
              backgroundColor: '#2a3c51'
            },
            '& .MuiFilledInput-underline:before':{
              borderBottomColor: '#424242'
            },
            '& .MuiFilledInput-underline:hover:before':{
              borderBottomColor: '#ffffff'
            },
            '& .MuiFilledInput-underline:after':{
              borderBottomColor: '#ff9800',
            },
            '& input::placeholder': {
              color: '#bdbdbd',opacity: 1,
            },
          }}
        />
      </Box>

      <Stack direction="row" spacing={2}
        sx={{ml:'auto', mr:3}}
      >
        <CambioBot />

        <IconButton aria-label='event' sx={{color:'white', height:40, alignSelf:"center"}}>
        <EventIcon />
      </IconButton>
      <IconButton aria-label='download'sx={{color:'white', height:40, alignSelf:"center"}}>
        <GetAppRoundedIcon />
      </IconButton>

      </Stack>

    </Stack>

    {errore && (
      <Alert severity='error' sx={{ mx: 4, mt:2}}>
        Impossibile caricare gli allarmi: {errore}
      </Alert>
    )}

    <TableContainer sx={{ maxHeight: 658, maxWidth: '96%', mx: 'auto' }}>
      <Table stickyHeader sx={{border: '1px solid', 
                  borderColor: '#424242', 
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid #424242', 
                    backgroundColor: '#1f2937',
                  }      
}}>
        <TableHead>
          <TableRow className='bg-gray-800'>
            <TableCell sx={{ color: '#bdbdbd', height: altezza_intestazione, top: 0, zIndex: 3 }}>Stato</TableCell>
            <TableCell sx={{ color: '#bdbdbd', height: altezza_intestazione, top: 0, zIndex: 3 }}>Impianto</TableCell>
            <TableCell sx={{ color: '#bdbdbd', height: altezza_intestazione, top: 0, zIndex: 3 }}>Azienda</TableCell>
            <TableCell sx={{ color: '#bdbdbd', height: altezza_intestazione, top: 0, zIndex: 3 }}>Gruppo</TableCell>
            <TableCell sx={{ color: '#bdbdbd', height: altezza_intestazione, top: 0, zIndex: 3 }}>Dispositivo</TableCell>
            <TableCell sx={{ color: '#bdbdbd', height: altezza_intestazione, top: 0, zIndex: 3 }}>Livello</TableCell>
            <TableCell sx={{ color: '#bdbdbd', height: altezza_intestazione, top: 0, zIndex: 3 }}>Inizio</TableCell>
            <TableCell sx={{ color: '#bdbdbd', height: altezza_intestazione, top: 0, zIndex: 3 }}>Fine</TableCell>
            <TableCell sx={{ color: '#bdbdbd', height: altezza_intestazione, top: 0, zIndex: 3 }}>Durata</TableCell>
            <TableCell sx={{ color: '#bdbdbd', height: altezza_intestazione, top: 0, zIndex: 3 }}>Descrizione</TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell sx={{ color: '#bdbdbd', position: 'sticky', top: altezza_intestazione, zIndex: 2 }}>
              <SelezioneStato value={statoFiltro} onChange={setStatoFiltro} />
            </TableCell>
            <TableCell sx={{ color: '#bdbdbd', position: 'sticky', top: altezza_intestazione, zIndex: 2 }}>
              <GenericaRicerca value={ricercaImpianto} onChange={setRicercaImpianto} />
            </TableCell>
            <TableCell sx={{ color: '#bdbdbd', position: 'sticky', top: altezza_intestazione, zIndex: 2 }}>
              <GenericaRicerca value={ricercaAzienda} onChange={setRicercaAzienda} />
            </TableCell>
            <TableCell sx={{ color: '#bdbdbd', position: 'sticky', top: altezza_intestazione, zIndex: 2 }}>
              <GenericaRicerca value={ricercaGruppo} onChange={setRicercaGruppo} />
            </TableCell>
            <TableCell sx={{ color: '#bdbdbd', position: 'sticky', top: altezza_intestazione, zIndex: 2 }}>
              <GenericaRicerca value={ricercaDispositivo} onChange={setRicercaDispositivo} />
            </TableCell>
            <TableCell sx={{ color: '#bdbdbd', position: 'sticky', top: altezza_intestazione, zIndex: 2 }}>
              <SelezioneLivello value={livelloFiltro} onChange={setLivelloFiltro} />
            </TableCell>
            <TableCell sx={{ color: '#bdbdbd', position: 'sticky', top: altezza_intestazione, zIndex: 2 }}>
              <BasicDatePicker value={dataInizioFiltro} onChange={setDataInizioFiltro} />
            </TableCell>
            <TableCell sx={{ color: '#bdbdbd', position: 'sticky', top: altezza_intestazione, zIndex: 2 }}>
              <BasicDatePicker value={dataFineFiltro} onChange={setDataFineFiltro} />
            </TableCell>
            <TableCell sx={{ color: '#bdbdbd', position: 'sticky', top: altezza_intestazione, zIndex: 2 }}></TableCell>
            <TableCell sx={{ color: '#bdbdbd', position: 'sticky', top: altezza_intestazione, zIndex: 2 }}>
              <GenericaRicerca value={ricercaDescrizione}  onChange={setRicercaDescrizione} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {caricamento ? (
            <TableRow>
              <TableCell colSpan={10} align='center' sx={{ py: 4}}>
                <CircularProgress size={28} />
              </TableCell>
            </TableRow>
          ) : allarmi.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align='center' sx={{ py: 4, color: '#9ca3af'}}>
                Nessun allarme corrispondente ai filtri selezionati
              </TableCell>
            </TableRow>
          ) : (
            allarmi.map((allarme) => (
              <TableRow className='bg-gray-800'
                key={allarme.id}
              >
                <TableCell>{allarme.stato ?  <ReportProblemRoundedIcon className='text-amber-500'/> : <ReportProblemRoundedIcon className='text-gray-400' />}</TableCell>
                <TableCell sx={{ color: 'white' }}>{allarme.impianto}</TableCell>
                <TableCell sx={{ color: 'white' }}>{allarme.azienda}</TableCell>
                <TableCell sx={{ color: 'white' }}>{allarme.gruppo}</TableCell>
                <TableCell sx={{ color: 'white' }}>{allarme.dispositivo}</TableCell>
                <TableCell sx={{ color: 'white' }}><ReportProblemRoundedIcon />{allarme.livello}</TableCell>
                <TableCell sx={{ color: 'white' }}>{formattaData(allarme.dataInizio)}</TableCell>
                <TableCell sx={{ color: 'white' }}>{formattaData(allarme.dataFine)}</TableCell>
                <TableCell sx={{ color: 'white' }}>{allarme.durata ?? '-'}</TableCell>
                <TableCell sx={{ color: 'white' }}>{allarme.descrizione}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      component="div"
      count={totale}
      page={pagina}
      onPageChange={handleCambioPagina}
      rowsPerPage={righePerPagina}
      onRowsPerPageChange={handleCambioRighePerPagina}
      rowsPerPageOptions={[10, 50, 100]}
      labelRowsPerPage="Righe per pagina:"
      sx={{
        maxWidth: '96%',
        mx: 'auto',
        color: 'white',
        backgroundColor: '#1f2937',
        borderTop: '1px solid #424242',
        '.MuiTablePagination-selectIcon': { color: 'white'},
        '.MuiTablePagination-actions button': { color: 'white'},
      }}
    />
    </>
  );
}