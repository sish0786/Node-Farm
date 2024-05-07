const fs = require('fs');
const http = require('http');
const url = require('url');


// //Blocking Synchronous Way
// const textIn = fs.readFileSync("./txt/input.txt",'utf-8');
// console.log(textIn);

// const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log("File written");

// //Non Blocking Async Way
// fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
//     fs.readFile(`./txt/${data}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
//         fs.writeFile('./txt/final.txt',`${data}\n${data2}`,(err)=>{
//             console.log("Written");
//         })
//     })
// })
// console.log("Reading.....");


//SERVER
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);

const replaceTemplate = (temp,product)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%QUNATITY%}/g,product.quantity);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%ID%}/g,product.id);
    if(!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');

    }
    return output;
}

const server = http.createServer((req,resp)=>{
    const {query, pathname} = url.parse(req.url,true);
    // OVERVIEW PAGE
    if(pathname === '/' || pathname === '/overview'){
        resp.writeHead(200,{'Content-type': 'text/html',})
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/,cardsHtml);
        resp.end(output);
    }
    //PRODUCT PAGE
    else if(pathname === '/product'){
        resp.writeHead(200,{'Content-type': 'text/html',})
        const product = dataObj[query.id];
        const output  = replaceTemplate(tempProduct,product);
        resp.end(output);
    }
    //API
    else if(pathname === '/api'){
            resp.writeHead(200,{'Content-type': 'application/json',})
            resp.end(data);
    }
    // NOT FOUND
    else{
        resp.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        resp.end("<h1>page Not Found</h1>");
    }
});

server.listen(5000, 'localhost',()=>{
    console.log('listening to port 5000');
});

