const sql = require("mssql");
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 8080;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept,Option");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  next()
})

app.get('/', async (req,res) => {
    let tquery = "SELECT * from dbo.Course";
    let x = await query(tquery);
/*	for (var i = 0; i < x.recordsets[0].length; i++) 
	{
        console.log(x.recordsets[0][i].Name +" "+x.recordsets[0][i].Location+" "+x.recordsets[0][i].Email);
	}*/
    let y ={
      value:x.recordset
    }
    console.log(y)
    res.status(200).json(y).end();
});

app.get('/page/:page/limited/:limited', async (req,res) => {
  let params = req.params
  let top = 0;
  if (params.page!=1){
    top = (params.page-1)*params.limited;
    bottom = params.page*params.limited;
  }else{
    top = 0;
    bottom = params.limited;
  }
  //  `SELECT * from ${table name} ORDER BY ${sortBy} OFFSET ${top} ROWS FETCH NEXT ${params.limited} ROWS ONLY`

  let tquery = `SELECT * from dbo.Course ORDER BY CourseId OFFSET ${top} ROWS FETCH NEXT ${params.limited} ROWS ONLY`;
  let cquery = `SELECT COUNT(*) as count from dbo.Course`;
  console.log(tquery)
  let x = await query(tquery);
  let t = await query(cquery);
  let y ={
    value:x.recordset,
    total:t.recordset[0].count,
  }
  res.status(200).json(y).end();
});


app.get('/page/:page/limited/:limited/table/:table', async (req,res) => {
  let params = req.params
  let top = 0;
  if (params.page!=1){
    top = (params.page-1)*params.limited;
    bottom = params.page*params.limited;
  }else{
    top = 0;
    bottom = params.limited;
  }
  //  `SELECT * from ${table name} ORDER BY ${sortBy} OFFSET ${top} ROWS FETCH NEXT ${params.limited} ROWS ONLY`

  let tquery = `SELECT * from dbo.Customers ORDER BY ${table} OFFSET ${top} ROWS FETCH NEXT ${params.limited} ROWS ONLY`;
  let cquery = `SELECT COUNT(*) as count from ${table}`;
  console.log(tquery)
  let x = await query(tquery);
  let t = await query(cquery);
  let y ={
    value:x.recordset,
    total:t.recordset[0].count,
  }
  res.status(200).json(y).end();
});


app.get('/page/:page/limited/:limited/sort/:sort', async (req,res) => {
  let params = req.params
  let top = 0;
  if (params.page!=1){
    top = (params.page-1)*params.limited;
    bottom = params.page*params.limited;
  }else{
    top = 0;
    bottom = params.limited;
  }
  
  // if(!params.sort.length){
  //   sortBy=params.sort;
  // }
    
  let tquery = `SELECT * from dbo.Customers ORDER BY ${params.sort} OFFSET ${top} ROWS FETCH NEXT ${params.limited} ROWS ONLY`;
  let cquery = `SELECT COUNT(*) as count from dbo.Customers`;

  let x = await query(tquery);
  let t = await query(cquery);
  let y ={
    value:x.recordset,
    total:t.recordset[0].count,
  }
  //console.log(y)
  res.status(200).json(y).end();
});

//Start server
app.listen(PORT,() => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});

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