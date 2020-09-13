const inquirer = require("inquirer");
const index = require("../index");
const {
  departmentFind, departmentView, departmentAdd, rowDelete,
} = require("../config/orm");

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
        department.delete();
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
      department.menu();
    });
  },
  // Add Department
  add: async () => {
    await inquirer.prompt(
      {
        name: "name",
        message: "What is the department name?",
        validate: (input) => input !== "" || "Title cannot be empty.",
      },
    )
      .then((answers) => {
        departmentAdd(["name", answers.name]);
        department.view();
      });
  },
  // Deletes Department
  delete: async () => {
    await inquirer.prompt({
      type: "list",
      name: "id",
      pageSize: 10,
      message: "Which department do you want to remove?",
      choices: await departmentFind().then((result) => {
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      if (answers.id != null) {
        rowDelete(["department", "id", answers.id]);
        department.view();
      }
    });
  },
};

module.exports = department;
