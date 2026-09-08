# Success Probability Calculator

A React app built with Vite that calculates date success probability based on mutual interest and date history.

## Formula

$$P(\text{Success}) = \frac{1}{1 + \exp\left( - \left[ \left( P(L) - \frac{\varnothing}{1 + 0.5a} \right) \cdot \mu \cdot (1.25)^a - 1 \right] \right)}$$

- **$P(L)$**: Chance they like you
- **$\varnothing$**: Chance they don't like you
- **$a$**: Number of good dates
- **$\mu$**: Rizz factor

## Quick Start

```bash
npm install
npm run dev
npm run deploy
```
