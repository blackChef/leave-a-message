import uniqueId from 'lodash/uniqueId';

// A pub-sub pattern like event system,.
// But instead of push msg to subscribers,
// subscribers must manually pull msg from pub-sub center.

let channels = {
  // channelName: {
  //   subscriber: unreadMsg || undefined
  // }
};

let publish = function(channelName, msg) {
  if (channels[channelName] === undefined) {
    channels[channelName] = {};
  }

  Object.keys(channels[channelName]).forEach(function(subscriber) {
    channels[channelName][subscriber] = msg;
  });
};

let subscribe = function(channelName) {
  if (channels[channelName] === undefined) {
    channels[channelName] = {};
  }

  let isSubscribed = true;
  let subscriberId = uniqueId();
  channels[channelName][subscriberId] = undefined;

  let readMsg = function() {
    if (!isSubscribed) {
      throw new Error(
        `You have already unSubscribed the channel "${channelName}".`
      );
    }

    let unreadMsg = channels[channelName][subscriberId];
    channels[channelName][subscriberId] = undefined;
    return unreadMsg;
  };

  let unSubscribe = function() {
    delete channels[channelName][subscriberId];
    isSubscribed = false;
  };

  return { readMsg, unSubscribe };
};

export { publish, subscribe };
