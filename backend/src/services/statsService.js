const db = require('../db/postgres');
const Routine = require('../models/Routine');
const ProgressLog = require('../models/ProgressLog');

/**
 * Returns a Date set to the first day of the month (UTC) for consistent storage
 * in PostgreSQL DATE columns.
 */
function getMonthStart(date = new Date()) {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function monthFromParts(year, month) {
  return new Date(Date.UTC(year, month - 1, 1));
}

async function upsertUserMonthlyStats(userId, monthStart, counts, mode = 'increment') {
  const { routines = 0, followups = 0 } = counts;
  const sql =
    mode === 'replace'
      ? `INSERT INTO gym_app.user_monthly_stats (user_id, month_year, routines_started, followups_count)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, month_year) DO UPDATE
         SET routines_started = EXCLUDED.routines_started,
             followups_count = EXCLUDED.followups_count`
      : `INSERT INTO gym_app.user_monthly_stats (user_id, month_year, routines_started, followups_count)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, month_year) DO UPDATE
         SET routines_started = gym_app.user_monthly_stats.routines_started + EXCLUDED.routines_started,
             followups_count = gym_app.user_monthly_stats.followups_count + EXCLUDED.followups_count`;
  await db.query(sql, [userId, monthStart, routines, followups]);
}

async function upsertInstructorMonthlyStats(instructorId, monthStart, counts, mode = 'increment') {
  const { newAssignments = 0, followups = 0 } = counts;
  const sql =
    mode === 'replace'
      ? `INSERT INTO gym_app.instructor_monthly_stats (instructor_id, month_year, new_assignments, followups_count)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (instructor_id, month_year) DO UPDATE
         SET new_assignments = EXCLUDED.new_assignments,
             followups_count = EXCLUDED.followups_count`
      : `INSERT INTO gym_app.instructor_monthly_stats (instructor_id, month_year, new_assignments, followups_count)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (instructor_id, month_year) DO UPDATE
         SET new_assignments = gym_app.instructor_monthly_stats.new_assignments + EXCLUDED.new_assignments,
             followups_count = gym_app.instructor_monthly_stats.followups_count + EXCLUDED.followups_count`;
  await db.query(sql, [instructorId, monthStart, newAssignments, followups]);
}

async function findInstructorForDate(userId, targetDate) {
  const result = await db.query(
    `SELECT instructor_id
       FROM gym_app.assignment
      WHERE user_id = $1
        AND start_date <= $2
        AND (end_date IS NULL OR end_date >= $2)
      ORDER BY start_date DESC
      LIMIT 1`,
    [userId, targetDate]
  );
  return result.rows[0]?.instructor_id || null;
}

async function recordRoutineCreation(userId, createdAt = new Date()) {
  const monthStart = getMonthStart(createdAt);
  await upsertUserMonthlyStats(userId, monthStart, { routines: 1, followups: 0 });
}

async function recordProgressFollowup(userId, progressDate = new Date()) {
  const monthStart = getMonthStart(progressDate);
  await upsertUserMonthlyStats(userId, monthStart, { routines: 0, followups: 1 });
  const instructorId = await findInstructorForDate(userId, progressDate);
  if (instructorId) {
    await upsertInstructorMonthlyStats(instructorId, monthStart, { newAssignments: 0, followups: 1 });
  }
}

async function recordNewAssignment(instructorId, startDate = new Date()) {
  const monthStart = getMonthStart(startDate);
  await upsertInstructorMonthlyStats(instructorId, monthStart, { newAssignments: 1, followups: 0 });
}

function ensureUserEntry(map, userId, monthStart) {
  const key = `${userId}-${monthStart.toISOString()}`;
  if (!map.has(key)) {
    map.set(key, { userId, monthStart, routines: 0, followups: 0 });
  }
  return map.get(key);
}

function ensureInstructorEntry(map, instructorId, monthStart) {
  const key = `${instructorId}-${monthStart.toISOString()}`;
  if (!map.has(key)) {
    map.set(key, { instructorId, monthStart, newAssignments: 0, followups: 0 });
  }
  return map.get(key);
}

function buildAssignmentsMap(rows) {
  const assignments = new Map();
  rows.forEach((row) => {
    const startDate = new Date(row.start_date);
    const endDate = row.end_date ? new Date(row.end_date) : null;
    const list = assignments.get(row.user_id) || [];
    list.push({ instructorId: row.instructor_id, startDate, endDate });
    assignments.set(row.user_id, list);
  });
  assignments.forEach((list, userId) => {
    list.sort((a, b) => a.startDate - b.startDate);
    assignments.set(userId, list);
  });
  return assignments;
}

function findInstructorInCache(assignmentsMap, userId, targetDate) {
  const list = assignmentsMap.get(userId) || [];
  const found = list.find(
    (assignment) =>
      assignment.startDate <= targetDate && (!assignment.endDate || assignment.endDate >= targetDate)
  );
  return found ? found.instructorId : null;
}

async function rebuildMonthlyStats() {
  const userAggregates = new Map();
  const instructorAggregates = new Map();

  const routinesAgg = await Routine.aggregate([
    {
      $group: {
        _id: { userId: '$userId', year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
  ]);
  routinesAgg.forEach((item) => {
    const { userId, year, month } = item._id;
    const monthStart = monthFromParts(year, month);
    const entry = ensureUserEntry(userAggregates, userId, monthStart);
    entry.routines += item.count;
  });

  const progressLogs = await ProgressLog.find({}, 'userId date').lean();

  progressLogs.forEach((log) => {
    const monthStart = getMonthStart(log.date);
    const entry = ensureUserEntry(userAggregates, log.userId, monthStart);
    entry.followups += 1;
  });

  const assignmentCounts = await db.query(
    `SELECT instructor_id, DATE_TRUNC('month', start_date)::date AS month_year, COUNT(*) AS count
       FROM gym_app.assignment
      GROUP BY instructor_id, month_year`
  );
  assignmentCounts.rows.forEach((row) => {
    const monthStart = new Date(row.month_year);
    const entry = ensureInstructorEntry(instructorAggregates, row.instructor_id, monthStart);
    entry.newAssignments = Number(row.count);
  });

  const assignments = await db.query(
    'SELECT user_id, instructor_id, start_date, end_date FROM gym_app.assignment'
  );
  const assignmentsMap = buildAssignmentsMap(assignments.rows);

  progressLogs.forEach((log) => {
    const instructorId = findInstructorInCache(assignmentsMap, log.userId, new Date(log.date));
    if (instructorId) {
      const monthStart = getMonthStart(log.date);
      const entry = ensureInstructorEntry(instructorAggregates, instructorId, monthStart);
      entry.followups += 1;
    }
  });

  for (const entry of userAggregates.values()) {
    await upsertUserMonthlyStats(
      entry.userId,
      entry.monthStart,
      { routines: entry.routines, followups: entry.followups },
      'replace'
    );
  }

  for (const entry of instructorAggregates.values()) {
    await upsertInstructorMonthlyStats(
      entry.instructorId,
      entry.monthStart,
      { newAssignments: entry.newAssignments, followups: entry.followups },
      'replace'
    );
  }
}

function scheduleMonthlyAggregation() {
  rebuildMonthlyStats().catch((err) => console.error('Error al recalcular estadísticas mensuales', err));
  const dayMs = 24 * 60 * 60 * 1000;
  setInterval(() => {
    rebuildMonthlyStats().catch((err) =>
      console.error('Error al ejecutar la agregación mensual programada', err)
    );
  }, dayMs);
}

module.exports = {
  getMonthStart,
  recordNewAssignment,
  recordProgressFollowup,
  recordRoutineCreation,
  rebuildMonthlyStats,
  scheduleMonthlyAggregation,
};
