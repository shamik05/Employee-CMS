const inquirer = require("inquirer");
const index = require("../index");
const {
  // eslint-disable-next-line max-len
  departmentFind, departmentView, departmentAdd, rowDelete, departmentViewRoles, departmentViewEmployees,
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
        "View Department's roles",
        "View Department's employees",
        "Add Department",
        "Remove Department",
        "Go Back",
      ],
    }).then((answers) => {
      switch (answers.menu) {
      case "View Departments":
        department.view();
        break;
      case "View Department's roles":
        department.viewRoles();
        break;
      case "View Department's employees":
        department.viewEmployees();
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
  // View Department's roles
  viewRoles: async () => {
    await inquirer.prompt({
      type: "list",
      name: "id",
      pageSize: 10,
      message: "Which department's roles do you want to view?",
      choices: await departmentFind().then((result) => {
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      if (answers.id != null) {
        departmentViewRoles([answers.id]).then((result) => {
          if (result.length) {
            console.table(result);
          } else {
            console.log("No roles found!");
          }
          department.viewRoles();
        });
      } else {
        department.menu();
      }
    });
  },
  // View Department's employees
  viewEmployees: async () => {
    await inquirer.prompt({
      type: "list",
      name: "id",
      pageSize: 10,
      message: "Which department's roles do you want to view?",
      choices: await departmentFind().then((result) => {
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      if (answers.id != null) {
        departmentViewEmployees([answers.id]).then((result) => {
          if (result.length) {
            console.table(result);
          } else {
            console.log("No employees found!");
          }
          department.viewEmployees();
        });
      } else {
        department.menu();
      }
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
    ).then((answers) => {
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
      if (answers) {
        rowDelete(["department", "id", answers.id]);
        department.view();
      } else {
        department.menu();
      }
    });
  },
};

module.exports = department;
