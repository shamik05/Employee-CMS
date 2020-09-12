const inquirer = require("inquirer");
const index = require("../index");
const { departmentView, departmentAdd } = require("../config/orm");

const department = {
  // Department Management Menu
  menu: async () => {
    inquirer.prompt({
      name: "menu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Departments",
        "Add Department",
        "Remove Department",
        "Go Back",
      ],
    }).then((answers) => {
      switch (answers.menu) {
      case "View Departments":
        department.view();
        break;
      case "Add Department":
        department.add();
        break;
      case "Remove Department":
        department.remove();
        break;
      default:
        index.menu();
        break;
      }
    });
  },
  // View all Departments
  view: async () => {
    await departmentView().then((result) => {
      console.table(result);
    });
    department.menu();
  },
  // Add Department
  add: async () => {
    inquirer.prompt(
      {
        name: "name",
        message: "What is the department name?",
        validate: (input) => input !== "" || "Title cannot be empty.",
      },
    )
      .then((answers) => {
        departmentAdd(answers);
        department.view();
      });
  },
};

module.exports = department;
