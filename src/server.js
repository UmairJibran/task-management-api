const app = require('./app');
const { scheduleDailyDigest } = require('./utils/scheduler');
const PORT = process.env.FA_PORT || 3000;

scheduleDailyDigest();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
