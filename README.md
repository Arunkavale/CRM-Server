## CRM-Server
Before you begin make sure you have installed all of the following prerequisites on your development machine:

* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) 
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Postman - [Download & Install Postman](https://www.getpostman.com/).

***************************************************************************
Follwing are the steps of deploying the application on local machine

* Download the full CRM-Server project in zip file 
* after completion of download unzip the file.
* open a terminal.
* Change the location of terminal to project folder useing cd Command.
* install the all dependencies using npm.

```bash
$ npm install 
```
 *************************************************************************

## Running Your Application

After the install process is over, you'll be able to run your application using following command:

```bash
$ node server/server.js 
```
* open postman
 
   - For creating a new user
     * change postman HTTP method to post and change the route url  http://localhost:3000/users and select body. inside body select row and change formate as a JSON 
     * create a object with the valid field and send the request as example
     
     ex: 
     ```bash
     {
       "firstname":"Arun",
       "lastname":"Kavale",
       "username":"Arunkavale",
       "password":"Arun25512",
       "email":"arunkavale@gmail.com",
       "industrie":"software",
       "OrganisationName":"AK",
       "phone":9010101010
     }
     
     ```
     * after completion of signup user then automatically user account will login and server will send  user-auth Token in Headers. copy that user-auth Token data.     
     Ex :
     
     ```bash 
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWNjNWYwM2Y4OWM5MTBjMmNmM2E3MDUiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTIzMzQzMTA4fQ.I3nYbQqkidXiMjRP12UMl8i2Fgr51ulqXDQzhVbDw-I
     ```
     
     
     
     

