[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/9NDadFFr)
Add design docs in *images/*

## Instructions to setup and run project

- Pre-requisites: Node.js, npm, MongoDB installed

- This program also assumes that MongoDB is running on the default port 27017 and localhost

- Make sure port 3000 and 8000 is not in use

Step 1://///////////////
Clone the repository

```bash
$ git clone git@github.com:sbu-ckane-f23-cse316-projectorg/projectfakeso-team_anten_christian.git
$ cd projectfakeso-team_anten_christian
```


Step 2://////////////////////////////////
Install dependencies in Client and Server

```bash
$ cd client
$ npm install
$ cd ../server
$ npm install
```


Step 3:////////////////////////
Initialize the database

```bash
# Make sure you are in the server directory
$ node init.js <email_of_admin> <password_of_admin>

# Example: node init.js admin@example.com password123
```
Step 4: ///////////////////////
Run the server

```bash
# Make sure you are in the server directory if not # cd server
$ npm start <secret_key>

# Example: npm start secret
```


Step 5: ///////////////////////////////
On a separate terminal, run the client

```bash
# Make sure you are in the client directory if not # cd client
$ npm start
```

## Other Information

Login Credentials

```
Email: user1@example.com
Password: pwd123

Email: user2example.com
Password: pwd123

Email: user3@example.com
Password: pwd123

Email: user4@example.com
Password: pwd123

Email: user5@example.com
Password: pwd123
```

## Team Member 1 Contribution - Anten Manuuel

## Team Member 2 Contribution - Christian Montano

 * Implemented Welcome page, Signup Page, and LoginPage
 * Implemented Original User Schema
 * Implemented Components for UserPage and UserP
 * Implemented Format for UserPage Answers,Questions, and Tags
 * Implemented commenting and voting to AnsTable via Frontend
 * Implemented Updating Comments via Backend
 * Implemented UserPage Answers Edit/Delete
 * UserDelete bug Fixed
 * UML designs 
 * Routes associated with what is described above




Please note that extension has been given to us from Monday to Thursday. Please contact Professor Kane regarding this
I have also provided a screenshot of email below with Professor Kanes' response

![extensionproof](./extensionproof/ExtensionImg.png 'ExtensionImg.png')

