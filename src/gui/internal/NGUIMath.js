
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
		var v = new THREE.Vector2();
		if (pv == NGUI.UIWidget.Pivot.Top || pv == NGUI.UIWidget.Pivot.Center || pv == NGUI.UIWidget.Pivot.Bottom) v.x = 0.5;
		else if (pv == NGUI.UIWidget.Pivot.TopRight || pv == NGUI.UIWidget.Pivot.Right || pv == NGUI.UIWidget.Pivot.BottomRight) v.x = 1;
		else v.x = 0;

		if (pv == NGUI.UIWidget.Pivot.Left || pv == NGUI.UIWidget.Pivot.Center || pv == NGUI.UIWidget.Pivot.Right) v.y = 0.5;
		else if (pv == NGUI.UIWidget.Pivot.TopLeft || pv == NGUI.UIWidget.Pivot.Top || pv == NGUI.UIWidget.Pivot.TopRight) v.y = 1;
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