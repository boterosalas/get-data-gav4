const getDateRange = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    startDate: formatDate(yesterday),
    endDate: formatDate(today),
  };
};

module.exports = {
  getDateRange,
};
