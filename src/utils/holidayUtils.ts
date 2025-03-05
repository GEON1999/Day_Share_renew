import axios from "axios";

export interface Holiday {
  date: string;
  name: string;
}

export async function getKoreanHolidays(year: number): Promise<Holiday[]> {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const calendarId = encodeURIComponent(
    "ko.south_korea#holiday@group.v.calendar.google.com"
  );
  const timeMin = `${year}-01-01T00:00:00Z`;
  const timeMax = `${year}-12-31T23:59:59Z`;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        params: {
          key: API_KEY,
          timeMin,
          timeMax,
          singleEvents: true,
          orderBy: "startTime",
        },
      }
    );

    const holidays: Holiday[] = response.data.items.map((item: any) => ({
      date: item.start.date,
      name: item.summary,
    }));

    return holidays;
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
}
