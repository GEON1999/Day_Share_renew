const generateCalendar = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  const prevLastDay = new Date(year, month, 0).getDate();

  let day = 1;
  const calendar = [];

  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startingDay) {
        week.push({
          day: prevLastDay - startingDay + j + 1,
          currentMonth: false,
        });
      } else if (day <= daysInMonth) {
        week.push({ day: day, currentMonth: true });
        day++;
      } else {
        week.push({ day: day - daysInMonth, currentMonth: false });
        day++;
      }
    }
    calendar.push(week);
  }

  return calendar;
};

export default generateCalendar;
