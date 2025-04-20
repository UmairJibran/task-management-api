const cron = require('node-cron');
const supabase = require('../config/supabase.client');

const generateDailyDigest = async () => {
  console.log('Generating daily digest...');

  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: upcomingTasks, error: upcomingError } = await supabase
      .from('tasks')
      .select(
        `
        *,
        categories(name)
      `,
      )
      .eq('due_date', today)
      .neq('status', 'completed');

    if (upcomingError) {
      console.error('Error fetching upcoming tasks:', upcomingError);
      return;
    }

    const { data: overdueTasks, error: overdueError } = await supabase
      .from('tasks')
      .select(
        `
        *,
        categories(name)
      `,
      )
      .lt('due_date', today)
      .neq('status', 'completed');

    if (overdueError) {
      console.error('Error fetching overdue tasks:', overdueError);
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIso = yesterday.toISOString();

    const { data: completedTasks, error: completedError } = await supabase
      .from('task_status_logs')
      .select(
        `
        *,
        tasks(
          *,
          categories(name)
        )
      `,
      )
      .eq('status', 'completed')
      .gt('changed_at', yesterdayIso);

    if (completedError) {
      console.error('Error fetching completed tasks:', completedError);
      return;
    }

    const { data: users, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log('Daily Digest Summary:');
    console.log('====================');
    console.log(`Total Users: ${users.users.length}`);
    console.log(`Upcoming Tasks Due Today: ${upcomingTasks.length}`);
    console.log(`Overdue Tasks: ${overdueTasks.length}`);
    console.log(`Recently Completed Tasks: ${completedTasks.length}`);
    console.log('====================');

    users.users.forEach((user) => {
      const userUpcomingTasks = upcomingTasks.filter(
        (task) => task.user_id === user.id,
      );
      const userOverdueTasks = overdueTasks.filter(
        (task) => task.user_id === user.id,
      );
      const userCompletedTasks = completedTasks
        .filter((log) => log.tasks && log.tasks.user_id === user.id)
        .map((log) => log.tasks);

      console.log(`\nDigest for ${user.email}:`);
      console.log(`- Tasks due today: ${userUpcomingTasks.length}`);
      console.log(`- Overdue tasks: ${userOverdueTasks.length}`);
      console.log(`- Recently completed tasks: ${userCompletedTasks.length}`);
    });

    console.log('\nDaily digest completed!');
  } catch (error) {
    console.error('Error generating daily digest:', error);
  }
};

const scheduleDailyDigest = () => {
  cron.schedule('0 0 * * *', generateDailyDigest);
  console.log('Daily digest scheduled to run at midnight every day');

  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Running initial digest...');
    generateDailyDigest();
  }
};

module.exports = {
  scheduleDailyDigest,
  generateDailyDigest,
};
