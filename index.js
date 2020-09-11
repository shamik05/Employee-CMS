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
  let roleList = [];
  let employeeList = [];

  await orm.findRoles()
  .then(result => {
    console.log(result)
    result.forEach(element => {
      roleList.push(element.title);
    });
  })

  await orm.findMEmployees()
  .then(result => {
    console.log(result);
    result.forEach(element => {
      employeeList.push(element.employee);
    });
  });

  inquirer.prompt([
    {
      name: "firstName",
      message: "What is the employee's first name?"
    },
    {
      name: "lastName",
      message: "What is the employee's last name?"
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: roleList
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the employee's manager?",
      choices: employeeList
    }
  ]).then(res => {
    console.log(res);
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
      default:
        connection.end();
    }
    // menu();
  });
};

menu();