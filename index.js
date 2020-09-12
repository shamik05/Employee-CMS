const inquirer = require("inquirer");
// eslint-disable-next-line no-unused-vars
const cTable = require("console.table");
const role = require("./controller/roleController.js");
const employee = require("./controller/employeeController.js");
const db = require("./config/connection");

// Main menu
const menu = () => {
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
      break;
    default:
      console.log("Exiting");
      db.close();
      break;
    }
  });
};

menu();

module.exports.menu = menu;
