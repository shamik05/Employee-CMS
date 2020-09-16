# Employee Tracker
![GitHub License](https://img.shields.io/badge/License-None-blue)
## Description
This is a **C**ontent **M**anagement **S**ystems focused-application for managing a company's employee database. It's built with a node interface and uses the inquirer npm package to communicate to a mysql backend. The results are then displayed using the console.table npm package. It has three major components (tables) in the database - Employees, Roles and Departments. Each management table consists of its own views, adding, removing and updating functions which the user has complete control over. The schema files in the sql folder can be consulted to find a detailed database structure. 
## Table of Contents
* [Installation](#Installation)
* [Configuration](#Configuration)
* [Usage](#Usage)
  * [Main](#Main)
  * [Employees](#Employees)
  * [Roles](#Roles)
  * [Departments](#Departments)
* [License](#License)
* [Contributing](#Contributing)
* [Tests](#Tests)
* [Questions](#Questions)
## Installation
Download or clone the repo to a working director and extract its contents. Use a **C**ommand **L**ine **I**nterface to install necessary dependencies by running the following command:
```
npm i
```
To create the database, copy the contents from ![schema](sql/schema.sql) and run it any application capable of managing MySQL database. MySQL Workbench was used for the development process. 
Sample data has also been provided in the ![sql](sql/) in the form of .csv files for populating your database and demo the app.
## Configuration
Locate the connection.js file inside the config folder and change the create connection function with your appropriate parameters.
## Usage 
Type the following in any CLI to run the app. 
```
node index.js
```
GIFs have also been attached for demo purposes.
### Main
![Main](main.gif)
(<iframe src="https://drive.google.com/file/d/1mpFmP9KwG6y6r_qV5lKtpzn6XAmsXwlg/preview" width="640" height="480"></iframe>)
### Employees
![Employees](employee.gif)

### Roles
![Roles](roles.gif)

### Departments
![Departments](department.gif)
## License 
The project is currently licenseless.
## Contributing
Message the owner on github or by email.
## Questions 
If you have any questions about the repo, open an issue or contact me directly at shamik05@hotmail.com. You can find more of my work at [shamik05](https://github.com/shamik05/).