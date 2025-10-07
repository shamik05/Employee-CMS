// Import dependencies
const inquirer = require("inquirer");
const {
  rolesView, rolesAdd, departmentFind, rolesFind, rowDelete, rowUpdate,
} = require("../config/orm");
const index = require("../server");

// All functions related to role submenu
const role = {
  // Role Management Menu
  menu: async () => {
    await inquirer.prompt({
      name: "menu",
      type: "list",
      message: "What would you like to do?",
      pageSize: 10,
      choices: [
        "View Roles by ID",
        "View Roles by Title",
        "View Roles by Salary",
        "View Roles by Department",
        "Add Role",
        "Remove Role",
        "Update Role",
        "Go Back",
      ],
    }).then((answers) => {
      // Depending on answer, invoke appropriate function
      switch (answers.menu) {
      case "View Roles by ID":
        role.view("role.id");
        break;
      case "View Roles by Title":
        role.view("title");
        break;
      case "View Roles by Salary":
        role.view("salary");
        break;
      case "View Roles by Department":
        role.view("department");
        break;
      case "Add Role":
        role.add();
        break;
      case "Remove Role":
        role.delete();
        break;
      case "Update Role":
        role.update();
        break;
      default:
        // Returns to main menu
        index.menu();
        break;
      }
    });
  },

  // View all roles
  view: async (type) => {
    await rolesView(type).then((result) => {
      // Displays results as columns
      result.length ? console.table(result) : console.log("No roles found!");
    });
    // Displays role management menu
    role.menu();
  },

  // Adds role
  add: async () => {
    await inquirer.prompt([
      // Ask for the role's title
      {
        name: "title",
        message: "What is the role title?",
        // Title cannot be empty
        validate: (input) => input !== "" || "Title cannot be empty.",
      },
      // Asks for the role's salary
      {
        name: "salary",
        message: "What is the role salary?",
        validate: (input) => {
          // Id has to be a number
          if (isNaN(input)) {
            return "Id has to be a number.";
          }
          // Id cannot be negative
          if (input < 0) {
            return "Id has to be a positive number.";
          }
          // Id cannot be empty
          if (input === "") {
            return "Id cannot be empty.";
          }
          return true;
        },
      },
      // Lists all departments to choose from
      {
        type: "list",
        name: "department_id",
        message: "Which department does the role belong to?",
        choices: await departmentFind().then((result) => {
          // Inserts a return option to role menu at index 0
          result.unshift({ value: null, name: "None" });
          return result;
        }),
      },
    ]).then((answers) => {
      // Add row to role table
      rolesAdd(answers);
      // Shows updated roles
      role.view("role.id");
    });
  },

  // Deletes role
  delete: async () => {
    // Asks which role to delete
    await inquirer.prompt({
      type: "list",
      name: "id",
      message: "Which role do you want to remove?",
      // Lists all roles to choose from
      choices: await rolesFind().then((result) => {
        // Inserts a return option to role menu at index 0
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      // If a role isn't chosen, return to role management menu
      if (answers.id === null) {
        role.menu();
      } else {
        // If a role is chosen, call the orm function and pass role.id as argument
        rowDelete(["role", "id", answers.id]);
        // Shows the updated roles
        role.view("role.id");
      }
    });
  },

  // Update Role's Title, Salary or Department
  update: async () => {
    // Asks which role to update
    const roleUpdate = await inquirer.prompt(
      {
        type: "list",
        name: "id",
        message: "Which role do you want to update?",
        pageSize: 15,
        // Lists all roles to choose from
        choices: await rolesFind().then((result) => {
          // Inserts a return option to role menu at index 0
          result.unshift({ value: null, name: "Go Back" });
          return result;
        }),
      },
    );
    // If a role wasn't chosen then return to role management menu
    if (roleUpdate.id === null) {
      role.menu();
    } else {
      // If a role is chosen, ask what to update
      const column = await inquirer.prompt({
        type: "list",
        name: "name",
        message: "Which do you want to update?",
        choices: [{ value: "title", name: "Update Title" }, { value: "salary", name: "Update Salary" }, { value: "department", name: "Update Department" }, { value: null, name: "Go Back" }],
      });
      // If a column isn't chosen then return to role update menu
      if (column.name === null) {
        role.update();

        // If the department column is chosen
      } else if (column.name === "department") {
        // Asks which department to update to
        await inquirer.prompt(
          {
            type: "list",
            name: "department",
            message: "What is the role's new department?",
            pageSize: 15,
            // Lists all departments
            choices: await departmentFind().then((result) => {
              // Inserts a return option to role menu at index 0
              result.unshift({ value: null, name: "None" });
              return result;
            }),
          },
        ).then((answers) => {
          // Update the role row with the new department id
          rowUpdate(["role", "department_id", answers.department, "id", roleUpdate.id]);
          // Shows the updated roles
          role.view("role.id");
        });
      } else {
        // If the title or salary column is chosen
        await inquirer.prompt({
          type: "input",
          name: "value",
          // Ask for the new column value
          message: `What is the new role's ${column.name}`,
        }).then((answers) => {
          // Update the role row with the desired column and value
          rowUpdate(["role", column.name, answers.value, "id", roleUpdate.id]);
          // Shows the updated roles
          role.view("role.id");
        });
      }
    }
  },
};

// Exports all role functions
module.exports = role;
