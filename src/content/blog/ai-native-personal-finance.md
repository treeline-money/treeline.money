---
title: "What AI-Native Personal Finance Looks Like"
date: 2026-04-24T12:00:00
description: "When AI agents can actually do the work"
---

This morning, I wanted to take a peek at my Treeline data. From my laptop, I asked Claude to do a few things for me:
- I asked it to suggest tags for new transactions based on my history, and update my auto-tag rules accordingly.
- I realized I had duplicate account data, so I asked it to migrate my old balance history to my new accounts so the correct accounts had the history.
- Then I asked it to build me a chart projecting out my net worth in 5 years for different life scenarios, based on my actual spending and savings patterns.

All this from Claude.

Then I opened the Treeline desktop app. Some things are just easier to scan visually than to ask Claude to rebuild every time (the budget view, net worth view, etc.). I made a few small updates, then went about my day.

**This is what AI-native personal finance looks like.** AI can access your data, and actually do the work for you. Not just some weird AI chat interface bolted on awkwardly, but integrating with AI agents you already use. No data gatekeeping. 

What makes this all possible? A couple core things:
- **Your data is queryable, not curated.** AI agents are *really good* at exploring data and deriving insights from it, especially when it's structured. Treeline gives them full database access, not a curated set of "one-size-fits-all" charts.
- **Automation is a first-class citizen.** Treeline was built from the ground up with the CLI and MCP (Model Context Protocol) as first-class surfaces. That means your agent can do anything you can do in the app: tag transactions, update rules, migrate data, adjust budgets. Not just read your data, but actually work with it.
- **Your workflows accumulate.** Save the way you analyze or do something as a "skill", and your agent knows how to do it next time. Your finances get smarter about your specific life the longer you use it.

Traditional personal finance apps simply can't do this in the same way, because, fundamentally, they're built to gatekeep *your data*. That's how they survive as businesses, they make it convenient to interact with your data in basic ways, but the second you want to do something they didn't curate for you? You're out of luck. Now you either have to go sign up for yet another app to get that specific feature OR you have to manually export your data into a spreadsheet, and run your own analysis. 

*Wait, but if \<insert favorite app here\> just adds an MCP, isn't that enough?*

Not exactly. Go back to my example above. The first item, sure, easily solvable with an MCP. The second bullet, maybe. The last bullet, definitely not. Think of it this way: if you're making dinner for your family, you want all your ingredients in the kitchen, right? This is what Treeline is: your data is all together in a structured format, on your computer. Let's say you're cooking a meal, and at each step in the recipe, you have to go to the grocery store. This is what bolting on an MCP to traditional apps is like. Sure, it gives you exactly what you ask for when you ask for it. But the only way to get to your final outcome is by putting all the ingredients in one place. Only then can you actually cook. 

**Data has to live where the work is done.** That's what AI-native actually means. I've become more and more convinced local-first apps are going to be the workhorse of the AI-era, and Treeline is just the beginning.
