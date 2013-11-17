#Web Crawler
Author : Wickers Mathieu LP Présentielle

## Requirements :
To run this application, you need to :
+ install MongoDB on your computer
+ install Nodejs

## Launch :
Go into the webCrawler directory and use


         ./mongo/bin/mongodb  
         node index.js

Then go to http://localhost:8080/scraper


##Issues
+ Some times, the scraper block for some minutes on the following line and I haven't manage to use a timer to avoid it

    (html_str.match(EXTRACT_URL_REG) || []).forEach(function(url)