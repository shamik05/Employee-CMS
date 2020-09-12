const db = require("./connection.js");

const orm = {
  employeeView(type, cb) {
    let order;
    switch (type) {
    case "Department":
      order = "D.name";
      break;
    case "Manager":
      order = "Manager desc";
      break;
    default:
      order = "E.id";
      break;
    }
    const query = `SELECT E.id AS ID, E.first_name AS "First Name", E.last_name AS "Last Name", R.title AS "Role", D.name AS "Department", R.salary AS "Salary ($)", concat(M.first_name, " ", M.last_name) AS "Manager" 
    FROM employee AS E 
    INNER JOIN role AS R ON E.role_id = R.id 
    INNER JOIN department AS D ON R.department_id = D.id
    LEFT JOIN employee AS M ON E.manager_id = M.id
    ORDER BY ${order}`;

    db.query(query, cb);
  },
  employeeFind: async () => {
    try {
      const query = "SELECT id AS value, concat(first_name, \" \", last_name) AS name FROM employee ORDER BY last_name ASC";
      return await db.query(query);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  employeeAdd: async (values) => {
    try {
      const query = "INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)";
      return await db.query(query, [...Object.values(values)]);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  employeeDelete: async (id) => {
    try {
      const query = "DELETE FROM employee where id = ?";
      return await db.query(query, id);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  employeeUpdate: async (answers) => {
    try {
      const query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      return await db.query(query, answers);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  rolesFind: async () => {
    try {
      const query = "SELECT id AS value, title AS name FROM role ORDER BY title ASC";
      return await db.query(query);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  rolesView: (cb) => {
    const query = `SELECT title AS "Title", salary AS "Salary ($)", department.name AS "Department" FROM role 
    LEFT JOIN department 
    ON role.department_id = department.id
    ORDER BY department.name asc`;
    db.query(query, cb);
  },
  rolesAdd: async (answers) => {
    try {
      const query = "INSERT INTO role(??, ??, ??) values(?,?,?)";
      return await db.query(query, [...Object.keys(answers), ...Object.values(answers)]);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  rolesDelete: async (answers) => {
    console.log(answers);
    try {
      const query = "";
      return await db.query();
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  rolesUpdate: async (answers) => {
    console.log(answers);
    try {
      const query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    // return await db.query(query, answers);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  departmentFind: async () => {
    const query = "SELECT id AS value, name FROM department ORDER BY name ASC";
    try {
      return await db.query(query);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
};

module.exports = orm;
