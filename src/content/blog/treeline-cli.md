---
title: "Making the Most of the Treeline CLI"
date: 2026-02-10T12:00:00
description: "Everything you can do without ever opening the desktop app"
draft: true
---

Most people discover Treeline through the desktop app. But there's a full CLI (`tl`) that can do almost everything the app can—and some things it can't. If you're someone who lives in the terminal, you might never need to open the GUI.

Here's what I actually use it for.

## Syncing transactions

The most common thing I do:

```bash
tl sync
```

That pulls new transactions from all your connected accounts (SimpleFIN, Lunch Flow, or both). If you only want to sync one integration:

```bash
tl sync simplefin
```

Add `--dry-run` to see what *would* be imported without actually writing anything. Useful when you're first setting up and want to make sure things look right.

## Importing CSVs

This is where the CLI really shines. The `tl import` command handles the messy reality of bank CSV exports—every bank formats them differently, and the CLI has flags for all of it:

```bash
tl import transactions.csv \
  --account "Chase Checking" \
  --date-column "Post Date" \
  --amount-column "Amount" \
  --description-column "Description"
```

If your bank splits debits and credits into separate columns:

```bash
tl import transactions.csv \
  --account "BofA Savings" \
  --debit-column "Debit" \
  --credit-column "Credit" \
  --date-column "Date" \
  --description-column "Memo"
```

European number formats? `--number-format eu`. Need to skip header rows? `--skip-rows 2`. Signs backwards? `--flip-signs`.

Once you get a command working for a particular bank, save it as a profile so you don't have to remember the flags:

```bash
tl import transactions.csv --save-profile "chase-checking"
```

Next time:

```bash
tl import new-transactions.csv --profile "chase-checking"
```

## Querying with SQL

This is the power-user feature. Your data is DuckDB, and `tl sql` gives you direct access:

```bash
tl sql "SELECT description, amount FROM transactions ORDER BY amount DESC LIMIT 10"
```

Pipe the output wherever you want:

```bash
tl sql "SELECT * FROM transactions WHERE date >= '2026-01-01'" --format csv > january.csv
```

Need to fix a tag or update a description? Use `--allow-writes`:

```bash
tl sql --allow-writes "UPDATE transactions SET tag = 'groceries' WHERE description LIKE '%Whole Foods%'"
```

I'll save the really interesting queries for [a dedicated post](/blog/sql-queries)—there's a lot you can do here.

## Quick tagging

Tag transactions by ID right from the terminal:

```bash
tl tag groceries,food --ids abc123,def456
```

Use `--replace` to overwrite existing tags instead of appending.

## Checking your status

A quick snapshot of your accounts and balances:

```bash
tl status
```

Add `--json` to any command if you want machine-readable output—handy if you're piping into `jq` or scripting something.

## Maintenance

A few commands you'll use occasionally:

- `tl doctor` — run health checks on your database. Use `--verbose` for the full report.
- `tl backup` — manage database backups. The app creates these automatically before plugin upgrades, but you can trigger them manually too.
- `tl compact` — shrink your database file. Good to run after large imports or deletions.
- `tl encrypt` / `tl decrypt` — add or remove encryption from your database.

## Keeping it updated

The CLI updates itself:

```bash
tl update
```

Add `--check` to just see if an update is available without installing it.

---

The CLI isn't a watered-down version of the app. It's a full interface to the same database, designed for people who prefer working in a terminal. Everything outputs clean tables by default, and `--json` is available everywhere for scripting.

If you haven't installed it yet:

```bash
curl -fsSL https://treeline.money/install.sh | sh
```

No sudo required. Installs to `~/.treeline/bin`.
