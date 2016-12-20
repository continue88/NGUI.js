
NGUIMath = {
	ConvertToTexCoords: function(rect, width, height) {
		var final = rect.clone();
		if (width != 0 && height != 0) {
			final.xMin = rect.xMin / width;
			final.xMax = rect.xMax / width;
			final.yMin = 1 - rect.yMax / height;
			final.yMax = 1 - rect.yMin / height;
		}
		return final;
	},
	GetPivotOffset: function(pv) {
		var v = new UnityEngine.Vector2();
		if (pv == WidgetPivot.Top || pv == WidgetPivot.Center || pv == WidgetPivot.Bottom) v.x = 0.5;
		else if (pv == WidgetPivot.TopRight || pv == WidgetPivot.Right || pv == WidgetPivot.BottomRight) v.x = 1;
		else v.x = 0;

		if (pv == WidgetPivot.Left || pv == WidgetPivot.Center || pv == WidgetPivot.Right) v.y = 0.5;
		else if (pv == WidgetPivot.TopLeft || pv == WidgetPivot.Top || pv == WidgetPivot.TopRight) v.y = 1;
		else v.y = 0;

		return v;
	},
	RepeatIndex: function(val, max) {
		if (max < 1) return 0;
		while (val < 0) val += max;
		while (val >= max) val -= max;
		return val;
	},
	WrapAngle: function(angle) {
		while (angle > 180) angle -= 360;
		while (angle < -180) angle += 360;
		return angle;
	},
	HexToDecimal: function(ch) {
		switch (ch) {
			case '0': return 0x0;
			case '1': return 0x1;
			case '2': return 0x2;
			case '3': return 0x3;
			case '4': return 0x4;
			case '5': return 0x5;
			case '6': return 0x6;
			case '7': return 0x7;
			case '8': return 0x8;
			case '9': return 0x9;
			case 'a':
			case 'A': return 0xA;
			case 'b':
			case 'B': return 0xB;
			case 'c':
			case 'C': return 0xC;
			case 'd':
			case 'D': return 0xD;
			case 'e':
			case 'E': return 0xE;
			case 'f':
			case 'F': return 0xF;
		}
		return 0xF;
	},
	DecimalToHex24: function(num) {
		num &= 0xFFFFFF;
		return num.ToString("X6");
	},
	IntToColor: function(val) {
		var inv = 1 / 255;
		var c = new UnityEngine.Color(0, 0, 0, 1);
		c.r = inv * ((val >> 24) & 0xFF);
		c.g = inv * ((val >> 16) & 0xFF);
		c.b = inv * ((val >> 8) & 0xFF);
		c.a = inv * (val & 0xFF);
		return c;
	},
	ColorToInt: function(c) {
		var retVal = 0;
		retVal |= Mathf.RoundToInt(c.r * 255) << 24;
		retVal |= Mathf.RoundToInt(c.g * 255) << 16;
		retVal |= Mathf.RoundToInt(c.b * 255) << 8;
		retVal |= Mathf.RoundToInt(c.a * 255);
		return retVal;
	},
};