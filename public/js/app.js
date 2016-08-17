angular.module("contactsApp", ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                controller: "TeamController",
                templateUrl: "teams.html",
                resolve: {
                    contacts: function (Contacts) {
                        return Contacts.getContacts();
                    },
                    events: function (Events) {
                        return Events.getEvents();
                    },
                    teams: function (Teams) {
                        return Teams.getTeams();
                    },
                    event_types: function (EventTypes) {
                        return EventTypes.getEventTypes();
                    }
                }
            })
            .when("/new/contact", {
                controller: "NewContactController",
                templateUrl: "contact-form.html"
            })
            .when("/contact/:contactId", {
                controller: "EditContactController",
                templateUrl: "contact.html"
            })
            .when("/scoreboard", {
                controller: "ScoreboardController",
                templateUrl: "scoreboard.html",
                resolve: {
                    contacts: function (Contacts) {
                        return Contacts.getContacts();
                    },
                    event_types: function (EventTypes) {
                        return EventTypes.getEventTypes();
                    }
                }
            })
            .when("/team", {
                controller: "TeamController",
                templateUrl: "teams.html",
                resolve: {
                    contacts: function (Contacts) {
                        return Contacts.getContacts();
                    },
                    events: function (Events) {
                        return Events.getEvents();
                    },
                    teams: function (Teams) {
                        return Teams.getTeams();
                    },
                    event_types: function (EventTypes) {
                        return EventTypes.getEventTypes();
                    }
                }
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Contacts", function ($http) {
        this.getContacts = function () {
            return $http.get("/contacts").then(function (response) {
                return response;
            }, function (response) {
                alert("Error finding contacts.");
            });
        };
        this.createContact = function (contact) {
            return $http.post("/contacts", contact).then(function (response) {
                return response;
            }, function (response) {
                alert("Error creating contact.");
            });
        };
        this.getContact = function (contactId) {
            var url = "/contacts/" + contactId;
            return $http.get(url).then(function (response) {
                return response;
            }, function (response) {
                alert("Error finding this contact.");
            });
        };
        this.editContact = function (contact) {
            var url = "/contacts/" + contact._id;
            console.log(contact._id);
            return $http.put(url, contact).then(function (response) {
                return response;
            }, function (response) {
                alert("Error editing this contact.");
                console.log(response);
            });
        };
        this.deleteContact = function (contactId) {
            var url = "/contacts/" + contactId;
            return $http.delete(url).then(function (response) {
                return response;
            }, function (response) {
                alert("Error deleting this contact.");
                console.log(response);
            });
        }
    })
    .service("Events", function ($http) {
        this.getEvents = function () {
            return $http.get("/events").then(function (response) {
                return response;
            }, function (response) {
                alert("Error finding contacts.");
            });
        };
        this.createEvent = function (event) {
            return $http.post("/events", event).then(function (response) {
                return response;
            }, function (response) {
                alert("Error creating contact.");
            });
        };
    })
    .service("Teams", function ($http) {
        this.getTeams = function () {
            return $http.get("/teams").then(function (response) {
                return response;
            }, function (response) {
                alert("Error finding contacts.");
            });
        };
    })
    .service("About", function ($http) {
        this.getAbout = function () {
            return $http.get("/about").then(function (response) {
                return response;
            }, function (response) {
                alert("Error getting about.");
            });
        }
    })
    .service("EventTypes", function ($http) {
        this.getEventTypes = function () {
            return $http.get("/event_types").then(function (response) {
                return response;
            }, function (response) {
                alert("Error getting about.");
            });
        }
    })
    .controller("ListController", function (contacts, $scope) {
        $scope.contacts = contacts.data;
    })
    .controller("ScoreboardController", function (contacts,
                                                  event_types,
                                                  $scope,
                                                  Events) {
        $scope.contacts = contacts.data;
        $scope.event_types = event_types.data;
        $scope.showevents = false;

        $scope.addPoints = function (contactId) {
            $scope.contact = contactId;
            $scope.showevents = true;
        };

        $scope.scoreEvent = function (eventTypeId) {
            $scope.eventTypeId = eventTypeId;
            $scope.showevents = false;
            Events.createEvent({
                "contact": $scope.contact,
                "event_type": $scope.eventTypeId
            });
        };
    })
    .controller("TeamController", function (contacts,
                                            event_types,
                                            events,
                                            teams,
                                            $scope) {
        $scope.listToDict = function (l) {
            var d = {};
            for (var i = 0; i < l.length; i++) {
                d[l[i]._id] = l[i];
            }
            return d;
        };

        $scope.contacts = contacts.data;
        $scope.event_types = $scope.listToDict(event_types.data);
        $scope.events = events.data;
        $scope.teams = teams.data;
        $scope.showAllTeams = true;
        $scope.this_week = 3;

        $scope.playerToTeam = function () {
            var contactDict = $scope.listToDict($scope.contacts);
            for (var i = 0; i < $scope.teams.length; i++) {
                var team = $scope.teams[i];
                var team_name = team['name'];
                for (var j = 0; j < team['members'].length; j++) {
                    var player_id = team['members'][j];
                    contactDict[player_id] = team_name;
                }
            }
            return contactDict;
        };
        $scope.playerToTeamDict = $scope.playerToTeam();

        $scope.scoreTable = function () {
            var d = {};
            for (var i = 0; i < $scope.events.length; i++) {
                var event = $scope.events[i];
                var team_name = $scope.playerToTeamDict[event['contact']];
                if (d[team_name] === undefined) {
                    d[team_name] = {};
                    d[team_name]["this_week"] = 0;
                    d[team_name]["overall"] = 0;
                    d[team_name]["name"] = team_name;
                }
                var score = $scope.event_types[event["event_type"]]["points"];
                if (event["week"] === $scope.this_week) {
                    d[team_name]["this_week"] += score;
                }
                d[team_name]["overall"] += score;
            }
            var l = [];
            for (var i = 0; i < $scope.teams.length; i++) {
                var team = $scope.teams[i];
                l.push(d[team["name"]])
            }
            return l;
        };

        $scope.scores = $scope.scoreTable();
    })
    .controller("NewContactController", function ($scope, $location, Contacts) {
        $scope.back = function () {
            $location.path("#/");
        };

        $scope.saveContact = function (contact) {
            Contacts.createContact(contact).then(function (doc) {
                var contactUrl = "/contact/" + doc.data._id;
                $location.path(contactUrl);
            }, function (response) {
                alert(response);
            });
        };
    })
    .controller("EditContactController", function ($scope, $routeParams, Contacts) {
        Contacts.getContact($routeParams.contactId).then(function (doc) {
            $scope.contact = doc.data;
        }, function (response) {
            alert(response);
        });

        $scope.toggleEdit = function () {
            $scope.editMode = true;
            $scope.contactFormUrl = "contact-form.html";
        };

        $scope.back = function () {
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        };

        $scope.saveContact = function (contact) {
            Contacts.editContact(contact);
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        };

        $scope.deleteContact = function (contactId) {
            Contacts.deleteContact(contactId);
        };
    });