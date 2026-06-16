import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type {SelectChangeEvent}  from '@mui/material/Select'

export default function SelezioneStato() {
  const [stato, setStato] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setStato(event.target.value);
  };
  return (
    <div>
      <FormControl variant="standard"
      sx={{minWidth: 80,
        transform: 'translateY(-7px)'
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
          disableUnderline
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
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value='tutto'>(TUTTI)</MenuItem>
          <MenuItem value='on'>Acceso</MenuItem>
          <MenuItem value='off'>Spento</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}