
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
	ConvertToPixels: function(rect, width, height, round) {
		var final = rect.clone();
		if (round) {
			final.xMin = Mathf.RoundToInt(rect.xMin * width);
			final.xMax = Mathf.RoundToInt(rect.xMax * width);
			final.yMin = Mathf.RoundToInt((1 - rect.yMax) * height);
			final.yMax = Mathf.RoundToInt((1 - rect.yMin) * height);
		} else {
			final.xMin = rect.xMin * width;
			final.xMax = rect.xMax * width;
			final.yMin = (1 - rect.yMax) * height;
			final.yMax = (1 - rect.yMin) * height;
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
			case CHAR_0: return 0x0;
			case CHAR_1: return 0x1;
			case CHAR_2: return 0x2;
			case CHAR_3: return 0x3;
			case CHAR_4: return 0x4;
			case CHAR_5: return 0x5;
			case CHAR_6: return 0x6;
			case CHAR_7: return 0x7;
			case CHAR_8: return 0x8;
			case CHAR_9: return 0x9;
			case CHAR_a:
			case CHAR_A: return 0xA;
			case CHAR_b:
			case CHAR_B: return 0xB;
			case CHAR_c:
			case CHAR_C: return 0xC;
			case CHAR_d:
			case CHAR_D: return 0xD;
			case CHAR_e:
			case CHAR_E: return 0xE;
			case CHAR_f:
			case CHAR_F: return 0xF;
		}
		return 0xF;
	},
	DecimalToHex24: function(num) {
		num &= 0xFFFFFF;
		return num.toString(16);
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