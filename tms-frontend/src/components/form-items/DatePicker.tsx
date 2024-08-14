import React, { useState } from "react";

import DatePicker from "react-datepicker";
import { setHours, setMinutes, setSeconds } from "date-fns";

const DateTimePickerCustom = () => {
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 30), 16)
  );

  return (
    <DatePicker
      className="border rounded-md pl-5 pt-1 pb-1 flex items-center justify-center"
      selected={startDate}
      onChange={(date) => setStartDate(date || new Date())}
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
