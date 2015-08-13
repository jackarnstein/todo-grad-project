'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($http, TodosModel) {
        var main = this;
        main.feed = {
            content: ''
        };

        //this is our controller
        TodosModel.getTodos()
            .then(function(todos){
            main.todos = todos;
        })
            .catch(function(error){
                main.error = error;
            })
            .finally(function(){
                main.message = 'done';
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
        }

       // main.extract = function(result){
        //    return result.data;
       // }

       // main.deleteTodo = function(todoId){
       //     return $http.delete(main.getUrlForTodo(todoId).then(main.extract));
       // }

        main.deleteTodo = function(todoId) {
            return $http.delete('/api/todo/' + todoId.id);
        }

        main.createTodo = function(todoLabel) {
            $http.post('/api/todo/', {title:todoLabel});

        }

})

.factory('TodosModel', function($http){


        //extract out the array of objects from the get todolist
        function extract(result){
            return result.data;
        }


        function getTodos(){
            //var deferred = $q.defer();
            //deferred.resolve(todos);
            //Use to test blank lists
            //deferred.reject(todos);
            //return deferred.promise;

            return $http.get('/api/todo').then(extract);
        }






        return {
            getTodos: getTodos
        }
})
