const orm = require("./config/orm.js");
const inquirer = require("inquirer");
const cTable = require("console.table");

const viewEmp = type => {
  orm.selectOrder(type, function(err, result) {
  if (err) throw err;
  console.log("\n\n");
  console.table(result);
  });
  menu();
};

const addEmp = async () => {
  inquirer.prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
      validate: input=>{
        return input !== '' || "Name cannot be empty.";
      }
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
      validate: input=>{
        return input !== '' || "Name cannot be empty.";
      }
    },
    {
      type: "list",
      name: "role_id",
      message: "What is the employee's role?",
      choices: await orm.findRoles()
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's manager?",
      choices: await orm.findEmployees().then(result => {
          result.unshift({value: null, name: "None"});
          return result;
          })
    }
  ]).then(answers => {
   orm.insertEmployee(answers);
   viewEmp("E.id");
  });
};

const menu = () => {
  inquirer.prompt({
    name: "menu",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Employees by Department",
      "View All Employees by Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "View All Roles",
      "Add Role",
      "Remove Role",
      "Exit",
    ],
  }).then(answer => {
    switch (answer.menu) {
      case "View All Employees":
        viewEmp("E.id");
        break;
      case "View All Employees by Department":
        viewEmp("D.name");
        break;
      case "View All Employees by Manager":
        viewEmp("Manager desc");
        break;
      case "Add Employee":
        addEmp();
        break;
      case "Remove Employee":
        removeEmp();
        break;
      case "Exit":
        console.log("Exiting");
        break;
      default:
        connection.end();
        break;
    }
  });
};

menu();