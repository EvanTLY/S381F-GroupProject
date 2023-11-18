const {MongoClient} = require('mongodb');
const {objectId} = require('mongodb');
const mongoURL = 'mongodb+srv://evantse:takyievan5@cluster0.i3gdyic.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'Clustor0';
const collectionName = 'note';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('cookie-session');
const { ObjectId } = require('mongodb');
const SECRETKEY = 'S381F';

var user = new Array (
    {name: "user1", password: "pw1"},
    {name: "user2", passowrd: "pw2"},
    {name: "user3", password: "pw3"}
);

app.set('view engine', 'ejs');
app.use(session({
    name: "session",
    keys: [SECRETKEY]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var documents = {};
let db; 

//Connect to MongoDB
MongoClient.connect(mongoURL, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db(dbName);
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
  
app.get('/', (req, res) => {
    res.redirect('/login')
});

app.get('/login', (req, res) => {
    res.render('login');
});

//Login
app.post('/login', (req, res) => {
    for (var i = 0; i < user.length; i++) {
        if (user[i].name == req.body.username && user[i].password == req.body.password) {
            req.session.authenticated = true;
            req.session.userid = user[i].name;
            console.log(req.session.userid);
            return res.redirect("/notes");
        }
    }
    console.log("Invalid Input");
    res.redirect('/login');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/notes', (req, res) => {
    // Check if the user is logged in
    if (!req.session.userid) {
      return res.redirect('/login');
    }

    db.collection(collectionName)
    .find()
    .toArray()
    .then((notes) => {
      res.render('notes', { notes: notes, userid: req.session.userid });
    })
    .catch((error) => {
      console.error('Error retrieving notes: ', error);
      res.json({ error: 'Error occurred' });
    });
  });

//Note API
app.post('/api/notes', (req, res) => {
    const {title, content} = req.body;

    db.collection(collectionName).insertOne({title, content}).then((result) => {
        res.json(result.ops[0]);
    }).catch((error) => {
        console.error('Error for creating note: ', error);
        res.json({error: 'Error occurred'});
    });
});

app.get('/api/notes', (req, res) => {
    db.collection(collectionName).find().toArray().then((notes) => {
        res.json(notes);
    }).catch ((error) => {
        console.error('Error retrieving notes: ', error);
        res.json({error: 'Error occurred'});
    });
});

app.get('/api/notes/:id', (req, res) => {
    const {id} = req.params;

    db.collection(collectionName).findOne({_id: ObjectId(id)}).then((note) => {
        if (note) {
            res.json(note);
        } else {
            res.json({error: 'Note not found'});
        }
    }).catch((error) => {
        console.error('Error retrieving note: ', error);
        res.json({error: 'Error occurred'});
    });
});

app.put('/api/notes/:id', (req,res) => {
    const {id} = req.params;
    const {title, content} = req.body;

    db.collection(collectionName).updateOne({_id: ObjectId(id)}, {$set: {title, content}}).then(() => {
        res.json({message: 'Note updated'});
    }).catch((error) => {
        console.error('Error updating not: ', error);
        res.json({error: 'Error occurred'});
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const {id} = req.params;

    db.collection(collectionName).deleteOne({_id: ObjectId(id)}).then(() => {
        res.json({message: 'Note deleted'});
    }).catch((error) => {
        console.error('Error deleting note: ', error);
        res.json({error: 'Error occurred'});
    });
});



//Start the server
app.listen(process.env.PORT || 8099, () => {
    console.log('Server is running...');
});
