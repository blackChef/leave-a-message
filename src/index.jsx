import uniqueId from 'lodash/uniqueId';

// A pub-sub pattern like event system.
// But instead of push msg to subscribers,
// subscribers must manually pull msg from pub-sub center.

let channels = {
  // channelName: {
  //   subscriber: [undreadMsg] || unreadMsg || undefined
  // }
};

let publish = function(channelName, msg) {
  if (channels[channelName] === undefined) {
    channels[channelName] = {};
  }

  Object.keys(channels[channelName]).forEach(function(subscriber) {
    let saveHistory = Array.isArray(channels[channelName][subscriber]);
    if (saveHistory) {
      channels[channelName][subscriber].push(msg);
    } else {
      channels[channelName][subscriber] = msg;
    }
  });
};

let subscribe = function(channelName, opts) {
  // If `saveHistory === false`, only the latest message would be kept,
  // otherwise, user can read an array of messages.
  let { saveHistory = false } = opts;

  if (channels[channelName] === undefined) {
    channels[channelName] = {};
  }

  let isSubscribed = true;
  let subscriberId = uniqueId();
  channels[channelName][subscriberId] = saveHistory ? [] : undefined;

  let readMsg = function() {
    if (!isSubscribed) {
      throw new Error(
        `leave-a-message: You have already unSubscribed the channel "${channelName}".`
      );
    }

    let unreadMsg = channels[channelName][subscriberId];
    channels[channelName][subscriberId] = saveHistory ? [] : undefined;
    return unreadMsg;
  };

  let unSubscribe = function() {
    delete channels[channelName][subscriberId];
    isSubscribed = false;
  };

  return { readMsg, unSubscribe };
};

export { publish, subscribe };
