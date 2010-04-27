Objection.store('Event', {
	constructor: function(event, data, target){
		this.type = event;
		this.target = target;
		Obj.augment(this, data, true);
	},
	remove: function(){
		this.currentTarget.unsubscribe(this.type, this.currentHandler);
	},
	stop: function(){
		this.stopped = true;
	}
});

Objection.store('Publisher', {
	constructor: function(){
		this._subscribers = {};
	},
	subscribe: function(event, subscriber){
		return (this._subscribers[event] || (this._subscribers[event] = [])).unshift(subscriber), this;
	},
	unsubscribe: function(event, subscriber){
		var list = this._subscribers[event]||(this._subscribers[event] = []),
			i = list.length;
		while(i--){
			list[i] === subscriber && list.splice(i, 1);
		}
		return this;
	},
	publish: function(event, data){
		data = Obj('Event', event, data, this);
		data.currentTarget = this;
		!data.target && (data.target = this);
		var list = this._subscribers[event]||(this._subscribers[event] = []),
			i = list.length;
		while(i--){
			data.currentHandler = list[i];
			typeof list[i] === 'function' && list[i].call(this,data);
			list[i] && typeof list[i][event] === 'function'  && list[i][event](data);
			if(event.stopped) break;
		}
		return this;
	}
});