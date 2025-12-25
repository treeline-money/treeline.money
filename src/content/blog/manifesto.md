---
title: "Personal finance should be... personal"
date: 2025-12-24T12:00:00
description: "Why your financial data should outlive any app"
---

I've had many distinct seasons in my adult life, and each one brings a fresh perspective for how I think about money. Early on, I cared deeply about sticking to a tight budget and making sure I could put some money away while paying the monthly bills. Now, I'm more interested in long-term planning and exploring different "what-if" scenarios. The highly custom spreadsheet I built when I was 22 is simply insufficient for the way I view money at 33. 

Everyone has unique life circumstances that inform their perspective on money. Consider these two hypothetical money managers:  

**Alice:** Fresh out of college with a pile of student debt. She has a new job and is receiving a regular paycheck for the first time in her life, but she's been living with her parents for the last few months, and is looking to move to her own place in the city. Alice has questions about her financial life:
- *"What are my monthly bills?"*
- *"How much can I afford to pay for rent?"*
- *"Do I have enough saved to go to the concert with my friends next month and still pay the bills?"*
- *"How can I make sure I have margin to start paying off my student loans?"*

**Bob:** Worked in tech for 20 years, owns a home, and has 2 teenagers living at home. Bob's questions:
- *"If I help my kids pay for college, how much longer do I need to save for retirement?"*
- *"How much runway do I have in my emergency fund if I lose my job tomorrow?"*
- *"Should I pay off my mortgage early or invest in the stock market?"*

These are *fundamentally*, *drastically* different ways of thinking about money.

---
  


I tinkered with my custom spreadsheet for years until I finally got it *exactly* where I wanted it. And it was glorious... for a while. Then I had kids, free time evaporated, and my perspective shifted. Manually typing every transaction into my spreadsheet was no longer worth the effort when our spending habits and expenses were well-established. I tried a few different finance apps and, while they brought convenience, they all lacked *something* — because the way I wanted to view my money didn't perfectly match The App's opinion of how I was *supposed* to view my money. 

I thought: "I wish I could just automatically get all my data on my computer, then I could build whatever I want on top!"

With most (all?) of the existing apps out there, getting your data out is simply not a priority for them. The App *needs* your data locked in their servers so you'll pay them. I've always thought this was strange: "It's MY data, right? Why can't I just... have it?" They might give you an "export" button if you're lucky, but letting you easily have your data is not in The App's best interest.

Strip these apps down and you realize what you're actually paying for: bank sync and cloud infrastructure. Everything else is just SQL queries piped into charts, wrapped in someone else's opinion about how you should see your money.

That's fine if their opinion matches yours. It never fully matched mine.

I want to tinker. I want to ask questions of my data that no product manager anticipated. I want my tools to grow with me as my needs change.

So I built Treeline.

The best way to understand Treeline is through another app: [Obsidian](https://obsidian.md/). Obsidian is a note-taking app. Obsidian's philosophy is simple: your notes should outlive any app. Your notes are just markdown files in a folder on your computer. No proprietary format, no cloud lock-in. If Obsidian disappeared tomorrow, you'd still have everything.

**Treeline is the Obsidian of personal finance.**

Your financial data lives in a single, local database file on your computer. Standard format (DuckDB), documented schema. Query it with SQL, open it in Python, plug it into whatever tools you want. If Treeline disappeared tomorrow, your data isn't going anywhere. And if you prefer the terminal, Treeline ships with a CLI—you can skip the desktop app entirely and manage everything from the command line.

The app is just a UI on top of that database-and (almost) everything is a plugin. The accounts view, the budget view, the transactions view: these come with the app by default, but they use the same plugin system available to anyone. Want a FIRE calculator that uses your actual spending data instead of made-up estimates? Want a different budgeting philosophy? Want to track something weird that only matters to you? That's what plugins are for.

Bank sync is optional. If you want automation, Treeline connects to third-party services that handle the actual bank connections—your credentials never touch Treeline. If you'd rather import CSVs or enter transactions manually, those are first-class options too.

Treeline isn't trying to be the perfect finance app for everyone. It's a foundation—something you can build on as your needs evolve. I don't know what questions you'll want to ask of your financial data five years from now. I don't know what views will matter most to you. That's kind of the point.

If this resonates with you, I'd love for you to try it.
