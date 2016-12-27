
NGUI.UISpriteData = function() {
	this.name = "Sprite";
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;

	this.borderLeft = 0;
	this.borderRight = 0;
	this.borderTop = 0;
	this.borderBottom = 0;

	this.paddingLeft = 0;
	this.paddingRight = 0;
	this.paddingTop = 0;
	this.paddingBottom = 0;
};

NGUI.UISpriteData.prototype = {
	constructor: NGUI.UISpriteData,
	get hasPadding() { return (this.paddingLeft | this.paddingRight | this.paddingTop | this.paddingBottom) != 0; },
	Load: function(json) {
		this.name = json.name;
		this.x = json.x || 0;
		this.y = json.y || 0;
		this.width = json.w || 0;
		this.height = json.h || 0;
		this.borderLeft = json.bl || 0;
		this.borderRight = json.br || 0;
		this.borderTop = json.bt || 0;
		this.borderBottom = json.bb || 0;
		this.paddingLeft = json.pl || 0;
		this.paddingRight = json.pr || 0;
		this.paddingTop = json.pt || 0;
		this.paddingBottom = json.pb || 0;
		return this;
	},
};