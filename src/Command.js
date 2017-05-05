const instance = null;
class Command {
  constructor () {
    this.subscribers = {};
    return instance || this
  }

  execute (event, args) {
    if(this.subscribers.hasOwnProperty(event)){
      let subscribers =  this.subscribers[event];

      _.forEach(subscribers, (subscriber) => {
        if(subscriber[event]){
          subscriber[event](args);
        }
      });
    }
  };

  subscribe(actionName, subscriber) {
    if(!this.subscribers.hasOwnProperty(actionName)){
      this.subscribers[actionName] = [];
    }
    this.subscribers[actionName].push(subscriber);
  }
}