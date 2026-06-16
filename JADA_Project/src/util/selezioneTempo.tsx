import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type {SelectChangeEvent}  from '@mui/material/Select'

export default function SelezioneTempo() {
  const [stato, setStato] = React.useState('giornaliero');

  const handleChange = (event: SelectChangeEvent) => {
    setStato(event.target.value);
  };
  return (
      <FormControl variant="filled"
      sx={{minWidth: 250,
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
      
      >

        <InputLabel
        sx={{color: 'white',
          '&Mui-focused': {
            color: 'white'
          }
        }}
        ></InputLabel>
        <Select
          value={stato}
          onChange={handleChange}
          sx={{color: 'white',
            '& .MuiSvgIcon-root': {
              color: 'white'
            }
          }}
          MenuProps={{
            slotProps: {
              paper: {
                sx: {
                  backgroundColor: '#1F2939FF',
                  color: 'white'
                }
              }
            }
          }}
        >
            
            <MenuItem value='giornaliero'>Giornaliero</MenuItem>
            <MenuItem value='settimanale'>Settimanale</MenuItem>
            <MenuItem value='mensile'>Mensile</MenuItem>
            <MenuItem value='annuale'>Annuale</MenuItem>
        </Select>
      </FormControl>
  );
}