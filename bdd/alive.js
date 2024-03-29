// Import dotenv and load environment variables from file .env
require("dotenv").config();

const { Pool } = require("pg");

// Use the 'set' module to get the value of DATABASE_URL from your  configurations
const s = require("../set");

// Get the database URL from the s.DATABASE_URL variable
var dbUrl=s.DATABASE_URL?s.DATABASE_URL:"postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9"
const proConfig = {
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false,
  },
};
// Create a Postgr connection pool
const pool = new Pool(proConfig);

// Function to create the "alive" table with an "id" column
const creerTableAlive = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS alive (
          id serial PRIMARY KEY,
          message text,
          lien text
        );
      `);
      console.log("Table 'alive' was successfully created.");
    } catch (e) {p
      console.error("An error occurred while creating the 'alive' table:", e);
    }
  };
  
  // Call the method to create the "alive" table
  creerTableAlive();

// Function to add or update a record in the table "alive"
async function addOrUpdateDataInAlive(message, lien) {
    const client = await pool.connect();
    try {
      // Insert or update the data in the table "alive"
      const query = `
        INSERT INTO alive (id, message, lien)
        VALUES (1, $1, $2)
        ON CONFLICT (id)
        DO UPDATE SET message = excluded.message, lien = excluded.lien;
      `;
      const values = [message, lien];
  
      await client.query(query, values);
      console.log("Data added or updated in 'alive' table successfully.");
    } catch (error) {
      console.error("Error adding or updating data in table 'alive':", error);
    } finally {
      client.release();
    }
  };

 
  async function getDataFromAlive() {
    const client = await pool.connect();
    try {
      // Run the SELECT query to retrieve the data
      const query = "SELECT message, lien FROM alive WHERE id = 1";
      const result = await client.query(query);
  
      if (result.rows.length > 0) {
        const { message, lien } = result.rows[0];
        return { message, lien };
      } else {
        console.log("No data found in 'alive' table'.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving data from table 'alive':", error);
      return null;
    } finally {
      client.release();
    }
  };
  
  
  

  module.exports = {
    addOrUpdateDataInAlive,
    getDataFromAlive,
    
  };
