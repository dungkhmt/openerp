import React from 'react';
import {FormControl, FormLabel, MenuItem, Select, TextField} from "@mui/material";

export default function SelectItem(props) {

  return (
    <FormControl {...props}>
      <FormLabel>{props.label}</FormLabel>
      <Select
        multiple={props.multiple}
        value={props.value}
        onChange={event => props.onChange(event.target.value)}
      >
        { props.options.map(option => (
          <MenuItem value={option.value} key={option.value}>
            { option.label }
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}