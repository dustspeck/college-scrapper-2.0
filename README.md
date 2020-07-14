# college-scrapper-2.0

College Data Scrapper Script to scrap reasonable amount of data from https://collegescorecard.ed.gov/ about each and every detail that is displayed on the website.

## Input: 
[usa_univs.txt]  A list of college names written in a plain text file.

## Output:
[final_data.csv]  A detailed CSV file that contains the defined fields to be fetched from the website.


## Procedure:
[scraper.js]  Every name entered in the input file is first searched on the website and the unique id of a matching college is picked and stored in the 'search-ids.txt'. Then the details of every id is picked and stored in 'final-data.csv'.

## Sample Data
Check the 'usa_univs.txt' & 'final-data.csv' for sample inout & output.
