let today = new Date();

module.exports = {
  getDay: today.getDate().toLocaleString(),
  getMonth: today.getMonth() + 1,
};
