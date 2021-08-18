const sql = require("mssql");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
require("dotenv").config();
const jsonParser = bodyParser.json(); 

const PORT = process.env.PORT || 3000;

// Data base Configure 
const config = {
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  server: process.env.DBSERVER,
  database: process.env.DATABASE,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
};

//Get Data functions
const query = async (query) => {
  try {
    const base = await sql.connect(config);
    const result = base.query(query);
    return result;
  } catch (error) {
    return error;
  }
};


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept,Option");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  next()
})

app.get('/', async (req,res) => {
    res.status(200).json({massage:"API Server"}).end();
});

app.get('/test', async (req,res) => {
  let xquery = `SELECT DB_NAME() AS DatabaseName, DATABASEPROPERTYEX('master', 'Status') AS DBStatus`
  let rest = await query(xquery);
  console.log(rest)
  let xrest = rest.recordset[0]
  res.status(200).json(xrest).end();
});

app.post("/", jsonParser, async (req, res) => {
  let options = req.body;
  //console.log(options)
  let tquery = `SELECT * from dbo.Customers `;
  if (options.page!=1){
    top = (options.page-1)*options.itemsPerPage;
    bottom = options.page*options.itemsPerPage;
  }else{
    top = 0;
    bottom = options.itemsPerPage;
  }
  let xsort = "ASC"
  if(options.sortDesc[0]){
    xsort = "DESC"
  }
  if (!options.sortBy[0]){
    tquery = `SELECT * from dbo.Customers ORDER BY 1 ${xsort} OFFSET ${top} ROWS FETCH NEXT ${bottom} ROWS ONLY`;
  }else {
    tquery = `SELECT * from dbo.Customers ORDER BY ${options.sortBy[0]} ${xsort} OFFSET ${top} ROWS FETCH NEXT ${bottom} ROWS ONLY`;
  }
  let cquery = `SELECT COUNT(*) as count from dbo.Customers`;
  // console.log(tquery)
  let t = await query(cquery);
  let x = await query(tquery);
  let rest = {
    value:x.recordset ,
    total:t.recordset[0].count
  } 
  res.status(200).json(rest).end();

})

app.post("/table/:tablename", jsonParser, async (req, res) => {
  let options = req.body;
  let tablename = req.params.tablename 
  //console.log(options)
  let tquery = `SELECT * from dbo.${tablename}`;
  if (options.page!=1){
    top = (options.page-1)*options.itemsPerPage;
    bottom = options.page*options.itemsPerPage;
  }else{
    top = 0;
    bottom = options.itemsPerPage;
  }
  let xsort = "ASC"
  if(options.sortDesc[0]){
    xsort = "DESC"
  }
  if (!options.sortBy[0]){
    tquery = `SELECT * from dbo.${tablename} ORDER BY 1 ${xsort} OFFSET ${top} ROWS FETCH NEXT ${bottom} ROWS ONLY`;
  }else {
    tquery = `SELECT * from dbo.${tablename} ORDER BY ${options.sortBy[0]} ${xsort} OFFSET ${top} ROWS FETCH NEXT ${bottom} ROWS ONLY`;
  }
  let cquery = `SELECT COUNT(*) as count from dbo.${tablename}`;
  let t = await query(cquery);
  let x = await query(tquery);
  let rest = {
    value:x.recordset ,
    total:t.recordset[0].count
  } 
  res.status(200).json(rest).end();

})

//Start server
app.listen(PORT,() => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
