import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

type Props = {
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
};

export default function BasicDatePicker({ value, onChange }: Props) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
      value={value}
      onChange={onChange}
      format='DD/MM/YYYY'
        slotProps={{
          textField: {
            variant: 'outlined',
            sx: {
              width: 170,
              "& *": {
                color: "white !important",
              },
              '& .MuiSvgIcon-root': {
                color: 'white',
              },
              '& fieldset': {
                border: 'none'
              },
            },
          },

          day: {
            sx: {
              color: 'white',
              '&.Mui-selected': {
                backgroundColor: '#ff9800',
                color: 'black',
              },
              '&:hover': {
                backgroundColor: '#e38800',
              },  
            }
          },
          
          popper: {
            sx: {
              '& .MuiPaper-root': {
                backgroundColor: '#1F2939FF',
                color: '#ff9800',
              },
              '& .MuiSvgIcon-root': {
                color: '#ff9800',
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}