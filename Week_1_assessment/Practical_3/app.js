const fs = require("fs");
const path = "./input.txt";

const updateFile = () => {
  // Read the file content in binary format
  fs.readFile(path, (err, data) => {
    if (err) {
      return console.error("Error:", err);
    }
    console.log("Read Data:", data.toString());

    // Append the text "Hello, Node!" to the file
    fs.appendFile(path, "\nHello, Node!", (err) => {
      if (err) {
        return console.error("Error:", err);
      }

      // Read the updated file content in binary format
      fs.readFile(path, (err, updatedData) => {
        if (err) {
          return console.error("Error:", err);
        }
        console.log("Updated Data:", updatedData.toString());
      });
    });
  });
};

// Call the function to update the file
updateFile();
