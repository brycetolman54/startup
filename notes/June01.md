# Database

- MongoB is good with JSON objects
- Choose a databae that works for the data that you are storing
- How to use MongoDB
```
mkdir testMongo && cd testMongo
npm install mongodb (make sure you do npm init -y first)

const{ MongoClass } = require('mongodb'); --> Gets just the mongo client from the object that is returned (you have to know what require is returning)
//    const userName = 'holowaychuk'; --> These are your credentials
//    const password = 'espress'; --> This is your password to get into your account
//    const hostname = 'yourdb.mongodb.com; --> this is the place where your database is stored, your mongodb database 
//    const url = `mongodb+srv://${userName}:${password}@${hostname}`; --> Don't do these

const config = require('./dbConfig.json');
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`; --> This gets the info from your file that is in the .gitignore

const client = new MongoClient(url);
const db = client.db('startup'); --> gets the pointer to your startup in the database, creates one if you don't have one

// See if all is working, if we are connected
client
  .connet() --> try to connect
  .then() => db.command({ping: 1})) --> send a ping to see if it is connected
  .catch((ex) => {
    console.log(`Error with ${url} because ${ex.message}`); --> throws an exception if it doesn't work
    process.exit(1); --> this is a node.js thing, it will exit the processor
  });
```

- Now we can access our database
  - You don't want to hardcode your line with your username and password
```
// In dbconfig.json that is added to .gitignore
{
  "hostname": yourhost.name --> from the website ('Database' > 'Connect')
  "userName": yourUserName
  password": yourPassWord
}
```
- How do we actually put stuff in the db
```
const db = client.db('startup'); --> gets teh DB

const scoreCollection = db.collection('score'); --> accesses or creates this object

scoreCollection.insertOne({name: 'tim', score: 42}); --> sets one thing in the collection

scores = [
  {name: 'bob', score: 35},
  {name: 'jon', score: 23)
]
scoreCollection.insertMany(scores); --> This inserts more things

// How to get things back out
db.house.find() --> finds the thing in the DB

// You can put a query and options into a find
const query = {score: {$gt: 10}}; --> wants all scores greater than 10
const options = {
  sort: {score: -1}, --> Sorts them in reverse order
  limit: 10, --> only gets the first ten
}
const cursor = db.find(query, options);
```

- All operations are preceded by $

| Operation | Keyword |
| :---: | :---: |
| Greater than or equal to | gte |
| Less than or equal to | lte |
| Less than | lt |
| Greater than | gt |


# Simon DB
- We have to update our DB when we need to or pull from it
- Your files will be gray in VS code when they are in gitignore

# Authentication
- You _HAVE_ to care about this
- Don't do clear text, store a hashed version
- When you have to authenticate, rehash and compare the hash values to see if they match (hash can go forward, not back)
- That's not secure enough... they can just use the same hash algorithm
- So, let's salt it (Salt:Hash): get a random ID for salt, append the id to the beginning of the hash
- What we do is:
  - Send the user data from the front end to the back
  - Cast out the password, don't store it
  - Send back a token representing the authentication from the back end
  - Now the client will send back the cookie token that you sent from the back end when they want to login
  - You can track who is an admin on the backend with that cookie and change front end functionality because of that
- There is some code on the slides about how to do cookies
- uuid: module from node to generate random user ids
- bcrypt: module from node to hash
