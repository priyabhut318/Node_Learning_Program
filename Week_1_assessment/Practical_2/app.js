const math = require("./mathOperations");

try {
  console.log("Addition: ", math.add(5, 3));
  console.log("Subtraction: ", math.subtract(10, 7));
  console.log("Multiplication: ", math.multiply(4, 6));
  console.log("Division: ", math.divide(12, 4));
} catch (error) {
  console.error("Error:", error.message);
}
