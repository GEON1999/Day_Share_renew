const CalendarHeader = () => (
  <thead className="bg_light_pink h-[20px] lg:h-[34px] w-[300px] lg:w-full border-b-[1.5px]">
    <tr className="text-black text-[14px] lg:text-md">
      <th className="day-sun">
        <span className="bor_right" />
      </th>
      <th className="day-mon relative">
        <span className="bor_right" />
      </th>
      <th className="day-tue relative">
        <span className="bor_right" />
      </th>
      <th className="day-wed relative">
        <span className="bor_right" />
      </th>
      <th className="day-thu relative">
        <span className="bor_right" />
      </th>
      <th className="day-fri relative">
        <span className="bor_right" />
      </th>
      <th className="day-sat"></th>
    </tr>
  </thead>
);

export default CalendarHeader;
