---
title: "Plaid CLI + Treeline CLI"
date: 2026-04-28T12:00:00
description: "Pipe Plaid CLI output into Treeline"
draft: false
---

Plaid [announced their CLI](https://medium.com/plaid-engineering/plaid-cli-from-idea-to-building-with-your-financial-data-in-minutes-7d5b0c4db11b) this week. With a bit of `jq`, you can pipe its output straight into Treeline. Here's the setup.

## Prerequisites

Two CLIs:

```bash
brew install plaid/plaid-cli/plaid
curl -fsSL https://treeline.money/install.sh | sh
```

Plaid CLI is macOS/Linux for now; Treeline's installer also has a [PowerShell version](https://treeline.money/download) for Windows. You'll also want `jq` if you don't already have it (`brew install jq`).

Confirm:

```bash
plaid --version
tl --version
```

## Get a Plaid sandbox link

```bash
plaid register     # creates a Plaid Dashboard account
plaid trial        # opt into the free Trial Plan
plaid login        # authenticates the CLI
plaid link         # opens Link in the browser; pick "Sandbox" + any institution
```

After `plaid link`, the CLI has an access token stored locally. Sanity check:

```bash
$ plaid item list
ITEM ID                                ALIAS  INSTITUTION  ACCESS TOKEN
yXkZQgb9edSp7kA65rEGf3yxzwX1wZiro65zr  -      ins_56       *********...e84f
```

The item ID is unfriendly. Alias it:

```bash
plaid item rename yXkZQgb9edSp7kA65rEGf3yxzwX1wZiro65zr sandbox
```

Now `--item sandbox` works everywhere.

## Look at what Plaid sees

```bash
plaid balance --item sandbox
plaid transactions list --item sandbox --json | jq '.transactions[0]'
```

The second command shows a single transaction's exact shape:

```json
{
  "transaction_id": "zGlEZ85BQJFX7r5DAlb8TPoA1adgbZflgWGz8",
  "account_id": "8dJ817R4k6HlL35VEPJvskl8r5r14vFWzgG1l",
  "amount": 6.33,
  "date": "2026-04-27",
  "name": "Uber 072515 SF**POOL**",
  "merchant_name": "Uber",
  "pending": false,
  "iso_currency_code": "USD",
  "payment_channel": "online"
}
```

Two things to know before we pipe this into Treeline:

1. **Sign convention is inverted.** Plaid uses positive amounts for money *out* — the Uber ride above is `+6.33`. Treeline uses negative for expenses, so we'll flip on import.
2. **One JSON, many accounts.** A single `transactions list` returns transactions for every account on the item. Treeline imports one account at a time, so we'll filter by `account_id`.

## From Plaid JSON to Treeline

Grab the `account_id` you care about from `plaid item get sandbox --json` and stash it in a variable:

```bash
CHECKING_ID="8dJ817R4k6HlL35VEPJvskl8r5r14vFWzgG1l"

plaid transactions list --item sandbox --json \
| jq -r --arg id "$CHECKING_ID" '
    ["date","amount","description"],
    (.transactions[] | select(.account_id == $id)
      | [.date, .amount, (.merchant_name // .name)])
    | @csv' \
| tl import - \
    --account "Plaid Checking" --create-if-not-exists --account-type depository \
    --date-column date --amount-column amount --description-column description \
    --flip-signs \
    --dry-run
```

What's happening:

- `plaid transactions list ... --json` dumps the payload to stdout (diagnostics go to stderr, so the pipe stays clean).
- `jq` writes a CSV header, filters to one account, projects three columns. `merchant_name // name` falls back when Plaid doesn't have a clean merchant string.
- `tl import -` reads the CSV from stdin, creates the account if needed, and `--flip-signs` reconciles the sign convention.

Always start with `--dry-run`. Treeline prints the parsed table before importing — eyeball it, then drop the flag and run for real.

For more than one account, wrap it:

```bash
plaid_to_tl () {
  local acct_id="$1" tl_name="$2" tl_type="${3:-depository}"
  plaid transactions list --item sandbox --json \
  | jq -r --arg id "$acct_id" '
      ["date","amount","description"],
      (.transactions[] | select(.account_id == $id)
        | [.date, .amount, (.merchant_name // .name)])
      | @csv' \
  | tl import - --account "$tl_name" --create-if-not-exists --account-type "$tl_type" \
      --date-column date --amount-column amount --description-column description \
      --flip-signs
}

CHECKING_ID="8dJ817R4k6HlL35VEPJvskl8r5r14vFWzgG1l"
CC_ID="AZwvGg95R1Ha5RMwbPryTl4XBbBjvyf9yadjp"

plaid_to_tl "$CHECKING_ID" "Plaid Checking"    depository
plaid_to_tl "$CC_ID"       "Plaid Credit Card" credit
```

From here it's just automation — drop the function into a script, wire it up to cron (or `launchd`, or whatever scheduler you prefer), and your data stays current. `tl import` dedupes on repeat runs, so daily overlap is harmless.

## Query it

Now the data's yours, and it's just SQL from here:

```bash
$ tl query "SELECT description,
                   ROUND(-SUM(amount), 2) AS spent
            FROM transactions
            WHERE amount < 0
              AND account_name IN ('Plaid Checking', 'Plaid Credit Card')
            GROUP BY description
            ORDER BY spent DESC
            LIMIT 5"

+---------------------------+--------+
| description               | spent  |
+====================================+
| AUTOMATIC PAYMENT - THANK | 2078.5 |
| KFC                       |  500.0 |
| United Airlines           |  500.0 |
| Tectra Inc                |  500.0 |
| Madison Bicycle Shop      |  500.0 |
+---------------------------+--------+
```

Or open the Treeline desktop app and the same transactions show up there too.
