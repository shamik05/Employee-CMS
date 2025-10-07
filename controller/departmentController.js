// Import dependencies
const inquirer = require("inquirer");
const index = require("../server");
const {
  // eslint-disable-next-line max-len
  departmentFind, departmentView, departmentAdd, rowDelete, departmentViewRoles, departmentViewEmployees, rowUpdate,
} = require("../config/orm");

// All functions related to department submenu
const department = {
  // Department Management Menu
  menu: async () => {
    await inquirer.prompt({
      name: "menu",
      type: "list",
      message: "What would you like to do?",
      pageSize: 10,
      choices: [
        "View Departments",
        "View Department's roles",
        "View Department's employees",
        "Add Department",
        "Remove Department",
        "Update Department Name",
        "Go Back",
      ],
    }).then((answers) => {
      // Depending on answer, invoke appropriate function
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
      case "Update Department Name":
        department.updateName();
        break;
      default:
        // Returns to main menu
        index.menu();
        break;
      }
    });
  },

  // View all Departments
  view: async () => {
    await departmentView().then((result) => {
      // Displays results as columns
      result.length ? console.table(result) : console.log("No departments found");
      // Displays department management menu
      department.menu();
    });
  },

  // View Department's roles
  viewRoles: async () => {
    // Asks which department to view
    await inquirer.prompt({
      type: "list",
      name: "id",
      pageSize: 10,
      message: "Which department's roles do you want to view?",
      // Lists all departments to choose from
      choices: await departmentFind().then((result) => {
        // Inserts a return option to department menu at index 0
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      // If a department is chosen, call the orm function and pass inquirer answers as argument
      if (answers.id != null) {
        departmentViewRoles([answers.id]).then((result) => {
          // If a department has any roles associated with it, display the result and return to menu
          result.length ? console.table(result) : console.log("No roles found!");
          department.viewRoles();
        });
      } else {
        // A department wasn't chosen so return to department management menu
        department.menu();
      }
    });
  },

  // View Department's employees
  viewEmployees: async () => {
    // Asks which department to view
    await inquirer.prompt({
      type: "list",
      name: "id",
      pageSize: 10,
      message: "Which department's employees do you want to view?",
      // Lists all departments to choose from
      choices: await departmentFind().then((result) => {
        // Inserts a return option to department menu at index 0
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      // If a department is chosen, call the orm function and pass inquirer answers as argument
      if (answers.id != null) {
        departmentViewEmployees([answers.id]).then((result) => {
          // If a department has any employees associated with it, display the result
          result.length ? console.table(result) : console.log("No employees found!");
          department.viewEmployees();
        });
      } else {
        // A department wasn't chosen so return to department management menu
        department.menu();
      }
    });
  },

  // Add Department
  add: async () => {
    // Ask department name
    await inquirer.prompt(
      {
        name: "name",
        message: "What is the department name?",
        // Name cannot be empty
        validate: (input) => input !== "" || "Title cannot be empty.",
      },
    ).then((answers) => {
      // Add row to department table
      departmentAdd(["name", answers.name]);
      // Show updated departments
      department.view();
    });
  },

  // Deletes Department
  delete: async () => {
    // Asks which department to delete
    await inquirer.prompt({
      type: "list",
      name: "id",
      pageSize: 10,
      message: "Which department do you want to remove?",
      // Lists all departments to choose from
      choices: await departmentFind().then((result) => {
        // Inserts a return option to department menu at index 0
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      // If a department is chosen, call the orm function and pass inquirer answers as argument
      if (answers) {
        rowDelete(["department", "id", answers.id]);
        // Shows the updated departments
        department.view();
      } else {
        // A department wasn't chosen so return to department management menu
        department.menu();
      }
    });
  },

  // Updates Department's Name
  updateName: async () => {
    // Asks which department to update
    await inquirer.prompt([{
      type: "list",
      name: "id",
      pageSize: 10,
      message: "Which department do you want to update?",
      // Lists all departments to choose from
      choices: await departmentFind().then((result) => {
        // Inserts a return option to department menu at index 0
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    },
    // Asks what the department's new name is
    {
      type: "input",
      name: "value",
      // Ask for the department's new name
      message: "What is the department's new name?",
      when: (answers) => answers.id != null,
    },
    ]).then((answers) => {
      // If a department is chosen, call the orm function and pass department id as argument
      if (answers.value) {
        // Update the department row with the new name
        rowUpdate(["department", "name", answers.value, "id", answers.id]);
        // Shows the updated departments
        department.view();
      } else {
        // If a department wasn't chosen then return to department menu
        department.menu();
      }
    });
  },
};

// Exports all department functions
module.exports = department;
