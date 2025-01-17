# DevCollabNet

DevCollabNet is a collaborative Q&A platform inspired by Stack Overflow. It enables users to engage in discussions, ask questions, and share knowledge in a structured and interactive manner. This full-stack web application promotes community engagement through features such as reputation scoring, user profiles, tagging, comments, and search functionality. The platform provides a seamless and secure user experience with robust authentication and data management mechanisms.

## Features
- **Reputation Scoring:** Incentivizes user participation by awarding reputation points for contributing to the platform.
- **User Profiles:** Allows users to showcase their contributions, manage their activity, and track their reputation.
- **Search and Tagging:** Enhances content discoverability with a powerful search and tagging system.
- **Secure Authentication:** Utilizes bcrypt for hashing and custom middleware to ensure only verified users access the platform.

## Technologies Used
This project leverages the following technologies to deliver a performant and reliable platform:
- **Frontend:** React.js with Material UI for responsive and modern UI components.
- **Backend:** Node.js and Express.js for RESTful API development.
- **Database:** MongoDB for efficient and scalable data storage.
- **Authentication:** bcrypt for secure password hashing and custom middleware for access control.

## Pre-requisites
Ensure the following are installed on your machine:
- Node.js
- npm (Node Package Manager)
- MongoDB (running on the default port 27017 and localhost)

Additionally, confirm that ports 3000 and 8000 are not in use.

---

## Instructions to setup and run project

Step 1: Clone the repository

```bash
$ git clone git@github.com:antenmanuuel/DevCollabNet.git
$ cd DevCollabNet
```


Step 2: Install dependencies in Client and Server

```bash
$ cd client
$ npm install
$ cd ../server
$ npm install
```


Step 3: Initialize the database

```bash
# Make sure you are in the server directory
$ node init.js <email_of_admin> <password_of_admin>

# Example: node init.js admin@example.com password123
```
Step 4: Run the server

```bash
# Make sure you are in the server directory if not # cd server
$ npm start <secret_key>

# Example: npm start secret
```


Step 5: On a separate terminal, run the client

```bash
# Make sure you are in the client directory if not # cd client
$ npm start
```

## Other Information

Login Credentials

```
Email: user1@example.com
Password: pwd123
Reputation: 30

Email: user2@example.com
Password: pwd123
Reputation: 55

Email: user3@example.com
Password: pwd123
Reputation: 100

Email: user4@example.com
Password: pwd123
Reputation: 75

Email: user5@example.com
Password: pwd123
Reputation: 25
```


