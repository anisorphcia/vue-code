(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  // 获取数组的方法
  var oldArrayProtoMethods = Array.prototype;
  console.log('oldArrayProtoMethods', oldArrayProtoMethods);
  // 继承
  var ArrayMethods = Object.create(oldArrayProtoMethods);
  console.log('ArrayMethods', ArrayMethods);
  // 劫持
  var methods = ["push", "pop", "unshift", "shift", "splice"];
  methods.forEach(function (item) {
    console.log('ArrayMethods[item]', ArrayMethods[item]);
    ArrayMethods[item] = function () {
      console.log('劫持数组');
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = oldArrayProtoMethods[item].apply(this, args); // this -> list:[]
      // 对添加的数组对象进行劫持
      var inserted;
      switch (item) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.splice(2);
          break;
      }
      console.log('inserted', inserted);
      var ob = this.__ob__;
      if (inserted) {
        ob.observeArray(inserted);
      }
      return result;
    };
  });

  function observer(data) {
    if (_typeof(data) !== 'object' || data === null) {
      return data;
    }
    return new Observer(data);
  }
  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);
      // 给data定义一个属性
      Object.defineProperty(value, '__ob__', {
        enumerable: false,
        value: this
      });
      if (Array.isArray(value)) {
        console.log('array', value);
        value.__proto__ = ArrayMethods;
        // 数组中的元素是对象
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          var value = data[key];
          defineReactive(data, key, value);
        }
      }
    }, {
      key: "observeArray",
      value: function observeArray(value) {
        // value.forEach(el => {
        //     observer(el)
        // })
        for (var i = 0; i < value.length; ++i) {
          observer(value[i]);
        }
      }
    }]);
    return Observer;
  }(); // 只能对对象中的属性劫持，无法操作数组
  function defineReactive(data, key, value) {
    observer(value);
    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        value = newValue;
      }
    });
  }

  function initState(vm) {
    var opts = vm.$options;
    if (opts.data) {
      initData(vm);
    }
  }
  function initData(vm) {
    var data = vm.$options.data;
    // data() 指向window
    // data.call(vm) 改变this指向
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    // 数据劫持
    observer(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      console.log(options);
      var vm = this;
      vm.$options = options;
      // init
      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
