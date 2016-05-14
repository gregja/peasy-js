var Command = require('./command');

var BusinessService = (function() {

  "use strict";

  var BusinessService = function(dataProxy) {
    if (this instanceof BusinessService) {
      this.dataProxy = dataProxy;
    } else {
      return new BusinessService(dataProxy);
    }
  };

  BusinessService.prototype = {

    getAllCommand: function() {
      var service = this;
      var context = {};
      return new Command({
        onInitialization: function(done) {
          service.__onGetAllCommandInitialization(context, done);
        },
        getRules: function(done) {
          return service.__getRulesForGetAll(context, done);
        },
        onValidationSuccess: function(done) {
          return service.__getAll(context, done);
        }
      });
    },

    getByIdCommand: function(id) {
      var service = this;
      var context = {};
      return new Command({
        onInitialization: function(done) {
          service.__onGetByIdCommandInitialization(id, context, done);
        },
        getRules: function(done) {
          return service.__getRulesForGetById(id, context, done);
        },
        onValidationSuccess: function(done) {
          return service.__getById(id, context, done);
        }
      });
    },

    insertCommand: function(data) {
      var service = this;
      var context = {};
      return new Command({
        onInitialization: function(done) {
          service.__onInsertCommandInitialization(data, context, done);
        },
        getRules: function(done) {
          return service.__getRulesForInsert(data, context, done);
        },
        onValidationSuccess: function(done) {
          return service.__insert(data, context, done);
        }
      });
    },

    updateCommand: function(data) {
      var service = this;
      var context = {};
      return new Command({
        onInitialization: function(done) {
          service.__onUpdateCommandInitialization(data, context, done);
        },
        getRules: function(done) {
          return service.__getRulesForUpdate(data, context, done);
        },
        onValidationSuccess: function(done) {
          return service.__update(data, context, done);
        }
      });
    },

    deleteCommand: function(id) {
      var service = this;
      var context = {};
      return new Command({
        onInitialization: function(done) {
          service.__onDeleteCommandInitialization(id, context, done);
        },
        getRules: function(done) {
          return service.__getRulesForDelete(id, context, done);
        },
        onValidationSuccess: function(done) {
          return service.__delete(id, context, done);
        }
      });
    },

    __getAll: function(context, done) {
      this.dataProxy.getAll(done);
    },

    __getRulesForGetAll: function(context, done) {
      done([]);
    },

    __onGetAllCommandInitialization: function(context, done) {
      done();
    },

    __getById: function(id, context, done) {
      this.dataProxy.getById(id, done);
    },

    __getRulesForGetById: function(id, context, done) {
      done([]);
    },

    __onGetByIdCommandInitialization: function(id, context, done) {
      done();
    },

    __insert: function(data, context, done) {
      this.dataProxy.insert(data, done);
    },

    __getRulesForInsert: function(data, context, done) {
      done([]);
    },

    __onInsertCommandInitialization: function(data, context, done) {
      done();
    },

    __update: function(data, context, done) {
      this.dataProxy.update(data, done);
    },

    __getRulesForUpdate: function(data, context, done) {
      done([]);
    },

    __onUpdateCommandInitialization: function(data, context, done) {
      done();
    },

    __delete: function(id, context, done) {
      this.dataProxy.delete(id, done);
    },

    __getRulesForDelete: function(id, context, done) {
      done([]);
    },

    __onDeleteCommandInitialization: function(id, context, done) {
      done();
    }
  };

  BusinessService.extend = function(options) {

    options = options || {};
    options.params = options.params || ['dataProxy'];
    options.functions = options.functions || [];

    var Extended = function() {
      this.args = arguments;
      var self = this;
      BusinessService.call(this);
      options.params.forEach(function(field, index) {
        self[field] = self.args[index];
      });
    };

    Extended.prototype = new BusinessService();
    var keys = Object.keys(BusinessService.prototype);
    options.functions.forEach(function(config) {
      var name = Object.keys(config)[0];
      if (keys.indexOf(name) === -1) {
        console.warn("The method: '" + name + "' is not an overridable method of BusinessService");
      }
      Extended.prototype[name] = config[name];
    });

    function createCommand(name, options) {
      BusinessService.createCommand(name, Extended, options);
      return {
        createCommand: createCommand,
        service: Extended
      };
    }

    return {
      createCommand: createCommand,
      service: Extended
    };
  };

  BusinessService.createCommand = function(name, service, functions) {
    var onInitialization = '__on' + capitalize(name) + 'Initialization';
    var getRules = '__getRulesFor' + capitalize(name);
    var onValidationSuccess = '__' + name.replace("Command", "");

    function capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    functions = functions || {};

    service.prototype[onInitialization] = functions.onInitialization || function(context, done) {
      done();
    };

    service.prototype[getRules] = functions.getRules || function(context, done) {
      done([]);
    };

    service.prototype[onValidationSuccess] = functions.onValidationSuccess || function(context, done) {
      done();
    };

    service.prototype[name] = function() {
      var self = this;
      var context = {};

      return new Command({
        onInitialization: function(done) {
          self[onInitialization](context, done);
        },
        getRules: function(done) {
          return self[getRules](context, done);
        },
        onValidationSuccess: function(done) {
          return self[onValidationSuccess](context, done);
        }
      });
    };

    return service;
  };

  Object.defineProperty(BusinessService.prototype, "constructor", {
    enumerable: false,
    value: BusinessService
  });

  return BusinessService;

})();

module.exports = BusinessService;
