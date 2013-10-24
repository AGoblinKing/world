// monad.js
// Douglas Crockford
// 2013-05-18

// High modified Josh Galvin
// no longer meets monad axioms, great chainable api tho
// 2013-10-16

// Public Domain


function MONAD(modifier) {
    'use strict';

    var prototype = Object.create(null);
    prototype.is_monad = true;

    function unit(value) {

        var monad = Object.create(prototype);
  
        monad.bind = function (func, args) {
            return func.apply(
                monad,
                [value].concat(Array.prototype.slice.apply(args || []))
            );
        };
        
        monad.bound = function (func) {
            var self = this;
      
            return function() {
                self.bind(func, arguments);
            };
        };
        
        if (typeof modifier === 'function') {
            value = modifier(monad, value);
        }

        return monad;
    }
    
    unit.method = function (name, func) {
        prototype[name] = function() {
            this.bind(func, arguments);
            return this;
        };
        
        return unit;
    };
    
    unit.lift_value = function (name, func) {
        prototype[name] = function () {
            return this.bind(func, arguments);
        };
        return unit;
    };
    
    unit.lift = function (name, func) {
        prototype[name] = function () {
            var result = this.bind(func, arguments);
            return result && result.is_monad === true ? result : unit(result);
        };
        return unit;
    };
    
    return unit;
}


module.exports = MONAD;