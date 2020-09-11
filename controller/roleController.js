const {rolesView, rolesAdd, departmentFind} = require("../config/orm");
const inquirer = require("inquirer");
const index = require("../index");

const role = {
  // Role Management Menu
  menu: async () => {
    inquirer.prompt({
    name: "menu",
    type: "list",
    message: "What would you like to do?",
    choices: [
    "Go Back",
    "View Roles",
    "Add Role",
    "Remove Role",
    "Update Role",
    ]
    })
    .then(answers => {
    switch (answers.menu) {
    case "View Roles":
      role.view();
      break;
    case "Add Role":
      role.add();
      break;
    case "Remove Role":
      // rolesDelete();
      console.log(answers.menu)
      break;
    case "Update Role":
      // rolesUpdate();
      console.log(answers.menu)
      break;
    default:
      index.menu();
      break;          
    };
    })
  },
  // View all roles
  view: async () => {
  rolesView(function(err, result) {
    if (err) throw err;
    console.log("\n\n");
    console.table(result);
    });
    role.menu();
  },
  // Adds role
  add: async () => {
    inquirer.prompt([
      {
        name: "title",
        message: "What is the role title?",
        validate: input=>{
          return input !== '' || "Title cannot be empty.";
        }
      },
      {
        name: "salary",
        message: "What is the role salary?",
        validate: input=>{
        if(isNaN(input)){
              return "Id has to be a number."
          } else if(input<0){
            return "Id has to be a positive number."
          } else if(input === ""){
              return "Id cannot be empty."
          }else{
              return true;
          };
        }
      },
      {
        type: "list",
        name: "department_id",
        message: "What is the employee's role?",
        choices: await departmentFind()
      }
    ])
    .then(answers => {
    rolesAdd(answers);
    role.view();
    });
  },
};

module.exports = role;