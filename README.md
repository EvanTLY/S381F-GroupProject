# Notes App
This is a server-side app that allow users to manage (create, update, delete, read) their note.

## Login & Logout
To login:
1. Open 'http://localhost:8099/login'
2. Enter following data:
    - User Name: (see uesr in server.json)
    - Password: (see user in server.json)
3. Click "Login" button
4. Your browser will turn to notes page ('http://localhost:8099/notes').

To logout:
1. Click "Logout" button on the notes page.

### CRUD Services
To test CRUD services
1. Create new note:
    - Send POST request to 'http://localhost:8099/api/notes'.
    - The response will contain created note object.
2. Retrieve all the notes:
    - Send GET request to 'http://localhost:8099/api/notes'.
    - The reponse will contain an array of all notes.
3. Retrive specific note by ID:
    - Send a GET request to 'http://localhost:8099/api/notes/:id'.
    * ':id' is the ID of note.
4. Update specific note by ID:
    - Send a PUT request to 'http://localhost:8099/api/notes/:id'.
    - Include the updated note data in request body.
    - The reponse will show a successful update.
    * ':id' is the ID of note.
5. Delete a specific note by ID:
    - Send a DELETE request to 'http://localhost:8099/api/notes/:id'.
    - The reponse will show a successful deletion.
    * ':id' is the ID of note.