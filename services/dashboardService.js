const dashboardRepository = require("../repositories/dashboardRepository");
const { getCache, setCache, DASHBOARD_KEY } = require("../utils/redisClient");

const getDashboard = async () => {
    const cached = await getCache(DASHBOARD_KEY);
    if (cached) {
        return {
            ...cached,
            meta: {
                ...cached.meta,
                source: "cache"
            }
        };
    }

    const [
        financialRows,
        categoryRows,
        monthlyRows,
        weeklyRows,
        topTransaction,
        recentMonthRows,
        mostFrequentCategory,
        currentBalance,
    ] = await Promise.all([
        dashboardRepository.getFinancialSummary(),
        dashboardRepository.getCategoryBreakdown(),
        dashboardRepository.getMonthlyTrends(),
        dashboardRepository.getWeeklyTrends(),
        dashboardRepository.getTopTransaction(),
        dashboardRepository.getRecentMonthExpenses(),
        dashboardRepository.getMostFrequentCategory(),
        dashboardRepository.getCurrentBalance(),
    ]);

    const incomeRow  = financialRows.find(r => r.type === "income");
    const expenseRow = financialRows.find(r => r.type === "expense");
    const totalIncome   = parseFloat(incomeRow?.total  || 0);
    const totalExpenses = parseFloat(expenseRow?.total || 0);
    const netBalance    = totalIncome - totalExpenses;

    const financialSummary = {
        totalIncome,
        totalExpenses,
        netBalance,
        currentBalance,
    };


    const expenseCategories = categoryRows.filter(r => r.type === "expense");
    const incomeCategories  = categoryRows.filter(r => r.type === "income");

    const expenseBreakdown = expenseCategories.map(r => ({
        category:    r.category,
        total:       parseFloat(r.total),
        count:       r.count,
        percentage:  totalExpenses > 0
            ? parseFloat(((parseFloat(r.total) / totalExpenses) * 100).toFixed(2))
            : 0,
    }));

    const incomeBreakdown = incomeCategories.map(r => ({
        category:   r.category,
        total:      parseFloat(r.total),
        count:      r.count,
        percentage: totalIncome > 0
            ? parseFloat(((parseFloat(r.total) / totalIncome) * 100).toFixed(2))
            : 0,
    }));

    const topSpendingCategories = [...expenseBreakdown]
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);

    const categoryAnalytics = {
        expenseBreakdown,
        incomeBreakdown,
        topSpendingCategories,
    };

    // Build maps: month → { income, expense }
    const monthMap = {};
    // month_start is a Date object from DATE_TRUNC — convert to 'YYYY-MM' string as map key
    const toMonthKey = (d) => new Date(d).toISOString().slice(0, 7);

    for (const row of monthlyRows) {
        const key = toMonthKey(row.month_start);
        if (!monthMap[key]) monthMap[key] = { income: 0, expense: 0 };
        monthMap[key][row.type] = parseFloat(row.total);
    }

    const allMonths      = Object.keys(monthMap).sort();
    const monthlyIncome  = allMonths.map(m => ({ month: m, total: monthMap[m].income  || 0 }));
    const monthlyExpense = allMonths.map(m => ({ month: m, total: monthMap[m].expense || 0 }));
    const monthlyNetCashFlow = allMonths.map(m => ({
        month: m,
        net: (monthMap[m].income || 0) - (monthMap[m].expense || 0),
    }));

    // Weekly
    const weekMap = {};
    for (const row of weeklyRows) {
        const key = row.week_start;
        if (!weekMap[key]) weekMap[key] = { income: 0, expense: 0 };
        weekMap[key][row.type] = parseFloat(row.total);
    }
    const allWeeks     = Object.keys(weekMap).sort();
    const weeklyTrends = allWeeks.map(w => ({
        week:    w,
        income:  weekMap[w].income  || 0,
        expense: weekMap[w].expense || 0,
    }));

    const timeTrends = { monthlyIncome, monthlyExpense, monthlyNetCashFlow, weeklyTrends };

    //Burn Rate & Runway 
    const totalMonths = allMonths.length || 1;
    const burnRate    = parseFloat((totalExpenses / totalMonths).toFixed(2));
    const runwayMonths = burnRate > 0
        ? parseFloat((currentBalance / burnRate).toFixed(2))
        : null; 

    const burnAndRunway = { burnRate, runwayMonths };

    // Financial Health Metrics 
    const savingsRate  = totalIncome > 0
        ? parseFloat(((totalIncome - totalExpenses) / totalIncome).toFixed(4))
        : 0;
    const expenseRatio = totalIncome > 0
        ? parseFloat((totalExpenses / totalIncome).toFixed(4))
        : null;

    const deficitMonths = allMonths.filter(
        m => (monthMap[m].expense || 0) > (monthMap[m].income || 0)
    );

    const recentNets = monthlyNetCashFlow.slice(-3); // last 3 months
    const cashFlowStatus = recentNets.length === 0
        ? "unknown"
        : recentNets.every(m => m.net >= 0) ? "positive"
        : recentNets.every(m => m.net <  0) ? "negative"
        : "mixed";

    const healthMetrics = { savingsRate, expenseRatio, deficitMonths, cashFlowStatus };


    const behavioralInsights = {
        mostFrequentCategory, // { category, count } from DB
    };

    // Alerts 
    const currentMonthKey = new Date().toISOString().slice(0, 7); // "YYYY-MM"
    const lastMonthDate   = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const lastMonthKey = lastMonthDate.toISOString().slice(0, 7);

    // month_start is a Date object — convert to 'YYYY-MM' key to match currentMonthKey
    const recentMap = {};
    for (const r of recentMonthRows) {
        const key = new Date(r.month_start).toISOString().slice(0, 7);
        recentMap[key] = parseFloat(r.total);
    }

    const currentMonthExpense = recentMap[currentMonthKey] || 0;
    const lastMonthExpense    = recentMap[lastMonthKey]    || 0;

    let overspendingAlert = null;
    if (lastMonthExpense > 0 && currentMonthExpense > lastMonthExpense) {
        overspendingAlert = {
            currentMonth:  currentMonthExpense,
            lastMonth:     lastMonthExpense,
            increasePercent: parseFloat(
                (((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100).toFixed(2)
            ),
        };
    }

    const alerts = {
        overspendingAlert,
        topExpense: topTransaction,
    };

    // Assemble & cache 
    const dashboard = {
        financialSummary,
        categoryAnalytics,
        timeTrends,
        burnAndRunway,
        healthMetrics,
        behavioralInsights,
        alerts,
        meta: {
            cachedAt: new Date().toISOString(),
            source: "db",
        },
    };

    await setCache(DASHBOARD_KEY, dashboard);
    return dashboard;
};

module.exports = { getDashboard };
