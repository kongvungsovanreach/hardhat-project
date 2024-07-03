/* Import required modules */
const USER_DB = './db/user.json';
const fs = require('fs-extra')

/* Class for User data */
class User {
    constructor(user){
        this.email = user.email
        this.password = user.password
        this.name = user.name
        this.private_key = user.private_key
    }
}

/* Find all users object */
User.findAllUsers =  async (result) => {
    const users = await fs.readJson(USER_DB);
    var userList = []
    users.forEach(user => {
        userList.push(user)
    })
    result(null, userList);
}

/* Find specific user by email */
User.findUserByEmail = async (email, result) => {
    const users = await fs.readJson(USER_DB);
    var userList = []
    users.forEach(user => {
        if(user.email == email) {
            userList.push(user)
        }
    })
    result(null, userList);
}

// Add new user to the db
User.addNew = async (user, result) => {
    // Read the JSON file
    fs.readFile(USER_DB, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Parse the JSON data
        let users = JSON.parse(data);

        // Add the new user to the array
        users.push(user);

        // Convert the updated object back to JSON
        const updatedData = JSON.stringify(users, null, 2);

        // Write the updated JSON back to the file
        fs.writeFile(USER_DB, updatedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            result(null, user)
            console.log('User added successfully!');
        });
    });
}

module.exports = User;