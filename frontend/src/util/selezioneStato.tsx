import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type {SelectChangeEvent}  from '@mui/material/Select'

export type StatoFiltro = '' | 'tutto' | 'on' | 'off'

type Props = {
  value: StatoFiltro;
  onChange: (value: StatoFiltro) => void;
};

export default function SelezioneStato({ value, onChange }: Props) {

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as StatoFiltro);
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
          value={value}
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