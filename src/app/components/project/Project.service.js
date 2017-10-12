(function() {
  'use strict';

  angular
    .module('webUi')
    .factory('Project', Project);

  /** @ngInject */
  function Project(Restangular) {
    var name = 'projects';
    var ProjectService = Restangular.service(name);

    ProjectService.from = function(object) {
      return Restangular.restangularizeElement(null, object, name);
    };

    ProjectService.cache = {};
    ProjectService.cache.projects = undefined;
    ProjectService.cache.listeners = [];

    ProjectService.cache.addOnCacheChangeListener = function(fn) {
      ProjectService.cache.listeners.push(fn);
    };

    ProjectService.cache.removeOnCacheChangeListener = function(fn) {
      var index = ProjectService.cache.listeners.indexOf(fn);
      if (index >= 0) {
        ProjectService.cache.listeners.splice(index, 1);
      }
    };

    var noticeListeners = function(what) {
      ProjectService.cache.listeners.forEach(function(fn) {
        fn(what);
      });
    };

    ProjectService.cache.updateWithProject = function(project) {
      var found = false;
      if (ProjectService.cache.isLoaded()) {
        ProjectService.cache.projects.forEach(function(element, p) {
          if (found) {
            return;
          }
          if (ProjectService.cache.projects[p]._id === project._id) {
            ProjectService.cache.projects[p] = project;
            found = true;
          }
        });
      } else {
        ProjectService.cache.projects = [];
      }

      if (!found) {
        ProjectService.cache.projects.push(project);
      }
      noticeListeners(project);
    };

    ProjectService.cache.removeProject = function(project) {
      if (!ProjectService.cache.isLoaded()) {
        return;
      }
      ProjectService.cache.projects.forEach(function(element, p) {
        if (ProjectService.cache.projects[p]._id === project._id) {
          ProjectService.cache.projects.splice(p, 1);
        }
      });
      noticeListeners(project);
    };

    ProjectService.cache.isLoaded = function() {
      return (typeof ProjectService.cache.projects !== 'undefined');
    };

    ProjectService.cache.invalidate = function() {
      return ProjectService.getList().then(function(projects) {
        ProjectService.cache.projects = projects;
        noticeListeners(projects);
      });
    };

    ProjectService.cache.getOrLoad = function() {
      if (ProjectService.cache.isLoaded()) {
        return ProjectService.cache.projects;
      }
      return ProjectService.cache.invalidate();
    };

    return ProjectService;
  }

})();
