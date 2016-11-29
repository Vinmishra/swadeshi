import Ember from 'ember';
import calendarData from '../../../stubs/data/calendar';
export default Ember.Route.extend({
	model:function(){
		let params = calendarData;
		return params;
	}
});
