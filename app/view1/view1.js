'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($http, TodosModel)  {
        var main = this;

        main.feed = {
            content: ''
        };

        main.newTodo = {
            title:'',
            isComplete:false
        };


        main.resetForm = function(){
            main.newTodo = {
                title:'',
                isComplete:false
            }
        }

        main.createNewTodo = function (todo){
            main.createTodo(todo);
        }


        //this is our controller
        TodosModel.getTodos()
            .then(function(todos){
            main.todos = todos;
        })
            .catch(function(error){
                main.error = error;
            })
            .finally(function(){
                main.message = 'List Loaded';
            })


        main.submitLiveText = function(liveText) {
            console.log('user', liveText);
            main.liveText = liveText
        };

        main.setCurrentSelection = function(todo) {
            main.currentSelection = todo;
        };

        main.getUrlForTodo = function(todoId) {
            return '/api/todo/' + todoId;
        };

        main.deleteTodo = function(todo) {
            var response = $http.delete('/api/todo/' + todo.id)
                .then(function (response) {
                console.log(response);

                    main.todos = main.todos.filter(function(item) {
                        return item.id !== todo.id;
                    });
            }, function (response) {
                console.log(response);
            })
        };

        main.createTodo = function(todo) {
            $http.post('/api/todo/', {
                title:todo.title,
                isComplete: false
            }).then(function(response){
                    console.log(response);
                    todo.id = response.data.id;
                main.todos.push(todo);
                main.resetForm();
            },function(response){
                    console.log(response);
                }
            )
        };

        main.editTodo = function(todo) {
            $http.put('/api/todo/' + todo.id, {
                isComplete: !todo.isComplete
            });
            todo.isComplete = !todo.isComplete;
        };

        main.deleteAll = function() {
            for(var i = 0; i<main.todos.length; i++){
                if(main.todos[i].isComplete){
                    main.deleteTodo(main.todos[i]);
                }
            }
        }

})

.factory('TodosModel', function($http){

        //extract out the array of objects from the get todolist
        function extract(result){
            return result.data;
        };


        function getTodos(){
            //var deferred = $q.defer();
            //deferred.resolve(todos);
            //Use to test blank lists
            //deferred.reject(todos);
            //return deferred.promise;

            return $http.get('/api/todo').then(extract);
        };

        return {
            getTodos: getTodos
        }
})
