'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribe = exports.publish = undefined;

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// A pub-sub pattern like event system,.
// But instead of push msg to subscribers,
// subscribers must manually pull msg from pub-sub center.

var channels = {
  // channelName: {
  //   subscriber: unreadMsg || undefined
  // }
};

var publish = function publish(channelName, msg) {
  if (channels[channelName] === undefined) {
    channels[channelName] = {};
  }

  Object.keys(channels[channelName]).forEach(function (subscriber) {
    channels[channelName][subscriber] = msg;
  });
};

var subscribe = function subscribe(channelName) {
  if (channels[channelName] === undefined) {
    channels[channelName] = {};
  }

  var isSubscribed = true;
  var subscriberId = (0, _uniqueId2.default)();
  channels[channelName][subscriberId] = undefined;

  var readMsg = function readMsg() {
    if (!isSubscribed) {
      throw new Error('You have already unSubscribed the channel "' + channelName + '".');
    }

    var unreadMsg = channels[channelName][subscriberId];
    channels[channelName][subscriberId] = undefined;
    return unreadMsg;
  };

  var unSubscribe = function unSubscribe() {
    delete channels[channelName][subscriberId];
    isSubscribed = false;
  };

  return { readMsg: readMsg, unSubscribe: unSubscribe };
};

exports.publish = publish;
exports.subscribe = subscribe;