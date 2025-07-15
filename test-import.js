const axios = require('axios');

// Test data from CSV
const testCompetitors = [
  {
    firstname: "Jean",
    lastname: "Dupont",
    birthday: "2010-05-15",
    club: "Club Kempo",
    country: "France",
    weight: 35,
    rank: "Ceinture Jaune",
    gender: "H"
  },
  {
    firstname: "Marie",
    lastname: "Martin",
    birthday: "2009-08-20",
    club: "Club Kempo",
    country: "France",
    weight: 32,
    rank: "Ceinture Orange",
    gender: "F"
  }
];

async function testImport() {
  try {
    console.log("Testing import with test data...");
    
    const response = await axios.post("http://localhost:3000/competitors/bulk", testCompetitors);
    console.log("✅ Import successful!");
    console.log("Response:", response.data);
    
  } catch (error) {
    console.error("❌ Import failed!");
    
    if (error.response) {
      console.log("Server response:", error.response.status, error.response.data);
    } else if (error.request) {
      console.log("Network error - no response received");
    } else {
      console.log("Error:", error.message);
    }
  }
}

testImport();
