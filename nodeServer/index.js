// External dependencies
const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path');


// import express framwork
const express = require('express'); // express js
const app = express();
const port = process.env.PORT || 3600;
const cors = require('cors')
app.use(cors())
app.use(express.static(path.join(__dirname, 'public'))); // generate the static files folder 


// vars 
const url = 'https://www.fluksaqua.com/fr/forum/pompe/' //url to be scraped
const outputFile = 'data.json' // the output data file
const pathFile = './'+outputFile
const parsedResults = [] // array to hold teh questions of the first page
const pageLimit = 10 // to make it more dynamic we can extract the number of the last page 
let pageCounter = 0 
let resultCount = 0



// Async exp function
const getWebsiteContent = async (url) => {

    //console.log(`\n  Scraping of ${chalk.underline.bold(url)} initiated...\n`)

    try {
        //laad results of scraping 
        const response = await axios.get(url)
        var $ = cheerio.load(response.data)
        const page = parseInt($('a.current').find('.num').text());

        // map the results of selection
        $('.card-body div.title').map((i, el) => {

            // count the elements 
            const count = resultCount++

            // extract the title + removing spaces 
            if (page == 1) { // to extract only the result of the first page
                const title = $(el)
                    .text()
                    .replace(/\s\s+/g, '')
                // populate the array
                parsedResults.push(title)
            }
        })

        // get Pagination Elements Link
        const nextPageLink = $('a.current').next().attr('href');
        // increment the page counter 
        pageCounter++
        // set the limit page and export data into a json file
        if (pageCounter === pageLimit) {

            // create a json to hold the global data 
            const scrapedData = {
                elementPerPage: resultCount / pageLimit,
                count: resultCount,
                data: parsedResults
            }
            
            // stringify data
            var data = JSON.stringify(scrapedData);
           
            // write into a josn file
            fs.writeFileSync(outputFile, data);
            // log the end of scraping + total element scraped
            console.log('scarping done ' + parsedResults.length + ' elements');

            // log the results in the console 

            console.log("Titles for 'pompe' (" + scrapedData.elementPerPage + "/" + scrapedData.count + ") \n");
            console.log(parsedResults);

            
            // return false
            return false

        }
        // implement the reccursive function 
        getWebsiteContent(nextPageLink)
       
    } catch (error) {
        //log error
        console.error(error)
    }

}


//check if data.json file exists



// try {
//     if (!fs.existsSync(pathFile)) {
//         getWebsiteContent(url)
//     }else{
//         console.log('file exists')
//     }
// } catch (err) {
//     console.error(err)
// }

// execute the function to test/generate a new JSON file 

getWebsiteContent(url)  




// read json file
var contents = fs.readFileSync("data.json");
var api = JSON.parse(contents);


// Execute the expression funciton 
app.get('/api/titles', (req, res) => {
    res.send(api)
})


// server
app.listen(port, () => {
    console.log('\n lieteing on port!' + port + '... + waiting to scrape data ...... \n')
})
