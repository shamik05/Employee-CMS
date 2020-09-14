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

figlet("Employee Tracker", async (err, data) => {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
  await menu();
});

module.exports.menu = menu;
