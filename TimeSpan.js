/*!
 * TimeSpanjs v1.0.0
 * https://github.com/abayaz61/TimeSpanJs
 * Powered by Abdullah AYAZ
 * Released under the MIT license
 */

(function () {
	const TicksPerMillisecond = 10000;
	const TicksPerSecond = 10000000;
	const TicksPerMinute = 600000000;
	const TicksPerHour = 36000000000;
	const TicksPerDay = 864000000000;
	const MinutesPerTick = 1.0 / TicksPerMinute;
	const DaysPerTick = 1.0 / TicksPerDay;
	const MillisecondsPerTick = 1.0 / TicksPerMillisecond;
	const MaxMilliSeconds = Number.MAX_VALUE / TicksPerMillisecond;
	const MinMilliSeconds = Number.MIN_VALUE / TicksPerMillisecond;
	const SecondsPerTick = 1.0 / TicksPerSecond;
	const HoursPerTick = 1.0 / TicksPerHour;
	const MaxSeconds = Number.MAX_VALUE / TicksPerSecond;
	const MinSeconds = Number.MIN_VALUE / TicksPerSecond;
	const MillisPerSecond = 1000;
	const MillisPerMinute = MillisPerSecond * 60; //60,000
	const MillisPerHour = MillisPerMinute * 60; //3,600,000
	const MillisPerDay = MillisPerHour * 24; //86,400,000
	TimeSpan = function(ticks, scale) {
		const _ticks = ticks;
		if (typeof (scale) != "undefined") {
			const tmp = _ticks * scale;
			const millis = tmp + (_ticks >= 0 ? 0.5 : -0.5);
			if ((millis > Number.MAX_VALUE / TicksPerMillisecond) || (millis < Number.MIN_VALUE / TicksPerMillisecond))
				throw "Overflow_TimeSpanTooLong";
			return new TimeSpan(parseInt(millis) * TicksPerMillisecond);
		}
		Object.defineProperty(this,
			"Days",
			{
				get: function() { return parseInt(_ticks / TicksPerDay); },
				enumerable: true,
				configurable: false
			});
		Object.defineProperty(this,
			"Hours",
			{
				get: function() { return parseInt((_ticks / TicksPerHour) % 24); },
				enumerable: true,
				configurable: false
			});
		Object.defineProperty(this,
			"Milliseconds",
			{
				get: function() { return parseInt((_ticks / TicksPerMillisecond) % 1000); },
				enumerable: true,
				configurable: false
			});
		Object.defineProperty(this,
			"Minutes",
			{
				get: function() { return parseInt((_ticks / TicksPerMinute) % 60); },
				enumerable: true,
				configurable: false
			});
		Object.defineProperty(this,
			"Seconds",
			{
				get: function() { return parseInt((_ticks / TicksPerSecond) % 60); },
				enumerable: true,
				configurable: false
			});
		Object.defineProperty(this,
			"TotalDays",
			{
				get: function() { return parseFloat(_ticks * DaysPerTick); },
				enumerable: true,
				configurable: false
			});
		Object.defineProperty(this,
			"TotalHours",
			{
				get: function() { return parseFloat(_ticks * HoursPerTick); },
				enumerable: true,
				configurable: false
			});
		Object.defineProperty(this,
			"TotalMinutes",
			{
				get: function() { return parseFloat(_ticks * MinutesPerTick); },
				enumerable: true,
				configurable: false
			});
		Object.defineProperty(this,
			"TotalSeconds",
			{
				get: function() { return parseFloat(_ticks * SecondsPerTick); },
				enumerable: true,
				configurable: false
			});
		Object.defineProperty(this,
			"TotalMilliseconds",
			{
				get: function() {
					const temp = parseFloat(_ticks * MillisecondsPerTick);
					if (temp > MaxMilliSeconds)
						return parseFloat(MaxMilliSeconds);
					if (temp < MinMilliSeconds)
						return parseFloat(MinMilliSeconds);
					return temp;
				},
				enumerable: true,
				configurable: false
			});
		this.getTicks = function() { return _ticks; };
	};
	function timeToTicks(hour, minute, second) {
		const totalSeconds = hour * 3600 + minute * 60 + second;
		if (totalSeconds > MaxSeconds || totalSeconds < MinSeconds)
			throw "Overflow_TimeSpanTooLong";
		return totalSeconds * TicksPerSecond;
	}
	TimeSpan.fromSeconds = function(value) {
		return new TimeSpan(value, MillisPerSecond);
	};
	TimeSpan.fromDays = function(value) {
		return new TimeSpan(value, MillisPerDay);
	};
	TimeSpan.fromHours = function(value) {
		return new TimeSpan(value, MillisPerHour);
	};
	TimeSpan.fromMilliseconds = function(value) {
		return new TimeSpan(value, 1);
	};
	TimeSpan.fromMinutes = function(value) {
		return new TimeSpan(value, MillisPerMinute);
	};
	TimeSpan.fromTicks = function(value) {
		return new TimeSpan(value);
	};
	TimeSpan.fromDiff = function(date1, date2) {
		const ms = (date1 - date2);
		return TimeSpan.fromMilliseconds(ms);
	};
	TimeSpan.fromTime = function(hour, minute, second) {
		return new TimeSpan(timeToTicks(hour, minute, second));
	};
	TimeSpan.fromDateTime = function(days, hours, minutes, seconds, milliseconds) {
		milliseconds = milliseconds || 0;
		const totalMilliSeconds = (parseInt(days) * 3600 * 24 + parseInt(hours) * 3600 + parseInt(minutes) * 60 + seconds) *
			1000 +
			milliseconds;
		if (totalMilliSeconds > MaxMilliSeconds || totalMilliSeconds < MinMilliSeconds)
			throw "Overflow_TimeSpanTooLong";
		_ticks = parseInt(totalMilliSeconds * TicksPerMillisecond);
		return new TimeSpan(_ticks);
	};
	TimeSpan.prototype.toString = function (format) {
		// this block not completed yet
		const that = this;
		format = format || null;
		if (format == null || format.length == 0)
			format = "c";
		const _ticks = that.getTicks();
		var day = parseInt(_ticks / TicksPerDay);
		var time = _ticks % TicksPerDay;

		if (_ticks < 0) {
			day = -day;
			time = -time;
		}
		const hours = parseInt(time / TicksPerHour % 24);
		const minutes = parseInt(time / TicksPerMinute % 60);
		const seconds = parseInt(time / TicksPerSecond % 60);
		const fraction = parseInt(time % TicksPerSecond);
		var result = "";
		switch (format) {
		case "G":
			result = hours +
				":" +
				formatDigits(minutes, 2, "0") +
				":" +
				formatDigits(seconds, 2, "0") +
				"." +
				formatDigits(fraction, 7, "0");
			if (day > 0)
				result = day + ":" + result;
			break;
		case "g":
			result = hours +
				":" +
				minutes +
				":" +
				formatDigits(seconds, 2, "0") +
				"." +
				formatDigits(fraction, 3, "0");
			if (day > 0)
				result = day + ":" + result;
			break;
		default:
			result = formatDigits(hours, 2, "0") +
				":" +
				formatDigits(minutes, 2, "0") +
				":" +
				formatDigits(seconds, 2, "0") +
				"." +
				formatDigits(fraction, 7, "0");
			if (day > 0)
				result = day + ":" + result;
			break;
		}
		return result;
	};
	formatDigits = function(value, len, char) {
		if (value.toString().length == len) return value;
		const s = len - value.toString().length;
		var result = value;
		for (let i = 0; i < s; i++) {
			result = char + result;
		}
		return result;
	};
})();
