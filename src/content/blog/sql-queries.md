---
title: "10 SQL Queries That Make Treeline Worth It"
date: 2026-02-10T12:00:00
description: "Real queries against real financial data—from simple to genuinely useful"
draft: true
---

Treeline stores your data in a local DuckDB database. That means you can query it with SQL—from the built-in editor, the CLI (`tl sql`), a Jupyter notebook, or any tool that speaks DuckDB. No API keys, no export-and-pray. Just SQL against your actual data.

Here are 10 queries I've actually used, starting simple and getting progressively more interesting.

## 1. What did I spend the most on?

```sql
SELECT description, amount, date
FROM transactions
WHERE amount < 0
ORDER BY amount ASC
LIMIT 20
```

Basic, but it's the first thing everyone runs. Seeing your biggest expenses in a raw list hits different than a pie chart.

## 2. Monthly spending by tag

```sql
SELECT
  date_trunc('month', date) AS month,
  tag,
  SUM(amount) AS total
FROM transactions
WHERE amount < 0
  AND date >= '2025-01-01'
GROUP BY month, tag
ORDER BY month DESC, total ASC
```

This is the backbone of any budget review. You'll immediately see which categories are growing.

## 3. What day of the week do I spend the most?

```sql
SELECT
  dayname(date) AS day_of_week,
  dayofweek(date) AS day_num,
  ROUND(AVG(amount), 2) AS avg_spend,
  COUNT(*) AS num_transactions
FROM transactions
WHERE amount < 0
GROUP BY day_of_week, day_num
ORDER BY day_num
```

Turns out I spend the most on Saturdays. Not surprising, but seeing it quantified is clarifying.

## 4. Rolling 3-month average spending

```sql
SELECT
  date_trunc('month', date) AS month,
  SUM(amount) AS monthly_total,
  AVG(SUM(amount)) OVER (
    ORDER BY date_trunc('month', date)
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS rolling_3mo_avg
FROM transactions
WHERE amount < 0
GROUP BY month
ORDER BY month DESC
```

This smooths out the noise. One expensive month doesn't mean your spending is out of control—the rolling average tells the real story.

## 5. Subscriptions that have increased in price

```sql
WITH monthly AS (
  SELECT
    description,
    date_trunc('month', date) AS month,
    ABS(amount) AS charge
  FROM transactions
  WHERE amount < 0
    AND tag = 'subscriptions'
)
SELECT
  description,
  MIN(charge) AS lowest_charge,
  MAX(charge) AS highest_charge,
  ROUND(MAX(charge) - MIN(charge), 2) AS increase
FROM monthly
GROUP BY description
HAVING COUNT(DISTINCT charge) > 1
ORDER BY increase DESC
```

Every subscription creeps up eventually. This finds the ones that have.

## 6. Income vs. expenses by month

```sql
SELECT
  date_trunc('month', date) AS month,
  SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS income,
  SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) AS expenses,
  SUM(amount) AS net
FROM transactions
GROUP BY month
ORDER BY month DESC
```

Simple, but having income and expenses side by side with the net makes months where you overspent obvious at a glance.

## 7. Top merchants by frequency

```sql
SELECT
  description,
  COUNT(*) AS visits,
  ROUND(SUM(amount), 2) AS total_spent,
  ROUND(AVG(amount), 2) AS avg_transaction
FROM transactions
WHERE amount < 0
  AND date >= current_date - INTERVAL '6 months'
GROUP BY description
ORDER BY visits DESC
LIMIT 15
```

Frequency matters as much as amount. You might spend more total at the grocery store than on coffee, but 47 coffee transactions in 6 months is worth noticing.

## 8. Largest month-over-month spending increase by tag

```sql
WITH monthly_tag AS (
  SELECT
    tag,
    date_trunc('month', date) AS month,
    ABS(SUM(amount)) AS total
  FROM transactions
  WHERE amount < 0 AND tag IS NOT NULL
  GROUP BY tag, month
)
SELECT
  tag,
  month,
  total,
  LAG(total) OVER (PARTITION BY tag ORDER BY month) AS prev_month,
  ROUND(total - LAG(total) OVER (PARTITION BY tag ORDER BY month), 2) AS increase
FROM monthly_tag
ORDER BY increase DESC NULLS LAST
LIMIT 10
```

Window functions are DuckDB's bread and butter. This finds the single biggest month-over-month jump in any spending category—useful for spotting anomalies.

## 9. Days since last transaction per account

```sql
SELECT
  account,
  MAX(date) AS last_transaction,
  current_date - MAX(date) AS days_since
FROM transactions
GROUP BY account
ORDER BY days_since DESC
```

If an account hasn't had activity in a while, either you forgot to sync or something's off. Quick sanity check.

## 10. Spending velocity—are you on track this month?

```sql
WITH this_month AS (
  SELECT
    ABS(SUM(amount)) AS spent_so_far,
    extract(day FROM current_date) AS days_elapsed,
    extract(day FROM last_day(current_date)) AS days_in_month
  FROM transactions
  WHERE amount < 0
    AND date_trunc('month', date) = date_trunc('month', current_date)
)
SELECT
  spent_so_far,
  ROUND(spent_so_far / days_elapsed, 2) AS daily_rate,
  ROUND((spent_so_far / days_elapsed) * days_in_month, 2) AS projected_total,
  days_elapsed || ' of ' || days_in_month || ' days' AS progress
FROM this_month
```

This projects your end-of-month spending based on your current daily rate. Run it mid-month to see if you need to pump the brakes.

---

These aren't hypothetical queries for a demo database. They're the kind of questions I actually want answered about my money—questions that no app's pre-built dashboard anticipated.

That's the point. Your data is a database. Ask it anything.

Run any of these from the terminal:

```bash
tl sql "PASTE_QUERY_HERE"
```

Or open the SQL editor in the desktop app, or connect with any DuckDB-compatible tool. The data is yours.
