---
title: "The Obsidian of Personal Finance"
date: 2026-02-10T12:00:00
description: "What note-taking philosophy can teach us about managing money"
draft: true
---

If you've used [Obsidian](https://obsidian.md/), you know the pitch: your notes are just markdown files in a folder. No proprietary format, no cloud lock-in. If Obsidian disappeared tomorrow, you'd still have everything—because the files were always yours.

I built Treeline with the same philosophy, applied to financial data.

## The parallel

Obsidian and Treeline share a set of principles that I think are worth spelling out, because they're not common in their respective spaces:

**Your data is a standard, open format.** Obsidian uses markdown files. Treeline uses a DuckDB database. Both are documented, portable formats that dozens of tools can read. Neither app traps your data in a proprietary format you can't access without their software.

**The app is a view layer on top of your data.** Obsidian is fundamentally a markdown editor with a plugin system. Treeline is fundamentally a database viewer with a plugin system. The data exists independently of the app.

**Plugins extend everything.** Obsidian's plugin ecosystem is legendary—there are plugins for kanban boards, graph views, spaced repetition, and hundreds of other things. Treeline's plugin system is younger but follows the same pattern: the official budget view, savings goals, cash flow planner, and emergency fund tracker are all plugins using the same SDK available to anyone.

**Local-first by default.** Your Obsidian vault lives on your filesystem. Your Treeline database lives on your filesystem. Neither requires an account, a subscription, or an internet connection to function.

**Optional sync, not required sync.** Obsidian offers paid sync but works fine without it. Treeline offers bank sync through third-party services but works fine with CSV imports or manual entry.

## Why this matters for finance

The note-taking world went through this reckoning years ago. People realized that locking their thoughts into Evernote or Notion meant their data was essentially held hostage by a subscription. Obsidian proved there was a better way—and it wasn't even that hard. Just store the data in a format the user actually owns.

Personal finance apps haven't had that reckoning yet. Your bank transactions, budgets, and financial history are locked inside apps that:

- Require a monthly subscription to access *your own data*
- Store everything on their servers, not yours
- Make export an afterthought (if it exists at all)
- Disappear regularly—taking your history with them

I've lost data to finance apps shutting down. If you've been managing money digitally for more than a few years, you probably have too.

## What "owning your data" actually means

It's not just about having a file on disk. It means:

**You can query it.** Treeline's database is DuckDB. You can open it in Python, query it from the terminal, connect it to a Jupyter notebook, or use any tool that supports DuckDB. Try doing that with your Mint data.

**You can back it up however you want.** It's a file. Put it in Dropbox, commit it to a private git repo, copy it to a USB drive. Your backup strategy is yours.

**You can encrypt it.** `tl encrypt` adds encryption to your database. `tl decrypt` removes it. Your call.

**You can build on top of it.** The plugin SDK gives you full access to the database. If you can write TypeScript and Svelte, you can build any view of your financial data you want—and share it with others.

**You can leave.** If something better comes along, or if Treeline stops being maintained, your data is in a standard format. Export isn't a feature—it's the default state.

## The missing piece

Obsidian's success proved that local-first, open-format, plugin-extensible software can thrive—even in a market dominated by cloud-first incumbents. The model works because it aligns the incentives: the app earns your loyalty by being useful, not by holding your data captive.

Personal finance needs that same model. Your financial data is some of the most personal, important data you have. It should outlive any app.

That's what Treeline is building toward.
