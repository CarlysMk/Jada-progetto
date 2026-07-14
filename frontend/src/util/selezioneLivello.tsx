import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type {SelectChangeEvent}  from '@mui/material/Select'

export type LivelloFiltro = '' | 'tutto' | 'red' | 'orange' | 'yellow';

type Props = {
  value: LivelloFiltro;
  onChange: (value: LivelloFiltro) => void;
};

export default function SelezioneLivello({ value, onChange }: Props) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as LivelloFiltro);
  };
  return (
    <div>
      <FormControl variant="standard"
      sx={{minWidth: 100,
        transform: 'translateY(-7px)'}}
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
          <MenuItem value='red'>Major</MenuItem>
          <MenuItem value='orange'>Warning</MenuItem>
          <MenuItem value='yellow'>Minor</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}