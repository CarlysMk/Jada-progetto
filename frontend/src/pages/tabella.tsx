import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, TextField, Stack, IconButton,
  CircularProgress, Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import EventIcon from '@mui/icons-material/Event';
import SelezioneStato from '../util/selezioneStato';
import GenericaRicerca from '../util/genericaRicerca';
import SelezioneLivello from '../util/selezioneLivello';
import BasicDatePicker from '../util/BasicDatePicker';
import CambioBot from '../util/cambiobot';
import { getAllarmi } from '../api/client';
import type { Allarme } from '../types/allarme';
import { formattaData } from '../util/formattaData';

export default function TabellaUtenti() {
  const [allarmi, setAllarmi] = useState<Allarme[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState<string | null> (null);

  useEffect(() => {
    let annullato = false;

    getAllarmi()
      .then((dati) => {
        if (!annullato) setAllarmi(dati);
      })
      .catch((err) => {
        if (!annullato) setErrore(err.message);
      })
      .finally(() => {
        if (!annullato) setCaricamento(false);
      });

    return () => {
      annullato = true;
    };
  }, []);
 
  return (
    <>
    <h1 className='text-white text-3xl pl-8 font-sans'>Allarmi</h1>

    <Stack direction="row">

      <Box novalidate autoComplete="off">
        <TextField placeholder="Cerca..." variant="filled"
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

    <TableContainer>
      <Table sx={{border: '1px solid', 
                  borderColor: '#424242', 
                  maxWidth:'96%', 
                  mx:'auto',
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid #424242', 
                    backgroundColor: '#1f2937',
                  }      
}}>
        <TableHead>
          <TableRow className='bg-gray-800'>
            <TableCell sx={{ color: '#bdbdbd' }}>Stato</TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}>Impianto</TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}>Azienda</TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}>Gruppo</TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}>Dispositivo</TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}>Livello</TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}>Inizio</TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}>Fine</TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}>Durata</TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}>Descrizione</TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell sx={{ color: '#bdbdbd' }}><SelezioneStato /></TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}><GenericaRicerca /></TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}><GenericaRicerca /></TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}><GenericaRicerca /></TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}><GenericaRicerca /></TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}><SelezioneLivello /></TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}><BasicDatePicker /></TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}><BasicDatePicker /></TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}></TableCell>
            <TableCell sx={{ color: '#bdbdbd' }}><GenericaRicerca /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {caricamento ? (
            <TableRow>
              <TableCell colSpan={10} align='center' sx={{ py: 4}}>
                <CircularProgress size={28} />
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
    </>
  );
}