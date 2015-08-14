'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', function(PersonsModel) {
        var main = this;
        main.feed = {
            content: ''
        };

        //this is going to be our try
        // and catch statement bit
        PersonsModel.getPersons()
            .then(function(persons){
                main.persons = persons;
            })
            .catch(function(error){
                main.error = error;
            })
            .finally(function(){
                main.message = 'FINALLY DONE';
            })

        main.submitLiveText = function(liveText){
            console.log('user', liveText);
            main.liveText = liveText
        };

        main.setCurrentSelection = function(person){
            main.currentSelection = person;
        };

        main.newPerson = {
            name: 'newbie'
        };

        main.createNewPerson = function(person){
            console.log("clicked");
            main.persons[123] = person;
        };
    })