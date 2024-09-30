let apiHeader = (token: any) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

let deleteOption = {
  headers: { Authorization: process.env.API_KEY },
};

export default {
  apiHeader,
  deleteOption,
};
