function getTodayAndXMore(numberToGet) {
  const today = new Date();
  let nextDate = new Date(today);

  let formattedDates = [];
  for (let i = 1; i <= numberToGet; i++) {
    nextDate.setDate(today.getDate() + i);
    const formattedDate = nextDate.toISOString().slice(0, 10);
    formattedDates.push(formattedDate);
  }

  return formattedDates;
}

module.exports = { getTodayAndXMore };
