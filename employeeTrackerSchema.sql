DROP DATABASE IF EXISTS employeeTracker_db;

CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(9,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Michael", "Scott", 1), ("Jim", "Halpert", 2), ("Toby", "Flenderson", 3), ("Oscar", "Nunez", 4), ("Darryl", "Philbin", 5);

INSERT INTO role (title, salary, department_id)
VALUES ("Branch Manager", 80000.00, 1), ("Sales Manager", 60000.00, 2), ("HR", 200000.00, 1), ("Accounting Manager", 50000.00, 3), ("Warehouse Manager", 70000.00, 4); 

INSERT INTO department (name)
VALUES ("Corporate"), ("Sales"), ("Accounting"), ("Warehouse");