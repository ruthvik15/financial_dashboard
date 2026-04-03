const pool = require("../utils/dbConnection");

/**
 * Total income and total expense
 */
const getFinancialSummary = async () => {
    const result = await pool.query(
        `SELECT type, SUM(amount) AS total
         FROM records
         WHERE is_deleted = FALSE
         GROUP BY type`
    );
    return result.rows;
};

/**
 * Expense and income totals + count per category
 */
const getCategoryBreakdown = async () => {
    const result = await pool.query(
        `SELECT type, category,
                SUM(amount) AS total,
                COUNT(*) AS count
         FROM records
         WHERE is_deleted = FALSE
         GROUP BY type, category
         ORDER BY total DESC`
    );
    return result.rows;
};

/**
 * Monthly income and expense totals
 */
const getMonthlyTrends = async () => {
    const result = await pool.query(
        `SELECT type,
                DATE_TRUNC('month', date) AS month_start,
                SUM(amount) AS total
         FROM records
         WHERE is_deleted = FALSE
         GROUP BY type, month_start
         ORDER BY month_start`
    );
    return result.rows;
};

/**
 * Weekly income and expense totals
 */
const getWeeklyTrends = async () => {
    const result = await pool.query(
        `SELECT type,
                TO_CHAR(DATE_TRUNC('week', date), 'IYYY-"W"IW') AS week_start,
                SUM(amount) AS total
         FROM records
         WHERE is_deleted = FALSE
         GROUP BY type, week_start
         ORDER BY week_start`
    );
    return result.rows;
};

/**
 * Top 1 largest transaction (for top expense alert)
 */
const getTopTransaction = async () => {
    const result = await pool.query(
        `SELECT id, amount, type, category, date, notes
         FROM records
         WHERE is_deleted = FALSE
         ORDER BY amount DESC
         LIMIT 1`
    );
    return result.rows[0] || null;
};

/**
 * Current month and last month expense totals (for overspending alert)
 */
const getRecentMonthExpenses = async () => {
    const result = await pool.query(
        `SELECT DATE_TRUNC('month', date) AS month_start,
                SUM(amount) AS total
         FROM records
         WHERE type = 'expense'
           AND date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
           AND is_deleted = FALSE
         GROUP BY month_start
         ORDER BY month_start;`
    );
    return result.rows;
};

/**
 * Most frequent category (by number of records)
 */
const getMostFrequentCategory = async () => {
    const result = await pool.query(
        `SELECT category, COUNT(*) AS count
         FROM records
         WHERE is_deleted = FALSE
         GROUP BY category
         ORDER BY count DESC
         LIMIT 1`
    );
    return result.rows[0] || null;
};

/**
 * Running cumulative balance (total income minus total expense)
 */
const getCurrentBalance = async () => {
    const result = await pool.query(
        `SELECT
            COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0) -
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)
            AS balance
         FROM records
         WHERE is_deleted = FALSE`
    );
    return parseFloat(result.rows[0]?.balance || 0);
};

module.exports = {
    getFinancialSummary,
    getCategoryBreakdown,
    getMonthlyTrends,
    getWeeklyTrends,
    getTopTransaction,
    getRecentMonthExpenses,
    getMostFrequentCategory,
    getCurrentBalance,
};
