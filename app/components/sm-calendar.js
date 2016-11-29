import Ember from 'ember';
import layout from '../templates/components/sm-calendar';


export default Ember.Component.extend({
    layout: layout,
    classNames: ['sm-calendar'],
    params: {},

    calendarId: Ember.computed(function() {
        return 'calendar' + (this.get('elementId'));
    }),
    /**
     * This is a property to determine the Label.
     *
     * @property label
     * @type string
     * @default ""
     */
    label: '',
    today: new Date(),
    /**
     * This is a property to determine the date-format.
     *
     * @property dateFormat
     * @type string
     * @default ""
     */
    dateFormat: Ember.computed('params.dateFormat', function() {
        return ((this.get('params.dateFormat')) ? this.get('params.dateFormat') : 'dd-mm-yy');
    }),
    /**
     * Property which states if min or max to be selected as the initial date when both min and max are assigned to the calendar
     *
     *
     * @property preferenceType
     * @type string
     * @default ''
     */
    preferenceType: Ember.computed('params.preferenceType', 'params.min', 'params.max', function() {
        let defaultMin = new Date();
        defaultMin.setMonth(defaultMin.getMonth() - 1);
        let defaultMax = new Date();
        defaultMax.setMonth(defaultMax.getMonth() + 1);
        let minDate = this.get('params.min') ? this.get('params.min') : this.standardDate(defaultMin);
        let maxDate = this.get('params.max') ? this.get('params.max') : this.standardDate(defaultMax);
        let minDateObj = this.parseDate(minDate),
            maxDateObj = this.parseDate(maxDate),
            todayDateObj = new Date(),
            preferenceType = this.get('params.preferenceType');
        if ((todayDateObj > maxDateObj) || (todayDateObj < minDateObj)) {
            if (preferenceType) {
                return preferenceType;
            } else {
                return "min";
            }
        }
    }),

    /**
     * This is a property to reflect the user selected value or be given as default value.
     * Specify either an actual date via a Date object or as a string in the current dateFormat, or a number of days from
     * today (e.g. +7) or a string of values and periods ('y' for years, 'm' for months, 'w' for weeks, 'd' for days,
     * e.g. '+1m +7d'), or null for today.
     *
     * @property selectedDate
     * @type string
     * @default ""
     */
    selectedDate: Ember.computed('params.selectedDate', 'preferenceType', function() {
        if (this.get('params.selectedDate')) {
            return this.get('params.selectedDate');
        } else if (this.get('preferenceType')) {
            return ((this.get('preferenceType') === 'max') ? this.get('params.max') : this.get('params.min'));
        } else {
            return new Date();
        }
    }),
    displayDate: Ember.computed.oneWay('params.selectedDate'),
    datepickerProps: ['altField', 'altFormat', 'appendText', 'autoSize', 'beforeShow', 'beforeShowDay', 'buttonImage', 'buttonImageOnly', 'buttonText', 'calculateWeek', 'changeMonth', 'changeYear', 'closeText', 'constrainInput', 'currentText', 'dateFormat', 'dayNames', 'dayNamesMin', 'dayNamesShort', 'defaultDate', 'duration', 'firstDay', 'gotoCurrent', 'hideIfNoPrevNext', 'isRTL', 'maxDate', 'minDate', 'monthNames', 'monthNamesShort', 'navigationAsDateFormat', 'nextText', 'numberOfMonths', 'onChangeMonthYear', 'onClose', 'onSelect', 'prevText', 'selectOtherMonths', 'shortYearCutoff', 'showAnim', 'showButtonPanel', 'showCurrentAtPos', 'showMonthAfterYear', 'showOn', 'showOptions', 'showOtherMonths', 'showWeek', 'stepMonths', 'weekHeader', 'yearRange', 'yearSuffix'],
    calendarProps: Ember.computed('params', function() {
        let calendarProps = {};
        let $this = this;
        Ember.$.each($this.get('datepickerProps'), function(dpIndex, dpElem) {
            Ember.$.each($this.get('params'), function(paramKey, paramProp) {
                if (paramKey === dpElem) {
                    calendarProps[paramKey] = paramProp;
                }
            });
        });
        return calendarProps;
    }),
    enableWeekendStd: function(date) {
        let enableWeekend = (this.get('params.enableWeekend') === false )? Ember.$.datepicker.noWeekends(date): [true, ''];
        if (enableWeekend[0]) {
            return this.disableDays(date); //(this.get('specialDates')? this.disableDays(date): [true]);
        } else {
            return enableWeekend;
        }
    },
    disableDays: function(date) {
        let specialDates = this.get('params.specialDates');
        let $this = this;
        let display =[true, ''];
        Ember.$.each(specialDates, function(dateIndex, elem){
            if($this.standardDate(elem.date) === $this.standardDate(date)){
                if(elem.isConsumed){
                    display = [true, 'consumed', elem.quantity];
                }else if(elem.isConsumptionChanged){
                    display = [true, 'changed-consumption', elem.quantity];
                }
            }
        });
        return display;
    },
    didInsertElement: function() {
        let context = this;
        let calendarProps = this.get('calendarProps');
        calendarProps.beforeShowDay = Ember.$.proxy(this.enableWeekendStd, this);
        calendarProps.onSelect = function(selectedDate) {
            console.log("selected date is: ", selectedDate);
            context.set('selectedDate', selectedDate);
            //context.send(dateChange, selectedDate);
        };
        calendarProps.defaultDate = this.get('selectedDate');
        calendarProps.minDate = this.get('params.min');
        calendarProps.maxDate = this.get('params.max');

        Ember.$('#'+this.get('calendarId')).datepicker(calendarProps);
    },
    standardDate: function(date) {
        let format = this.get('dateFormat');
        if (typeof(date) !== 'object') {
            date = this.parseDate(date);
        }
        //format date object in to specified date format string
        return Ember.$.datepicker.formatDate(format, date);
    },
    parseDate: function(date_str) {
        //convert date string in to date object
        return Ember.$.datepicker.parseDate(this.get('dateFormat'), date_str);
    },
    actions: {
        onDateChange() {
            console.log("selectedDate", this.get('selectedDate'));

            // this.attrs.onDateChange(this.get('selectedDate'));
            return this.get('selectedDate');
        }
    }
});