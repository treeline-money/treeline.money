---
title: "SimpleFIN vs. Lunch Flow: Choosing a Bank Sync for Treeline"
date: 2026-02-10T12:00:00
description: "Two very different services that solve the same problem—here's how to pick"
draft: true
---

Treeline doesn't connect to your bank directly. Instead, it integrates with third-party sync services that handle the bank connection, and your credentials never touch Treeline. Right now there are two options: **SimpleFIN** and **Lunch Flow**.

They solve the same problem—getting your transactions into Treeline automatically—but they work differently and serve different audiences. Here's the breakdown.

## SimpleFIN

[SimpleFIN](https://www.simplefin.org/) is a read-only financial data protocol and service. It's intentionally simple (hence the name) and was built with privacy-conscious, small-developer use cases in mind.

**How it works:** You create a Setup Token at [beta-bridge.simplefin.org](https://beta-bridge.simplefin.org/), hand it to Treeline via `tl setup`, and Treeline exchanges it for an access token to pull your transactions. Your bank credentials live with SimpleFIN's bridge—Treeline never sees them.

- **Cost:** ~$1.50/month ($15/year)
- **Coverage:** US and Canadian banks
- **Connections:** Up to 25 institutions, 25 apps
- **Sync frequency:** Once per day per account
- **Access:** Read-only (no ability to initiate transfers)

**Best for:** US/Canada-based users who want the cheapest, simplest option. SimpleFIN has a strong following in the open-source finance community—it also works with Actual Budget, hledger, and Beancount.

## Lunch Flow

[Lunch Flow](https://www.lunchflow.app/) is a bank-to-app sync service with significantly broader coverage. It was originally built for Lunch Money (a budgeting app) but now supports multiple destinations including Treeline.

**How it works:** You connect your bank accounts through Lunch Flow's dashboard, select Treeline as a destination, and transactions sync automatically. Under the hood, it uses open banking APIs from providers like GoCardless, MX, Finicity, Pluggy, and others depending on your region.

- **Cost:** ~$3/month
- **Coverage:** US, Canada, EU, UK, Brazil, Singapore, Hong Kong, Thailand, Malaysia, Philippines, Vietnam, New Zealand (and expanding)
- **Sync frequency:** Daily
- **Access:** Read-only via open banking protocols

**Best for:** International users, or anyone whose bank isn't supported by SimpleFIN. The global coverage is Lunch Flow's main advantage.

## Side-by-side comparison

| | SimpleFIN | Lunch Flow |
|---|---|---|
| **Price** | ~$1.50/mo | ~$3/mo |
| **US/Canada** | Yes | Yes |
| **Europe** | No | Yes |
| **UK** | No | Yes |
| **Latin America** | No | Brazil |
| **Asia-Pacific** | No | SG, HK, TH, MY, PH, VN |
| **Oceania** | No | New Zealand |
| **Protocol** | SimpleFIN protocol | Open banking APIs |
| **Setup** | Token-based (CLI or app) | Web dashboard |

## So which should you pick?

**If you're in the US or Canada and want to spend less:** SimpleFIN. It's half the price, the protocol is dead simple, and it covers most US/Canadian banks well.

**If you're outside the US/Canada:** Lunch Flow. It's your only option with Treeline, and the coverage is genuinely good—especially in Europe and the UK via GoCardless.

**If SimpleFIN doesn't support your bank:** Try Lunch Flow. Different underlying providers means different bank coverage, even within the same country.

**If you want both:** You can actually run both simultaneously. Treeline deduplicates transactions, so if you have accounts at banks where one service works better than the other, you can use each where it's strongest.

## Or skip bank sync entirely

Both services are optional. Treeline works perfectly fine with manual CSV imports—the CLI's `tl import` command handles the messy reality of different bank export formats with flags for every edge case. Manual entry through the desktop app is also a first-class option.

The point of Treeline's architecture is that your data workflow is your choice. Bank sync is convenient, but it's not a requirement.

---

Set up either service by running:

```bash
tl setup
```

Or configure them through the desktop app's settings.
