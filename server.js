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
    {name: "user1", password: "pw1"}
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

app.post('/login', (req, res) => {
    for (var i = 0; i < user.length; i++) {
        if (user[i].name == req.body.username && user[i].password == req.body.password) {
            req.session.authenticated = true;
            req.session.userid = user[i].name;
            console.log(req.session.userid);
            return res.redirect("/notes");
        } else {
          console.log("Invalid Input");
          res.redirect('/login');
        }
    }
    
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('login');
});

app.get('/notes', (req, res) => {
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

app.get('/notes/delete', (req, res) => {
  db.collection(collectionName)
    .find({})
    .toArray()
    .then((notes) => {
      res.render('delete', { notes });
    })
    .catch((error) => {
      console.error('Error fetching notes: ', error);
      res.redirect('/notes');
    });
});

app.post('/notes/delete', (req, res) => {
  const noteId = req.body.noteId;

  db.collection(collectionName)
    .deleteOne({ _id: ObjectId(noteId) })
    .then(() => {
      res.render('notes');
    })
    .catch((error) => {
      console.error('Error deleting note: ', error);
      res.redirect('/notes');
    });
});

app.get('/notes/update', (req, res) => {
    db.collection(collectionName)
      .find({})
      .toArray()
      .then((notes) => {
        res.render('update', { notes });
      })
      .catch((error) => {
        console.error('Error fetching notes: ', error);
        res.redirect('/notes');
      });
  });
  
  app.post('/notes/update', (req, res) => {
    const noteId = req.body.noteId;
    const { title, content } = req.body;
  
    db.collection(collectionName)
      .updateOne(
        { _id: ObjectId(noteId) },
        { $set: { title, content } }
      )
      .then(() => {
        res.render('notes');
      })
      .catch((error) => {
        console.error('Error updating note: ', error);
        res.redirect('/notes');
      });
  });

app.listen(process.env.PORT || 8099, () => {
    console.log('Server is running...');
});
