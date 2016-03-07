(function() {
  'use strict';
  
  const assign = require('object-assign');
  const EventEmitter = require('events').EventEmitter;
  const ExampleDispatcher = require('./../dispatcher/ExampleDispatcher.js');
  const ExampleConstants = require('./../constants/ExampleConstants.js');

  const ActionTypes = ExampleConstants.ActionTypes;
  const CHANGE_EVENT = 'change';

  let ExampleStore = assign({}, EventEmitter.prototype, {
    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    },

    get: function() {
      return _value;
    },
  });

  ExampleStore.dispatchToken = ExampleDispatcher.register((action) => {
    switch(action.type) {
      case ActionTypes.EXAMPLE:
        console.log(action.payload);
        ExampleStore.emitChange();
        break;
      default:
        // do nothing
    }
  });

  module.exports = ExampleStore;
})();