# BISDLE - [bisdle.vercel.app](https://bisdle.vercel.app)
## Determine the Teamfight Tactics champion given their BIS (best in slot) item combination!

BISdle is a Wordle-like web application that challenges players to guess the best-in-slot (BIS) item combinations for champions in Teamfight Tactics (TFT). The app uses data from Riot Games' TFT API to determine the most frequently used item combinations from real Challenger games and presents them as daily and unlimited puzzles.

## Features

- **Two Game Modes**: Daily (one puzzle per day, resets at midnight) and Unlimited (generate new puzzles freely)
- **Interactive Guessing**: Type a champion name or pick from the autocomplete dropdown
- **Hint System**: Request a class/trait hint or a gold cost hint if you're stuck
- **Feedback**: Immediate per-guess feedback with champion portraits
- **Stats Tracking**: Win streaks, guess distribution, and hints used — persisted in localStorage

## Tech Stack

- **Frontend**: Next.js 12 (React 18)
- **Styling**: Plain CSS via `styles/globals.css`
- **API**: Riot Games TFT API for match/item data; Riot Data Dragon for images
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/mibernard/BISdle.git
   cd BISdle
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file and add your Riot API key:
   ```
   RIOT_API_KEY=your_riot_api_key_here
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to play.

## Maintenance

Champion data (traits, classes, origins) updates automatically via a weekly GitHub Actions workflow — no manual intervention needed when a new TFT set releases. See [MAINTENANCE.md](./MAINTENANCE.md) for details.

## Contact

For questions or feedback: matthewbernard4@gmail.com
