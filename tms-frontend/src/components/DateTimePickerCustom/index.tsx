import React from "react";

import DatePicker from "react-datepicker";
import { setHours, setMinutes, setSeconds } from "date-fns";

interface Props {
  id?: string;
  dateTime: Date;
  setDateTime: (val: Date) => void;
  placeholder?: string;
}

const DateTimePickerCustom = ({
  id,
  dateTime,
  setDateTime,
  placeholder,
}: Props) => {
  return (
    <DatePicker
      placeholderText={placeholder}
      id={id}
      className="border rounded-md pl-5 pt-1 pb-1 flex items-center justify-center w-full"
      selected={dateTime}
      onChange={(date) => setDateTime(date || new Date())}
      showTimeSelect
      timeFormat="HH:mm:ss"
      injectTimes={[
        setHours(setMinutes(setSeconds(new Date(), 10), 1), 0),
        setHours(setMinutes(new Date(), 5), 12),
        setHours(setMinutes(new Date(), 59), 23),
      ]}
      dateFormat="MMMM d, yyyy h:mm aa"
    />
  );
};

export default DateTimePickerCustom;
