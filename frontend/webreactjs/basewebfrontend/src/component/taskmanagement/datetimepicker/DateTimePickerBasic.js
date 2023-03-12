import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function DateTimePickerBasic({ label, onChange, value }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label={label}
        value={value}
        onChange={onChange}
        sx={{ backgroundColor: "#fff" }}
      />
    </LocalizationProvider>
  );
}
