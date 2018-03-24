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
  //   subscriber: [undreadMsg] || unreadMsg || undefined
  // }
};

var publish = function publish(channelName, msg) {
  if (channels[channelName] === undefined) {
    channels[channelName] = {};
  }

  Object.keys(channels[channelName]).forEach(function (subscriber) {
    var saveHistory = Array.isArray(channels[channelName][subscriber]);
    if (saveHistory) {
      channels[channelName][subscriber].push(msg);
    } else {
      channels[channelName][subscriber] = msg;
    }
  });
};

var subscribe = function subscribe(channelName, opts) {
  // If `saveHistory === false`, only the latest message would be kept,
  // otherwise, user can read an array of messages.
  var _opts$saveHistory = opts.saveHistory,
      saveHistory = _opts$saveHistory === undefined ? false : _opts$saveHistory;


  if (channels[channelName] === undefined) {
    channels[channelName] = {};
  }

  var isSubscribed = true;
  var subscriberId = (0, _uniqueId2.default)();
  channels[channelName][subscriberId] = saveHistory ? [] : undefined;

  var readMsg = function readMsg() {
    if (!isSubscribed) {
      throw new Error('leave-a-message: You have already unSubscribed the channel "' + channelName + '".');
    }

    var unreadMsg = channels[channelName][subscriberId];
    channels[channelName][subscriberId] = saveHistory ? [] : undefined;
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