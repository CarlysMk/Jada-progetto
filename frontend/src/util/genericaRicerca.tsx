import {
    Box, TextField,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function GenericaRicerca({ value, onChange, placeholder }: Props) {
    return (
        <Box novalidate autoComplete="off">
        <TextField variant="standard"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
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
            
            
            '& .MuiInput-root': {
              color:'white',
            },
            '& .MuiInput-underline:before':{
              borderBottomColor: '#1f2939'
            },
            '& .MuiInput-underline:hover:before':{
              borderBottomColor: '#1f2939'
            },
            '& .MuiInput-underline:after':{
              borderBottomColor: '#ff9800',
            },
            '& input::placeholder': {
              color: '##ff9800',opacity: 0,
            },
          }}
        />
      </Box>
    );

}
