angular.module("contactsApp", ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    contacts: function (Contacts) {
                        return Contacts.getContacts();
                    },
                    about: function (About) {
                        return About.getAbout();
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
    .controller("ScoreboardController", function (contacts, event_types, $scope, Events) {
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