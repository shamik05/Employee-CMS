-- Create the database
DROP DATABASE IF EXISTS employeesDB;
CREATE database employeesDB;

USE employeesDB;

-- Creates the department table
CREATE TABLE department (
  id INT  AUTO_INCREMENT UNIQUE NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

-- Creates the role table
CREATE TABLE role (
  id INT  AUTO_INCREMENT UNIQUE NOT NULL,
  title VARCHAR(50) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL,
  PRIMARY KEY (id)
);

-- Creates the employee table
CREATE TABLE employee (
  id INT  AUTO_INCREMENT UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  role_id INT NULL,
  manager_id INT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL,
  PRIMARY KEY (id)
);
