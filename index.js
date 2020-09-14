// Import dependencies
const inquirer = require("inquirer");
// eslint-disable-next-line no-unused-vars
const cTable = require("console.table");
const figlet = require("figlet");
const role = require("./controller/roleController.js");
const employee = require("./controller/employeeController.js");
const db = require("./config/connection");
const department = require("./controller/departmentController.js");

// Main menu
const menu = async () => {
  // Inquirer prompt presenting three options
  inquirer.prompt({
    name: "menu",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "Employee Management",
      "Role Management",
      "Department Management",
      "Exit",
    ],
  }).then((answer) => {
    // Depending on answer, direct user to appropriate controller
    switch (answer.menu) {
    case "Employee Management":
      employee.menu();
      break;
    case "Role Management":
      role.menu();
      break;
    case "Department Management":
      department.menu();
      break;
    default:
      console.log("Goodbye");
      db.close();
      break;
    }
  });
};

// Banner shown on program start that is automatically ran
figlet("Employee Tracker", async (err, data) => {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  // Show the banner on the console
  console.log(data);
  // Run the main menu
  await menu();
});

// Exports the main menu function
module.exports.menu = menu;
