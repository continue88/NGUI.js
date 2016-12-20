
NGUI.UILabel = function(gameObject) {
    NGUI.UIWidget.call(this, gameObject);
    this.bitmapFont = undefined;
    this.fontSize = 20;
    this.value = "";
    this.overflowMethod = LabelOverflow.ShrinkContent;
    this.alignment = TextAlignment.Automatic;
    this.gradientTop = new UnityEngine.Color(1, 1, 1, 1);
    this.gradientBottom = new UnityEngine.Color(1, 1, 1, 1);
    this.effectStyle = LabelEffect.None;
    this.effectColor = new UnityEngine.Color(0, 0, 0, 1);
    this.effectDistance = new UnityEngine.Vector2(1, 1);
    this.spacingX = 0;
    this.spacingY = 0;
    this.maxLineCount = 0;
    this.supportEncoding = false;
    this.symbolStyle = SymbolStyle.Normal;
    this.fontStyle = FontStyle.Normal;
};

LabelEffect = {
    None: 0,
    Shadow: 1,
    Outline: 2,
};

LabelOverflow = {
    ShrinkContent: 0,
    ClampContent: 1,
    ResizeFreely: 2,
    ResizeHeight: 3,
};

TextAlignment ={
    Automatic : 0,
    Left: 1,
    Center: 2,
    Right: 3,
    Justified: 4,
};

SymbolStyle = {
    None: 0,
    Normal: 1,
    Colored: 2,
};

FontStyle = {
    Normal: 0,
    Bold: 1,
    Italic: 2,
    BoldAndItalic: 3,
};

Object.assign(NGUI.UILabel.prototype = Object.create(NGUI.UIWidget.prototype), {
	constructor: NGUI.UILabel,
    Load: function(json) {
		NGUI.UIWidget.prototype.Load.call(this, json);
        this.bitmapFont = UnityEngine.Resources.Load(json.ft, 'UIFont');
        this.fontSize = json.fs || 20;
        this.value = json.tx || "";
        this.overflowMethod = json.of || LabelOverflow.ShrinkContent;
        this.alignment = json.al || TextAlignment.Automatic;
        this.effectStyle = json.es || LabelEffect.None;
        this.spacingX = json.sx || 0;
        this.spacingY = json.sy || 0;
        this.maxLineCount = json.ml || 0;
        this.supportEncoding = json.se || false;
        this.symbolStyle = json.ss || SymbolStyle.Normal;
        this.fontStyle = json.st || FontStyle.Normal;
        if (json.gt) this.gradientTop.set32(json.gt.r || 255, json.gt.g || 255, json.gt.b || 255, json.gt.a || 255);
        if (json.gb) this.gradientBottom.set32(json.gb.r || 255, json.gb.g || 255, json.gb.b || 255, json.gb.a || 255);
        if (json.ec) this.effectColor.set32(json.ec.r || 0, json.ec.g || 0, json.ec.b || 0, json.ec.a || 255);
        if (json.ed) this.effectDistance.set(json.ed.x || 1, json.ed.y || 1);
    },
});