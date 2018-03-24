# leave-a-message
A pub-sub pattern like event system. But instead of push message to subscribers, subscribers must manually pull message from pub-sub center.

# Usage
    import { publish, subscribe } from 'leave-a-message';

    let options = {
      // If `saveHistory === false`, only the latest message would be kept,
      // otherwise, user can read an array of new messages. Default is false.
      saveHistory: true 
    };

    let channelName = 'channel_foo';

    let { readMsg, unsubscribe } = subscribe(channelName, options);

    publish(channelName, 'abc');
    publish(channelName, 'def');

    // Get ['def', 'abc'] or 'def' if `saveHistory === false`
    console.log( readMsg() ); 

    // No new messages. Get [] or undefined if `saveHistory === false`.
    console.log( readMsg() ); 


    unsubscribe();

    // Throw error if user already unsubscribed the channel.
    readMsg();
