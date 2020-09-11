const db = require("./connection.js");

const orm = {
  selectOrder: function(type, cb){
    const query = `SELECT E.id, E.first_name AS "First Name", E.last_name AS "Last Name", R.title AS "Job Title", D.name AS Department, R.salary AS Salary, concat(M.first_name, " ", M.last_name) AS Manager 
    FROM employee AS E 
    INNER JOIN role AS R ON E.role_id = R.id 
    INNER JOIN department AS D ON R.department_id = D.id
    LEFT JOIN employee AS M ON E.manager_id = M.id
    ORDER BY ${type}`;

    db.query(query, cb);
  },
  findRoles: async () => {
    const query = `SELECT id AS value, title AS name FROM role ORDER BY title ASC`;
    return await db.query(query);
  },
  findEmployees: async () => {
    const query = `SELECT id AS value, concat(first_name, " ", last_name) AS name FROM employee ORDER BY last_name ASC`
    return await db.query(query);
  },
  insertEmployee: async (values) => {
    const query = `INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)`
    console.log(values);
    return await db.query(query,[...Object.values(values)]);
  }
};

module.exports = orm;