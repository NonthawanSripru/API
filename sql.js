const sql = require("mssql");
require("dotenv").config();

// Database Configure
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

  
async function main() {
    // let xablename = "Sale_n_Product";
    let tquery = "SELECT * from dbo.Customers ORDER BY 1 OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY"
    let x = await query(tquery);
    console.log(x)
  }
  
  main()
    .then(() => console.log("Done"))
    .catch((ex) => console.log(ex.message));