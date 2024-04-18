# BISDLE
## Determine the TeamfightTactics champion given their BIS (best in slot) item combination!

This project demonstrates a simple web scraper built with Node.js, using Puppeteer for scraping and Express for serving the scraped data through a RESTful API. The scraper fetches the alt texts of the first three images from specified pages and serves this data to a simple front-end interface.

## Features

- Scrapes image alt texts using Puppeteer from dynamically generated content.
- Serves scraped data through an Express.js server.
- Provides a simple frontend interface to request and display data.

## Prerequisites

Before you can run this project, you need to have Node.js and npm (Node Package Manager) installed on your machine. You can download and install them from [Node.js official website](https://nodejs.org/).

## Installation

1. Clone the repository:
   git clone https://github.com/mibernard/BISdle.git  
   cd your-project-directory
   
2. Install dependencies:
  npm install

3. Start the server:
  npm start

## Usage
After starting the server, open your web browser and visit http://localhost:3000. Enter a unit name in the input field and click "Fetch Alts" to retrieve the alt texts of images. The results will be displayed on the page.

## API
The server exposes a single API endpoint:
GET /fetch-alts/:unit
Parameter: unit - The name of the unit to fetch images from.
Response: JSON containing the success status and either the alt texts or an error message.

## Contributing
Contributions are welcome! Please feel free to submit pull requests with any enhancements, bug fixes, or improvements.

## License
This project is open source and available under the MIT License.

## Contact
For any queries or further assistance, please contact Your Email.
