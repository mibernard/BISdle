# BISDLE - [bisdle.vercel.app](https://bisdle.vercel.app)
## Determine the TeamfightTactics champion given their BIS (best in slot) item combination!

BISdle is a wordle-like web application that challenges players to guess the best-in-slot (BIS) item combinations for champions in the game Teamfight Tactics (TFT). The application uses data from Riot Games' TFT API to determine the most frequent item combinations based on actual game data and presents these as puzzles for users to solve.

## Features

- **Two Game Modes**: Daily and Unlimited, where Daily mode provides a single puzzle per day and Unlimited allows users to generate new puzzles at will.
- **Interactive Guessing**: Users can type in their guesses or select from an autocomplete dropdown of TFT champions.
- **Feedback System**: Immediate feedback on guesses, displaying the correct or incorrect item setups.
- **Responsive Design**: Fully functional on both desktop and mobile devices.

## Tech Stack

- **Frontend**: Next.js (React framework) for server-side rendering and a seamless user experience.
- **Backend**: Node.js for handling API requests, including fetching data from the Riot Games API.
- **API**: Riot Games' Teamfight Tactics API to fetch real-time data on champions and item combinations.
- **Styling**: TailwindCSS for scoped and maintainable styles across the application.
- **Deployment**: Vercel for hosting and automatic deployments from Git repositories.

## Prerequisites

Before you can run this project, you need to have Node.js and npm (Node Package Manager) installed on your machine. You can download and install them from [Node.js official website](https://nodejs.org/).

## Installation

1. Clone the repository:  
   git clone https://github.com/mibernard/BISdle.git  
   cd your-project-directory
   
2. Install dependencies:
   npm install

3. Set up environment variables:
   Create a .env.local file in the root of your project.
   Add the Riot Games API key:
   RIOT_API_KEY=your_riot_games_api_key

4. Start the server:
   npm run dev

## Usage
After starting the server, open your web browser and visit http://localhost:3000. Choose between Daily or Unlimited modes to start guessing champions based on the items provided.

## Contributing
Contributions are welcome! Please feel free to submit pull requests with any enhancements, bug fixes, or improvements.

## Contact
For any queries or further assistance, please contact matthewbernard4@gmail.com.
