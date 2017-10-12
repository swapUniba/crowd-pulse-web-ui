(function() {
  'use strict';

  angular
    .module('webUi')
    .controller('ProfileController', ProfileController);

  /** @ngInject */
  function ProfileController($stateParams, $mdDialog, $mdToast, $auth, $scope, Account) {


    $scope.isAuthenticated = function() {
         return $auth.isAuthenticated();
    };


    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data.user;
	      $scope.tweets = response.data.tweets;
          $scope.face_posts = response.data.face_posts;
          $scope.face_likes = response.data.face_likes;
        })
        .catch(function(response) {
          showToast(response.data.message);
        });
    };

    var showToast = function(message) {
      var toast = $mdToast.simple()
        .content(message)
        .position('bottom right');
      return $mdToast.show(toast);
    };

   $scope.toggleTwitter=function(showTweets){
        if(showTweets===true){
            $scope.showTweets=false;
        }else{
            $scope.showTweets=true;
        }
    };

   $scope.toggleFacePosts=function(showPosts){
        if(showPosts===true){
            $scope.showPosts=false;
        }else{
            $scope.showPosts=true;
        }
   };

    $scope.toggleFaceLikes=function(showLikes){
        if(showLikes===true){
            $scope.showLikes=false;
        }else{
            $scope.showLikes=true;
        }
   };

    $scope.filter = function(items) {
        var result = {};
        angular.forEach(items, function(value, key) {
            if (key !== 'picture' && key !== 'url' && key !== 'id' && key !== 'connections' && key !== 'customTags') {
                key = key.charAt(0).toUpperCase() + key.slice(1);
                key = key.replace("_", " ");

                var newValue="<ul>";
                if(value.constructor === Array){

                    for(var i=0; i < value.length; i++){
                        newValue += "<li>" + cleanerValue(key,value[i]) + "</li>";
                    }

                }else{
                    newValue += "<li>" + cleanerValue(key,value) + "</li>";
                }

                newValue += "</ul>";
                value=newValue;

                result[key] = value;
            }
        });
	return result;
      };

      var cleanerValue=function(key, value){
          switch(key) {
            case 'Inspirational people':
            case 'Languages':
            case 'Hometown':
            case 'Favorite athletes':
                return value['name'];
                break;
            case "Education":
                var school="";
                school += "Name : " + value["school"]["name"] + "<br>";
                school += "Type : " + value["type"] + "<br>";

                if(typeof value["year"] !== 'undefined')
                    school += "Year : " + value["year"]["name"] + "<br>";

                if(typeof value["concentration"] !== 'undefined'){
                    school += "Concentration : ";
                    for(var i = 0; i < value["concentration"].length; i++)
                        if(i+1 == value["concentration"].length)
                            school +=value["concentration"][i]["name"] + " <br>";
                        else
                            school +=value["concentration"][i]["name"] + " ,";
                }

                school += "<br>";
                return school;
            case 'Age range':
                  return 'Min : ' + value["min"];
            case "Work":
                var work="";
                if(typeof value["employer"] !== 'undefined')
                    work += "Employer : " + value["employer"]["name"] + "<br>";

                if(typeof value["position"] !== 'undefined')
                    work += "Position : " + value["position"]["name"] + "<br>";

                if(typeof value["start_date"] !== 'undefined')
                    work += "Start date : " + value["start_date"] + "<br>";

                if(typeof value["end_date"] !== 'undefined')
                    work += "End date : " + value["end_date"] + "<br>";


                if(typeof value["projects"] !== 'undefined'){
                    work += "Projects : ";
                    for(var i = 0; i < value["projects"].length; i++)
                        if(i+1 == value["projects"].length)
                            work += value["projects"][i]["name"] + "<br>";
                        else
                            work += value["projects"][i]["name"] + " ,";
                }

                work += "<br>";
                return work;
            default:
                break;
          }

          return JSON.stringify(value);
      };

    $scope.getProfile();

    $scope.showTweets=false;
    $scope.showPosts=false;
    $scope.showLikes=false;
  }
})();
