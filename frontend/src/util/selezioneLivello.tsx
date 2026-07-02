import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type {SelectChangeEvent}  from '@mui/material/Select'

export default function SelezioneLivello() {
  const [livello, setLivello] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setLivello(event.target.value);
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
          value={livello}
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
          <MenuItem value='tuttto'>(TUTTI)</MenuItem>
          <MenuItem value='red'>Major</MenuItem>
          <MenuItem value='orange'>Warning</MenuItem>
          <MenuItem value='yellow'>Minor</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}