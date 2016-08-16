var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";
var TEAMS_COLLECTION = "teams";
var EVENTS_COLLECTION = "events";
var EVENT_TYPES_COLLECTION = "event_types";
var WEEK = 2;

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server. 
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

app.get("/about", function (req, res) {
    res.status(200).json({
        "week": WEEK
    });
});

// TEAMS API below
/*  "/teams"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/teams", function (req, res) {
    db.collection(TEAMS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get teams.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/teams", function (req, res) {
    var newTeam = req.body;
    newTeam.createDate = new Date();

    db.collection(TEAMS_COLLECTION).insertOne(newTeam, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new team.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

/*  "/teams/:id"
 *    GET: find team by id
 *    PUT: update team by id
 *    DELETE: deletes team by id
 */

app.get("/teams/:id", function (req, res) {
    db.collection(TEAMS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get team");
        } else {
            res.status(200).json(doc);
        }
    });
});

app.put("/teams/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(TEAMS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update team");
        } else {
            res.status(204).end();
        }
    });
});

app.delete("/teams/:id", function (req, res) {
    db.collection(TEAMS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete team");
        } else {
            res.status(204).end();
        }
    });
});


// CONTACTS API ROUTES BELOW
/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/contacts", function (req, res) {
    db.collection(CONTACTS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/contacts", function (req, res) {
    var newContact = req.body;
    newContact.createDate = new Date();

    if (!(req.body.name || req.body.img)) {
        handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
    }

    db.collection(CONTACTS_COLLECTION).insertOne(newContact, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/contacts/:id", function (req, res) {
    db.collection(CONTACTS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get contact");
        } else {
            res.status(200).json(doc);
        }
    });
});

app.put("/contacts/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update contact");
        } else {
            res.status(204).end();
        }
    });
});

app.delete("/contacts/:id", function (req, res) {
    db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete contact");
        } else {
            res.status(204).end();
        }
    });
});

// Events Routes
/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/events", function (req, res) {
    db.collection(EVENTS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/events", function (req, res) {
    var newContact = req.body;
    newContact.createDate = new Date();

    db.collection(EVENTS_COLLECTION).insertOne(newContact, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});


// Event Type Routes
/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/event_types", function (req, res) {
    db.collection(EVENT_TYPES_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/event_types", function (req, res) {
    var newContact = req.body;
    newContact.createDate = new Date();

    db.collection(EVENT_TYPES_COLLECTION).insertOne(newContact, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

app.delete("/event_types/:id", function (req, res) {
    db.collection(EVENT_TYPES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete contact");
        } else {
            res.status(204).end();
        }
    });
});

// Event Routes
/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/events", function (req, res) {
    db.collection(EVENTS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/events", function (req, res) {
    var newEvent = req.body;
    newEvent.createDate = n = new Date("8-8-16 9:00");
    newEvent.week = WEEK;

    db.collection(EVENT_TYPES_COLLECTION).insertOne(newEvent, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new event.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});
