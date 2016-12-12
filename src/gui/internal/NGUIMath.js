
NGUIMath = {
	ConvertToTexCoords: function(rect, width, height) {
		var final = rect;
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
	}
};