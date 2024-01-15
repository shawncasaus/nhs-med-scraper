# Project Title

Scrape NHS Meds

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Limitations Thoughts and Known Issues](#limitations)
- [License](#license)

## Installation

#### Dependencies

- Node.js (newest version recomended)
- npm

#### Run:

```
npm install
```

## Usage

- To Generate a Json File:

```
npm start
```

- To fix linting issues:

```
npm lint:fix
```

- To format code:

```
npm format
```

## Limitations Thoughts and Known Issues

- Is designed to scrape specifically the URL: https://www.nhs.uk/medicines/
- Most medications have a format of data inside sublinks, this code only handles these medications
- For Medications of a single page information format the data is currently being displayed as: "error": "No details found" (this needs to be handled)
- Need to build the Using with other medicines and the Common questions scraper logic
- The data is being formatted into an array data structure, this is intentional, as future logic can be implimented to incorporate this data into what ever use case it may be used for (ie: API, database storage, LLM, etc...)
- Better Typing needs to be added, lots of Any's and forced typing, so a types file to build out the expected data structure needs to be implimented
- Some code redundancy, this is a first pass at grabbing data from the page so it was written with very specific intent for each situation, so consolidating some code into functions with muliple uses should be explored where the same code can be reused. This could also limit the lengthy switch statement at the end
- As always, test cases are always a good idea for longterm maintainable code

## License

Written by Shawn Renee Casaus
