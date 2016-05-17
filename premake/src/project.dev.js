require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ActionCallback":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2881e6K1edLBbgvc+6/YN7o', 'ActionCallback');
// cases/05_scripting/03_events/ActionCallback.js

cc.Class({
    'extends': cc.Component,

    // use this for initialization
    onLoad: function onLoad() {
        var touchEvent = this.getComponent('TouchEvent');
        var mouseEvent = this.getComponent('MouseEvent');
        var event = touchEvent || mouseEvent;
        event._callback = function () {
            this.node.runAction(cc.sequence(cc.scaleTo(0.5, 2, 1), cc.scaleTo(0.25, 1, 1)));
        };
    }
});

cc._RFpop();
},{}],"AdaptiveSprite":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4edf1JTF/BHIKZVY3FaAqsT', 'AdaptiveSprite');
// scripts/Global/AdaptiveSprite.js

cc.Class({
    "extends": cc.Component,

    properties: {

        padding: 20,

        label: {
            "default": null,
            type: cc.Node
        },

        backgroup: {
            "default": null,
            type: cc.Node
        }

    },

    update: function update() {
        if (this.backgroup.width !== this.label.width) {
            this.backgroup.width = this.label.width + this.padding;
        }
        if (this.backgroup.height !== this.label.height) {
            this.backgroup.height = this.label.height + this.padding;
        }
    }

});

cc._RFpop();
},{}],"AnimateCustomPropertyCtrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fb14cmn7KJJCo4qVcOy/GmS', 'AnimateCustomPropertyCtrl');
// cases/03_gameplay/03_animation/AnimateCustomPropertyCtrl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        hp: 0,
        emissionRote: 0,
        num: 0,
        hpBar: {
            "default": null,
            type: cc.ProgressBar
        },
        particle: {
            "default": null,
            type: cc.ParticleSystem
        },
        score: {
            "default": null,
            type: cc.Label
        }
    },

    update: function update(dt) {
        this.hpBar.progress = this.hp;
        this.particle.emissionRate = this.emissionRote;
        this.score.string = Math.ceil(this.num);
    }
});

cc._RFpop();
},{}],"AnimationEvent":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1dc09SR4TdLU74RjGBArlm0', 'AnimationEvent');
// cases/03_gameplay/03_animation/AnimationEvent.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var node = cc.find('Canvas/New Label');
        this._label = node.getComponent(cc.Label);
        this._animCtrl = this.node.getComponent(cc.Animation);
    },

    onNextAnimation: function onNextAnimation(step) {
        this._animCtrl.play("step_" + step);
        this._label.string = "开始第" + step + "个动画";
    }
});

cc._RFpop();
},{}],"AssetLoading":[function(require,module,exports){
"use strict";
cc._RFpush(module, '65aa6czKHtKGZog+yjK1bc6', 'AssetLoading');
// cases/05_scripting/07_asset_loading/AssetLoading.js

cc.Class({
    "extends": cc.Component,

    properties: {
        showWindow: {
            "default": null,
            type: cc.Node
        },

        loadAnimTestPrefab: {
            "default": null,
            type: cc.Prefab
        },

        loadTips: {
            "default": null,
            type: cc.Label
        },

        loadList: {
            "default": [],
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        // cur load Target
        this._curType = "";
        this._lastType = "";
        this._curRes = null;
        this._curNode = null;
        this._curLabel = null;
        // add load res url
        this._urls = {
            // Raw Asset, need extension
            Audio: cc.url.raw("resources/test assets/audio.mp3"),
            Txt: cc.url.raw("resources/test assets/text.txt"),
            Font: cc.url.raw("resources/test assets/font.fnt"),
            Plist: cc.url.raw("resources/test assets/atom.plist"),
            Texture: cc.url.raw("resources/test assets/image.png"),
            // Asset, no extension
            SpriteFrame: "resources://test assets/image.png/image",
            Prefab: "resources://test assets/prefab",
            Animation: "resources://test assets/anim",
            Scene: "resources://test assets/scene"
        };
        // registered event
        this.onRegisteredEvent();
    },

    loadCallBack: function loadCallBack(err, res) {
        if (err) {
            return;
        }

        this._curRes = res;

        if (this._curType === "Audio") {
            this._curLabel.string = "Play ";
        } else {
            this._curLabel.string = "Create ";
        }
        this._curLabel.string += this._curType;

        this.loadTips.string = this._curType + " Loaded Successfully !";
    },

    onRegisteredEvent: function onRegisteredEvent() {
        for (var i = 0; i < this.loadList.length; ++i) {
            this.loadList[i].on(cc.Node.EventType.TOUCH_END, this.onLoadResClick.bind(this));
        }
    },

    onClear: function onClear() {
        if (this._curNode) {
            this._curNode.destroy();
        }

        if (cc.Audio && this._curRes instanceof cc.Audio) {
            this._curRes.stop();
        }
    },

    onLoadResClick: function onLoadResClick(event) {
        this.onClear();

        this._lastType = this._curType;
        this._curType = event.target.name.split('_')[1];

        if (this._lastType !== "" && this._curType === this._lastType) {
            this.onShowResClick(event);
            return;
        }

        if (this._curLabel) {
            this._curLabel.string = "Loaded " + this._lastType;
        }

        this._curLabel = event.target.getChildByName("Label").getComponent("cc.Label");

        this.loadTips.string = this._curType + " Loading....";
        cc.loader.load(this._urls[this._curType], this.loadCallBack.bind(this));
    },

    onShowResClick: function onShowResClick(event) {
        if (this._curType === "Scene") {
            cc.loader.release(this._urls.Scene.src);
            cc.director.runScene(this._curRes.scene);
        } else if (this._curType === "Audio") {
            if (this._curRes) {
                this._curRes.play();
                this.loadTips.string = "Open sound music!!";
            } else {
                this.loadTips.string = "Failed to open audio!";
            }
        } else {
            this._createNode(this._curType, this._curRes);
        }
    },

    _createNode: function _createNode(type, res) {
        this.loadTips.string = "";
        var node = new cc.Node("New " + type);
        node.parent = this.showWindow;
        var component = null;
        switch (this._curType) {
            case "Texture":
                component = node.addComponent(cc.Sprite);
                component.spriteFrame = new cc.SpriteFrame(res);
                break;
            case "SpriteFrame":
                component = node.addComponent(cc.Sprite);
                component.spriteFrame = res;
                break;
            case "Txt":
                component = node.addComponent(cc.Label);
                component.lineHeight = 40;
                component.string = res;
                break;
            case "Font":
                component = node.addComponent(cc.Label);
                component.file = this._urls.Font;
                component.lineHeight = 40;
                component.string = "This is Font!";
                break;
            case "Plist":
                component = node.addComponent(cc.ParticleSystem);
                component.file = this._urls.Plist;
                component.resetSystem();
                break;
            case "Prefab":
                var prefab = cc.instantiate(res);
                prefab.parent = node;
                prefab.setPosition(0, 0);
                break;
            case "Animation":
                var loadAnim = cc.instantiate(this.loadAnimTestPrefab);
                loadAnim.parent = node;
                loadAnim.setPosition(0, 0);
                var AanimCtrl = loadAnim.getComponent(cc.Animation);
                AanimCtrl.addClip(res);
                AanimCtrl.play(res.name);
                break;

        }
        node.setPosition(0, 0);
        this._curNode = node;
    },

    loadSpriteAnimation: function loadSpriteAnimation() {
        var plistUrl = 'resources://test assets/atlas.png';
        var pngUrl = 'resources://test assets/atlas.plist';
        var animUrl = 'resources://test assets/sprite-anim';
        cc.loader.load([plistUrl, pngUrl], (function (errs, results) {
            cc.loader.load(animUrl, (function (err, res) {
                if (err) {
                    cc.log('Error url [' + err + ']');
                }
                this.loadTips.string = "";
                var loadAnim = cc.instantiate(this.loadAnimTestPrefab);
                this.showWindow.addChild(loadAnim);
                loadAnim.setPosition(0, 0);
                var AanimCtrl = loadAnim.getComponent(cc.Animation);
                AanimCtrl.addClip(res);
                AanimCtrl.play(res.name);
            }).bind(this));
        }).bind(this));
    }
});

cc._RFpop();
},{}],"AudioControl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8c95bT2M3hBPIdRDVftiUQG', 'AudioControl');
// cases/04_audio/AudioControl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        musicPlayer: {
            "default": null,
            type: cc.AudioSource
        },
        dingClip: {
            "default": null,
            url: cc.AudioClip
        },
        cheeringClip: {
            "default": null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        // play audioSource
        self.musicPlayer.play();

        // play ding in 1 sec, play cheering in 2 sec
        setTimeout(function () {
            cc.audioEngine.playEffect(self.dingClip, false);
            setTimeout(function () {
                cc.audioEngine.playEffect(self.cheeringClip, false);
            }, 2000);
        }, 1000);
    },

    // called every frame
    update: function update(dt) {}
});

cc._RFpop();
},{}],"Bar":[function(require,module,exports){
"use strict";
cc._RFpush(module, '990e2c/1VlE9pmwd+Ftseau', 'Bar');
// cases/05_scripting/05_cross_reference/Bar.js

cc.Class({
    'extends': cc.Component,

    properties: function properties() {
        return {
            refToFoo: require('Foo')
        };
    },

    // use this for initialization
    onLoad: function onLoad() {
        var tip = this.node.children[0].getComponent(cc.Label);
        tip.string = this.name + ' has reference to ' + this.refToFoo.name;
    }
});

cc._RFpop();
},{"Foo":"Foo"}],"ButtonControl1":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e6dc7dWcxxJuofXB7ergGnC', 'ButtonControl1');
// cases/02_ui/03_button/ButtonControl1.js

cc.Class({
    'extends': cc.Component,

    properties: {
        buttonLeft: {
            'default': null,
            type: cc.Button
        },
        buttonRight: {
            'default': null,
            type: cc.Button
        },
        display: {
            'default': null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        // You can also register event listener using the method below
        // this.buttonLeft.getComponent(cc.Button).on(cc.EButton.EVENT_TOUCH_UP, this.onBtnLeftClicked, this);
        // this.buttonRight.getComponent(cc.Button).on(cc.EButton.EVENT_TOUCH_UP, this.onBtnRightClicked, this);
    },

    onBtnLeftClicked: function onBtnLeftClicked() {
        console.log('Left button clicked!');
        this.display.string = 'Left button clicked!';
    },

    onBtnRightClicked: function onBtnRightClicked() {
        console.log('Right button clicked!');
        this.display.string = 'Right button clicked!';
    },

    onBtnInScrollClicked: function onBtnInScrollClicked(sender, event) {
        var msg = sender.node.name + ' clicked!';
        console.log(msg);
        this.display.string = msg;
    }
});

cc._RFpop();
},{}],"ButtonInteractable":[function(require,module,exports){
"use strict";
cc._RFpush(module, '18e60T2NZpEwZAunS+2rFMK', 'ButtonInteractable');
// cases/02_ui/03_button/ButtonInteractable.js

cc.Class({
    'extends': cc.Component,

    properties: {
        buttonLeft: {
            'default': null,
            type: cc.Button
        },
        buttonRight: {
            'default': null,
            type: cc.Button
        },
        labelLeft: {
            'default': null,
            type: cc.Label
        },
        labelRight: {
            'default': null,
            type: cc.Label
        }
    },

    onBtnLeftClicked: function onBtnLeftClicked() {
        console.log('Left button clicked!');
        this.buttonLeft.interactable = false;
        this.buttonRight.interactable = true;

        this.updateInfo();
    },

    onBtnRightClicked: function onBtnRightClicked() {
        console.log('Right button clicked!');
        this.buttonRight.interactable = false;
        this.buttonLeft.interactable = true;

        this.updateInfo();
    },

    updateInfo: function updateInfo() {
        this.labelLeft.string = 'interactable: ' + this.buttonLeft.interactable;
        this.labelRight.string = 'interactable: ' + this.buttonRight.interactable;
    }
});

cc._RFpop();
},{}],"Category":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6b006KRyOZEJaNdg7MsZBqI', 'Category');
// cases/collider/Category.js

cc.Class({
    'extends': cc.Component,

    properties: {
        target: {
            'default': null,
            type: cc.BoxCollider
        }
    },

    // use this for initialization
    start: function start() {
        if (!this.target) return;

        var label = this.getComponent(cc.Label);
        label.string = 'Category: ' + this.target.category + '\n' + 'Mask: ' + this.target.mask;
    }

});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

cc._RFpop();
},{}],"ColliderListner":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9d60fXxtXFNeI79PM6EXYuZ', 'ColliderListner');
// cases/collider/ColliderListner.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = true;

        cc.director.setDisplayStats(true);
        this.touchingNumber = 0;
    },

    onCollisionEnter: function onCollisionEnter(other) {
        this.node.color = cc.Color.RED;
        this.touchingNumber++;
    },

    onCollisionStay: function onCollisionStay(other) {
        // console.log('on collision stay');
    },

    onCollisionExit: function onCollisionExit() {
        this.touchingNumber--;
        if (this.touchingNumber === 0) {
            this.node.color = cc.Color.WHITE;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"ComeBackToAssetLoad":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cb585k+cxFKjohloTN1+FuU', 'ComeBackToAssetLoad');
// cases/05_scripting/07_asset_loading/ComeBackToAssetLoad.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onComeBlack: function onComeBlack() {
        cc.director.loadScene("asset_loading.fire");
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"CustomEvent":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5cc23aoYcxIKazRFwKWGEI7', 'CustomEvent');
// cases/05_scripting/03_events/CustomEvent.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        var touchEvent = this.getComponent('TouchEvent');

        // Emit CUSTOM_EVENT to its listeners while touch end
        touchEvent._callback = (function () {
            this.node.emit('CUSTOM_EVENT');
        }).bind(this);

        var addButton = cc.find('Canvas/add');
        var cancelButton = cc.find('Canvas/cancel');

        function onCustomEvent(event) {
            this.runAction(cc.sequence(cc.scaleTo(0.5, 2, 1), cc.scaleTo(0.25, 1, 1)));
        }

        this.node.on('CUSTOM_EVENT', onCustomEvent, addButton);
        this.node.on('CUSTOM_EVENT', onCustomEvent, cancelButton);
    }
});

cc._RFpop();
},{}],"DestroySelf":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c07302m/oFJeIq2igPCJbWE', 'DestroySelf');
// cases/05_scripting/06_life_cycle/DestroySelf.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        console.log("Pos: " + this.node.getPosition().x + ", " + this.node.getPosition().y);
        this.node.runAction(cc.sequence(cc.moveBy(2, 200, 0), cc.callFunc(function () {
            console.log("Pos: " + this.node.x + ", " + this.node.y);
            this.node.destroy();
        }, this)));
    }
});

cc._RFpop();
},{}],"FilledSpriteControl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '50a95ObLqFH2rz6eShvGuNK', 'FilledSpriteControl');
// cases/01_graphics/01_sprite/FilledSpriteControl.js

cc.Class({
    "extends": cc.Component,

    properties: {

        speed: 0.1,

        horizontal: {
            "default": null,
            type: cc.Sprite
        },

        radial_round: {
            "default": null,
            type: cc.Sprite
        },

        radial_semicircle: {
            "default": null,
            type: cc.Sprite
        }
    },

    onLoad: function onLoad() {
        this.init_horizontal_Range = this.horizontal.fillRange * -1;
        this.init_round_range = this.radial_round.fillRange;
        this.init_semicircle_range = this.radial_semicircle.fillRange;
    },

    update: function update(dt) {
        // 因为默认是从左往右的，为了从有到左所有这里 * -1
        this._updataFillStart(this.horizontal, this.init_horizontal_Range, this.speed, dt);
        this._updateFillRange(this.radial_round, this.init_round_range, this.speed, dt);
        this._updateFillRange(this.radial_semicircle, this.init_semicircle_range, this.speed, dt);
    },

    _updataFillStart: function _updataFillStart(sprite, range, speed, dt) {
        var fillStart = sprite.fillStart;
        fillStart = fillStart > range ? fillStart -= dt * speed : 0;
        sprite.fillStart = fillStart;
    },

    _updateFillRange: function _updateFillRange(sprite, range, speed, dt) {
        var fillRange = sprite.fillRange;
        fillRange = fillRange < range ? fillRange += dt * speed : 0;
        sprite.fillRange = fillRange;
    }

});

cc._RFpop();
},{}],"Foo":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1ea36nYikVOup6BzaEIMYPH', 'Foo');
// cases/05_scripting/05_cross_reference/Foo.js

cc.Class({
    'extends': cc.Component,

    properties: function properties() {
        return {
            refToBar: require('Bar')
        };
    },

    // use this for initialization
    onLoad: function onLoad() {
        var tip = this.node.children[0].getComponent(cc.Label);
        tip.string = this.name + ' has reference to ' + this.refToBar.name;
    }
});

cc._RFpop();
},{"Bar":"Bar"}],"GoldBeatingAnime":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bff49Gn9LVF0YZB0Q/MOguP', 'GoldBeatingAnime');
// cases/02_ui/02_label/GoldBeatingAnime.js

cc.Class({
    "extends": cc.Component,

    properties: {
        speed: 50,
        gold_label: {
            "default": null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.curGold = 0;
        this.curIndex = 0;
    },

    update: function update(dt) {
        this.curIndex += dt * this.speed;
        if (this.curIndex > 10) {
            this.curIndex = 0;
            this.curGold++;
            this.gold_label.string += this.curGold;
            if (this.gold_label.string.length > 10) {
                this.gold_label.string = "0";
                this.curGold = 0;
            }
        }
    }
});

cc._RFpop();
},{}],"Helpers":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c8640M3ozRErrV/Go3uTknt', 'Helpers');
// scripts/Global/Helpers.js

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  getRandomInt: getRandomInt
};

cc._RFpop();
},{}],"HeroControl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '339d2dg1QpEKKxBJBzHiDJ0', 'HeroControl');
// cases/collider/HeroControl.js


cc.Class({
    "extends": cc.Component,

    properties: {
        speed: cc.v2(0, 0),
        maxSpeed: cc.v2(2000, 2000),
        gravity: -1000,
        drag: 1000,
        direction: 0,
        jumpSpeed: 300
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

        //add keyboard input listener to call turnLeft and turnRight
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this),
            onKeyReleased: this.onKeyReleased.bind(this)
        }, this.node);

        this.collisionX = 0;
        this.collisionY = 0;

        this.prePosition = cc.v2();
        this.preStep = cc.v2();

        this.touchingNumber = 0;
    },

    onDisabled: function onDisabled() {
        cc.director.getCollisionManager().enabledDebugDraw = false;
    },

    onKeyPressed: function onKeyPressed(keyCode, event) {
        switch (keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this.direction = -1;
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this.direction = 1;
                break;
            case cc.KEY.w:
            case cc.KEY.up:
                if (!this.jumping) {
                    this.jumping = true;
                    this.speed.y = this.jumpSpeed;
                }
                break;
        }
    },

    onKeyReleased: function onKeyReleased(keyCode, event) {
        switch (keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
            case cc.KEY.d:
            case cc.KEY.right:
                this.direction = 0;
                break;
        }
    },

    onCollisionEnter: function onCollisionEnter(other, self) {
        this.node.color = cc.Color.RED;

        this.touchingNumber++;

        var otherAabb = other.world.aabb;
        var selfAabb = self.world.aabb.clone();
        var preAabb = self.world.preAabb;

        selfAabb.x = preAabb.x;
        selfAabb.y = preAabb.y;

        selfAabb.x = self.world.aabb.x;
        if (cc.Intersection.rectRect(selfAabb, otherAabb)) {
            if (this.speed.x < 0 && selfAabb.xMax > otherAabb.xMax) {
                this.node.x = otherAabb.xMax;
                this.collisionX = -1;
            } else if (this.speed.x > 0 && selfAabb.xMin < otherAabb.xMin) {
                this.node.x = otherAabb.xMin - selfAabb.width;
                this.collisionX = 1;
            }

            this.speed.x = 0;
            other.touchingX = true;
            return;
        }

        selfAabb.y = self.world.aabb.y;
        if (cc.Intersection.rectRect(selfAabb, otherAabb)) {
            if (this.speed.y < 0 && selfAabb.yMax > otherAabb.yMax) {
                this.node.y = otherAabb.yMax;
                this.jumping = false;
                this.collisionY = -1;
            } else if (this.speed.y > 0 && selfAabb.yMin < otherAabb.yMin) {
                this.node.y = otherAabb.yMin - selfAabb.height;
                this.collisionY = 1;
            }

            this.speed.y = 0;
            other.touchingY = true;
        }
    },

    onCollisionStay: function onCollisionStay(other) {
        this.collision = true;
    },

    onCollisionExit: function onCollisionExit(other) {
        this.touchingNumber--;
        if (this.touchingNumber === 0) {
            this.node.color = cc.Color.WHITE;
        }

        if (other.touchingX) {
            this.collisionX = 0;
            other.touchingX = false;
        } else if (other.touchingY) {
            other.touchingY = false;
            this.collisionY = 0;
            this.jumping = true;
        }
    },

    update: function update(dt) {
        if (this.collisionY === 0) {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        }

        if (this.direction === 0) {
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x <= 0) this.speed.x = 0;
            } else if (this.speed.x < 0) {
                this.speed.x += this.drag * dt;
                if (this.speed.x >= 0) this.speed.x = 0;
            }
        } else {
            this.speed.x += (this.direction > 0 ? 1 : -1) * this.drag * dt;
            if (Math.abs(this.speed.x) > this.maxSpeed.x) {
                this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x;
            }
        }

        if (this.speed.x * this.collisionX > 0) {
            this.speed.x = 0;
        }

        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;

        this.preStep.x = this.speed.x * dt;
        this.preStep.y = this.speed.y * dt;

        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;
    }
});

cc._RFpop();
},{}],"InitData":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3ae4cUsGcBIE4q7Ksp4ZX/H', 'InitData');
// cases/05_scripting/08_module/InitData.js


var _monsterInfo = {
    name: "Slime",
    hp: 100,
    lv: 1,
    atk: 10,
    defense: 5,
    imageUrl: "res/textures/monster-icon/PurpleMonster.png"
};

module.exports = {
    monsterInfo: _monsterInfo
};

cc._RFpop();
},{}],"Instruction":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6a871gy73FDLap3Eje/2h6i', 'Instruction');
// scripts/Global/Instruction.js

cc.Class({
    'extends': cc.Component,

    properties: {
        text: {
            'default': '',
            type: String,
            multiline: true
        }
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});
// called every frame
// update: function (dt) {

// },

cc._RFpop();
},{}],"Item":[function(require,module,exports){
"use strict";
cc._RFpush(module, '920c8a5MahAhbCTSvmQvaB+', 'Item');
// cases/02_ui/05_scrollView/Item.js

cc.Class({
    'extends': cc.Component,

    properties: {
        label: {
            'default': null,
            type: cc.Label
        },
        itemID: 0
    },

    updateItem: function updateItem(tmplId, itemId) {
        this.itemID = itemId;
        this.label.string = 'Tmpl#' + tmplId + ' Item#' + this.itemID;
    }
});

cc._RFpop();
},{}],"LayoutResizeContainerCtrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2bbedtV3blCVJbmf2E9h/0V', 'LayoutResizeContainerCtrl');
// cases/02_ui/06_layout/LayoutResizeContainerCtrl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        itemTemp: {
            "default": null,
            type: cc.Prefab
        },
        layoutHorizontalNum: 5,
        layoutHorizontal: {
            "default": null,
            type: cc.Node
        },
        layoutVerticalNum: 3,
        layoutVertical: {
            "default": null,
            type: cc.Node
        },
        gridLayoutAxisHorizontalNum: 10,
        gridLayoutAxisHorizontal: {
            "default": null,
            type: cc.Node
        },
        gridLayoutAxisVerticalNum: 12,
        gridLayoutAxisVertical: {
            "default": null,
            type: cc.Node
        }
    },

    onLoad: function onLoad() {
        this._curTime = 0;
        this._curIndex = 0;
    },

    _createItem: function _createItem(parentNode, idx) {
        var item = cc.instantiate(this.itemTemp);
        var label = item.getComponentInChildren(cc.Label);
        label.string = idx;
        item.parent = parentNode;
    },

    update: function update(dt) {
        this._curTime += dt;
        if (this._curTime >= 1) {
            this._curTime = 0;
            if (this._curIndex < this.layoutHorizontalNum) {
                this._createItem(this.layoutHorizontal, this._curIndex);
            }
            if (this._curIndex < this.layoutVerticalNum) {
                this._createItem(this.layoutVertical, this._curIndex);
            }
            if (this._curIndex < this.gridLayoutAxisHorizontalNum) {
                this._createItem(this.gridLayoutAxisHorizontal, this._curIndex);
            }
            if (this._curIndex < this.gridLayoutAxisVerticalNum) {
                this._createItem(this.gridLayoutAxisVertical, this._curIndex);
            }
            this._curIndex++;
        }
    }

});

cc._RFpop();
},{}],"ListItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'aa63bWNE8hBf4P4Sp0X2uT0', 'ListItem');
// scripts/Global/ListItem.js

cc.Class({
    'extends': cc.Component,

    properties: {
        label: {
            'default': null,
            type: cc.Label
        },
        url: ''
    },

    loadExample: function loadExample() {
        if (this.url) {
            cc.find('Menu').getComponent('Menu').loadScene(this.url);
        }
    }
});

cc._RFpop();
},{}],"ListView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e6458+hf5VAnIXocmvhggqC', 'ListView');
// cases/02_ui/05_scrollView/ListView.js

cc.Class({
    'extends': cc.Component,

    properties: {
        itemTemplate: { // item template to instantiate other items
            'default': null,
            type: cc.Node
        },
        scrollView: {
            'default': null,
            type: cc.ScrollView
        },
        spawnCount: 0, // how many items we actually spawn
        totalCount: 0, // how many items we need for the whole list
        spacing: 0, // space between each item
        bufferZone: 0 },

    // when item is away from bufferZone, we relocate it
    // use this for initialization
    onLoad: function onLoad() {
        this.content = this.scrollView.content;
        this.items = []; // array to store spawned items
        this.initialize();
        this.updateTimer = 0;
        this.updateInterval = 0.2;
        this.lastContentPosY = 0; // use this variable to detect if we are scrolling up or down
    },

    initialize: function initialize() {
        this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing; // get total content height
        for (var i = 0; i < this.spawnCount; ++i) {
            // spawn items, we only need to do this once
            var item = cc.instantiate(this.itemTemplate);
            this.content.addChild(item);
            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            item.getComponent('Item').updateItem(i, i);
            this.items.push(item);
        }
    },

    getPositionInView: function getPositionInView(item) {
        // get item position in scrollview's node space
        var worldPos = item.parent.convertToWorldSpaceAR(item.position);
        var viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    update: function update(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
        this.updateTimer = 0;
        var items = this.items;
        var buffer = this.bufferZone;
        var isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction
        var offset = (this.itemTemplate.height + this.spacing) * items.length;
        for (var i = 0; i < items.length; ++i) {
            var viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // if away from buffer zone and not reaching top of content
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    items[i].setPositionY(items[i].y + offset);
                    var item = items[i].getComponent('Item');
                    var itemId = item.itemID - items.length; // update item id
                    item.updateItem(i, itemId);
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    items[i].setPositionY(items[i].y - offset);
                    var item = items[i].getComponent('Item');
                    console.log('itemID: ' + item.itemID);
                    var itemId = item.itemID + items.length;
                    item.updateItem(i, itemId);
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.scrollView.content.y;
    }
});

cc._RFpop();
},{}],"LoadModuleCtrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9e702GubHpK+4vAb3yu2OW5', 'LoadModuleCtrl');
// cases/05_scripting/08_module/LoadModuleCtrl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        monsterTemp: {
            "default": null,
            type: cc.Prefab
        },
        btn_createMonster: {
            "default": null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.btn_createMonster.on(cc.Node.EventType.TOUCH_END, this.createMoster.bind(this));
    },

    createMoster: function createMoster() {
        var monster = cc.instantiate(this.monsterTemp);
        var Monster = require("Monster");
        var monsterComp = monster.getComponent(Monster);
        var InitData = require("InitData");
        monsterComp.initInfo(InitData.monsterInfo);
        monster.parent = this.node;
        monster.setPosition(cc.p(0, 0));
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{"InitData":"InitData","Monster":"Monster"}],"Menu":[function(require,module,exports){
"use strict";
cc._RFpush(module, '04525pyYBlN26SWawaUF3dA', 'Menu');
// scripts/Global/Menu.js


var emptyFunc = function emptyFunc(event) {
    event.stopPropagation();
};

cc.Class({
    'extends': cc.Component,

    properties: {
        text: {
            'default': null,
            type: cc.Label
        },
        readme: {
            'default': null,
            type: cc.Node
        },
        mask: {
            'default': null,
            type: cc.Node
        },
        btnInfo: {
            'default': null,
            type: cc.Button
        },
        btnBack: {
            'default': null,
            type: cc.Button
        }
    },

    onLoad: function onLoad() {
        cc.game.addPersistRootNode(this.node);
        this.currentSceneUrl = 'TestList.fire';
        this.contentPos = null;
        this.isMenu = true;
        this.loadInstruction(this.currentSceneUrl);
    },

    backToList: function backToList() {
        this.showReadme(false);
        this.currentSceneUrl = 'TestList.fire';
        this.isMenu = true;
        cc.director.loadScene('TestList', this.onLoadSceneFinish.bind(this));
    },

    loadScene: function loadScene(url) {
        this.contentPos = cc.find('Canvas/testList').getComponent(cc.ScrollView).getContentPosition();
        this.currentSceneUrl = url;
        this.isMenu = false;
        cc.director.loadScene(url, this.onLoadSceneFinish.bind(this));
    },

    onLoadSceneFinish: function onLoadSceneFinish() {
        var url = this.currentSceneUrl;
        this.loadInstruction(url);
        if (this.isMenu && this.contentPos) {
            cc.find('Canvas/testList').getComponent(cc.ScrollView).setContentPosition(this.contentPos);
        }
    },

    loadInstruction: function loadInstruction(url) {
        var self = this;
        var urlArr = url.split('/');
        var fileName = urlArr[urlArr.length - 1].replace('.fire', '.md');
        cc.loader.load(cc.url.raw("resources://readme/" + fileName), function (err, txt) {
            if (err) {
                self.text.string = '说明暂缺';
                return;
            }
            self.text.string = txt;
        });
    },

    showReadme: function showReadme(active) {
        if (active === undefined) {
            this.readme.active = !this.readme.active;
        } else {
            this.readme.active = active;
        }
        if (this.readme.active) {
            this.mask.on('touchstart', emptyFunc, this);
        } else {
            this.mask.off('touchstart', emptyFunc, this);
        }
        var labelTxt = this.readme.active ? '关闭说明' : '查看说明';
        cc.find('label', this.btnInfo.node).getComponent(cc.Label).string = labelTxt;
    }
});

cc._RFpop();
},{}],"MonsterPrefab":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8cb4dm2QEpJ7pnaS/cjrvgF', 'MonsterPrefab');
// cases/05_scripting/02_prefab/MonsterPrefab.js

var Helpers = require('Helpers');

cc.Class({
    'extends': cc.Component,

    properties: {
        spriteList: {
            'default': [],
            type: [cc.SpriteFrame]
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var randomIdx = Helpers.getRandomInt(0, this.spriteList.length);
        var sprite = this.getComponent(cc.Sprite);
        sprite.spriteFrame = this.spriteList[randomIdx];
    }

});

cc._RFpop();
},{"Helpers":"Helpers"}],"Monster":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e31b0+PoDRJXIDHFxy60vEs', 'Monster');
// cases/05_scripting/08_module/Monster.js

cc.Class({
    "extends": cc.Component,

    properties: {
        nickname: {
            "default": null,
            type: cc.Label
        },
        lv: {
            "default": null,
            type: cc.Label
        },
        hp: {
            "default": null,
            type: cc.Label
        },
        atk: {
            "default": null,
            type: cc.Label
        },
        defense: {
            "default": null,
            type: cc.Label
        },
        image: {
            "default": null,
            type: cc.Sprite
        }
    },

    initInfo: function initInfo(info) {
        this.nickname.string = info.name;
        this.lv.string = info.lv;
        this.hp.string = info.hp;
        this.atk.string = info.atk;
        this.defense.string = info.defense;

        this.image.spriteFrame = new cc.SpriteFrame(cc.url.raw(info.imageUrl));

        //cc.loader.load(, function (error, res) {
        //    console.log(res);
        //}.bind(this));
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"MouseEvent":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6df0ft1jy5Jg4cQ039jt8jC', 'MouseEvent');
// cases/05_scripting/03_events/MouseEvent.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    move: function move(event) {
        this.node.x += event.getDeltaX();
        this.node.y += event.getDeltaY();
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.scroll = 0;
        this.node.opacity = 50;
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function () {
            this.node.opacity = 255;
            this.node.on(cc.Node.EventType.MOUSE_MOVE, this.move, this);
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER, function () {
            this.node.opacity = 160;
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, function () {
            this.node.opacity = 50;
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_UP, function () {
            this.node.opacity = 50;
            this.node.off(cc.Node.EventType.MOUSE_MOVE, this.move, this);
            if (this._callback) {
                this._callback();
            }
        }, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, function (event) {
            this.scroll += event.getScrollY();
            var h = this.node.height;
            this.scroll = cc.clampf(this.scroll, -2 * h, 0.7 * h);
            this.node.scale = 1 - this.scroll / h;
        }, this);
    }
});

cc._RFpop();
},{}],"MoveAnimationCtrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1dc95dq3mVI658br0l2Zbi0', 'MoveAnimationCtrl');
// cases/03_gameplay/03_animation/MoveAnimationCtrl.js

cc.Class({
    "extends": cc.Component,

    properties: {
        target: {
            "default": null,
            type: cc.Animation
        },

        nodes: {
            "default": [],
            type: cc.Node
        }
    },

    onLoad: function onLoad() {
        this.onRegisteredEvent();
    },

    onRegisteredEvent: function onRegisteredEvent() {
        for (var i = 0; i < this.nodes.length; ++i) {
            this.nodes[i].on(cc.Node.EventType.TOUCH_END, this.onPlayAnimation.bind(this));
        }
    },

    onPlayAnimation: function onPlayAnimation(event) {
        this.target.stop();
        switch (event.target._name) {
            case "Linear":
                this.target.play("linear");
                break;
            case "CaseIn_Expo":
                this.target.play("caseIn-expo");
                break;
            case "CaseOut_Expo":
                this.target.play("caseOut-expo");
                break;
            case "CaseInOut_Expo":
                this.target.play("caseInOut-expo");
                break;
            case "Back_Forward":
                this.target.play("back-forward");
                break;
        }
    }

});

cc._RFpop();
},{}],"MyCustomComponent":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6b8baEpLuxACIMNlIL2vw2W', 'MyCustomComponent');
// cases/05_scripting/01_properties/MyCustomComponent.js

cc.Class({
    "extends": cc.Component,

    properties: {
        power: 10
    },

    getPower: function getPower() {
        return this.power;
    }
});

cc._RFpop();
},{}],"NodeGroupControl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bd4a2+britAlof0UdMCVB8c', 'NodeGroupControl');
// cases/05_scripting/01_properties/NodeGroupControl.js

cc.Class({
    'extends': cc.Component,

    properties: {
        nodeList: {
            'default': [],
            type: [cc.Node]
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        this.inervalId = setInterval(function () {
            self.toggleNodesVisibility();
        }, 1000);
    },

    onDestroy: function onDestroy() {
        clearInterval(this.inervalId);
    },

    toggleNodesVisibility: function toggleNodesVisibility() {
        console.log('toggle visibility');
        for (var i = 0; i < this.nodeList.length; ++i) {
            this.nodeList[i].active = !this.nodeList[i].active;
        }
    }
});

cc._RFpop();
},{}],"NonSerializedProperties":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd4114PgybhJ3L/k0N9TkCZI', 'NonSerializedProperties');
// cases/05_scripting/01_properties/NonSerializedProperties.js

cc.Class({
    'extends': cc.Component,

    properties: {
        mySerializedText: '',
        myNonSerializedText: {
            'default': '',
            visible: false
        },
        label1: {
            'default': null,
            type: cc.Label
        },
        label2: {
            'default': null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.myNonSerializedText = 'Can only set value in script';
        this.label1.string = this.mySerializedText;
        this.label2.string = this.myNonSerializedText;
    }
});

cc._RFpop();
},{}],"ParticleControl1":[function(require,module,exports){
"use strict";
cc._RFpush(module, '79ae3hiP+JAhIKehaWyiKuh', 'ParticleControl1');
// cases/01_graphics/02_particle/ParticleControl1.js

cc.Class({
    "extends": cc.Component,

    properties: {
        particle: {
            "default": null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        // use space to toggle particle
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                if (keyCode === cc.KEY.space) {
                    self.toggleParticlePlay();
                }
            }
        }, self);
    },

    toggleParticlePlay: function toggleParticlePlay() {
        var myParticle = this.particle.getComponent(cc.ParticleSystem);
        if (myParticle.isFull()) {
            // check if particle has fully plaed
            myParticle.stopSystem(); // stop particle system
        } else {
                myParticle.resetSystem(); // restart particle system
            }
    }
});

cc._RFpop();
},{}],"PopulatePrefab":[function(require,module,exports){
"use strict";
cc._RFpush(module, '75518I0ImJHXqWNNGRIOmJg', 'PopulatePrefab');
// cases/05_scripting/02_prefab/PopulatePrefab.js

cc.Class({
    "extends": cc.Component,

    properties: {
        prefab: {
            "default": null,
            type: cc.Prefab
        },
        canvas: {
            "default": null,
            type: cc.Canvas
        },
        numberToSpawn: 0,
        spawnInterval: 0
    },

    addSpawn: function addSpawn() {
        if (this.spawnCount >= this.numberToSpawn) {
            this.clearRepeater();
            return;
        }
        var monster = cc.instantiate(this.prefab);
        this.canvas.node.addChild(monster);
        monster.position = this.getRandomPosition();
        this.spawnCount++;
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        self.randomRange = cc.p(300, 200);
        self.spawnCount = 0;
        self.schedule(self.addSpawn, self.spawnInterval);
    },

    getRandomPosition: function getRandomPosition() {
        return cc.p(cc.randomMinus1To1() * this.randomRange.x, cc.randomMinus1To1() * this.randomRange.y);
    },

    clearRepeater: function clearRepeater() {
        this.unschedule(this.addSpawn);
    }
});

cc._RFpop();
},{}],"ProgressBar":[function(require,module,exports){
"use strict";
cc._RFpush(module, '84a43yb9OxBX6HMQxPzHQyz', 'ProgressBar');
// cases/02_ui/04_progressbar/ProgressBar.js

cc.Class({
    "extends": cc.Component,

    properties: {
        horizontalBar: {
            type: cc.ProgressBar,
            "default": null
        },
        horizontalBarReverse: {
            type: cc.ProgressBar,
            "default": null
        },
        verticalBar: {
            type: cc.ProgressBar,
            "default": null
        },
        verticalBarReverse: {
            type: cc.ProgressBar,
            "default": null
        }
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this._updateProgressBar(this.horizontalBar, dt);
        this._updateProgressBar(this.verticalBar, dt);
        this._updateProgressBar(this.horizontalBarReverse, dt);
        this._updateProgressBar(this.verticalBarReverse, dt);
    },

    _updateProgressBar: function _updateProgressBar(progressBar, dt) {
        var progress = progressBar.progress;
        if (progress < 1.0) {
            progress += dt;
        } else {
            progress = 0;
        }
        progressBar.progress = progress;
    }
});

cc._RFpop();
},{}],"Puzzle":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6289cZl6zJEcLVQd60JnAzW', 'Puzzle');
// cases/tiledmap/Puzzle.js


var MoveDirection = cc.Enum({
    NONE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
});

var minTilesCount = 2;
var mapMoveStep = 1;
var minMoveValue = 50;

cc.Class({
    'extends': cc.Component,
    editor: {
        requireComponent: cc.TiledMap
    },

    properties: {
        _touchStartPos: {
            'default': null,
            serializable: false
        },
        _touching: {
            'default': false,
            serializable: false
        },

        _isMapLoaded: {
            'default': false,
            serializable: false
        },

        floorLayerName: {
            'default': 'floor'
        },

        barrierLayerName: {
            'default': 'barrier'
        },

        objectGroupName: {
            'default': 'players'
        },

        startObjectName: {
            'default': 'SpawnPoint'
        },

        successObjectName: {
            'default': 'SuccessPoint'
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._player = this.node.getChildByName('player');
        if (!this._isMapLoaded) {
            this._player.active = false;
        }

        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                self._onKeyPressed(keyCode, event);
            }
        }, self);

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self._touching = true;
            self._touchStartPos = event.touch.getLocation();
        }, self);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (!self._touching) return;

            self._touching = false;
            var touchPos = event.touch.getLocation();
            var movedX = touchPos.x - self._touchStartPos.x;
            var movedY = touchPos.y - self._touchStartPos.y;
            var movedXValue = Math.abs(movedX);
            var movedYValue = Math.abs(movedY);
            if (movedXValue < minMoveValue && movedYValue < minMoveValue) {
                // touch moved not enough
                return;
            }

            var newTile = cc.p(this._curTile.x, this._curTile.y);
            var mapMoveDir = MoveDirection.NONE;
            if (movedXValue >= movedYValue) {
                // move to right or left
                if (movedX > 0) {
                    newTile.x += 1;
                    mapMoveDir = MoveDirection.LEFT;
                } else {
                    newTile.x -= 1;
                    mapMoveDir = MoveDirection.RIGHT;
                }
            } else {
                // move to up or down
                if (movedY > 0) {
                    newTile.y -= 1;
                    mapMoveDir = MoveDirection.UP;
                } else {
                    newTile.y += 1;
                    mapMoveDir = MoveDirection.DOWN;
                }
            }
            this._tryMoveToNewTile(newTile, mapMoveDir);
        }, self);
    },

    restartGame: function restartGame() {
        this._succeedLayer.active = false;
        this._initMapPos();
        this._curTile = this._startTile;
        this._updatePlayerPos();
    },

    start: function start(err) {
        if (err) return;

        // init the map position
        this._initMapPos();

        // init the succeed layer
        this._succeedLayer = this.node.getParent().getChildByName('succeedLayer');
        this._succeedLayer.active = false;

        // init the player position
        this._tiledMap = this.node.getComponent('cc.TiledMap');
        var objectGroup = this._tiledMap.getObjectGroup(this.objectGroupName);
        if (!objectGroup) return;

        var startObj = objectGroup.getObject(this.startObjectName);
        var endObj = objectGroup.getObject(this.successObjectName);
        if (!startObj || !endObj) return;

        var startPos = cc.p(startObj.x, startObj.y);
        var endPos = cc.p(endObj.x, endObj.y);

        this._layerFloor = this._tiledMap.getLayer(this.floorLayerName);
        this._layerBarrier = this._tiledMap.getLayer(this.barrierLayerName);
        if (!this._layerFloor || !this._layerBarrier) return;

        this._curTile = this._startTile = this._getTilePos(startPos);
        this._endTile = this._getTilePos(endPos);

        if (this._player) {
            this._updatePlayerPos();
            this._player.active = true;
        }

        this._isMapLoaded = true;
    },

    _initMapPos: function _initMapPos() {
        this.node.setPosition(cc.visibleRect.bottomLeft);
    },

    _updatePlayerPos: function _updatePlayerPos() {
        var pos = this._layerFloor.getPositionAt(this._curTile);
        this._player.setPosition(pos);
    },

    _getTilePos: function _getTilePos(posInPixel) {
        var mapSize = this.node.getContentSize();
        var tileSize = this._tiledMap.getTileSize();
        var x = Math.floor(posInPixel.x / tileSize.width);
        var y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);

        return cc.p(x, y);
    },

    _onKeyPressed: function _onKeyPressed(keyCode, event) {
        if (!this._isMapLoaded || this._succeedLayer.active) return;

        var newTile = cc.p(this._curTile.x, this._curTile.y);
        var mapMoveDir = MoveDirection.NONE;
        switch (keyCode) {
            case cc.KEY.up:
                newTile.y -= 1;
                mapMoveDir = MoveDirection.DOWN;
                break;
            case cc.KEY.down:
                newTile.y += 1;
                mapMoveDir = MoveDirection.UP;
                break;
            case cc.KEY.left:
                newTile.x -= 1;
                mapMoveDir = MoveDirection.RIGHT;
                break;
            case cc.KEY.right:
                newTile.x += 1;
                mapMoveDir = MoveDirection.LEFT;
                break;
            default:
                return;
        }

        this._tryMoveToNewTile(newTile, mapMoveDir);
    },

    _tryMoveToNewTile: function _tryMoveToNewTile(newTile, mapMoveDir) {
        var mapSize = this._tiledMap.getMapSize();
        if (newTile.x < 0 || newTile.x >= mapSize.width) return;
        if (newTile.y < 0 || newTile.y >= mapSize.height) return;

        if (this._layerBarrier.getTileGIDAt(newTile)) {
            cc.log('This way is blocked!');
            return false;
        }

        // update the player position
        this._curTile = newTile;
        this._updatePlayerPos();

        // move the map if necessary
        this._tryMoveMap(mapMoveDir);

        // check the player is success or not
        if (cc.pointEqualToPoint(this._curTile, this._endTile)) {
            cc.log('succeed');
            this._succeedLayer.active = true;
        }
    },

    _tryMoveMap: function _tryMoveMap(moveDir) {
        // get necessary data
        var mapContentSize = this.node.getContentSize();
        var mapPos = this.node.getPosition();
        var playerPos = this._player.getPosition();
        var viewSize = cc.size(cc.visibleRect.width, cc.visibleRect.height);
        var tileSize = this._tiledMap.getTileSize();
        var minDisX = minTilesCount * tileSize.width;
        var minDisY = minTilesCount * tileSize.height;

        var disX = playerPos.x + mapPos.x;
        var disY = playerPos.y + mapPos.y;
        var newPos;
        switch (moveDir) {
            case MoveDirection.UP:
                if (disY < minDisY) {
                    newPos = cc.p(mapPos.x, mapPos.y + tileSize.height * mapMoveStep);
                }
                break;
            case MoveDirection.DOWN:
                if (viewSize.height - disY - tileSize.height < minDisY) {
                    newPos = cc.p(mapPos.x, mapPos.y - tileSize.height * mapMoveStep);
                }
                break;
            case MoveDirection.LEFT:
                if (viewSize.width - disX - tileSize.width < minDisX) {
                    newPos = cc.p(mapPos.x - tileSize.width * mapMoveStep, mapPos.y);
                }
                break;
            case MoveDirection.RIGHT:
                if (disX < minDisX) {
                    newPos = cc.p(mapPos.x + tileSize.width * mapMoveStep, mapPos.y);
                }
                break;
            default:
                return;
        }

        if (newPos) {
            // calculate the position range of map
            var minX = viewSize.width - mapContentSize.width - cc.visibleRect.left;
            var maxX = cc.visibleRect.left.x;
            var minY = viewSize.height - mapContentSize.height - cc.visibleRect.bottom;
            var maxY = cc.visibleRect.bottom.y;

            if (newPos.x < minX) newPos.x = minX;
            if (newPos.x > maxX) newPos.x = maxX;
            if (newPos.y < minY) newPos.y = minY;
            if (newPos.y > maxY) newPos.y = maxY;

            if (!cc.pointEqualToPoint(newPos, mapPos)) {
                cc.log('Move the map to new position: ', newPos);
                this.node.setPosition(newPos);
            }
        }
    }
});

cc._RFpop();
},{}],"ReferenceTypeProperties":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9341f3fDdBMjJLKh4D+kJJK', 'ReferenceTypeProperties');
// cases/05_scripting/01_properties/ReferenceTypeProperties.js

var MyCustomComponent = require('MyCustomComponent');

cc.Class({
    'extends': cc.Component,

    properties: {
        myNode: {
            'default': null,
            type: cc.Node
        },
        mySprite: {
            'default': null,
            type: cc.Sprite
        },
        myLabel: {
            'default': null,
            type: cc.Label
        },
        myComponent: {
            'default': null,
            type: MyCustomComponent
        },
        mySpriteFrame: {
            'default': null,
            type: cc.SpriteFrame
        },
        myAtlas: {
            'default': null,
            type: cc.SpriteAtlas
        },
        myPrefab: {
            'default': null,
            type: cc.Prefab
        },
        myAudioClip: {
            'default': null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.myLabel.string = this.myComponent.getPower().toString();
    },

    // called every frame
    update: function update(dt) {}
});

cc._RFpop();
},{"MyCustomComponent":"MyCustomComponent"}],"SceneList":[function(require,module,exports){
"use strict";
cc._RFpush(module, '473b8wxs55OsJvoxVdYCzTF', 'SceneList');
// scripts/Global/SceneList.js

cc.Class({
    'extends': cc.Component,

    properties: {
        itemPrefab: {
            'default': null,
            type: cc.Prefab
        }
    },

    createItem: function createItem(x, y, name, url) {
        var item = cc.instantiate(this.itemPrefab);
        var itemComp = item.getComponent('ListItem');
        var label = itemComp.label;
        label.string = name;

        if (url) {
            itemComp.url = url;
        }

        // item.width = w;
        item.x = x;
        item.y = y;
        this.node.addChild(item);
        return item;
    },

    // use this for initialization
    onLoad: function onLoad() {
        var scenes = cc.game._sceneInfos;
        var list = {};
        if (scenes) {
            var i, j;
            for (i = 0; i < scenes.length; ++i) {
                var url = scenes[i].url;
                var dirname = cc.path.dirname(url).replace('db://assets/cases/', '');
                console.log(dirname);
                if (dirname === 'db://assets/resources/test assets') {
                    continue;
                }
                var scenename = cc.path.basename(url, '.fire');
                if (scenename === 'TestList') continue;

                if (!dirname) dirname = '_root';
                if (!list[dirname]) {
                    list[dirname] = {};
                }
                list[dirname][scenename] = url;
            }

            var dirs = Object.keys(list);
            dirs.sort();
            var y = -50;

            for (i = 0; i < dirs.length; ++i) {
                var dirname = dirs[i];
                var item = this.createItem(100, y, dirname);
                item.getComponent(cc.Widget).left = 60;
                item.getComponent(cc.Sprite).enabled = false;
                y -= 50;
                var scenenames = Object.keys(list[dirname]);
                scenenames.sort();
                for (j = 0; j < scenenames.length; ++j) {
                    var _name = scenenames[j];
                    var url = list[dirname][_name];
                    var _item = this.createItem(200, y, _name, url);
                    _item.getComponent(cc.Widget).left = 120;
                    _item.color = cc.Color.WHITE;
                    y -= 50;
                }
            }
            this.node.height = Math.abs(y) + 30;
        }
    }
});

cc._RFpop();
},{}],"SheepAnimation1":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ae6fcR8cuFGRYHW525VJD/k', 'SheepAnimation1');
// cases/03_gameplay/03_animation/SheepAnimation1.js

cc.Class({
    'extends': cc.Component,

    properties: {
        sheepAnim: {
            'default': null,
            type: cc.Animation
        }
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        var anim = this.sheepAnim;
        setTimeout(function () {
            anim.play('sheep_jump');
        }, 2000);
    },

    // called every frame
    update: function update(dt) {}
});

cc._RFpop();
},{}],"ShowCollider":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5a6dfRzhTBMp5U3il8DJmBZ', 'ShowCollider');
// cases/collider/ShowCollider.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {},

    onBtnClick: function onBtnClick(event) {
        var target = event.target;
        var shapeClassName = 'cc.' + target.name + 'Collider';
        var nodePath = 'Canvas/root/' + target.parent.name;
        var collider = cc.find(nodePath).getComponent(shapeClassName);
        collider.enabled = !collider.enabled;

        var label = target.getChildByName('Label').getComponent(cc.Label);
        if (collider.enabled) {
            label.string = label.string.replace('Show', 'Hide');
        } else {
            label.string = label.string.replace('Hide', 'Show');
        }
    }
});

cc._RFpop();
},{}],"SimpleAction":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b6067a1+J5FW4G30nmVLU/d', 'SimpleAction');
// cases/03_gameplay/02_actions/SimpleAction.js

cc.Class({
    "extends": cc.Component,

    properties: {
        jumper: {
            "default": null,
            type: cc.Node
        },
        colorNode: {
            "default": null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.squashAction = cc.scaleTo(0.2, 1, 0.6);
        this.stretchAction = cc.scaleTo(0.2, 1, 1.2);
        this.scaleBackAction = cc.scaleTo(0.1, 1, 1);
        this.moveUpAction = cc.moveBy(1, cc.p(0, 200)).easing(cc.easeCubicActionOut());
        this.moveDownAction = cc.moveBy(1, cc.p(0, -200)).easing(cc.easeCubicActionIn());
        var seq = cc.sequence(this.squashAction, this.stretchAction, this.moveUpAction, this.scaleBackAction, this.moveDownAction, this.squashAction, this.scaleBackAction);
        // this is a temp api which will be combined to cc.Node
        this.jumper.runAction(seq);

        this.colorNode.runAction(cc.sequence(cc.tintTo(2, 255, 0, 0), cc.delayTime(0.5), cc.fadeOut(1), cc.delayTime(0.5), cc.fadeIn(1), cc.delayTime(0.5), cc.tintTo(2, 255, 255, 255)).repeat(2));
    }
});

cc._RFpop();
},{}],"SimpleKeyboardMovement":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c3f971iyCdIh6xdaO49XP0F', 'SimpleKeyboardMovement');
// cases/03_gameplay/01_player_control/SimpleKeyboardMovement.js

cc.Class({
    'extends': cc.Component,

    properties: {
        sheep: {
            'default': null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;

        // set initial move direction
        self.turnRight();

        //add keyboard input listener to call turnLeft and turnRight
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        console.log('turn left');
                        self.turnLeft();
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        console.log('turn right');
                        self.turnRight();
                        break;
                }
            }
        }, self.node);
    },

    // called every frame
    update: function update(dt) {
        this.sheep.x += this.speed * dt;
    },

    turnLeft: function turnLeft() {
        this.speed = -100;
        this.sheep.scaleX = 1;
    },

    turnRight: function turnRight() {
        this.speed = 100;
        this.sheep.scaleX = -1;
    }
});

cc._RFpop();
},{}],"SimpleMotion":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fde33rWt81MvZWO7QQ3jv3j', 'SimpleMotion');
// cases/collider/SimpleMotion.js

cc.Class({
    "extends": cc.Component,

    properties: {
        moveSpeed: 100,
        rotationSpeed: 90
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this.node.x += dt * this.moveSpeed;
        this.node.rotation += dt * this.rotationSpeed;
    }
});

cc._RFpop();
},{}],"SpineCtrl":[function(require,module,exports){
"use strict";
cc._RFpush(module, '91115OWZ9hJkIXaqCNRUsZC', 'SpineCtrl');
// cases/spine/SpineCtrl.js

cc.Class({
    'extends': cc.Component,
    editor: {
        requireComponent: sp.Skeleton
    },

    properties: {
        mixTime: 0.2
    },

    onLoad: function onLoad() {
        var spine = this.spine = this.getComponent('sp.Skeleton');
        this._setMix('walk', 'run');
        this._setMix('run', 'jump');
        this._setMix('walk', 'jump');

        spine.setStartListener(function (track) {
            var entry = spine.getState().getCurrent(track);
            if (entry) {
                var animationName = entry.animation ? entry.animation.name : "";
                cc.log("[track %s] start: %s", track, animationName);
            }
        });
        spine.setEndListener(function (track) {
            cc.log("[track %s] end", track);
        });
        spine.setCompleteListener(function (track, loopCount) {
            cc.log("[track %s] complete: %s", track, loopCount);
        });
        spine.setEventListener(function (track, event) {
            cc.log("[track %s] event: %s, %s, %s, %s", track, event.data.name, event.intValue, event.floatValue, event.stringValue);
        });

        // var self = this;
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        //     onTouchesBegan () {
        //         self.toggleTimeScale();
        //     }
        // }, this.node);
    },

    // OPTIONS

    toggleDebugSlots: function toggleDebugSlots() {
        this.spine.debugSlots = !this.spine.debugSlots;
    },

    toggleDebugBones: function toggleDebugBones() {
        this.spine.debugBones = !this.spine.debugBones;
    },

    toggleTimeScale: function toggleTimeScale() {
        if (this.spine.timeScale === 1.0) {
            this.spine.timeScale = 0.3;
        } else {
            this.spine.timeScale = 1.0;
        }
    },

    // ANIMATIONS

    stop: function stop() {
        this.spine.clearTrack(0);
    },

    walk: function walk() {
        this.spine.addAnimation(0, 'walk', true, 0);
    },

    run: function run() {
        this.spine.addAnimation(0, 'run', true, 0);
    },

    jump: function jump() {
        var oldAnim = this.spine.animation;
        this.spine.setAnimation(0, 'jump', false);
        if (oldAnim) {
            this.spine.addAnimation(0, oldAnim === 'run' ? 'run' : 'walk', true, 0);
        }
    },

    shoot: function shoot() {
        this.spine.setAnimation(1, 'shoot', false);
    },

    //

    _setMix: function _setMix(anim1, anim2) {
        this.spine.setMix(anim1, anim2, this.mixTime);
        this.spine.setMix(anim2, anim1, this.mixTime);
    }
});

cc._RFpop();
},{}],"SpriteFollowTouch":[function(require,module,exports){
"use strict";
cc._RFpush(module, '90aed86Xu1DZoaevFdcthY3', 'SpriteFollowTouch');
// cases/03_gameplay/01_player_control/SpriteFollowTouch.js

cc.Class({
    'extends': cc.Component,

    properties: {
        touchLocationDisplay: {
            'default': null,
            type: cc.Label
        },
        follower: {
            'default': null,
            type: cc.Node
        },
        followSpeed: 0
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        self.moveToPos = cc.p(0, 0);
        self.isMoving = false;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function onTouchBegan(touch, event) {
                var touchLoc = touch.getLocation();
                self.isMoving = true;
                self.moveToPos = self.follower.parent.convertToNodeSpaceAR(touchLoc);
                return true; // don't capture event
            },
            onTouchMoved: function onTouchMoved(touch, event) {
                var touchLoc = touch.getLocation();
                self.touchLocationDisplay.string = 'touch (' + Math.floor(touchLoc.x) + ', ' + Math.floor(touchLoc.y) + ')';
                self.moveToPos = self.follower.parent.convertToNodeSpaceAR(touchLoc);
            },
            onTouchEnded: function onTouchEnded(touch, event) {
                self.isMoving = false; // when touch ended, stop moving
            }
        }, self.node);
    },

    // called every frame
    update: function update(dt) {
        if (!this.isMoving) return;
        var oldPos = this.follower.position;
        // get move direction
        var direction = cc.pNormalize(cc.pSub(this.moveToPos, oldPos));
        // multiply direction with distance to get new position
        var newPos = cc.pAdd(oldPos, cc.pMult(direction, this.followSpeed * dt));
        // set new position
        this.follower.setPosition(newPos);
    }
});

cc._RFpop();
},{}],"TiledSpriteControl":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e6941HLrIVFLokuMTS8HSUo', 'TiledSpriteControl');
// cases/01_graphics/01_sprite/TiledSpriteControl.js

cc.Class({
    "extends": cc.Component,

    properties: {

        speed: 100,

        progressBar: {
            "default": null,
            type: cc.Node
        },

        ground: {
            "default": null,
            type: cc.Node
        }
    },

    update: function update(dt) {
        if (this.progressBar.width < 500) {
            this.progressBar.width += dt * this.speed;
        }
        if (this.ground.width < 1000) {
            this.ground.width += dt * this.speed;
        }
    }

});

cc._RFpop();
},{}],"TouchDragger":[function(require,module,exports){
"use strict";
cc._RFpush(module, '95021X5KjxP369OONe316sH', 'TouchDragger');
// cases/05_scripting/03_events/TouchDragger.js

var TouchDragger = cc.Class({
    "extends": cc.Component,

    properties: {
        propagate: {
            "default": false
        }
    },

    // ...
    // use this for initialization
    onLoad: function onLoad() {
        this.node.opacity = 160;
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            this.opacity = 255;
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.opacity = 255;
            var delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
            if (this.getComponent(TouchDragger).propagate) event.stopPropagation();
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            this.opacity = 160;
        }, this.node);
    }
});

cc._RFpop();
},{}],"TouchEvent":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a14bfaD+gRJKrTVjKwitc53', 'TouchEvent');
// cases/05_scripting/03_events/TouchEvent.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    _callback: null,

    // use this for initialization
    onLoad: function onLoad() {
        this.node.opacity = 100;
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            this.node.opacity = 255;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            this.node.opacity = 100;
            if (this._callback) {
                this._callback();
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            this.node.opacity = 100;
        }, this);
    }
});

cc._RFpop();
},{}],"ValueTypeProperties":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd9bf6bFb+tF779stLEmjzTV', 'ValueTypeProperties');
// cases/05_scripting/01_properties/ValueTypeProperties.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // number
        myNumber: {
            'default': 0,
            type: Number
        },
        // string
        myString: {
            'default': 'default text',
            type: String
        },
        myVec2: {
            'default': cc.Vec2.ZERO,
            type: cc.Vec2
        },
        myColor: {
            'default': cc.Color.WHITE,
            type: cc.Color
        },
        myOtherNumber: 0,
        myOtherString: 'no type definition',
        myOtherVec2: cc.Vec2.ONE,
        myOtherColor: cc.Color.BLACK
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame
    update: function update(dt) {}
});

cc._RFpop();
},{}],"editbox":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dd654DFPoRNVKRWOuQdLiEE', 'editbox');
// cases/02_ui/07_editBox/editbox.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        singleLineText: {
            "default": null,
            type: cc.EditBox
        },

        singleLinePassword: {
            "default": null,
            type: cc.EditBox
        },

        multiLineText: {
            "default": null,
            type: cc.EditBox
        },

        showEditorBoxLabel: {
            "default": null,
            type: cc.Label
        }

    },

    // use this for initialization
    onLoad: function onLoad() {},

    singleLineEditBoxDidBeginEditing: function singleLineEditBoxDidBeginEditing(sender) {
        cc.log(sender.node.name + " single line editBoxDidBeginEditing");
    },

    singleLineEditBoxDidChanged: function singleLineEditBoxDidChanged(text, sender) {
        cc.log(sender.node.name + " single line editBoxDidChanged: " + text);
    },

    singleLineEditBoxDidEndEditing: function singleLineEditBoxDidEndEditing(sender) {
        cc.log(sender.node.name + " single line editBoxDidEndEditing: " + this.singleLineText.string);
    },

    singleLinePasswordEditBoxDidBeginEditing: function singleLinePasswordEditBoxDidBeginEditing(sender) {
        cc.log(sender.node.name + " single line password editBoxDidBeginEditing");
    },

    singleLinePasswordEditBoxDidChanged: function singleLinePasswordEditBoxDidChanged(text, sender) {
        cc.log(sender.node.name + " single line password editBoxDidChanged: " + text);
    },

    singleLinePasswordEditBoxDidEndEditing: function singleLinePasswordEditBoxDidEndEditing(sender) {
        cc.log(sender.node.name + " single line password editBoxDidEndEditing: " + this.singleLinePassword.string);
    },

    multiLinePasswordEditBoxDidBeginEditing: function multiLinePasswordEditBoxDidBeginEditing(sender) {
        cc.log(sender.node.name + " multi line editBoxDidBeginEditing");
    },

    multiLinePasswordEditBoxDidChanged: function multiLinePasswordEditBoxDidChanged(text, sender) {
        cc.log(sender.node.name + " multi line editBoxDidChanged: " + text);
    },

    multiLinePasswordEditBoxDidEndEditing: function multiLinePasswordEditBoxDidEndEditing(sender) {
        cc.log(sender.node.name + " multi line editBoxDidEndEditing: " + this.multiLineText.string);
    },
    buttonClicked: function buttonClicked() {
        cc.log("button Clicked!");
        if (this.singleLineText.string !== "") {
            this.showEditorBoxLabel.string = "Enter Text: " + this.singleLineText.string;
        } else {
            this.showEditorBoxLabel.string = "";
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"scheduleCallbacks":[function(require,module,exports){
"use strict";
cc._RFpush(module, '930deImxoZIkp6ugjMU5ULW', 'scheduleCallbacks');
// cases/05_scripting/04_scheduler/scheduleCallbacks.js

cc.Class({
    'extends': cc.Component,

    properties: {
        time: {
            'default': 5
        }
    },

    _callback: function _callback() {
        this.node.runAction(this.seq);
        if (this.repeat) {
            this.counting = true;
        } else {
            this.counting = false;
        }
        this.time = 5;
        this.counter.string = this.time.toFixed(2) + ' s';
    },

    // use this for initialization
    onLoad: function onLoad() {
        var squashAction = cc.scaleTo(0.2, 1, 0.6);
        var stretchAction = cc.scaleTo(0.2, 1, 1.2);
        var scaleBackAction = cc.scaleTo(0.1, 1, 1);
        var moveUpAction = cc.moveBy(1, cc.p(0, 100)).easing(cc.easeCubicActionOut());
        var moveDownAction = cc.moveBy(1, cc.p(0, -100)).easing(cc.easeCubicActionIn());
        this.seq = cc.sequence(squashAction, stretchAction, moveUpAction, scaleBackAction, moveDownAction, squashAction, scaleBackAction);

        this.counter = cc.find('Canvas/count_label').getComponent(cc.Label);
        this.counter.string = this.time.toFixed(2) + ' s';
        this.counting = false;
        this.repeat = false;
    },

    // called every frame
    update: function update(dt) {
        if (this.counting) {
            this.time -= dt;
            this.counter.string = this.time.toFixed(2) + ' s';
        }
    },

    stopCounting: function stopCounting() {
        this.unschedule(this._callback);
        this.counting = false;
        this.counter.string = '5.00 s';
        this.time = 5;
    },

    repeatSchedule: function repeatSchedule() {
        this.stopCounting();
        this.schedule(this._callback, 5);
        this.repeat = true;
        this.counting = true;
    },

    oneSchedule: function oneSchedule() {
        this.stopCounting();
        this.scheduleOnce(this._callback, 5);
        this.repeat = false;
        this.counting = true;
    },

    cancelSchedules: function cancelSchedules() {
        this.repeat = false;
        this.stopCounting();
    }
});

cc._RFpop();
},{}]},{},["Menu","ButtonInteractable","AnimationEvent","MoveAnimationCtrl","Foo","ActionCallback","LayoutResizeContainerCtrl","HeroControl","InitData","SceneList","AdaptiveSprite","FilledSpriteControl","ShowCollider","Puzzle","AssetLoading","Instruction","Category","MyCustomComponent","CustomEvent","MouseEvent","PopulatePrefab","ParticleControl1","ProgressBar","AudioControl","MonsterPrefab","SpineCtrl","Item","SpriteFollowTouch","scheduleCallbacks","ReferenceTypeProperties","TouchDragger","Bar","ColliderListner","LoadModuleCtrl","TouchEvent","ListItem","SheepAnimation1","SimpleAction","GoldBeatingAnime","NodeGroupControl","DestroySelf","SimpleKeyboardMovement","ComeBackToAssetLoad","NonSerializedProperties","Helpers","ValueTypeProperties","editbox","Monster","ListView","TiledSpriteControl","ButtonControl1","AnimateCustomPropertyCtrl","SimpleMotion"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NjL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjYXNlcy8wNV9zY3JpcHRpbmcvMDNfZXZlbnRzL0FjdGlvbkNhbGxiYWNrLmpzIiwic2NyaXB0cy9HbG9iYWwvQWRhcHRpdmVTcHJpdGUuanMiLCJjYXNlcy8wM19nYW1lcGxheS8wM19hbmltYXRpb24vQW5pbWF0ZUN1c3RvbVByb3BlcnR5Q3RybC5qcyIsImNhc2VzLzAzX2dhbWVwbGF5LzAzX2FuaW1hdGlvbi9BbmltYXRpb25FdmVudC5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wN19hc3NldF9sb2FkaW5nL0Fzc2V0TG9hZGluZy5qcyIsImNhc2VzLzA0X2F1ZGlvL0F1ZGlvQ29udHJvbC5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wNV9jcm9zc19yZWZlcmVuY2UvQmFyLmpzIiwiY2FzZXMvMDJfdWkvMDNfYnV0dG9uL0J1dHRvbkNvbnRyb2wxLmpzIiwiY2FzZXMvMDJfdWkvMDNfYnV0dG9uL0J1dHRvbkludGVyYWN0YWJsZS5qcyIsImNhc2VzL2NvbGxpZGVyL0NhdGVnb3J5LmpzIiwiY2FzZXMvY29sbGlkZXIvQ29sbGlkZXJMaXN0bmVyLmpzIiwiY2FzZXMvMDVfc2NyaXB0aW5nLzA3X2Fzc2V0X2xvYWRpbmcvQ29tZUJhY2tUb0Fzc2V0TG9hZC5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wM19ldmVudHMvQ3VzdG9tRXZlbnQuanMiLCJjYXNlcy8wNV9zY3JpcHRpbmcvMDZfbGlmZV9jeWNsZS9EZXN0cm95U2VsZi5qcyIsImNhc2VzLzAxX2dyYXBoaWNzLzAxX3Nwcml0ZS9GaWxsZWRTcHJpdGVDb250cm9sLmpzIiwiY2FzZXMvMDVfc2NyaXB0aW5nLzA1X2Nyb3NzX3JlZmVyZW5jZS9Gb28uanMiLCJjYXNlcy8wMl91aS8wMl9sYWJlbC9Hb2xkQmVhdGluZ0FuaW1lLmpzIiwic2NyaXB0cy9HbG9iYWwvSGVscGVycy5qcyIsImNhc2VzL2NvbGxpZGVyL0hlcm9Db250cm9sLmpzIiwiY2FzZXMvMDVfc2NyaXB0aW5nLzA4X21vZHVsZS9Jbml0RGF0YS5qcyIsInNjcmlwdHMvR2xvYmFsL0luc3RydWN0aW9uLmpzIiwiY2FzZXMvMDJfdWkvMDVfc2Nyb2xsVmlldy9JdGVtLmpzIiwiY2FzZXMvMDJfdWkvMDZfbGF5b3V0L0xheW91dFJlc2l6ZUNvbnRhaW5lckN0cmwuanMiLCJzY3JpcHRzL0dsb2JhbC9MaXN0SXRlbS5qcyIsImNhc2VzLzAyX3VpLzA1X3Njcm9sbFZpZXcvTGlzdFZpZXcuanMiLCJjYXNlcy8wNV9zY3JpcHRpbmcvMDhfbW9kdWxlL0xvYWRNb2R1bGVDdHJsLmpzIiwic2NyaXB0cy9HbG9iYWwvTWVudS5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wMl9wcmVmYWIvTW9uc3RlclByZWZhYi5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wOF9tb2R1bGUvTW9uc3Rlci5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wM19ldmVudHMvTW91c2VFdmVudC5qcyIsImNhc2VzLzAzX2dhbWVwbGF5LzAzX2FuaW1hdGlvbi9Nb3ZlQW5pbWF0aW9uQ3RybC5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wMV9wcm9wZXJ0aWVzL015Q3VzdG9tQ29tcG9uZW50LmpzIiwiY2FzZXMvMDVfc2NyaXB0aW5nLzAxX3Byb3BlcnRpZXMvTm9kZUdyb3VwQ29udHJvbC5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wMV9wcm9wZXJ0aWVzL05vblNlcmlhbGl6ZWRQcm9wZXJ0aWVzLmpzIiwiY2FzZXMvMDFfZ3JhcGhpY3MvMDJfcGFydGljbGUvUGFydGljbGVDb250cm9sMS5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wMl9wcmVmYWIvUG9wdWxhdGVQcmVmYWIuanMiLCJjYXNlcy8wMl91aS8wNF9wcm9ncmVzc2Jhci9Qcm9ncmVzc0Jhci5qcyIsImNhc2VzL3RpbGVkbWFwL1B1enpsZS5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wMV9wcm9wZXJ0aWVzL1JlZmVyZW5jZVR5cGVQcm9wZXJ0aWVzLmpzIiwic2NyaXB0cy9HbG9iYWwvU2NlbmVMaXN0LmpzIiwiY2FzZXMvMDNfZ2FtZXBsYXkvMDNfYW5pbWF0aW9uL1NoZWVwQW5pbWF0aW9uMS5qcyIsImNhc2VzL2NvbGxpZGVyL1Nob3dDb2xsaWRlci5qcyIsImNhc2VzLzAzX2dhbWVwbGF5LzAyX2FjdGlvbnMvU2ltcGxlQWN0aW9uLmpzIiwiY2FzZXMvMDNfZ2FtZXBsYXkvMDFfcGxheWVyX2NvbnRyb2wvU2ltcGxlS2V5Ym9hcmRNb3ZlbWVudC5qcyIsImNhc2VzL2NvbGxpZGVyL1NpbXBsZU1vdGlvbi5qcyIsImNhc2VzL3NwaW5lL1NwaW5lQ3RybC5qcyIsImNhc2VzLzAzX2dhbWVwbGF5LzAxX3BsYXllcl9jb250cm9sL1Nwcml0ZUZvbGxvd1RvdWNoLmpzIiwiY2FzZXMvMDFfZ3JhcGhpY3MvMDFfc3ByaXRlL1RpbGVkU3ByaXRlQ29udHJvbC5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wM19ldmVudHMvVG91Y2hEcmFnZ2VyLmpzIiwiY2FzZXMvMDVfc2NyaXB0aW5nLzAzX2V2ZW50cy9Ub3VjaEV2ZW50LmpzIiwiY2FzZXMvMDVfc2NyaXB0aW5nLzAxX3Byb3BlcnRpZXMvVmFsdWVUeXBlUHJvcGVydGllcy5qcyIsImNhc2VzLzAyX3VpLzA3X2VkaXRCb3gvZWRpdGJveC5qcyIsImNhc2VzLzA1X3NjcmlwdGluZy8wNF9zY2hlZHVsZXIvc2NoZWR1bGVDYWxsYmFja3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzI4ODFlNksxZWRMQmJndmMrNi9ZTjdvJywgJ0FjdGlvbkNhbGxiYWNrJyk7XG4vLyBjYXNlcy8wNV9zY3JpcHRpbmcvMDNfZXZlbnRzL0FjdGlvbkNhbGxiYWNrLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgdG91Y2hFdmVudCA9IHRoaXMuZ2V0Q29tcG9uZW50KCdUb3VjaEV2ZW50Jyk7XG4gICAgICAgIHZhciBtb3VzZUV2ZW50ID0gdGhpcy5nZXRDb21wb25lbnQoJ01vdXNlRXZlbnQnKTtcbiAgICAgICAgdmFyIGV2ZW50ID0gdG91Y2hFdmVudCB8fCBtb3VzZUV2ZW50O1xuICAgICAgICBldmVudC5fY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLnNjYWxlVG8oMC41LCAyLCAxKSwgY2Muc2NhbGVUbygwLjI1LCAxLCAxKSkpO1xuICAgICAgICB9O1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNGVkZjFKVEYvQkhJS1pWWTNGYUFxc1QnLCAnQWRhcHRpdmVTcHJpdGUnKTtcbi8vIHNjcmlwdHMvR2xvYmFsL0FkYXB0aXZlU3ByaXRlLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHBhZGRpbmc6IDIwLFxuXG4gICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcblxuICAgICAgICBiYWNrZ3JvdXA6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmJhY2tncm91cC53aWR0aCAhPT0gdGhpcy5sYWJlbC53aWR0aCkge1xuICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdXAud2lkdGggPSB0aGlzLmxhYmVsLndpZHRoICsgdGhpcy5wYWRkaW5nO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmJhY2tncm91cC5oZWlnaHQgIT09IHRoaXMubGFiZWwuaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tncm91cC5oZWlnaHQgPSB0aGlzLmxhYmVsLmhlaWdodCArIHRoaXMucGFkZGluZztcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmYjE0Y21uN0tKSkNvNHFWY095L0dtUycsICdBbmltYXRlQ3VzdG9tUHJvcGVydHlDdHJsJyk7XG4vLyBjYXNlcy8wM19nYW1lcGxheS8wM19hbmltYXRpb24vQW5pbWF0ZUN1c3RvbVByb3BlcnR5Q3RybC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaHA6IDAsXG4gICAgICAgIGVtaXNzaW9uUm90ZTogMCxcbiAgICAgICAgbnVtOiAwLFxuICAgICAgICBocEJhcjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Qcm9ncmVzc0JhclxuICAgICAgICB9LFxuICAgICAgICBwYXJ0aWNsZToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QYXJ0aWNsZVN5c3RlbVxuICAgICAgICB9LFxuICAgICAgICBzY29yZToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIHRoaXMuaHBCYXIucHJvZ3Jlc3MgPSB0aGlzLmhwO1xuICAgICAgICB0aGlzLnBhcnRpY2xlLmVtaXNzaW9uUmF0ZSA9IHRoaXMuZW1pc3Npb25Sb3RlO1xuICAgICAgICB0aGlzLnNjb3JlLnN0cmluZyA9IE1hdGguY2VpbCh0aGlzLm51bSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxZGMwOVNSNFRkTFU3NFJqR0JBcmxtMCcsICdBbmltYXRpb25FdmVudCcpO1xuLy8gY2FzZXMvMDNfZ2FtZXBsYXkvMDNfYW5pbWF0aW9uL0FuaW1hdGlvbkV2ZW50LmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge30sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBjYy5maW5kKCdDYW52YXMvTmV3IExhYmVsJyk7XG4gICAgICAgIHRoaXMuX2xhYmVsID0gbm9kZS5nZXRDb21wb25lbnQoY2MuTGFiZWwpO1xuICAgICAgICB0aGlzLl9hbmltQ3RybCA9IHRoaXMubm9kZS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICB9LFxuXG4gICAgb25OZXh0QW5pbWF0aW9uOiBmdW5jdGlvbiBvbk5leHRBbmltYXRpb24oc3RlcCkge1xuICAgICAgICB0aGlzLl9hbmltQ3RybC5wbGF5KFwic3RlcF9cIiArIHN0ZXApO1xuICAgICAgICB0aGlzLl9sYWJlbC5zdHJpbmcgPSBcIuW8gOWni+esrFwiICsgc3RlcCArIFwi5Liq5Yqo55S7XCI7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2NWFhNmN6S0h0S0dab2creWpLMWJjNicsICdBc3NldExvYWRpbmcnKTtcbi8vIGNhc2VzLzA1X3NjcmlwdGluZy8wN19hc3NldF9sb2FkaW5nL0Fzc2V0TG9hZGluZy5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc2hvd1dpbmRvdzoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZEFuaW1UZXN0UHJlZmFiOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuXG4gICAgICAgIGxvYWRUaXBzOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZExpc3Q6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy8gY3VyIGxvYWQgVGFyZ2V0XG4gICAgICAgIHRoaXMuX2N1clR5cGUgPSBcIlwiO1xuICAgICAgICB0aGlzLl9sYXN0VHlwZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuX2N1clJlcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2N1ck5vZGUgPSBudWxsO1xuICAgICAgICB0aGlzLl9jdXJMYWJlbCA9IG51bGw7XG4gICAgICAgIC8vIGFkZCBsb2FkIHJlcyB1cmxcbiAgICAgICAgdGhpcy5fdXJscyA9IHtcbiAgICAgICAgICAgIC8vIFJhdyBBc3NldCwgbmVlZCBleHRlbnNpb25cbiAgICAgICAgICAgIEF1ZGlvOiBjYy51cmwucmF3KFwicmVzb3VyY2VzL3Rlc3QgYXNzZXRzL2F1ZGlvLm1wM1wiKSxcbiAgICAgICAgICAgIFR4dDogY2MudXJsLnJhdyhcInJlc291cmNlcy90ZXN0IGFzc2V0cy90ZXh0LnR4dFwiKSxcbiAgICAgICAgICAgIEZvbnQ6IGNjLnVybC5yYXcoXCJyZXNvdXJjZXMvdGVzdCBhc3NldHMvZm9udC5mbnRcIiksXG4gICAgICAgICAgICBQbGlzdDogY2MudXJsLnJhdyhcInJlc291cmNlcy90ZXN0IGFzc2V0cy9hdG9tLnBsaXN0XCIpLFxuICAgICAgICAgICAgVGV4dHVyZTogY2MudXJsLnJhdyhcInJlc291cmNlcy90ZXN0IGFzc2V0cy9pbWFnZS5wbmdcIiksXG4gICAgICAgICAgICAvLyBBc3NldCwgbm8gZXh0ZW5zaW9uXG4gICAgICAgICAgICBTcHJpdGVGcmFtZTogXCJyZXNvdXJjZXM6Ly90ZXN0IGFzc2V0cy9pbWFnZS5wbmcvaW1hZ2VcIixcbiAgICAgICAgICAgIFByZWZhYjogXCJyZXNvdXJjZXM6Ly90ZXN0IGFzc2V0cy9wcmVmYWJcIixcbiAgICAgICAgICAgIEFuaW1hdGlvbjogXCJyZXNvdXJjZXM6Ly90ZXN0IGFzc2V0cy9hbmltXCIsXG4gICAgICAgICAgICBTY2VuZTogXCJyZXNvdXJjZXM6Ly90ZXN0IGFzc2V0cy9zY2VuZVwiXG4gICAgICAgIH07XG4gICAgICAgIC8vIHJlZ2lzdGVyZWQgZXZlbnRcbiAgICAgICAgdGhpcy5vblJlZ2lzdGVyZWRFdmVudCgpO1xuICAgIH0sXG5cbiAgICBsb2FkQ2FsbEJhY2s6IGZ1bmN0aW9uIGxvYWRDYWxsQmFjayhlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jdXJSZXMgPSByZXM7XG5cbiAgICAgICAgaWYgKHRoaXMuX2N1clR5cGUgPT09IFwiQXVkaW9cIikge1xuICAgICAgICAgICAgdGhpcy5fY3VyTGFiZWwuc3RyaW5nID0gXCJQbGF5IFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fY3VyTGFiZWwuc3RyaW5nID0gXCJDcmVhdGUgXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3VyTGFiZWwuc3RyaW5nICs9IHRoaXMuX2N1clR5cGU7XG5cbiAgICAgICAgdGhpcy5sb2FkVGlwcy5zdHJpbmcgPSB0aGlzLl9jdXJUeXBlICsgXCIgTG9hZGVkIFN1Y2Nlc3NmdWxseSAhXCI7XG4gICAgfSxcblxuICAgIG9uUmVnaXN0ZXJlZEV2ZW50OiBmdW5jdGlvbiBvblJlZ2lzdGVyZWRFdmVudCgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxvYWRMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRMaXN0W2ldLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5vbkxvYWRSZXNDbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkNsZWFyOiBmdW5jdGlvbiBvbkNsZWFyKCkge1xuICAgICAgICBpZiAodGhpcy5fY3VyTm9kZSkge1xuICAgICAgICAgICAgdGhpcy5fY3VyTm9kZS5kZXN0cm95KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY2MuQXVkaW8gJiYgdGhpcy5fY3VyUmVzIGluc3RhbmNlb2YgY2MuQXVkaW8pIHtcbiAgICAgICAgICAgIHRoaXMuX2N1clJlcy5zdG9wKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkUmVzQ2xpY2s6IGZ1bmN0aW9uIG9uTG9hZFJlc0NsaWNrKGV2ZW50KSB7XG4gICAgICAgIHRoaXMub25DbGVhcigpO1xuXG4gICAgICAgIHRoaXMuX2xhc3RUeXBlID0gdGhpcy5fY3VyVHlwZTtcbiAgICAgICAgdGhpcy5fY3VyVHlwZSA9IGV2ZW50LnRhcmdldC5uYW1lLnNwbGl0KCdfJylbMV07XG5cbiAgICAgICAgaWYgKHRoaXMuX2xhc3RUeXBlICE9PSBcIlwiICYmIHRoaXMuX2N1clR5cGUgPT09IHRoaXMuX2xhc3RUeXBlKSB7XG4gICAgICAgICAgICB0aGlzLm9uU2hvd1Jlc0NsaWNrKGV2ZW50KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jdXJMYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5fY3VyTGFiZWwuc3RyaW5nID0gXCJMb2FkZWQgXCIgKyB0aGlzLl9sYXN0VHlwZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2N1ckxhYmVsID0gZXZlbnQudGFyZ2V0LmdldENoaWxkQnlOYW1lKFwiTGFiZWxcIikuZ2V0Q29tcG9uZW50KFwiY2MuTGFiZWxcIik7XG5cbiAgICAgICAgdGhpcy5sb2FkVGlwcy5zdHJpbmcgPSB0aGlzLl9jdXJUeXBlICsgXCIgTG9hZGluZy4uLi5cIjtcbiAgICAgICAgY2MubG9hZGVyLmxvYWQodGhpcy5fdXJsc1t0aGlzLl9jdXJUeXBlXSwgdGhpcy5sb2FkQ2FsbEJhY2suYmluZCh0aGlzKSk7XG4gICAgfSxcblxuICAgIG9uU2hvd1Jlc0NsaWNrOiBmdW5jdGlvbiBvblNob3dSZXNDbGljayhldmVudCkge1xuICAgICAgICBpZiAodGhpcy5fY3VyVHlwZSA9PT0gXCJTY2VuZVwiKSB7XG4gICAgICAgICAgICBjYy5sb2FkZXIucmVsZWFzZSh0aGlzLl91cmxzLlNjZW5lLnNyYyk7XG4gICAgICAgICAgICBjYy5kaXJlY3Rvci5ydW5TY2VuZSh0aGlzLl9jdXJSZXMuc2NlbmUpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2N1clR5cGUgPT09IFwiQXVkaW9cIikge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2N1clJlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1clJlcy5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkVGlwcy5zdHJpbmcgPSBcIk9wZW4gc291bmQgbXVzaWMhIVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRUaXBzLnN0cmluZyA9IFwiRmFpbGVkIHRvIG9wZW4gYXVkaW8hXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVOb2RlKHRoaXMuX2N1clR5cGUsIHRoaXMuX2N1clJlcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2NyZWF0ZU5vZGU6IGZ1bmN0aW9uIF9jcmVhdGVOb2RlKHR5cGUsIHJlcykge1xuICAgICAgICB0aGlzLmxvYWRUaXBzLnN0cmluZyA9IFwiXCI7XG4gICAgICAgIHZhciBub2RlID0gbmV3IGNjLk5vZGUoXCJOZXcgXCIgKyB0eXBlKTtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSB0aGlzLnNob3dXaW5kb3c7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBudWxsO1xuICAgICAgICBzd2l0Y2ggKHRoaXMuX2N1clR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJUZXh0dXJlXCI6XG4gICAgICAgICAgICAgICAgY29tcG9uZW50ID0gbm9kZS5hZGRDb21wb25lbnQoY2MuU3ByaXRlKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc3ByaXRlRnJhbWUgPSBuZXcgY2MuU3ByaXRlRnJhbWUocmVzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJTcHJpdGVGcmFtZVwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnNwcml0ZUZyYW1lID0gcmVzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIlR4dFwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQubGluZUhlaWdodCA9IDQwO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdHJpbmcgPSByZXM7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiRm9udFwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLkxhYmVsKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuZmlsZSA9IHRoaXMuX3VybHMuRm9udDtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQubGluZUhlaWdodCA9IDQwO1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5zdHJpbmcgPSBcIlRoaXMgaXMgRm9udCFcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJQbGlzdFwiOlxuICAgICAgICAgICAgICAgIGNvbXBvbmVudCA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlBhcnRpY2xlU3lzdGVtKTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuZmlsZSA9IHRoaXMuX3VybHMuUGxpc3Q7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnJlc2V0U3lzdGVtKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiUHJlZmFiXCI6XG4gICAgICAgICAgICAgICAgdmFyIHByZWZhYiA9IGNjLmluc3RhbnRpYXRlKHJlcyk7XG4gICAgICAgICAgICAgICAgcHJlZmFiLnBhcmVudCA9IG5vZGU7XG4gICAgICAgICAgICAgICAgcHJlZmFiLnNldFBvc2l0aW9uKDAsIDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkFuaW1hdGlvblwiOlxuICAgICAgICAgICAgICAgIHZhciBsb2FkQW5pbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMubG9hZEFuaW1UZXN0UHJlZmFiKTtcbiAgICAgICAgICAgICAgICBsb2FkQW5pbS5wYXJlbnQgPSBub2RlO1xuICAgICAgICAgICAgICAgIGxvYWRBbmltLnNldFBvc2l0aW9uKDAsIDApO1xuICAgICAgICAgICAgICAgIHZhciBBYW5pbUN0cmwgPSBsb2FkQW5pbS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgICAgICBBYW5pbUN0cmwuYWRkQ2xpcChyZXMpO1xuICAgICAgICAgICAgICAgIEFhbmltQ3RybC5wbGF5KHJlcy5uYW1lKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICB9XG4gICAgICAgIG5vZGUuc2V0UG9zaXRpb24oMCwgMCk7XG4gICAgICAgIHRoaXMuX2N1ck5vZGUgPSBub2RlO1xuICAgIH0sXG5cbiAgICBsb2FkU3ByaXRlQW5pbWF0aW9uOiBmdW5jdGlvbiBsb2FkU3ByaXRlQW5pbWF0aW9uKCkge1xuICAgICAgICB2YXIgcGxpc3RVcmwgPSAncmVzb3VyY2VzOi8vdGVzdCBhc3NldHMvYXRsYXMucG5nJztcbiAgICAgICAgdmFyIHBuZ1VybCA9ICdyZXNvdXJjZXM6Ly90ZXN0IGFzc2V0cy9hdGxhcy5wbGlzdCc7XG4gICAgICAgIHZhciBhbmltVXJsID0gJ3Jlc291cmNlczovL3Rlc3QgYXNzZXRzL3Nwcml0ZS1hbmltJztcbiAgICAgICAgY2MubG9hZGVyLmxvYWQoW3BsaXN0VXJsLCBwbmdVcmxdLCAoZnVuY3Rpb24gKGVycnMsIHJlc3VsdHMpIHtcbiAgICAgICAgICAgIGNjLmxvYWRlci5sb2FkKGFuaW1VcmwsIChmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnRXJyb3IgdXJsIFsnICsgZXJyICsgJ10nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkVGlwcy5zdHJpbmcgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHZhciBsb2FkQW5pbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMubG9hZEFuaW1UZXN0UHJlZmFiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dXaW5kb3cuYWRkQ2hpbGQobG9hZEFuaW0pO1xuICAgICAgICAgICAgICAgIGxvYWRBbmltLnNldFBvc2l0aW9uKDAsIDApO1xuICAgICAgICAgICAgICAgIHZhciBBYW5pbUN0cmwgPSBsb2FkQW5pbS5nZXRDb21wb25lbnQoY2MuQW5pbWF0aW9uKTtcbiAgICAgICAgICAgICAgICBBYW5pbUN0cmwuYWRkQ2xpcChyZXMpO1xuICAgICAgICAgICAgICAgIEFhbmltQ3RybC5wbGF5KHJlcy5uYW1lKTtcbiAgICAgICAgICAgIH0pLmJpbmQodGhpcykpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzhjOTViVDJNM2hCUElkUkRWZnRpVVFHJywgJ0F1ZGlvQ29udHJvbCcpO1xuLy8gY2FzZXMvMDRfYXVkaW8vQXVkaW9Db250cm9sLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBtdXNpY1BsYXllcjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BdWRpb1NvdXJjZVxuICAgICAgICB9LFxuICAgICAgICBkaW5nQ2xpcDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICBjaGVlcmluZ0NsaXA6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBwbGF5IGF1ZGlvU291cmNlXG4gICAgICAgIHNlbGYubXVzaWNQbGF5ZXIucGxheSgpO1xuXG4gICAgICAgIC8vIHBsYXkgZGluZyBpbiAxIHNlYywgcGxheSBjaGVlcmluZyBpbiAyIHNlY1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3Qoc2VsZi5kaW5nQ2xpcCwgZmFsc2UpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdChzZWxmLmNoZWVyaW5nQ2xpcCwgZmFsc2UpO1xuICAgICAgICAgICAgfSwgMjAwMCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWVcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge31cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOTkwZTJjLzFWbEU5cG13ZCtGdHNlYXUnLCAnQmFyJyk7XG4vLyBjYXNlcy8wNV9zY3JpcHRpbmcvMDVfY3Jvc3NfcmVmZXJlbmNlL0Jhci5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiBmdW5jdGlvbiBwcm9wZXJ0aWVzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVmVG9Gb286IHJlcXVpcmUoJ0ZvbycpXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgdGlwID0gdGhpcy5ub2RlLmNoaWxkcmVuWzBdLmdldENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgICAgIHRpcC5zdHJpbmcgPSB0aGlzLm5hbWUgKyAnIGhhcyByZWZlcmVuY2UgdG8gJyArIHRoaXMucmVmVG9Gb28ubmFtZTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2U2ZGM3ZFdjeHhKdW9mWEI3ZXJnR25DJywgJ0J1dHRvbkNvbnRyb2wxJyk7XG4vLyBjYXNlcy8wMl91aS8wM19idXR0b24vQnV0dG9uQ29udHJvbDEuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBidXR0b25MZWZ0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgYnV0dG9uUmlnaHQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9LFxuICAgICAgICBkaXNwbGF5OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICAvLyBZb3UgY2FuIGFsc28gcmVnaXN0ZXIgZXZlbnQgbGlzdGVuZXIgdXNpbmcgdGhlIG1ldGhvZCBiZWxvd1xuICAgICAgICAvLyB0aGlzLmJ1dHRvbkxlZnQuZ2V0Q29tcG9uZW50KGNjLkJ1dHRvbikub24oY2MuRUJ1dHRvbi5FVkVOVF9UT1VDSF9VUCwgdGhpcy5vbkJ0bkxlZnRDbGlja2VkLCB0aGlzKTtcbiAgICAgICAgLy8gdGhpcy5idXR0b25SaWdodC5nZXRDb21wb25lbnQoY2MuQnV0dG9uKS5vbihjYy5FQnV0dG9uLkVWRU5UX1RPVUNIX1VQLCB0aGlzLm9uQnRuUmlnaHRDbGlja2VkLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgb25CdG5MZWZ0Q2xpY2tlZDogZnVuY3Rpb24gb25CdG5MZWZ0Q2xpY2tlZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0xlZnQgYnV0dG9uIGNsaWNrZWQhJyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdHJpbmcgPSAnTGVmdCBidXR0b24gY2xpY2tlZCEnO1xuICAgIH0sXG5cbiAgICBvbkJ0blJpZ2h0Q2xpY2tlZDogZnVuY3Rpb24gb25CdG5SaWdodENsaWNrZWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdSaWdodCBidXR0b24gY2xpY2tlZCEnKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnN0cmluZyA9ICdSaWdodCBidXR0b24gY2xpY2tlZCEnO1xuICAgIH0sXG5cbiAgICBvbkJ0bkluU2Nyb2xsQ2xpY2tlZDogZnVuY3Rpb24gb25CdG5JblNjcm9sbENsaWNrZWQoc2VuZGVyLCBldmVudCkge1xuICAgICAgICB2YXIgbXNnID0gc2VuZGVyLm5vZGUubmFtZSArICcgY2xpY2tlZCEnO1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc3RyaW5nID0gbXNnO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMThlNjBUMk5acEV3WkF1blMrMnJGTUsnLCAnQnV0dG9uSW50ZXJhY3RhYmxlJyk7XG4vLyBjYXNlcy8wMl91aS8wM19idXR0b24vQnV0dG9uSW50ZXJhY3RhYmxlLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgYnV0dG9uTGVmdDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIGJ1dHRvblJpZ2h0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b25cbiAgICAgICAgfSxcbiAgICAgICAgbGFiZWxMZWZ0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBsYWJlbFJpZ2h0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uQnRuTGVmdENsaWNrZWQ6IGZ1bmN0aW9uIG9uQnRuTGVmdENsaWNrZWQoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMZWZ0IGJ1dHRvbiBjbGlja2VkIScpO1xuICAgICAgICB0aGlzLmJ1dHRvbkxlZnQuaW50ZXJhY3RhYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYnV0dG9uUmlnaHQuaW50ZXJhY3RhYmxlID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUluZm8oKTtcbiAgICB9LFxuXG4gICAgb25CdG5SaWdodENsaWNrZWQ6IGZ1bmN0aW9uIG9uQnRuUmlnaHRDbGlja2VkKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnUmlnaHQgYnV0dG9uIGNsaWNrZWQhJyk7XG4gICAgICAgIHRoaXMuYnV0dG9uUmlnaHQuaW50ZXJhY3RhYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYnV0dG9uTGVmdC5pbnRlcmFjdGFibGUgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMudXBkYXRlSW5mbygpO1xuICAgIH0sXG5cbiAgICB1cGRhdGVJbmZvOiBmdW5jdGlvbiB1cGRhdGVJbmZvKCkge1xuICAgICAgICB0aGlzLmxhYmVsTGVmdC5zdHJpbmcgPSAnaW50ZXJhY3RhYmxlOiAnICsgdGhpcy5idXR0b25MZWZ0LmludGVyYWN0YWJsZTtcbiAgICAgICAgdGhpcy5sYWJlbFJpZ2h0LnN0cmluZyA9ICdpbnRlcmFjdGFibGU6ICcgKyB0aGlzLmJ1dHRvblJpZ2h0LmludGVyYWN0YWJsZTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzZiMDA2S1J5T1pFSmFOZGc3TXNaQnFJJywgJ0NhdGVnb3J5Jyk7XG4vLyBjYXNlcy9jb2xsaWRlci9DYXRlZ29yeS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRhcmdldDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQm94Q29sbGlkZXJcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBzdGFydDogZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICAgIGlmICghdGhpcy50YXJnZXQpIHJldHVybjtcblxuICAgICAgICB2YXIgbGFiZWwgPSB0aGlzLmdldENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgICAgIGxhYmVsLnN0cmluZyA9ICdDYXRlZ29yeTogJyArIHRoaXMudGFyZ2V0LmNhdGVnb3J5ICsgJ1xcbicgKyAnTWFzazogJyArIHRoaXMudGFyZ2V0Lm1hc2s7XG4gICAgfVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4vLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4vLyB9LFxuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOWQ2MGZYeHRYRk5lSTc5UE02RVhZdVonLCAnQ29sbGlkZXJMaXN0bmVyJyk7XG4vLyBjYXNlcy9jb2xsaWRlci9Db2xsaWRlckxpc3RuZXIuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCkuZW5hYmxlZERlYnVnRHJhdyA9IHRydWU7XG4gICAgICAgIC8vIGNjLmRpcmVjdG9yLmdldENvbGxpc2lvbk1hbmFnZXIoKS5lbmFibGVkRHJhd0JvdW5kaW5nQm94ID0gdHJ1ZTtcblxuICAgICAgICBjYy5kaXJlY3Rvci5zZXREaXNwbGF5U3RhdHModHJ1ZSk7XG4gICAgICAgIHRoaXMudG91Y2hpbmdOdW1iZXIgPSAwO1xuICAgIH0sXG5cbiAgICBvbkNvbGxpc2lvbkVudGVyOiBmdW5jdGlvbiBvbkNvbGxpc2lvbkVudGVyKG90aGVyKSB7XG4gICAgICAgIHRoaXMubm9kZS5jb2xvciA9IGNjLkNvbG9yLlJFRDtcbiAgICAgICAgdGhpcy50b3VjaGluZ051bWJlcisrO1xuICAgIH0sXG5cbiAgICBvbkNvbGxpc2lvblN0YXk6IGZ1bmN0aW9uIG9uQ29sbGlzaW9uU3RheShvdGhlcikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnb24gY29sbGlzaW9uIHN0YXknKTtcbiAgICB9LFxuXG4gICAgb25Db2xsaXNpb25FeGl0OiBmdW5jdGlvbiBvbkNvbGxpc2lvbkV4aXQoKSB7XG4gICAgICAgIHRoaXMudG91Y2hpbmdOdW1iZXItLTtcbiAgICAgICAgaWYgKHRoaXMudG91Y2hpbmdOdW1iZXIgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5jb2xvciA9IGNjLkNvbG9yLldISVRFO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnY2I1ODVrK2N4Rktqb2hsb1ROMStGdVUnLCAnQ29tZUJhY2tUb0Fzc2V0TG9hZCcpO1xuLy8gY2FzZXMvMDVfc2NyaXB0aW5nLzA3X2Fzc2V0X2xvYWRpbmcvQ29tZUJhY2tUb0Fzc2V0TG9hZC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBvbkNvbWVCbGFjazogZnVuY3Rpb24gb25Db21lQmxhY2soKSB7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZShcImFzc2V0X2xvYWRpbmcuZmlyZVwiKTtcbiAgICB9XG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc1Y2MyM2FvWWN4SUthelJGd0tXR0VJNycsICdDdXN0b21FdmVudCcpO1xuLy8gY2FzZXMvMDVfc2NyaXB0aW5nLzAzX2V2ZW50cy9DdXN0b21FdmVudC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHRvdWNoRXZlbnQgPSB0aGlzLmdldENvbXBvbmVudCgnVG91Y2hFdmVudCcpO1xuXG4gICAgICAgIC8vIEVtaXQgQ1VTVE9NX0VWRU5UIHRvIGl0cyBsaXN0ZW5lcnMgd2hpbGUgdG91Y2ggZW5kXG4gICAgICAgIHRvdWNoRXZlbnQuX2NhbGxiYWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5lbWl0KCdDVVNUT01fRVZFTlQnKTtcbiAgICAgICAgfSkuYmluZCh0aGlzKTtcblxuICAgICAgICB2YXIgYWRkQnV0dG9uID0gY2MuZmluZCgnQ2FudmFzL2FkZCcpO1xuICAgICAgICB2YXIgY2FuY2VsQnV0dG9uID0gY2MuZmluZCgnQ2FudmFzL2NhbmNlbCcpO1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uQ3VzdG9tRXZlbnQoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucnVuQWN0aW9uKGNjLnNlcXVlbmNlKGNjLnNjYWxlVG8oMC41LCAyLCAxKSwgY2Muc2NhbGVUbygwLjI1LCAxLCAxKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKCdDVVNUT01fRVZFTlQnLCBvbkN1c3RvbUV2ZW50LCBhZGRCdXR0b24pO1xuICAgICAgICB0aGlzLm5vZGUub24oJ0NVU1RPTV9FVkVOVCcsIG9uQ3VzdG9tRXZlbnQsIGNhbmNlbEJ1dHRvbik7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjMDczMDJtL29GSmVJcTJpZ1BDSmJXRScsICdEZXN0cm95U2VsZicpO1xuLy8gY2FzZXMvMDVfc2NyaXB0aW5nLzA2X2xpZmVfY3ljbGUvRGVzdHJveVNlbGYuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvczogXCIgKyB0aGlzLm5vZGUuZ2V0UG9zaXRpb24oKS54ICsgXCIsIFwiICsgdGhpcy5ub2RlLmdldFBvc2l0aW9uKCkueSk7XG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MubW92ZUJ5KDIsIDIwMCwgMCksIGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUG9zOiBcIiArIHRoaXMubm9kZS54ICsgXCIsIFwiICsgdGhpcy5ub2RlLnkpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLmRlc3Ryb3koKTtcbiAgICAgICAgfSwgdGhpcykpKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzUwYTk1T2JMcUZIMnJ6NmVTaHZHdU5LJywgJ0ZpbGxlZFNwcml0ZUNvbnRyb2wnKTtcbi8vIGNhc2VzLzAxX2dyYXBoaWNzLzAxX3Nwcml0ZS9GaWxsZWRTcHJpdGVDb250cm9sLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHNwZWVkOiAwLjEsXG5cbiAgICAgICAgaG9yaXpvbnRhbDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVcbiAgICAgICAgfSxcblxuICAgICAgICByYWRpYWxfcm91bmQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgcmFkaWFsX3NlbWljaXJjbGU6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuaW5pdF9ob3Jpem9udGFsX1JhbmdlID0gdGhpcy5ob3Jpem9udGFsLmZpbGxSYW5nZSAqIC0xO1xuICAgICAgICB0aGlzLmluaXRfcm91bmRfcmFuZ2UgPSB0aGlzLnJhZGlhbF9yb3VuZC5maWxsUmFuZ2U7XG4gICAgICAgIHRoaXMuaW5pdF9zZW1pY2lyY2xlX3JhbmdlID0gdGhpcy5yYWRpYWxfc2VtaWNpcmNsZS5maWxsUmFuZ2U7XG4gICAgfSxcblxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIC8vIOWboOS4uum7mOiupOaYr+S7juW3puW+gOWPs+eahO+8jOS4uuS6huS7juacieWIsOW3puaJgOaciei/memHjCAqIC0xXG4gICAgICAgIHRoaXMuX3VwZGF0YUZpbGxTdGFydCh0aGlzLmhvcml6b250YWwsIHRoaXMuaW5pdF9ob3Jpem9udGFsX1JhbmdlLCB0aGlzLnNwZWVkLCBkdCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUZpbGxSYW5nZSh0aGlzLnJhZGlhbF9yb3VuZCwgdGhpcy5pbml0X3JvdW5kX3JhbmdlLCB0aGlzLnNwZWVkLCBkdCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUZpbGxSYW5nZSh0aGlzLnJhZGlhbF9zZW1pY2lyY2xlLCB0aGlzLmluaXRfc2VtaWNpcmNsZV9yYW5nZSwgdGhpcy5zcGVlZCwgZHQpO1xuICAgIH0sXG5cbiAgICBfdXBkYXRhRmlsbFN0YXJ0OiBmdW5jdGlvbiBfdXBkYXRhRmlsbFN0YXJ0KHNwcml0ZSwgcmFuZ2UsIHNwZWVkLCBkdCkge1xuICAgICAgICB2YXIgZmlsbFN0YXJ0ID0gc3ByaXRlLmZpbGxTdGFydDtcbiAgICAgICAgZmlsbFN0YXJ0ID0gZmlsbFN0YXJ0ID4gcmFuZ2UgPyBmaWxsU3RhcnQgLT0gZHQgKiBzcGVlZCA6IDA7XG4gICAgICAgIHNwcml0ZS5maWxsU3RhcnQgPSBmaWxsU3RhcnQ7XG4gICAgfSxcblxuICAgIF91cGRhdGVGaWxsUmFuZ2U6IGZ1bmN0aW9uIF91cGRhdGVGaWxsUmFuZ2Uoc3ByaXRlLCByYW5nZSwgc3BlZWQsIGR0KSB7XG4gICAgICAgIHZhciBmaWxsUmFuZ2UgPSBzcHJpdGUuZmlsbFJhbmdlO1xuICAgICAgICBmaWxsUmFuZ2UgPSBmaWxsUmFuZ2UgPCByYW5nZSA/IGZpbGxSYW5nZSArPSBkdCAqIHNwZWVkIDogMDtcbiAgICAgICAgc3ByaXRlLmZpbGxSYW5nZSA9IGZpbGxSYW5nZTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMWVhMzZuWWlrVk91cDZCemFFSU1ZUEgnLCAnRm9vJyk7XG4vLyBjYXNlcy8wNV9zY3JpcHRpbmcvMDVfY3Jvc3NfcmVmZXJlbmNlL0Zvby5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiBmdW5jdGlvbiBwcm9wZXJ0aWVzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVmVG9CYXI6IHJlcXVpcmUoJ0JhcicpXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgdGlwID0gdGhpcy5ub2RlLmNoaWxkcmVuWzBdLmdldENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgICAgIHRpcC5zdHJpbmcgPSB0aGlzLm5hbWUgKyAnIGhhcyByZWZlcmVuY2UgdG8gJyArIHRoaXMucmVmVG9CYXIubmFtZTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2JmZjQ5R245TFZGMFlaQjBRL01PZ3VQJywgJ0dvbGRCZWF0aW5nQW5pbWUnKTtcbi8vIGNhc2VzLzAyX3VpLzAyX2xhYmVsL0dvbGRCZWF0aW5nQW5pbWUuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNwZWVkOiA1MCxcbiAgICAgICAgZ29sZF9sYWJlbDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmN1ckdvbGQgPSAwO1xuICAgICAgICB0aGlzLmN1ckluZGV4ID0gMDtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgdGhpcy5jdXJJbmRleCArPSBkdCAqIHRoaXMuc3BlZWQ7XG4gICAgICAgIGlmICh0aGlzLmN1ckluZGV4ID4gMTApIHtcbiAgICAgICAgICAgIHRoaXMuY3VySW5kZXggPSAwO1xuICAgICAgICAgICAgdGhpcy5jdXJHb2xkKys7XG4gICAgICAgICAgICB0aGlzLmdvbGRfbGFiZWwuc3RyaW5nICs9IHRoaXMuY3VyR29sZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmdvbGRfbGFiZWwuc3RyaW5nLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nb2xkX2xhYmVsLnN0cmluZyA9IFwiMFwiO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VyR29sZCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2M4NjQwTTNvelJFcnJWL0dvM3VUa250JywgJ0hlbHBlcnMnKTtcbi8vIHNjcmlwdHMvR2xvYmFsL0hlbHBlcnMuanNcblxuLy8gUmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIChpbmNsdWRlZCkgYW5kIG1heCAoZXhjbHVkZWQpXG5mdW5jdGlvbiBnZXRSYW5kb21JbnQobWluLCBtYXgpIHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldFJhbmRvbUludDogZ2V0UmFuZG9tSW50XG59O1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMzM5ZDJkZzFRcEVLS3hCSkJ6SGlESjAnLCAnSGVyb0NvbnRyb2wnKTtcbi8vIGNhc2VzL2NvbGxpZGVyL0hlcm9Db250cm9sLmpzXG5cblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNwZWVkOiBjYy52MigwLCAwKSxcbiAgICAgICAgbWF4U3BlZWQ6IGNjLnYyKDIwMDAsIDIwMDApLFxuICAgICAgICBncmF2aXR5OiAtMTAwMCxcbiAgICAgICAgZHJhZzogMTAwMCxcbiAgICAgICAgZGlyZWN0aW9uOiAwLFxuICAgICAgICBqdW1wU3BlZWQ6IDMwMFxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBjYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCkuZW5hYmxlZERlYnVnRHJhdyA9IHRydWU7XG5cbiAgICAgICAgLy9hZGQga2V5Ym9hcmQgaW5wdXQgbGlzdGVuZXIgdG8gY2FsbCB0dXJuTGVmdCBhbmQgdHVyblJpZ2h0XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogdGhpcy5vbktleVByZXNzZWQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIG9uS2V5UmVsZWFzZWQ6IHRoaXMub25LZXlSZWxlYXNlZC5iaW5kKHRoaXMpXG4gICAgICAgIH0sIHRoaXMubm9kZSk7XG5cbiAgICAgICAgdGhpcy5jb2xsaXNpb25YID0gMDtcbiAgICAgICAgdGhpcy5jb2xsaXNpb25ZID0gMDtcblxuICAgICAgICB0aGlzLnByZVBvc2l0aW9uID0gY2MudjIoKTtcbiAgICAgICAgdGhpcy5wcmVTdGVwID0gY2MudjIoKTtcblxuICAgICAgICB0aGlzLnRvdWNoaW5nTnVtYmVyID0gMDtcbiAgICB9LFxuXG4gICAgb25EaXNhYmxlZDogZnVuY3Rpb24gb25EaXNhYmxlZCgpIHtcbiAgICAgICAgY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpLmVuYWJsZWREZWJ1Z0RyYXcgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgb25LZXlQcmVzc2VkOiBmdW5jdGlvbiBvbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkubGVmdDpcbiAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IC0xO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnc6XG4gICAgICAgICAgICBjYXNlIGNjLktFWS51cDpcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuanVtcGluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmp1bXBpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwZWVkLnkgPSB0aGlzLmp1bXBTcGVlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25LZXlSZWxlYXNlZDogZnVuY3Rpb24gb25LZXlSZWxlYXNlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICBzd2l0Y2ggKGtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5sZWZ0OlxuICAgICAgICAgICAgY2FzZSBjYy5LRVkuZDpcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkNvbGxpc2lvbkVudGVyOiBmdW5jdGlvbiBvbkNvbGxpc2lvbkVudGVyKG90aGVyLCBzZWxmKSB7XG4gICAgICAgIHRoaXMubm9kZS5jb2xvciA9IGNjLkNvbG9yLlJFRDtcblxuICAgICAgICB0aGlzLnRvdWNoaW5nTnVtYmVyKys7XG5cbiAgICAgICAgdmFyIG90aGVyQWFiYiA9IG90aGVyLndvcmxkLmFhYmI7XG4gICAgICAgIHZhciBzZWxmQWFiYiA9IHNlbGYud29ybGQuYWFiYi5jbG9uZSgpO1xuICAgICAgICB2YXIgcHJlQWFiYiA9IHNlbGYud29ybGQucHJlQWFiYjtcblxuICAgICAgICBzZWxmQWFiYi54ID0gcHJlQWFiYi54O1xuICAgICAgICBzZWxmQWFiYi55ID0gcHJlQWFiYi55O1xuXG4gICAgICAgIHNlbGZBYWJiLnggPSBzZWxmLndvcmxkLmFhYmIueDtcbiAgICAgICAgaWYgKGNjLkludGVyc2VjdGlvbi5yZWN0UmVjdChzZWxmQWFiYiwgb3RoZXJBYWJiKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3BlZWQueCA8IDAgJiYgc2VsZkFhYmIueE1heCA+IG90aGVyQWFiYi54TWF4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnggPSBvdGhlckFhYmIueE1heDtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvblggPSAtMTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5zcGVlZC54ID4gMCAmJiBzZWxmQWFiYi54TWluIDwgb3RoZXJBYWJiLnhNaW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGUueCA9IG90aGVyQWFiYi54TWluIC0gc2VsZkFhYmIud2lkdGg7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25YID0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zcGVlZC54ID0gMDtcbiAgICAgICAgICAgIG90aGVyLnRvdWNoaW5nWCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZWxmQWFiYi55ID0gc2VsZi53b3JsZC5hYWJiLnk7XG4gICAgICAgIGlmIChjYy5JbnRlcnNlY3Rpb24ucmVjdFJlY3Qoc2VsZkFhYmIsIG90aGVyQWFiYikpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNwZWVkLnkgPCAwICYmIHNlbGZBYWJiLnlNYXggPiBvdGhlckFhYmIueU1heCkge1xuICAgICAgICAgICAgICAgIHRoaXMubm9kZS55ID0gb3RoZXJBYWJiLnlNYXg7XG4gICAgICAgICAgICAgICAgdGhpcy5qdW1waW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25ZID0gLTE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3BlZWQueSA+IDAgJiYgc2VsZkFhYmIueU1pbiA8IG90aGVyQWFiYi55TWluKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnkgPSBvdGhlckFhYmIueU1pbiAtIHNlbGZBYWJiLmhlaWdodDtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvblkgPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNwZWVkLnkgPSAwO1xuICAgICAgICAgICAgb3RoZXIudG91Y2hpbmdZID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkNvbGxpc2lvblN0YXk6IGZ1bmN0aW9uIG9uQ29sbGlzaW9uU3RheShvdGhlcikge1xuICAgICAgICB0aGlzLmNvbGxpc2lvbiA9IHRydWU7XG4gICAgfSxcblxuICAgIG9uQ29sbGlzaW9uRXhpdDogZnVuY3Rpb24gb25Db2xsaXNpb25FeGl0KG90aGVyKSB7XG4gICAgICAgIHRoaXMudG91Y2hpbmdOdW1iZXItLTtcbiAgICAgICAgaWYgKHRoaXMudG91Y2hpbmdOdW1iZXIgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5jb2xvciA9IGNjLkNvbG9yLldISVRFO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG90aGVyLnRvdWNoaW5nWCkge1xuICAgICAgICAgICAgdGhpcy5jb2xsaXNpb25YID0gMDtcbiAgICAgICAgICAgIG90aGVyLnRvdWNoaW5nWCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKG90aGVyLnRvdWNoaW5nWSkge1xuICAgICAgICAgICAgb3RoZXIudG91Y2hpbmdZID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvbGxpc2lvblkgPSAwO1xuICAgICAgICAgICAgdGhpcy5qdW1waW5nID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy5jb2xsaXNpb25ZID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNwZWVkLnkgKz0gdGhpcy5ncmF2aXR5ICogZHQ7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModGhpcy5zcGVlZC55KSA+IHRoaXMubWF4U3BlZWQueSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWQueSA9IHRoaXMuc3BlZWQueSA+IDAgPyB0aGlzLm1heFNwZWVkLnkgOiAtdGhpcy5tYXhTcGVlZC55O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGVlZC54ID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWQueCAtPSB0aGlzLmRyYWcgKiBkdDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zcGVlZC54IDw9IDApIHRoaXMuc3BlZWQueCA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3BlZWQueCA8IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwZWVkLnggKz0gdGhpcy5kcmFnICogZHQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3BlZWQueCA+PSAwKSB0aGlzLnNwZWVkLnggPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcGVlZC54ICs9ICh0aGlzLmRpcmVjdGlvbiA+IDAgPyAxIDogLTEpICogdGhpcy5kcmFnICogZHQ7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModGhpcy5zcGVlZC54KSA+IHRoaXMubWF4U3BlZWQueCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BlZWQueCA9IHRoaXMuc3BlZWQueCA+IDAgPyB0aGlzLm1heFNwZWVkLnggOiAtdGhpcy5tYXhTcGVlZC54O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc3BlZWQueCAqIHRoaXMuY29sbGlzaW9uWCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc3BlZWQueCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByZVBvc2l0aW9uLnggPSB0aGlzLm5vZGUueDtcbiAgICAgICAgdGhpcy5wcmVQb3NpdGlvbi55ID0gdGhpcy5ub2RlLnk7XG5cbiAgICAgICAgdGhpcy5wcmVTdGVwLnggPSB0aGlzLnNwZWVkLnggKiBkdDtcbiAgICAgICAgdGhpcy5wcmVTdGVwLnkgPSB0aGlzLnNwZWVkLnkgKiBkdDtcblxuICAgICAgICB0aGlzLm5vZGUueCArPSB0aGlzLnNwZWVkLnggKiBkdDtcbiAgICAgICAgdGhpcy5ub2RlLnkgKz0gdGhpcy5zcGVlZC55ICogZHQ7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczYWU0Y1VzR2NCSUU0cTdLc3A0WlgvSCcsICdJbml0RGF0YScpO1xuLy8gY2FzZXMvMDVfc2NyaXB0aW5nLzA4X21vZHVsZS9Jbml0RGF0YS5qc1xuXG5cbnZhciBfbW9uc3RlckluZm8gPSB7XG4gICAgbmFtZTogXCJTbGltZVwiLFxuICAgIGhwOiAxMDAsXG4gICAgbHY6IDEsXG4gICAgYXRrOiAxMCxcbiAgICBkZWZlbnNlOiA1LFxuICAgIGltYWdlVXJsOiBcInJlcy90ZXh0dXJlcy9tb25zdGVyLWljb24vUHVycGxlTW9uc3Rlci5wbmdcIlxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbW9uc3RlckluZm86IF9tb25zdGVySW5mb1xufTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzZhODcxZ3k3M0ZETGFwM0VqZS8yaDZpJywgJ0luc3RydWN0aW9uJyk7XG4vLyBzY3JpcHRzL0dsb2JhbC9JbnN0cnVjdGlvbi5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRleHQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogJycsXG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgICAgfVxuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fVxuXG59KTtcbi8vIGNhbGxlZCBldmVyeSBmcmFtZVxuLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuLy8gfSxcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzkyMGM4YTVNYWhBaGJDVFN2bVF2YUIrJywgJ0l0ZW0nKTtcbi8vIGNhc2VzLzAyX3VpLzA1X3Njcm9sbFZpZXcvSXRlbS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBpdGVtSUQ6IDBcbiAgICB9LFxuXG4gICAgdXBkYXRlSXRlbTogZnVuY3Rpb24gdXBkYXRlSXRlbSh0bXBsSWQsIGl0ZW1JZCkge1xuICAgICAgICB0aGlzLml0ZW1JRCA9IGl0ZW1JZDtcbiAgICAgICAgdGhpcy5sYWJlbC5zdHJpbmcgPSAnVG1wbCMnICsgdG1wbElkICsgJyBJdGVtIycgKyB0aGlzLml0ZW1JRDtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzJiYmVkdFYzYmxDVkpibWYyRTloLzBWJywgJ0xheW91dFJlc2l6ZUNvbnRhaW5lckN0cmwnKTtcbi8vIGNhc2VzLzAyX3VpLzA2X2xheW91dC9MYXlvdXRSZXNpemVDb250YWluZXJDdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBpdGVtVGVtcDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgbGF5b3V0SG9yaXpvbnRhbE51bTogNSxcbiAgICAgICAgbGF5b3V0SG9yaXpvbnRhbDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGxheW91dFZlcnRpY2FsTnVtOiAzLFxuICAgICAgICBsYXlvdXRWZXJ0aWNhbDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGdyaWRMYXlvdXRBeGlzSG9yaXpvbnRhbE51bTogMTAsXG4gICAgICAgIGdyaWRMYXlvdXRBeGlzSG9yaXpvbnRhbDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGdyaWRMYXlvdXRBeGlzVmVydGljYWxOdW06IDEyLFxuICAgICAgICBncmlkTGF5b3V0QXhpc1ZlcnRpY2FsOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5fY3VyVGltZSA9IDA7XG4gICAgICAgIHRoaXMuX2N1ckluZGV4ID0gMDtcbiAgICB9LFxuXG4gICAgX2NyZWF0ZUl0ZW06IGZ1bmN0aW9uIF9jcmVhdGVJdGVtKHBhcmVudE5vZGUsIGlkeCkge1xuICAgICAgICB2YXIgaXRlbSA9IGNjLmluc3RhbnRpYXRlKHRoaXMuaXRlbVRlbXApO1xuICAgICAgICB2YXIgbGFiZWwgPSBpdGVtLmdldENvbXBvbmVudEluQ2hpbGRyZW4oY2MuTGFiZWwpO1xuICAgICAgICBsYWJlbC5zdHJpbmcgPSBpZHg7XG4gICAgICAgIGl0ZW0ucGFyZW50ID0gcGFyZW50Tm9kZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgdGhpcy5fY3VyVGltZSArPSBkdDtcbiAgICAgICAgaWYgKHRoaXMuX2N1clRpbWUgPj0gMSkge1xuICAgICAgICAgICAgdGhpcy5fY3VyVGltZSA9IDA7XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VySW5kZXggPCB0aGlzLmxheW91dEhvcml6b250YWxOdW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVJdGVtKHRoaXMubGF5b3V0SG9yaXpvbnRhbCwgdGhpcy5fY3VySW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1ckluZGV4IDwgdGhpcy5sYXlvdXRWZXJ0aWNhbE51bSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZUl0ZW0odGhpcy5sYXlvdXRWZXJ0aWNhbCwgdGhpcy5fY3VySW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2N1ckluZGV4IDwgdGhpcy5ncmlkTGF5b3V0QXhpc0hvcml6b250YWxOdW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVJdGVtKHRoaXMuZ3JpZExheW91dEF4aXNIb3Jpem9udGFsLCB0aGlzLl9jdXJJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fY3VySW5kZXggPCB0aGlzLmdyaWRMYXlvdXRBeGlzVmVydGljYWxOdW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jcmVhdGVJdGVtKHRoaXMuZ3JpZExheW91dEF4aXNWZXJ0aWNhbCwgdGhpcy5fY3VySW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fY3VySW5kZXgrKztcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdhYTYzYldORThoQmY0UDRTcDBYMnVUMCcsICdMaXN0SXRlbScpO1xuLy8gc2NyaXB0cy9HbG9iYWwvTGlzdEl0ZW0uanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgdXJsOiAnJ1xuICAgIH0sXG5cbiAgICBsb2FkRXhhbXBsZTogZnVuY3Rpb24gbG9hZEV4YW1wbGUoKSB7XG4gICAgICAgIGlmICh0aGlzLnVybCkge1xuICAgICAgICAgICAgY2MuZmluZCgnTWVudScpLmdldENvbXBvbmVudCgnTWVudScpLmxvYWRTY2VuZSh0aGlzLnVybCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2U2NDU4K2hmNVZBbklYb2NtdmhnZ3FDJywgJ0xpc3RWaWV3Jyk7XG4vLyBjYXNlcy8wMl91aS8wNV9zY3JvbGxWaWV3L0xpc3RWaWV3LmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaXRlbVRlbXBsYXRlOiB7IC8vIGl0ZW0gdGVtcGxhdGUgdG8gaW5zdGFudGlhdGUgb3RoZXIgaXRlbXNcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgc2Nyb2xsVmlldzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU2Nyb2xsVmlld1xuICAgICAgICB9LFxuICAgICAgICBzcGF3bkNvdW50OiAwLCAvLyBob3cgbWFueSBpdGVtcyB3ZSBhY3R1YWxseSBzcGF3blxuICAgICAgICB0b3RhbENvdW50OiAwLCAvLyBob3cgbWFueSBpdGVtcyB3ZSBuZWVkIGZvciB0aGUgd2hvbGUgbGlzdFxuICAgICAgICBzcGFjaW5nOiAwLCAvLyBzcGFjZSBiZXR3ZWVuIGVhY2ggaXRlbVxuICAgICAgICBidWZmZXJab25lOiAwIH0sXG5cbiAgICAvLyB3aGVuIGl0ZW0gaXMgYXdheSBmcm9tIGJ1ZmZlclpvbmUsIHdlIHJlbG9jYXRlIGl0XG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuc2Nyb2xsVmlldy5jb250ZW50O1xuICAgICAgICB0aGlzLml0ZW1zID0gW107IC8vIGFycmF5IHRvIHN0b3JlIHNwYXduZWQgaXRlbXNcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMudXBkYXRlVGltZXIgPSAwO1xuICAgICAgICB0aGlzLnVwZGF0ZUludGVydmFsID0gMC4yO1xuICAgICAgICB0aGlzLmxhc3RDb250ZW50UG9zWSA9IDA7IC8vIHVzZSB0aGlzIHZhcmlhYmxlIHRvIGRldGVjdCBpZiB3ZSBhcmUgc2Nyb2xsaW5nIHVwIG9yIGRvd25cbiAgICB9LFxuXG4gICAgaW5pdGlhbGl6ZTogZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5jb250ZW50LmhlaWdodCA9IHRoaXMudG90YWxDb3VudCAqICh0aGlzLml0ZW1UZW1wbGF0ZS5oZWlnaHQgKyB0aGlzLnNwYWNpbmcpICsgdGhpcy5zcGFjaW5nOyAvLyBnZXQgdG90YWwgY29udGVudCBoZWlnaHRcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNwYXduQ291bnQ7ICsraSkge1xuICAgICAgICAgICAgLy8gc3Bhd24gaXRlbXMsIHdlIG9ubHkgbmVlZCB0byBkbyB0aGlzIG9uY2VcbiAgICAgICAgICAgIHZhciBpdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5pdGVtVGVtcGxhdGUpO1xuICAgICAgICAgICAgdGhpcy5jb250ZW50LmFkZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgaXRlbS5zZXRQb3NpdGlvbigwLCAtaXRlbS5oZWlnaHQgKiAoMC41ICsgaSkgLSB0aGlzLnNwYWNpbmcgKiAoaSArIDEpKTtcbiAgICAgICAgICAgIGl0ZW0uZ2V0Q29tcG9uZW50KCdJdGVtJykudXBkYXRlSXRlbShpLCBpKTtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBnZXRQb3NpdGlvbkluVmlldzogZnVuY3Rpb24gZ2V0UG9zaXRpb25JblZpZXcoaXRlbSkge1xuICAgICAgICAvLyBnZXQgaXRlbSBwb3NpdGlvbiBpbiBzY3JvbGx2aWV3J3Mgbm9kZSBzcGFjZVxuICAgICAgICB2YXIgd29ybGRQb3MgPSBpdGVtLnBhcmVudC5jb252ZXJ0VG9Xb3JsZFNwYWNlQVIoaXRlbS5wb3NpdGlvbik7XG4gICAgICAgIHZhciB2aWV3UG9zID0gdGhpcy5zY3JvbGxWaWV3Lm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIod29ybGRQb3MpO1xuICAgICAgICByZXR1cm4gdmlld1BvcztcbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lciArPSBkdDtcbiAgICAgICAgaWYgKHRoaXMudXBkYXRlVGltZXIgPCB0aGlzLnVwZGF0ZUludGVydmFsKSByZXR1cm47IC8vIHdlIGRvbid0IG5lZWQgdG8gZG8gdGhlIG1hdGggZXZlcnkgZnJhbWVcbiAgICAgICAgdGhpcy51cGRhdGVUaW1lciA9IDA7XG4gICAgICAgIHZhciBpdGVtcyA9IHRoaXMuaXRlbXM7XG4gICAgICAgIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlclpvbmU7XG4gICAgICAgIHZhciBpc0Rvd24gPSB0aGlzLnNjcm9sbFZpZXcuY29udGVudC55IDwgdGhpcy5sYXN0Q29udGVudFBvc1k7IC8vIHNjcm9sbGluZyBkaXJlY3Rpb25cbiAgICAgICAgdmFyIG9mZnNldCA9ICh0aGlzLml0ZW1UZW1wbGF0ZS5oZWlnaHQgKyB0aGlzLnNwYWNpbmcpICogaXRlbXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YXIgdmlld1BvcyA9IHRoaXMuZ2V0UG9zaXRpb25JblZpZXcoaXRlbXNbaV0pO1xuICAgICAgICAgICAgaWYgKGlzRG93bikge1xuICAgICAgICAgICAgICAgIC8vIGlmIGF3YXkgZnJvbSBidWZmZXIgem9uZSBhbmQgbm90IHJlYWNoaW5nIHRvcCBvZiBjb250ZW50XG4gICAgICAgICAgICAgICAgaWYgKHZpZXdQb3MueSA8IC1idWZmZXIgJiYgaXRlbXNbaV0ueSArIG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNbaV0uc2V0UG9zaXRpb25ZKGl0ZW1zW2ldLnkgKyBvZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldLmdldENvbXBvbmVudCgnSXRlbScpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbUlkID0gaXRlbS5pdGVtSUQgLSBpdGVtcy5sZW5ndGg7IC8vIHVwZGF0ZSBpdGVtIGlkXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udXBkYXRlSXRlbShpLCBpdGVtSWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgYXdheSBmcm9tIGJ1ZmZlciB6b25lIGFuZCBub3QgcmVhY2hpbmcgYm90dG9tIG9mIGNvbnRlbnRcbiAgICAgICAgICAgICAgICBpZiAodmlld1Bvcy55ID4gYnVmZmVyICYmIGl0ZW1zW2ldLnkgLSBvZmZzZXQgPiAtdGhpcy5jb250ZW50LmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBpdGVtc1tpXS5zZXRQb3NpdGlvblkoaXRlbXNbaV0ueSAtIG9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV0uZ2V0Q29tcG9uZW50KCdJdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpdGVtSUQ6ICcgKyBpdGVtLml0ZW1JRCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtSWQgPSBpdGVtLml0ZW1JRCArIGl0ZW1zLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS51cGRhdGVJdGVtKGksIGl0ZW1JZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHVwZGF0ZSBsYXN0Q29udGVudFBvc1lcbiAgICAgICAgdGhpcy5sYXN0Q29udGVudFBvc1kgPSB0aGlzLnNjcm9sbFZpZXcuY29udGVudC55O1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOWU3MDJHdWJIcEsrNHZBYjN5dTJPVzUnLCAnTG9hZE1vZHVsZUN0cmwnKTtcbi8vIGNhc2VzLzA1X3NjcmlwdGluZy8wOF9tb2R1bGUvTG9hZE1vZHVsZUN0cmwuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG1vbnN0ZXJUZW1wOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICBidG5fY3JlYXRlTW9uc3Rlcjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuYnRuX2NyZWF0ZU1vbnN0ZXIub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfRU5ELCB0aGlzLmNyZWF0ZU1vc3Rlci5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgY3JlYXRlTW9zdGVyOiBmdW5jdGlvbiBjcmVhdGVNb3N0ZXIoKSB7XG4gICAgICAgIHZhciBtb25zdGVyID0gY2MuaW5zdGFudGlhdGUodGhpcy5tb25zdGVyVGVtcCk7XG4gICAgICAgIHZhciBNb25zdGVyID0gcmVxdWlyZShcIk1vbnN0ZXJcIik7XG4gICAgICAgIHZhciBtb25zdGVyQ29tcCA9IG1vbnN0ZXIuZ2V0Q29tcG9uZW50KE1vbnN0ZXIpO1xuICAgICAgICB2YXIgSW5pdERhdGEgPSByZXF1aXJlKFwiSW5pdERhdGFcIik7XG4gICAgICAgIG1vbnN0ZXJDb21wLmluaXRJbmZvKEluaXREYXRhLm1vbnN0ZXJJbmZvKTtcbiAgICAgICAgbW9uc3Rlci5wYXJlbnQgPSB0aGlzLm5vZGU7XG4gICAgICAgIG1vbnN0ZXIuc2V0UG9zaXRpb24oY2MucCgwLCAwKSk7XG4gICAgfVxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICAvLyB1cGRhdGU6IGZ1bmN0aW9uIChkdCkge1xuXG4gICAgLy8gfSxcbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDQ1MjVweVlCbE4yNlNXYXdhVUYzZEEnLCAnTWVudScpO1xuLy8gc2NyaXB0cy9HbG9iYWwvTWVudS5qc1xuXG5cbnZhciBlbXB0eUZ1bmMgPSBmdW5jdGlvbiBlbXB0eUZ1bmMoZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbn07XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgdGV4dDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgcmVhZG1lOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIG1hc2s6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgYnRuSW5mbzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQnV0dG9uXG4gICAgICAgIH0sXG4gICAgICAgIGJ0bkJhY2s6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkJ1dHRvblxuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBjYy5nYW1lLmFkZFBlcnNpc3RSb290Tm9kZSh0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTY2VuZVVybCA9ICdUZXN0TGlzdC5maXJlJztcbiAgICAgICAgdGhpcy5jb250ZW50UG9zID0gbnVsbDtcbiAgICAgICAgdGhpcy5pc01lbnUgPSB0cnVlO1xuICAgICAgICB0aGlzLmxvYWRJbnN0cnVjdGlvbih0aGlzLmN1cnJlbnRTY2VuZVVybCk7XG4gICAgfSxcblxuICAgIGJhY2tUb0xpc3Q6IGZ1bmN0aW9uIGJhY2tUb0xpc3QoKSB7XG4gICAgICAgIHRoaXMuc2hvd1JlYWRtZShmYWxzZSk7XG4gICAgICAgIHRoaXMuY3VycmVudFNjZW5lVXJsID0gJ1Rlc3RMaXN0LmZpcmUnO1xuICAgICAgICB0aGlzLmlzTWVudSA9IHRydWU7XG4gICAgICAgIGNjLmRpcmVjdG9yLmxvYWRTY2VuZSgnVGVzdExpc3QnLCB0aGlzLm9uTG9hZFNjZW5lRmluaXNoLmJpbmQodGhpcykpO1xuICAgIH0sXG5cbiAgICBsb2FkU2NlbmU6IGZ1bmN0aW9uIGxvYWRTY2VuZSh1cmwpIHtcbiAgICAgICAgdGhpcy5jb250ZW50UG9zID0gY2MuZmluZCgnQ2FudmFzL3Rlc3RMaXN0JykuZ2V0Q29tcG9uZW50KGNjLlNjcm9sbFZpZXcpLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTY2VuZVVybCA9IHVybDtcbiAgICAgICAgdGhpcy5pc01lbnUgPSBmYWxzZTtcbiAgICAgICAgY2MuZGlyZWN0b3IubG9hZFNjZW5lKHVybCwgdGhpcy5vbkxvYWRTY2VuZUZpbmlzaC5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgb25Mb2FkU2NlbmVGaW5pc2g6IGZ1bmN0aW9uIG9uTG9hZFNjZW5lRmluaXNoKCkge1xuICAgICAgICB2YXIgdXJsID0gdGhpcy5jdXJyZW50U2NlbmVVcmw7XG4gICAgICAgIHRoaXMubG9hZEluc3RydWN0aW9uKHVybCk7XG4gICAgICAgIGlmICh0aGlzLmlzTWVudSAmJiB0aGlzLmNvbnRlbnRQb3MpIHtcbiAgICAgICAgICAgIGNjLmZpbmQoJ0NhbnZhcy90ZXN0TGlzdCcpLmdldENvbXBvbmVudChjYy5TY3JvbGxWaWV3KS5zZXRDb250ZW50UG9zaXRpb24odGhpcy5jb250ZW50UG9zKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBsb2FkSW5zdHJ1Y3Rpb246IGZ1bmN0aW9uIGxvYWRJbnN0cnVjdGlvbih1cmwpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgdXJsQXJyID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgICAgIHZhciBmaWxlTmFtZSA9IHVybEFyclt1cmxBcnIubGVuZ3RoIC0gMV0ucmVwbGFjZSgnLmZpcmUnLCAnLm1kJyk7XG4gICAgICAgIGNjLmxvYWRlci5sb2FkKGNjLnVybC5yYXcoXCJyZXNvdXJjZXM6Ly9yZWFkbWUvXCIgKyBmaWxlTmFtZSksIGZ1bmN0aW9uIChlcnIsIHR4dCkge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHNlbGYudGV4dC5zdHJpbmcgPSAn6K+05piO5pqC57y6JztcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWxmLnRleHQuc3RyaW5nID0gdHh0O1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgc2hvd1JlYWRtZTogZnVuY3Rpb24gc2hvd1JlYWRtZShhY3RpdmUpIHtcbiAgICAgICAgaWYgKGFjdGl2ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlYWRtZS5hY3RpdmUgPSAhdGhpcy5yZWFkbWUuYWN0aXZlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWFkbWUuYWN0aXZlID0gYWN0aXZlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlYWRtZS5hY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMubWFzay5vbigndG91Y2hzdGFydCcsIGVtcHR5RnVuYywgdGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1hc2sub2ZmKCd0b3VjaHN0YXJ0JywgZW1wdHlGdW5jLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGFiZWxUeHQgPSB0aGlzLnJlYWRtZS5hY3RpdmUgPyAn5YWz6Zet6K+05piOJyA6ICfmn6XnnIvor7TmmI4nO1xuICAgICAgICBjYy5maW5kKCdsYWJlbCcsIHRoaXMuYnRuSW5mby5ub2RlKS5nZXRDb21wb25lbnQoY2MuTGFiZWwpLnN0cmluZyA9IGxhYmVsVHh0O1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnOGNiNGRtMlFFcEo3cG5hUy9janJ2Z0YnLCAnTW9uc3RlclByZWZhYicpO1xuLy8gY2FzZXMvMDVfc2NyaXB0aW5nLzAyX3ByZWZhYi9Nb25zdGVyUHJlZmFiLmpzXG5cbnZhciBIZWxwZXJzID0gcmVxdWlyZSgnSGVscGVycycpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNwcml0ZUxpc3Q6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogW10sXG4gICAgICAgICAgICB0eXBlOiBbY2MuU3ByaXRlRnJhbWVdXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciByYW5kb21JZHggPSBIZWxwZXJzLmdldFJhbmRvbUludCgwLCB0aGlzLnNwcml0ZUxpc3QubGVuZ3RoKTtcbiAgICAgICAgdmFyIHNwcml0ZSA9IHRoaXMuZ2V0Q29tcG9uZW50KGNjLlNwcml0ZSk7XG4gICAgICAgIHNwcml0ZS5zcHJpdGVGcmFtZSA9IHRoaXMuc3ByaXRlTGlzdFtyYW5kb21JZHhdO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdlMzFiMCtQb0RSSlhJREhGeHk2MHZFcycsICdNb25zdGVyJyk7XG4vLyBjYXNlcy8wNV9zY3JpcHRpbmcvMDhfbW9kdWxlL01vbnN0ZXIuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG5pY2tuYW1lOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGx2OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGhwOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGF0azoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBkZWZlbnNlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGltYWdlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluaXRJbmZvOiBmdW5jdGlvbiBpbml0SW5mbyhpbmZvKSB7XG4gICAgICAgIHRoaXMubmlja25hbWUuc3RyaW5nID0gaW5mby5uYW1lO1xuICAgICAgICB0aGlzLmx2LnN0cmluZyA9IGluZm8ubHY7XG4gICAgICAgIHRoaXMuaHAuc3RyaW5nID0gaW5mby5ocDtcbiAgICAgICAgdGhpcy5hdGsuc3RyaW5nID0gaW5mby5hdGs7XG4gICAgICAgIHRoaXMuZGVmZW5zZS5zdHJpbmcgPSBpbmZvLmRlZmVuc2U7XG5cbiAgICAgICAgdGhpcy5pbWFnZS5zcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZShjYy51cmwucmF3KGluZm8uaW1hZ2VVcmwpKTtcblxuICAgICAgICAvL2NjLmxvYWRlci5sb2FkKCwgZnVuY3Rpb24gKGVycm9yLCByZXMpIHtcbiAgICAgICAgLy8gICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgLy99LmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzZkZjBmdDFqeTVKZzRjUTAzOWp0OGpDJywgJ01vdXNlRXZlbnQnKTtcbi8vIGNhc2VzLzA1X3NjcmlwdGluZy8wM19ldmVudHMvTW91c2VFdmVudC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIG1vdmU6IGZ1bmN0aW9uIG1vdmUoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5ub2RlLnggKz0gZXZlbnQuZ2V0RGVsdGFYKCk7XG4gICAgICAgIHRoaXMubm9kZS55ICs9IGV2ZW50LmdldERlbHRhWSgpO1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5zY3JvbGwgPSAwO1xuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDUwO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfRE9XTiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XG4gICAgICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTU9WRSwgdGhpcy5tb3ZlLCB0aGlzKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9FTlRFUiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAxNjA7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfTEVBVkUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gNTA7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuTU9VU0VfVVAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gNTA7XG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX01PVkUsIHRoaXMubW92ZSwgdGhpcyk7XG4gICAgICAgICAgICBpZiAodGhpcy5fY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLk1PVVNFX1dIRUVMLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsICs9IGV2ZW50LmdldFNjcm9sbFkoKTtcbiAgICAgICAgICAgIHZhciBoID0gdGhpcy5ub2RlLmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsID0gY2MuY2xhbXBmKHRoaXMuc2Nyb2xsLCAtMiAqIGgsIDAuNyAqIGgpO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNjYWxlID0gMSAtIHRoaXMuc2Nyb2xsIC8gaDtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxZGM5NWRxM21WSTY1OGJyMGwyWmJpMCcsICdNb3ZlQW5pbWF0aW9uQ3RybCcpO1xuLy8gY2FzZXMvMDNfZ2FtZXBsYXkvMDNfYW5pbWF0aW9uL01vdmVBbmltYXRpb25DdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQW5pbWF0aW9uXG4gICAgICAgIH0sXG5cbiAgICAgICAgbm9kZXM6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5vblJlZ2lzdGVyZWRFdmVudCgpO1xuICAgIH0sXG5cbiAgICBvblJlZ2lzdGVyZWRFdmVudDogZnVuY3Rpb24gb25SZWdpc3RlcmVkRXZlbnQoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5ub2Rlc1tpXS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMub25QbGF5QW5pbWF0aW9uLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIG9uUGxheUFuaW1hdGlvbjogZnVuY3Rpb24gb25QbGF5QW5pbWF0aW9uKGV2ZW50KSB7XG4gICAgICAgIHRoaXMudGFyZ2V0LnN0b3AoKTtcbiAgICAgICAgc3dpdGNoIChldmVudC50YXJnZXQuX25hbWUpIHtcbiAgICAgICAgICAgIGNhc2UgXCJMaW5lYXJcIjpcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5wbGF5KFwibGluZWFyXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNhc2VJbl9FeHBvXCI6XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQucGxheShcImNhc2VJbi1leHBvXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkNhc2VPdXRfRXhwb1wiOlxuICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0LnBsYXkoXCJjYXNlT3V0LWV4cG9cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQ2FzZUluT3V0X0V4cG9cIjpcbiAgICAgICAgICAgICAgICB0aGlzLnRhcmdldC5wbGF5KFwiY2FzZUluT3V0LWV4cG9cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiQmFja19Gb3J3YXJkXCI6XG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXQucGxheShcImJhY2stZm9yd2FyZFwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc2YjhiYUVwTHV4QUNJTU5sSUwydncyVycsICdNeUN1c3RvbUNvbXBvbmVudCcpO1xuLy8gY2FzZXMvMDVfc2NyaXB0aW5nLzAxX3Byb3BlcnRpZXMvTXlDdXN0b21Db21wb25lbnQuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBvd2VyOiAxMFxuICAgIH0sXG5cbiAgICBnZXRQb3dlcjogZnVuY3Rpb24gZ2V0UG93ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvd2VyO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYmQ0YTIrYnJpdEFsb2YwVWRNQ1ZCOGMnLCAnTm9kZUdyb3VwQ29udHJvbCcpO1xuLy8gY2FzZXMvMDVfc2NyaXB0aW5nLzAxX3Byb3BlcnRpZXMvTm9kZUdyb3VwQ29udHJvbC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG5vZGVMaXN0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IFtdLFxuICAgICAgICAgICAgdHlwZTogW2NjLk5vZGVdXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5pbmVydmFsSWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLnRvZ2dsZU5vZGVzVmlzaWJpbGl0eSgpO1xuICAgICAgICB9LCAxMDAwKTtcbiAgICB9LFxuXG4gICAgb25EZXN0cm95OiBmdW5jdGlvbiBvbkRlc3Ryb3koKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbmVydmFsSWQpO1xuICAgIH0sXG5cbiAgICB0b2dnbGVOb2Rlc1Zpc2liaWxpdHk6IGZ1bmN0aW9uIHRvZ2dsZU5vZGVzVmlzaWJpbGl0eSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3RvZ2dsZSB2aXNpYmlsaXR5Jyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2RlTGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdGhpcy5ub2RlTGlzdFtpXS5hY3RpdmUgPSAhdGhpcy5ub2RlTGlzdFtpXS5hY3RpdmU7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Q0MTE0UGd5YmhKM0wvazBOOVRrQ1pJJywgJ05vblNlcmlhbGl6ZWRQcm9wZXJ0aWVzJyk7XG4vLyBjYXNlcy8wNV9zY3JpcHRpbmcvMDFfcHJvcGVydGllcy9Ob25TZXJpYWxpemVkUHJvcGVydGllcy5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG15U2VyaWFsaXplZFRleHQ6ICcnLFxuICAgICAgICBteU5vblNlcmlhbGl6ZWRUZXh0OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6ICcnLFxuICAgICAgICAgICAgdmlzaWJsZTogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgbGFiZWwxOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5MYWJlbFxuICAgICAgICB9LFxuICAgICAgICBsYWJlbDI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMubXlOb25TZXJpYWxpemVkVGV4dCA9ICdDYW4gb25seSBzZXQgdmFsdWUgaW4gc2NyaXB0JztcbiAgICAgICAgdGhpcy5sYWJlbDEuc3RyaW5nID0gdGhpcy5teVNlcmlhbGl6ZWRUZXh0O1xuICAgICAgICB0aGlzLmxhYmVsMi5zdHJpbmcgPSB0aGlzLm15Tm9uU2VyaWFsaXplZFRleHQ7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc3OWFlM2hpUCtKQWhJS2VoYVd5aUt1aCcsICdQYXJ0aWNsZUNvbnRyb2wxJyk7XG4vLyBjYXNlcy8wMV9ncmFwaGljcy8wMl9wYXJ0aWNsZS9QYXJ0aWNsZUNvbnRyb2wxLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBwYXJ0aWNsZToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgLy8gdXNlIHNwYWNlIHRvIHRvZ2dsZSBwYXJ0aWNsZVxuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQsXG4gICAgICAgICAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uIG9uS2V5UHJlc3NlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChrZXlDb2RlID09PSBjYy5LRVkuc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50b2dnbGVQYXJ0aWNsZVBsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHNlbGYpO1xuICAgIH0sXG5cbiAgICB0b2dnbGVQYXJ0aWNsZVBsYXk6IGZ1bmN0aW9uIHRvZ2dsZVBhcnRpY2xlUGxheSgpIHtcbiAgICAgICAgdmFyIG15UGFydGljbGUgPSB0aGlzLnBhcnRpY2xlLmdldENvbXBvbmVudChjYy5QYXJ0aWNsZVN5c3RlbSk7XG4gICAgICAgIGlmIChteVBhcnRpY2xlLmlzRnVsbCgpKSB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBwYXJ0aWNsZSBoYXMgZnVsbHkgcGxhZWRcbiAgICAgICAgICAgIG15UGFydGljbGUuc3RvcFN5c3RlbSgpOyAvLyBzdG9wIHBhcnRpY2xlIHN5c3RlbVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG15UGFydGljbGUucmVzZXRTeXN0ZW0oKTsgLy8gcmVzdGFydCBwYXJ0aWNsZSBzeXN0ZW1cbiAgICAgICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzc1NTE4STBJbUpIWHFXTk5HUklPbUpnJywgJ1BvcHVsYXRlUHJlZmFiJyk7XG4vLyBjYXNlcy8wNV9zY3JpcHRpbmcvMDJfcHJlZmFiL1BvcHVsYXRlUHJlZmFiLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBwcmVmYWI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIGNhbnZhczoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5DYW52YXNcbiAgICAgICAgfSxcbiAgICAgICAgbnVtYmVyVG9TcGF3bjogMCxcbiAgICAgICAgc3Bhd25JbnRlcnZhbDogMFxuICAgIH0sXG5cbiAgICBhZGRTcGF3bjogZnVuY3Rpb24gYWRkU3Bhd24oKSB7XG4gICAgICAgIGlmICh0aGlzLnNwYXduQ291bnQgPj0gdGhpcy5udW1iZXJUb1NwYXduKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyUmVwZWF0ZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbW9uc3RlciA9IGNjLmluc3RhbnRpYXRlKHRoaXMucHJlZmFiKTtcbiAgICAgICAgdGhpcy5jYW52YXMubm9kZS5hZGRDaGlsZChtb25zdGVyKTtcbiAgICAgICAgbW9uc3Rlci5wb3NpdGlvbiA9IHRoaXMuZ2V0UmFuZG9tUG9zaXRpb24oKTtcbiAgICAgICAgdGhpcy5zcGF3bkNvdW50Kys7XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYucmFuZG9tUmFuZ2UgPSBjYy5wKDMwMCwgMjAwKTtcbiAgICAgICAgc2VsZi5zcGF3bkNvdW50ID0gMDtcbiAgICAgICAgc2VsZi5zY2hlZHVsZShzZWxmLmFkZFNwYXduLCBzZWxmLnNwYXduSW50ZXJ2YWwpO1xuICAgIH0sXG5cbiAgICBnZXRSYW5kb21Qb3NpdGlvbjogZnVuY3Rpb24gZ2V0UmFuZG9tUG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiBjYy5wKGNjLnJhbmRvbU1pbnVzMVRvMSgpICogdGhpcy5yYW5kb21SYW5nZS54LCBjYy5yYW5kb21NaW51czFUbzEoKSAqIHRoaXMucmFuZG9tUmFuZ2UueSk7XG4gICAgfSxcblxuICAgIGNsZWFyUmVwZWF0ZXI6IGZ1bmN0aW9uIGNsZWFyUmVwZWF0ZXIoKSB7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLmFkZFNwYXduKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzg0YTQzeWI5T3hCWDZITVF4UHpIUXl6JywgJ1Byb2dyZXNzQmFyJyk7XG4vLyBjYXNlcy8wMl91aS8wNF9wcm9ncmVzc2Jhci9Qcm9ncmVzc0Jhci5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaG9yaXpvbnRhbEJhcjoge1xuICAgICAgICAgICAgdHlwZTogY2MuUHJvZ3Jlc3NCYXIsXG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBob3Jpem9udGFsQmFyUmV2ZXJzZToge1xuICAgICAgICAgICAgdHlwZTogY2MuUHJvZ3Jlc3NCYXIsXG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB2ZXJ0aWNhbEJhcjoge1xuICAgICAgICAgICAgdHlwZTogY2MuUHJvZ3Jlc3NCYXIsXG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB2ZXJ0aWNhbEJhclJldmVyc2U6IHtcbiAgICAgICAgICAgIHR5cGU6IGNjLlByb2dyZXNzQmFyLFxuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGxcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICB0aGlzLl91cGRhdGVQcm9ncmVzc0Jhcih0aGlzLmhvcml6b250YWxCYXIsIGR0KTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUHJvZ3Jlc3NCYXIodGhpcy52ZXJ0aWNhbEJhciwgZHQpO1xuICAgICAgICB0aGlzLl91cGRhdGVQcm9ncmVzc0Jhcih0aGlzLmhvcml6b250YWxCYXJSZXZlcnNlLCBkdCk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVByb2dyZXNzQmFyKHRoaXMudmVydGljYWxCYXJSZXZlcnNlLCBkdCk7XG4gICAgfSxcblxuICAgIF91cGRhdGVQcm9ncmVzc0JhcjogZnVuY3Rpb24gX3VwZGF0ZVByb2dyZXNzQmFyKHByb2dyZXNzQmFyLCBkdCkge1xuICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBwcm9ncmVzc0Jhci5wcm9ncmVzcztcbiAgICAgICAgaWYgKHByb2dyZXNzIDwgMS4wKSB7XG4gICAgICAgICAgICBwcm9ncmVzcyArPSBkdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb2dyZXNzID0gMDtcbiAgICAgICAgfVxuICAgICAgICBwcm9ncmVzc0Jhci5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNjI4OWNabDZ6SkVjTFZRZDYwSm5BelcnLCAnUHV6emxlJyk7XG4vLyBjYXNlcy90aWxlZG1hcC9QdXp6bGUuanNcblxuXG52YXIgTW92ZURpcmVjdGlvbiA9IGNjLkVudW0oe1xuICAgIE5PTkU6IDAsXG4gICAgVVA6IDEsXG4gICAgRE9XTjogMixcbiAgICBMRUZUOiAzLFxuICAgIFJJR0hUOiA0XG59KTtcblxudmFyIG1pblRpbGVzQ291bnQgPSAyO1xudmFyIG1hcE1vdmVTdGVwID0gMTtcbnZhciBtaW5Nb3ZlVmFsdWUgPSA1MDtcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuICAgIGVkaXRvcjoge1xuICAgICAgICByZXF1aXJlQ29tcG9uZW50OiBjYy5UaWxlZE1hcFxuICAgIH0sXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIF90b3VjaFN0YXJ0UG9zOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIF90b3VjaGluZzoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBmYWxzZSxcbiAgICAgICAgICAgIHNlcmlhbGl6YWJsZTogZmFsc2VcbiAgICAgICAgfSxcblxuICAgICAgICBfaXNNYXBMb2FkZWQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogZmFsc2UsXG4gICAgICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlXG4gICAgICAgIH0sXG5cbiAgICAgICAgZmxvb3JMYXllck5hbWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogJ2Zsb29yJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGJhcnJpZXJMYXllck5hbWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogJ2JhcnJpZXInXG4gICAgICAgIH0sXG5cbiAgICAgICAgb2JqZWN0R3JvdXBOYW1lOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6ICdwbGF5ZXJzJ1xuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXJ0T2JqZWN0TmFtZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAnU3Bhd25Qb2ludCdcbiAgICAgICAgfSxcblxuICAgICAgICBzdWNjZXNzT2JqZWN0TmFtZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAnU3VjY2Vzc1BvaW50J1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLl9wbGF5ZXIgPSB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ3BsYXllcicpO1xuICAgICAgICBpZiAoIXRoaXMuX2lzTWFwTG9hZGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5LRVlCT0FSRCxcbiAgICAgICAgICAgIG9uS2V5UHJlc3NlZDogZnVuY3Rpb24gb25LZXlQcmVzc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fb25LZXlQcmVzc2VkKGtleUNvZGUsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgc2VsZik7XG5cbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHNlbGYuX3RvdWNoaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuX3RvdWNoU3RhcnRQb3MgPSBldmVudC50b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgICAgICB9LCBzZWxmKTtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuX3RvdWNoaW5nKSByZXR1cm47XG5cbiAgICAgICAgICAgIHNlbGYuX3RvdWNoaW5nID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgdG91Y2hQb3MgPSBldmVudC50b3VjaC5nZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgdmFyIG1vdmVkWCA9IHRvdWNoUG9zLnggLSBzZWxmLl90b3VjaFN0YXJ0UG9zLng7XG4gICAgICAgICAgICB2YXIgbW92ZWRZID0gdG91Y2hQb3MueSAtIHNlbGYuX3RvdWNoU3RhcnRQb3MueTtcbiAgICAgICAgICAgIHZhciBtb3ZlZFhWYWx1ZSA9IE1hdGguYWJzKG1vdmVkWCk7XG4gICAgICAgICAgICB2YXIgbW92ZWRZVmFsdWUgPSBNYXRoLmFicyhtb3ZlZFkpO1xuICAgICAgICAgICAgaWYgKG1vdmVkWFZhbHVlIDwgbWluTW92ZVZhbHVlICYmIG1vdmVkWVZhbHVlIDwgbWluTW92ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gdG91Y2ggbW92ZWQgbm90IGVub3VnaFxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5ld1RpbGUgPSBjYy5wKHRoaXMuX2N1clRpbGUueCwgdGhpcy5fY3VyVGlsZS55KTtcbiAgICAgICAgICAgIHZhciBtYXBNb3ZlRGlyID0gTW92ZURpcmVjdGlvbi5OT05FO1xuICAgICAgICAgICAgaWYgKG1vdmVkWFZhbHVlID49IG1vdmVkWVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gbW92ZSB0byByaWdodCBvciBsZWZ0XG4gICAgICAgICAgICAgICAgaWYgKG1vdmVkWCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3VGlsZS54ICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIG1hcE1vdmVEaXIgPSBNb3ZlRGlyZWN0aW9uLkxFRlQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3VGlsZS54IC09IDE7XG4gICAgICAgICAgICAgICAgICAgIG1hcE1vdmVEaXIgPSBNb3ZlRGlyZWN0aW9uLlJJR0hUO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gbW92ZSB0byB1cCBvciBkb3duXG4gICAgICAgICAgICAgICAgaWYgKG1vdmVkWSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3VGlsZS55IC09IDE7XG4gICAgICAgICAgICAgICAgICAgIG1hcE1vdmVEaXIgPSBNb3ZlRGlyZWN0aW9uLlVQO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1RpbGUueSArPSAxO1xuICAgICAgICAgICAgICAgICAgICBtYXBNb3ZlRGlyID0gTW92ZURpcmVjdGlvbi5ET1dOO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3RyeU1vdmVUb05ld1RpbGUobmV3VGlsZSwgbWFwTW92ZURpcik7XG4gICAgICAgIH0sIHNlbGYpO1xuICAgIH0sXG5cbiAgICByZXN0YXJ0R2FtZTogZnVuY3Rpb24gcmVzdGFydEdhbWUoKSB7XG4gICAgICAgIHRoaXMuX3N1Y2NlZWRMYXllci5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5faW5pdE1hcFBvcygpO1xuICAgICAgICB0aGlzLl9jdXJUaWxlID0gdGhpcy5fc3RhcnRUaWxlO1xuICAgICAgICB0aGlzLl91cGRhdGVQbGF5ZXJQb3MoKTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KGVycikge1xuICAgICAgICBpZiAoZXJyKSByZXR1cm47XG5cbiAgICAgICAgLy8gaW5pdCB0aGUgbWFwIHBvc2l0aW9uXG4gICAgICAgIHRoaXMuX2luaXRNYXBQb3MoKTtcblxuICAgICAgICAvLyBpbml0IHRoZSBzdWNjZWVkIGxheWVyXG4gICAgICAgIHRoaXMuX3N1Y2NlZWRMYXllciA9IHRoaXMubm9kZS5nZXRQYXJlbnQoKS5nZXRDaGlsZEJ5TmFtZSgnc3VjY2VlZExheWVyJyk7XG4gICAgICAgIHRoaXMuX3N1Y2NlZWRMYXllci5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICAvLyBpbml0IHRoZSBwbGF5ZXIgcG9zaXRpb25cbiAgICAgICAgdGhpcy5fdGlsZWRNYXAgPSB0aGlzLm5vZGUuZ2V0Q29tcG9uZW50KCdjYy5UaWxlZE1hcCcpO1xuICAgICAgICB2YXIgb2JqZWN0R3JvdXAgPSB0aGlzLl90aWxlZE1hcC5nZXRPYmplY3RHcm91cCh0aGlzLm9iamVjdEdyb3VwTmFtZSk7XG4gICAgICAgIGlmICghb2JqZWN0R3JvdXApIHJldHVybjtcblxuICAgICAgICB2YXIgc3RhcnRPYmogPSBvYmplY3RHcm91cC5nZXRPYmplY3QodGhpcy5zdGFydE9iamVjdE5hbWUpO1xuICAgICAgICB2YXIgZW5kT2JqID0gb2JqZWN0R3JvdXAuZ2V0T2JqZWN0KHRoaXMuc3VjY2Vzc09iamVjdE5hbWUpO1xuICAgICAgICBpZiAoIXN0YXJ0T2JqIHx8ICFlbmRPYmopIHJldHVybjtcblxuICAgICAgICB2YXIgc3RhcnRQb3MgPSBjYy5wKHN0YXJ0T2JqLngsIHN0YXJ0T2JqLnkpO1xuICAgICAgICB2YXIgZW5kUG9zID0gY2MucChlbmRPYmoueCwgZW5kT2JqLnkpO1xuXG4gICAgICAgIHRoaXMuX2xheWVyRmxvb3IgPSB0aGlzLl90aWxlZE1hcC5nZXRMYXllcih0aGlzLmZsb29yTGF5ZXJOYW1lKTtcbiAgICAgICAgdGhpcy5fbGF5ZXJCYXJyaWVyID0gdGhpcy5fdGlsZWRNYXAuZ2V0TGF5ZXIodGhpcy5iYXJyaWVyTGF5ZXJOYW1lKTtcbiAgICAgICAgaWYgKCF0aGlzLl9sYXllckZsb29yIHx8ICF0aGlzLl9sYXllckJhcnJpZXIpIHJldHVybjtcblxuICAgICAgICB0aGlzLl9jdXJUaWxlID0gdGhpcy5fc3RhcnRUaWxlID0gdGhpcy5fZ2V0VGlsZVBvcyhzdGFydFBvcyk7XG4gICAgICAgIHRoaXMuX2VuZFRpbGUgPSB0aGlzLl9nZXRUaWxlUG9zKGVuZFBvcyk7XG5cbiAgICAgICAgaWYgKHRoaXMuX3BsYXllcikge1xuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUGxheWVyUG9zKCk7XG4gICAgICAgICAgICB0aGlzLl9wbGF5ZXIuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2lzTWFwTG9hZGVkID0gdHJ1ZTtcbiAgICB9LFxuXG4gICAgX2luaXRNYXBQb3M6IGZ1bmN0aW9uIF9pbml0TWFwUG9zKCkge1xuICAgICAgICB0aGlzLm5vZGUuc2V0UG9zaXRpb24oY2MudmlzaWJsZVJlY3QuYm90dG9tTGVmdCk7XG4gICAgfSxcblxuICAgIF91cGRhdGVQbGF5ZXJQb3M6IGZ1bmN0aW9uIF91cGRhdGVQbGF5ZXJQb3MoKSB7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLl9sYXllckZsb29yLmdldFBvc2l0aW9uQXQodGhpcy5fY3VyVGlsZSk7XG4gICAgICAgIHRoaXMuX3BsYXllci5zZXRQb3NpdGlvbihwb3MpO1xuICAgIH0sXG5cbiAgICBfZ2V0VGlsZVBvczogZnVuY3Rpb24gX2dldFRpbGVQb3MocG9zSW5QaXhlbCkge1xuICAgICAgICB2YXIgbWFwU2l6ZSA9IHRoaXMubm9kZS5nZXRDb250ZW50U2l6ZSgpO1xuICAgICAgICB2YXIgdGlsZVNpemUgPSB0aGlzLl90aWxlZE1hcC5nZXRUaWxlU2l6ZSgpO1xuICAgICAgICB2YXIgeCA9IE1hdGguZmxvb3IocG9zSW5QaXhlbC54IC8gdGlsZVNpemUud2lkdGgpO1xuICAgICAgICB2YXIgeSA9IE1hdGguZmxvb3IoKG1hcFNpemUuaGVpZ2h0IC0gcG9zSW5QaXhlbC55KSAvIHRpbGVTaXplLmhlaWdodCk7XG5cbiAgICAgICAgcmV0dXJuIGNjLnAoeCwgeSk7XG4gICAgfSxcblxuICAgIF9vbktleVByZXNzZWQ6IGZ1bmN0aW9uIF9vbktleVByZXNzZWQoa2V5Q29kZSwgZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9pc01hcExvYWRlZCB8fCB0aGlzLl9zdWNjZWVkTGF5ZXIuYWN0aXZlKSByZXR1cm47XG5cbiAgICAgICAgdmFyIG5ld1RpbGUgPSBjYy5wKHRoaXMuX2N1clRpbGUueCwgdGhpcy5fY3VyVGlsZS55KTtcbiAgICAgICAgdmFyIG1hcE1vdmVEaXIgPSBNb3ZlRGlyZWN0aW9uLk5PTkU7XG4gICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkudXA6XG4gICAgICAgICAgICAgICAgbmV3VGlsZS55IC09IDE7XG4gICAgICAgICAgICAgICAgbWFwTW92ZURpciA9IE1vdmVEaXJlY3Rpb24uRE9XTjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgY2MuS0VZLmRvd246XG4gICAgICAgICAgICAgICAgbmV3VGlsZS55ICs9IDE7XG4gICAgICAgICAgICAgICAgbWFwTW92ZURpciA9IE1vdmVEaXJlY3Rpb24uVVA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGNjLktFWS5sZWZ0OlxuICAgICAgICAgICAgICAgIG5ld1RpbGUueCAtPSAxO1xuICAgICAgICAgICAgICAgIG1hcE1vdmVEaXIgPSBNb3ZlRGlyZWN0aW9uLlJJR0hUO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjYy5LRVkucmlnaHQ6XG4gICAgICAgICAgICAgICAgbmV3VGlsZS54ICs9IDE7XG4gICAgICAgICAgICAgICAgbWFwTW92ZURpciA9IE1vdmVEaXJlY3Rpb24uTEVGVDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdHJ5TW92ZVRvTmV3VGlsZShuZXdUaWxlLCBtYXBNb3ZlRGlyKTtcbiAgICB9LFxuXG4gICAgX3RyeU1vdmVUb05ld1RpbGU6IGZ1bmN0aW9uIF90cnlNb3ZlVG9OZXdUaWxlKG5ld1RpbGUsIG1hcE1vdmVEaXIpIHtcbiAgICAgICAgdmFyIG1hcFNpemUgPSB0aGlzLl90aWxlZE1hcC5nZXRNYXBTaXplKCk7XG4gICAgICAgIGlmIChuZXdUaWxlLnggPCAwIHx8IG5ld1RpbGUueCA+PSBtYXBTaXplLndpZHRoKSByZXR1cm47XG4gICAgICAgIGlmIChuZXdUaWxlLnkgPCAwIHx8IG5ld1RpbGUueSA+PSBtYXBTaXplLmhlaWdodCkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0aGlzLl9sYXllckJhcnJpZXIuZ2V0VGlsZUdJREF0KG5ld1RpbGUpKSB7XG4gICAgICAgICAgICBjYy5sb2coJ1RoaXMgd2F5IGlzIGJsb2NrZWQhJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgdGhlIHBsYXllciBwb3NpdGlvblxuICAgICAgICB0aGlzLl9jdXJUaWxlID0gbmV3VGlsZTtcbiAgICAgICAgdGhpcy5fdXBkYXRlUGxheWVyUG9zKCk7XG5cbiAgICAgICAgLy8gbW92ZSB0aGUgbWFwIGlmIG5lY2Vzc2FyeVxuICAgICAgICB0aGlzLl90cnlNb3ZlTWFwKG1hcE1vdmVEaXIpO1xuXG4gICAgICAgIC8vIGNoZWNrIHRoZSBwbGF5ZXIgaXMgc3VjY2VzcyBvciBub3RcbiAgICAgICAgaWYgKGNjLnBvaW50RXF1YWxUb1BvaW50KHRoaXMuX2N1clRpbGUsIHRoaXMuX2VuZFRpbGUpKSB7XG4gICAgICAgICAgICBjYy5sb2coJ3N1Y2NlZWQnKTtcbiAgICAgICAgICAgIHRoaXMuX3N1Y2NlZWRMYXllci5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF90cnlNb3ZlTWFwOiBmdW5jdGlvbiBfdHJ5TW92ZU1hcChtb3ZlRGlyKSB7XG4gICAgICAgIC8vIGdldCBuZWNlc3NhcnkgZGF0YVxuICAgICAgICB2YXIgbWFwQ29udGVudFNpemUgPSB0aGlzLm5vZGUuZ2V0Q29udGVudFNpemUoKTtcbiAgICAgICAgdmFyIG1hcFBvcyA9IHRoaXMubm9kZS5nZXRQb3NpdGlvbigpO1xuICAgICAgICB2YXIgcGxheWVyUG9zID0gdGhpcy5fcGxheWVyLmdldFBvc2l0aW9uKCk7XG4gICAgICAgIHZhciB2aWV3U2l6ZSA9IGNjLnNpemUoY2MudmlzaWJsZVJlY3Qud2lkdGgsIGNjLnZpc2libGVSZWN0LmhlaWdodCk7XG4gICAgICAgIHZhciB0aWxlU2l6ZSA9IHRoaXMuX3RpbGVkTWFwLmdldFRpbGVTaXplKCk7XG4gICAgICAgIHZhciBtaW5EaXNYID0gbWluVGlsZXNDb3VudCAqIHRpbGVTaXplLndpZHRoO1xuICAgICAgICB2YXIgbWluRGlzWSA9IG1pblRpbGVzQ291bnQgKiB0aWxlU2l6ZS5oZWlnaHQ7XG5cbiAgICAgICAgdmFyIGRpc1ggPSBwbGF5ZXJQb3MueCArIG1hcFBvcy54O1xuICAgICAgICB2YXIgZGlzWSA9IHBsYXllclBvcy55ICsgbWFwUG9zLnk7XG4gICAgICAgIHZhciBuZXdQb3M7XG4gICAgICAgIHN3aXRjaCAobW92ZURpcikge1xuICAgICAgICAgICAgY2FzZSBNb3ZlRGlyZWN0aW9uLlVQOlxuICAgICAgICAgICAgICAgIGlmIChkaXNZIDwgbWluRGlzWSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdQb3MgPSBjYy5wKG1hcFBvcy54LCBtYXBQb3MueSArIHRpbGVTaXplLmhlaWdodCAqIG1hcE1vdmVTdGVwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIE1vdmVEaXJlY3Rpb24uRE9XTjpcbiAgICAgICAgICAgICAgICBpZiAodmlld1NpemUuaGVpZ2h0IC0gZGlzWSAtIHRpbGVTaXplLmhlaWdodCA8IG1pbkRpc1kpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zID0gY2MucChtYXBQb3MueCwgbWFwUG9zLnkgLSB0aWxlU2l6ZS5oZWlnaHQgKiBtYXBNb3ZlU3RlcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBNb3ZlRGlyZWN0aW9uLkxFRlQ6XG4gICAgICAgICAgICAgICAgaWYgKHZpZXdTaXplLndpZHRoIC0gZGlzWCAtIHRpbGVTaXplLndpZHRoIDwgbWluRGlzWCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdQb3MgPSBjYy5wKG1hcFBvcy54IC0gdGlsZVNpemUud2lkdGggKiBtYXBNb3ZlU3RlcCwgbWFwUG9zLnkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgTW92ZURpcmVjdGlvbi5SSUdIVDpcbiAgICAgICAgICAgICAgICBpZiAoZGlzWCA8IG1pbkRpc1gpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3UG9zID0gY2MucChtYXBQb3MueCArIHRpbGVTaXplLndpZHRoICogbWFwTW92ZVN0ZXAsIG1hcFBvcy55KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXdQb3MpIHtcbiAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgcG9zaXRpb24gcmFuZ2Ugb2YgbWFwXG4gICAgICAgICAgICB2YXIgbWluWCA9IHZpZXdTaXplLndpZHRoIC0gbWFwQ29udGVudFNpemUud2lkdGggLSBjYy52aXNpYmxlUmVjdC5sZWZ0O1xuICAgICAgICAgICAgdmFyIG1heFggPSBjYy52aXNpYmxlUmVjdC5sZWZ0Lng7XG4gICAgICAgICAgICB2YXIgbWluWSA9IHZpZXdTaXplLmhlaWdodCAtIG1hcENvbnRlbnRTaXplLmhlaWdodCAtIGNjLnZpc2libGVSZWN0LmJvdHRvbTtcbiAgICAgICAgICAgIHZhciBtYXhZID0gY2MudmlzaWJsZVJlY3QuYm90dG9tLnk7XG5cbiAgICAgICAgICAgIGlmIChuZXdQb3MueCA8IG1pblgpIG5ld1Bvcy54ID0gbWluWDtcbiAgICAgICAgICAgIGlmIChuZXdQb3MueCA+IG1heFgpIG5ld1Bvcy54ID0gbWF4WDtcbiAgICAgICAgICAgIGlmIChuZXdQb3MueSA8IG1pblkpIG5ld1Bvcy55ID0gbWluWTtcbiAgICAgICAgICAgIGlmIChuZXdQb3MueSA+IG1heFkpIG5ld1Bvcy55ID0gbWF4WTtcblxuICAgICAgICAgICAgaWYgKCFjYy5wb2ludEVxdWFsVG9Qb2ludChuZXdQb3MsIG1hcFBvcykpIHtcbiAgICAgICAgICAgICAgICBjYy5sb2coJ01vdmUgdGhlIG1hcCB0byBuZXcgcG9zaXRpb246ICcsIG5ld1Bvcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnNldFBvc2l0aW9uKG5ld1Bvcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzkzNDFmM2ZEZEJNakpMS2g0RCtrSkpLJywgJ1JlZmVyZW5jZVR5cGVQcm9wZXJ0aWVzJyk7XG4vLyBjYXNlcy8wNV9zY3JpcHRpbmcvMDFfcHJvcGVydGllcy9SZWZlcmVuY2VUeXBlUHJvcGVydGllcy5qc1xuXG52YXIgTXlDdXN0b21Db21wb25lbnQgPSByZXF1aXJlKCdNeUN1c3RvbUNvbXBvbmVudCcpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIG15Tm9kZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuICAgICAgICBteVNwcml0ZToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIG15TGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIG15Q29tcG9uZW50OiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBNeUN1c3RvbUNvbXBvbmVudFxuICAgICAgICB9LFxuICAgICAgICBteVNwcml0ZUZyYW1lOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVGcmFtZVxuICAgICAgICB9LFxuICAgICAgICBteUF0bGFzOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5TcHJpdGVBdGxhc1xuICAgICAgICB9LFxuICAgICAgICBteVByZWZhYjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG4gICAgICAgIG15QXVkaW9DbGlwOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm15TGFiZWwuc3RyaW5nID0gdGhpcy5teUNvbXBvbmVudC5nZXRQb3dlcigpLnRvU3RyaW5nKCk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZVxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7fVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc0NzNiOHd4czU1T3NKdm94VmRZQ3pURicsICdTY2VuZUxpc3QnKTtcbi8vIHNjcmlwdHMvR2xvYmFsL1NjZW5lTGlzdC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGl0ZW1QcmVmYWI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNyZWF0ZUl0ZW06IGZ1bmN0aW9uIGNyZWF0ZUl0ZW0oeCwgeSwgbmFtZSwgdXJsKSB7XG4gICAgICAgIHZhciBpdGVtID0gY2MuaW5zdGFudGlhdGUodGhpcy5pdGVtUHJlZmFiKTtcbiAgICAgICAgdmFyIGl0ZW1Db21wID0gaXRlbS5nZXRDb21wb25lbnQoJ0xpc3RJdGVtJyk7XG4gICAgICAgIHZhciBsYWJlbCA9IGl0ZW1Db21wLmxhYmVsO1xuICAgICAgICBsYWJlbC5zdHJpbmcgPSBuYW1lO1xuXG4gICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgIGl0ZW1Db21wLnVybCA9IHVybDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGl0ZW0ud2lkdGggPSB3O1xuICAgICAgICBpdGVtLnggPSB4O1xuICAgICAgICBpdGVtLnkgPSB5O1xuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQoaXRlbSk7XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHNjZW5lcyA9IGNjLmdhbWUuX3NjZW5lSW5mb3M7XG4gICAgICAgIHZhciBsaXN0ID0ge307XG4gICAgICAgIGlmIChzY2VuZXMpIHtcbiAgICAgICAgICAgIHZhciBpLCBqO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHNjZW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHZhciB1cmwgPSBzY2VuZXNbaV0udXJsO1xuICAgICAgICAgICAgICAgIHZhciBkaXJuYW1lID0gY2MucGF0aC5kaXJuYW1lKHVybCkucmVwbGFjZSgnZGI6Ly9hc3NldHMvY2FzZXMvJywgJycpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRpcm5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChkaXJuYW1lID09PSAnZGI6Ly9hc3NldHMvcmVzb3VyY2VzL3Rlc3QgYXNzZXRzJykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHNjZW5lbmFtZSA9IGNjLnBhdGguYmFzZW5hbWUodXJsLCAnLmZpcmUnKTtcbiAgICAgICAgICAgICAgICBpZiAoc2NlbmVuYW1lID09PSAnVGVzdExpc3QnKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGlmICghZGlybmFtZSkgZGlybmFtZSA9ICdfcm9vdCc7XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0W2Rpcm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RbZGlybmFtZV0gPSB7fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGlzdFtkaXJuYW1lXVtzY2VuZW5hbWVdID0gdXJsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgZGlycyA9IE9iamVjdC5rZXlzKGxpc3QpO1xuICAgICAgICAgICAgZGlycy5zb3J0KCk7XG4gICAgICAgICAgICB2YXIgeSA9IC01MDtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGRpcnMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlybmFtZSA9IGRpcnNbaV07XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmNyZWF0ZUl0ZW0oMTAwLCB5LCBkaXJuYW1lKTtcbiAgICAgICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChjYy5XaWRnZXQpLmxlZnQgPSA2MDtcbiAgICAgICAgICAgICAgICBpdGVtLmdldENvbXBvbmVudChjYy5TcHJpdGUpLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB5IC09IDUwO1xuICAgICAgICAgICAgICAgIHZhciBzY2VuZW5hbWVzID0gT2JqZWN0LmtleXMobGlzdFtkaXJuYW1lXSk7XG4gICAgICAgICAgICAgICAgc2NlbmVuYW1lcy5zb3J0KCk7XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNjZW5lbmFtZXMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9uYW1lID0gc2NlbmVuYW1lc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IGxpc3RbZGlybmFtZV1bX25hbWVdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgX2l0ZW0gPSB0aGlzLmNyZWF0ZUl0ZW0oMjAwLCB5LCBfbmFtZSwgdXJsKTtcbiAgICAgICAgICAgICAgICAgICAgX2l0ZW0uZ2V0Q29tcG9uZW50KGNjLldpZGdldCkubGVmdCA9IDEyMDtcbiAgICAgICAgICAgICAgICAgICAgX2l0ZW0uY29sb3IgPSBjYy5Db2xvci5XSElURTtcbiAgICAgICAgICAgICAgICAgICAgeSAtPSA1MDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm5vZGUuaGVpZ2h0ID0gTWF0aC5hYnMoeSkgKyAzMDtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYWU2ZmNSOGN1RkdSWUhXNTI1VkpEL2snLCAnU2hlZXBBbmltYXRpb24xJyk7XG4vLyBjYXNlcy8wM19nYW1lcGxheS8wM19hbmltYXRpb24vU2hlZXBBbmltYXRpb24xLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc2hlZXBBbmltOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfVxuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBhbmltID0gdGhpcy5zaGVlcEFuaW07XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYW5pbS5wbGF5KCdzaGVlcF9qdW1wJyk7XG4gICAgICAgIH0sIDIwMDApO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWVcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge31cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNWE2ZGZSemhUQk1wNVUzaWw4REptQlonLCAnU2hvd0NvbGxpZGVyJyk7XG4vLyBjYXNlcy9jb2xsaWRlci9TaG93Q29sbGlkZXIuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIG9uQnRuQ2xpY2s6IGZ1bmN0aW9uIG9uQnRuQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgdmFyIHNoYXBlQ2xhc3NOYW1lID0gJ2NjLicgKyB0YXJnZXQubmFtZSArICdDb2xsaWRlcic7XG4gICAgICAgIHZhciBub2RlUGF0aCA9ICdDYW52YXMvcm9vdC8nICsgdGFyZ2V0LnBhcmVudC5uYW1lO1xuICAgICAgICB2YXIgY29sbGlkZXIgPSBjYy5maW5kKG5vZGVQYXRoKS5nZXRDb21wb25lbnQoc2hhcGVDbGFzc05hbWUpO1xuICAgICAgICBjb2xsaWRlci5lbmFibGVkID0gIWNvbGxpZGVyLmVuYWJsZWQ7XG5cbiAgICAgICAgdmFyIGxhYmVsID0gdGFyZ2V0LmdldENoaWxkQnlOYW1lKCdMYWJlbCcpLmdldENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgICAgIGlmIChjb2xsaWRlci5lbmFibGVkKSB7XG4gICAgICAgICAgICBsYWJlbC5zdHJpbmcgPSBsYWJlbC5zdHJpbmcucmVwbGFjZSgnU2hvdycsICdIaWRlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsYWJlbC5zdHJpbmcgPSBsYWJlbC5zdHJpbmcucmVwbGFjZSgnSGlkZScsICdTaG93Jyk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2I2MDY3YTErSjVGVzRHMzBubVZMVS9kJywgJ1NpbXBsZUFjdGlvbicpO1xuLy8gY2FzZXMvMDNfZ2FtZXBsYXkvMDJfYWN0aW9ucy9TaW1wbGVBY3Rpb24uanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGp1bXBlcjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGNvbG9yTm9kZToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuc3F1YXNoQWN0aW9uID0gY2Muc2NhbGVUbygwLjIsIDEsIDAuNik7XG4gICAgICAgIHRoaXMuc3RyZXRjaEFjdGlvbiA9IGNjLnNjYWxlVG8oMC4yLCAxLCAxLjIpO1xuICAgICAgICB0aGlzLnNjYWxlQmFja0FjdGlvbiA9IGNjLnNjYWxlVG8oMC4xLCAxLCAxKTtcbiAgICAgICAgdGhpcy5tb3ZlVXBBY3Rpb24gPSBjYy5tb3ZlQnkoMSwgY2MucCgwLCAyMDApKS5lYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uT3V0KCkpO1xuICAgICAgICB0aGlzLm1vdmVEb3duQWN0aW9uID0gY2MubW92ZUJ5KDEsIGNjLnAoMCwgLTIwMCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcbiAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKHRoaXMuc3F1YXNoQWN0aW9uLCB0aGlzLnN0cmV0Y2hBY3Rpb24sIHRoaXMubW92ZVVwQWN0aW9uLCB0aGlzLnNjYWxlQmFja0FjdGlvbiwgdGhpcy5tb3ZlRG93bkFjdGlvbiwgdGhpcy5zcXVhc2hBY3Rpb24sIHRoaXMuc2NhbGVCYWNrQWN0aW9uKTtcbiAgICAgICAgLy8gdGhpcyBpcyBhIHRlbXAgYXBpIHdoaWNoIHdpbGwgYmUgY29tYmluZWQgdG8gY2MuTm9kZVxuICAgICAgICB0aGlzLmp1bXBlci5ydW5BY3Rpb24oc2VxKTtcblxuICAgICAgICB0aGlzLmNvbG9yTm9kZS5ydW5BY3Rpb24oY2Muc2VxdWVuY2UoY2MudGludFRvKDIsIDI1NSwgMCwgMCksIGNjLmRlbGF5VGltZSgwLjUpLCBjYy5mYWRlT3V0KDEpLCBjYy5kZWxheVRpbWUoMC41KSwgY2MuZmFkZUluKDEpLCBjYy5kZWxheVRpbWUoMC41KSwgY2MudGludFRvKDIsIDI1NSwgMjU1LCAyNTUpKS5yZXBlYXQoMikpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYzNmOTcxaXlDZEloNnhkYU80OVhQMEYnLCAnU2ltcGxlS2V5Ym9hcmRNb3ZlbWVudCcpO1xuLy8gY2FzZXMvMDNfZ2FtZXBsYXkvMDFfcGxheWVyX2NvbnRyb2wvU2ltcGxlS2V5Ym9hcmRNb3ZlbWVudC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHNoZWVwOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgICAvLyBzZXQgaW5pdGlhbCBtb3ZlIGRpcmVjdGlvblxuICAgICAgICBzZWxmLnR1cm5SaWdodCgpO1xuXG4gICAgICAgIC8vYWRkIGtleWJvYXJkIGlucHV0IGxpc3RlbmVyIHRvIGNhbGwgdHVybkxlZnQgYW5kIHR1cm5SaWdodFxuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuS0VZQk9BUkQsXG4gICAgICAgICAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uIG9uS2V5UHJlc3NlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5sZWZ0OlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3R1cm4gbGVmdCcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50dXJuTGVmdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmQ6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLnJpZ2h0OlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3R1cm4gcmlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudHVyblJpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHNlbGYubm9kZSk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZVxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIHRoaXMuc2hlZXAueCArPSB0aGlzLnNwZWVkICogZHQ7XG4gICAgfSxcblxuICAgIHR1cm5MZWZ0OiBmdW5jdGlvbiB0dXJuTGVmdCgpIHtcbiAgICAgICAgdGhpcy5zcGVlZCA9IC0xMDA7XG4gICAgICAgIHRoaXMuc2hlZXAuc2NhbGVYID0gMTtcbiAgICB9LFxuXG4gICAgdHVyblJpZ2h0OiBmdW5jdGlvbiB0dXJuUmlnaHQoKSB7XG4gICAgICAgIHRoaXMuc3BlZWQgPSAxMDA7XG4gICAgICAgIHRoaXMuc2hlZXAuc2NhbGVYID0gLTE7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdmZGUzM3JXdDgxTXZaV083UVEzanYzaicsICdTaW1wbGVNb3Rpb24nKTtcbi8vIGNhc2VzL2NvbGxpZGVyL1NpbXBsZU1vdGlvbi5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbW92ZVNwZWVkOiAxMDAsXG4gICAgICAgIHJvdGF0aW9uU3BlZWQ6IDkwXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIHRoaXMubm9kZS54ICs9IGR0ICogdGhpcy5tb3ZlU3BlZWQ7XG4gICAgICAgIHRoaXMubm9kZS5yb3RhdGlvbiArPSBkdCAqIHRoaXMucm90YXRpb25TcGVlZDtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzkxMTE1T1daOWhKa0lYYXFDTlJVc1pDJywgJ1NwaW5lQ3RybCcpO1xuLy8gY2FzZXMvc3BpbmUvU3BpbmVDdHJsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcbiAgICBlZGl0b3I6IHtcbiAgICAgICAgcmVxdWlyZUNvbXBvbmVudDogc3AuU2tlbGV0b25cbiAgICB9LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBtaXhUaW1lOiAwLjJcbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzcGluZSA9IHRoaXMuc3BpbmUgPSB0aGlzLmdldENvbXBvbmVudCgnc3AuU2tlbGV0b24nKTtcbiAgICAgICAgdGhpcy5fc2V0TWl4KCd3YWxrJywgJ3J1bicpO1xuICAgICAgICB0aGlzLl9zZXRNaXgoJ3J1bicsICdqdW1wJyk7XG4gICAgICAgIHRoaXMuX3NldE1peCgnd2FsaycsICdqdW1wJyk7XG5cbiAgICAgICAgc3BpbmUuc2V0U3RhcnRMaXN0ZW5lcihmdW5jdGlvbiAodHJhY2spIHtcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IHNwaW5lLmdldFN0YXRlKCkuZ2V0Q3VycmVudCh0cmFjayk7XG4gICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICB2YXIgYW5pbWF0aW9uTmFtZSA9IGVudHJ5LmFuaW1hdGlvbiA/IGVudHJ5LmFuaW1hdGlvbi5uYW1lIDogXCJcIjtcbiAgICAgICAgICAgICAgICBjYy5sb2coXCJbdHJhY2sgJXNdIHN0YXJ0OiAlc1wiLCB0cmFjaywgYW5pbWF0aW9uTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzcGluZS5zZXRFbmRMaXN0ZW5lcihmdW5jdGlvbiAodHJhY2spIHtcbiAgICAgICAgICAgIGNjLmxvZyhcIlt0cmFjayAlc10gZW5kXCIsIHRyYWNrKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNwaW5lLnNldENvbXBsZXRlTGlzdGVuZXIoZnVuY3Rpb24gKHRyYWNrLCBsb29wQ291bnQpIHtcbiAgICAgICAgICAgIGNjLmxvZyhcIlt0cmFjayAlc10gY29tcGxldGU6ICVzXCIsIHRyYWNrLCBsb29wQ291bnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3BpbmUuc2V0RXZlbnRMaXN0ZW5lcihmdW5jdGlvbiAodHJhY2ssIGV2ZW50KSB7XG4gICAgICAgICAgICBjYy5sb2coXCJbdHJhY2sgJXNdIGV2ZW50OiAlcywgJXMsICVzLCAlc1wiLCB0cmFjaywgZXZlbnQuZGF0YS5uYW1lLCBldmVudC5pbnRWYWx1ZSwgZXZlbnQuZmxvYXRWYWx1ZSwgZXZlbnQuc3RyaW5nVmFsdWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgIC8vICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9BTExfQVRfT05DRSxcbiAgICAgICAgLy8gICAgIG9uVG91Y2hlc0JlZ2FuICgpIHtcbiAgICAgICAgLy8gICAgICAgICBzZWxmLnRvZ2dsZVRpbWVTY2FsZSgpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9LCB0aGlzLm5vZGUpO1xuICAgIH0sXG5cbiAgICAvLyBPUFRJT05TXG5cbiAgICB0b2dnbGVEZWJ1Z1Nsb3RzOiBmdW5jdGlvbiB0b2dnbGVEZWJ1Z1Nsb3RzKCkge1xuICAgICAgICB0aGlzLnNwaW5lLmRlYnVnU2xvdHMgPSAhdGhpcy5zcGluZS5kZWJ1Z1Nsb3RzO1xuICAgIH0sXG5cbiAgICB0b2dnbGVEZWJ1Z0JvbmVzOiBmdW5jdGlvbiB0b2dnbGVEZWJ1Z0JvbmVzKCkge1xuICAgICAgICB0aGlzLnNwaW5lLmRlYnVnQm9uZXMgPSAhdGhpcy5zcGluZS5kZWJ1Z0JvbmVzO1xuICAgIH0sXG5cbiAgICB0b2dnbGVUaW1lU2NhbGU6IGZ1bmN0aW9uIHRvZ2dsZVRpbWVTY2FsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3BpbmUudGltZVNjYWxlID09PSAxLjApIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbmUudGltZVNjYWxlID0gMC4zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcGluZS50aW1lU2NhbGUgPSAxLjA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gQU5JTUFUSU9OU1xuXG4gICAgc3RvcDogZnVuY3Rpb24gc3RvcCgpIHtcbiAgICAgICAgdGhpcy5zcGluZS5jbGVhclRyYWNrKDApO1xuICAgIH0sXG5cbiAgICB3YWxrOiBmdW5jdGlvbiB3YWxrKCkge1xuICAgICAgICB0aGlzLnNwaW5lLmFkZEFuaW1hdGlvbigwLCAnd2FsaycsIHRydWUsIDApO1xuICAgIH0sXG5cbiAgICBydW46IGZ1bmN0aW9uIHJ1bigpIHtcbiAgICAgICAgdGhpcy5zcGluZS5hZGRBbmltYXRpb24oMCwgJ3J1bicsIHRydWUsIDApO1xuICAgIH0sXG5cbiAgICBqdW1wOiBmdW5jdGlvbiBqdW1wKCkge1xuICAgICAgICB2YXIgb2xkQW5pbSA9IHRoaXMuc3BpbmUuYW5pbWF0aW9uO1xuICAgICAgICB0aGlzLnNwaW5lLnNldEFuaW1hdGlvbigwLCAnanVtcCcsIGZhbHNlKTtcbiAgICAgICAgaWYgKG9sZEFuaW0pIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbmUuYWRkQW5pbWF0aW9uKDAsIG9sZEFuaW0gPT09ICdydW4nID8gJ3J1bicgOiAnd2FsaycsIHRydWUsIDApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNob290OiBmdW5jdGlvbiBzaG9vdCgpIHtcbiAgICAgICAgdGhpcy5zcGluZS5zZXRBbmltYXRpb24oMSwgJ3Nob290JywgZmFsc2UpO1xuICAgIH0sXG5cbiAgICAvL1xuXG4gICAgX3NldE1peDogZnVuY3Rpb24gX3NldE1peChhbmltMSwgYW5pbTIpIHtcbiAgICAgICAgdGhpcy5zcGluZS5zZXRNaXgoYW5pbTEsIGFuaW0yLCB0aGlzLm1peFRpbWUpO1xuICAgICAgICB0aGlzLnNwaW5lLnNldE1peChhbmltMiwgYW5pbTEsIHRoaXMubWl4VGltZSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5MGFlZDg2WHUxRFpvYWV2RmRjdGhZMycsICdTcHJpdGVGb2xsb3dUb3VjaCcpO1xuLy8gY2FzZXMvMDNfZ2FtZXBsYXkvMDFfcGxheWVyX2NvbnRyb2wvU3ByaXRlRm9sbG93VG91Y2guanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICB0b3VjaExvY2F0aW9uRGlzcGxheToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgZm9sbG93ZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgZm9sbG93U3BlZWQ6IDBcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5tb3ZlVG9Qb3MgPSBjYy5wKDAsIDApO1xuICAgICAgICBzZWxmLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgIGNjLmV2ZW50TWFuYWdlci5hZGRMaXN0ZW5lcih7XG4gICAgICAgICAgICBldmVudDogY2MuRXZlbnRMaXN0ZW5lci5UT1VDSF9PTkVfQllfT05FLFxuICAgICAgICAgICAgb25Ub3VjaEJlZ2FuOiBmdW5jdGlvbiBvblRvdWNoQmVnYW4odG91Y2gsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRvdWNoTG9jID0gdG91Y2guZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgICBzZWxmLmlzTW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZWxmLm1vdmVUb1BvcyA9IHNlbGYuZm9sbG93ZXIucGFyZW50LmNvbnZlcnRUb05vZGVTcGFjZUFSKHRvdWNoTG9jKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gZG9uJ3QgY2FwdHVyZSBldmVudFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uVG91Y2hNb3ZlZDogZnVuY3Rpb24gb25Ub3VjaE1vdmVkKHRvdWNoLCBldmVudCkge1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaExvYyA9IHRvdWNoLmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgc2VsZi50b3VjaExvY2F0aW9uRGlzcGxheS5zdHJpbmcgPSAndG91Y2ggKCcgKyBNYXRoLmZsb29yKHRvdWNoTG9jLngpICsgJywgJyArIE1hdGguZmxvb3IodG91Y2hMb2MueSkgKyAnKSc7XG4gICAgICAgICAgICAgICAgc2VsZi5tb3ZlVG9Qb3MgPSBzZWxmLmZvbGxvd2VyLnBhcmVudC5jb252ZXJ0VG9Ob2RlU3BhY2VBUih0b3VjaExvYyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Ub3VjaEVuZGVkOiBmdW5jdGlvbiBvblRvdWNoRW5kZWQodG91Y2gsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pc01vdmluZyA9IGZhbHNlOyAvLyB3aGVuIHRvdWNoIGVuZGVkLCBzdG9wIG1vdmluZ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBzZWxmLm5vZGUpO1xuICAgIH0sXG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWVcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNNb3ZpbmcpIHJldHVybjtcbiAgICAgICAgdmFyIG9sZFBvcyA9IHRoaXMuZm9sbG93ZXIucG9zaXRpb247XG4gICAgICAgIC8vIGdldCBtb3ZlIGRpcmVjdGlvblxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gY2MucE5vcm1hbGl6ZShjYy5wU3ViKHRoaXMubW92ZVRvUG9zLCBvbGRQb3MpKTtcbiAgICAgICAgLy8gbXVsdGlwbHkgZGlyZWN0aW9uIHdpdGggZGlzdGFuY2UgdG8gZ2V0IG5ldyBwb3NpdGlvblxuICAgICAgICB2YXIgbmV3UG9zID0gY2MucEFkZChvbGRQb3MsIGNjLnBNdWx0KGRpcmVjdGlvbiwgdGhpcy5mb2xsb3dTcGVlZCAqIGR0KSk7XG4gICAgICAgIC8vIHNldCBuZXcgcG9zaXRpb25cbiAgICAgICAgdGhpcy5mb2xsb3dlci5zZXRQb3NpdGlvbihuZXdQb3MpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZTY5NDFITHJJVkZMb2t1TVRTOEhTVW8nLCAnVGlsZWRTcHJpdGVDb250cm9sJyk7XG4vLyBjYXNlcy8wMV9ncmFwaGljcy8wMV9zcHJpdGUvVGlsZWRTcHJpdGVDb250cm9sLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuXG4gICAgICAgIHNwZWVkOiAxMDAsXG5cbiAgICAgICAgcHJvZ3Jlc3NCYXI6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTm9kZVxuICAgICAgICB9LFxuXG4gICAgICAgIGdyb3VuZDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvZ3Jlc3NCYXIud2lkdGggPCA1MDApIHtcbiAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3NCYXIud2lkdGggKz0gZHQgKiB0aGlzLnNwZWVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdyb3VuZC53aWR0aCA8IDEwMDApIHtcbiAgICAgICAgICAgIHRoaXMuZ3JvdW5kLndpZHRoICs9IGR0ICogdGhpcy5zcGVlZDtcbiAgICAgICAgfVxuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5NTAyMVg1S2p4UDM2OU9PTmUzMTZzSCcsICdUb3VjaERyYWdnZXInKTtcbi8vIGNhc2VzLzA1X3NjcmlwdGluZy8wM19ldmVudHMvVG91Y2hEcmFnZ2VyLmpzXG5cbnZhciBUb3VjaERyYWdnZXIgPSBjYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcHJvcGFnYXRlOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogZmFsc2VcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyAuLi5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAxNjA7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5vcGFjaXR5ID0gMjU1O1xuICAgICAgICB9LCB0aGlzLm5vZGUpO1xuICAgICAgICB0aGlzLm5vZGUub24oY2MuTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLm9wYWNpdHkgPSAyNTU7XG4gICAgICAgICAgICB2YXIgZGVsdGEgPSBldmVudC50b3VjaC5nZXREZWx0YSgpO1xuICAgICAgICAgICAgdGhpcy54ICs9IGRlbHRhLng7XG4gICAgICAgICAgICB0aGlzLnkgKz0gZGVsdGEueTtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldENvbXBvbmVudChUb3VjaERyYWdnZXIpLnByb3BhZ2F0ZSkgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0sIHRoaXMubm9kZSk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSA9IDE2MDtcbiAgICAgICAgfSwgdGhpcy5ub2RlKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2ExNGJmYUQrZ1JKS3JUVmpLd2l0YzUzJywgJ1RvdWNoRXZlbnQnKTtcbi8vIGNhc2VzLzA1X3NjcmlwdGluZy8wM19ldmVudHMvVG91Y2hFdmVudC5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgfSxcblxuICAgIF9jYWxsYmFjazogbnVsbCxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDEwMDtcbiAgICAgICAgdGhpcy5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IDI1NTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMTAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9DQU5DRUwsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5vcGFjaXR5ID0gMTAwO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Q5YmY2YkZiK3RGNzc5c3RMRW1qelRWJywgJ1ZhbHVlVHlwZVByb3BlcnRpZXMnKTtcbi8vIGNhc2VzLzA1X3NjcmlwdGluZy8wMV9wcm9wZXJ0aWVzL1ZhbHVlVHlwZVByb3BlcnRpZXMuanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBudW1iZXJcbiAgICAgICAgbXlOdW1iZXI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogMCxcbiAgICAgICAgICAgIHR5cGU6IE51bWJlclxuICAgICAgICB9LFxuICAgICAgICAvLyBzdHJpbmdcbiAgICAgICAgbXlTdHJpbmc6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogJ2RlZmF1bHQgdGV4dCcsXG4gICAgICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICAgICAgfSxcbiAgICAgICAgbXlWZWMyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IGNjLlZlYzIuWkVSTyxcbiAgICAgICAgICAgIHR5cGU6IGNjLlZlYzJcbiAgICAgICAgfSxcbiAgICAgICAgbXlDb2xvcjoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBjYy5Db2xvci5XSElURSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkNvbG9yXG4gICAgICAgIH0sXG4gICAgICAgIG15T3RoZXJOdW1iZXI6IDAsXG4gICAgICAgIG15T3RoZXJTdHJpbmc6ICdubyB0eXBlIGRlZmluaXRpb24nLFxuICAgICAgICBteU90aGVyVmVjMjogY2MuVmVjMi5PTkUsXG4gICAgICAgIG15T3RoZXJDb2xvcjogY2MuQ29sb3IuQkxBQ0tcbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZVxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7fVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkZDY1NERGUG9STlZLUldPdVFkTGlFRScsICdlZGl0Ym94Jyk7XG4vLyBjYXNlcy8wMl91aS8wN19lZGl0Qm94L2VkaXRib3guanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIGZvbzoge1xuICAgICAgICAvLyAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAvLyAgICB1cmw6IGNjLlRleHR1cmUyRCwgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgIC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgZGlzcGxheU5hbWU6ICdGb28nLCAvLyBvcHRpb25hbFxuICAgICAgICAvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG4gICAgICAgIC8vIH0sXG4gICAgICAgIC8vIC4uLlxuICAgICAgICBzaW5nbGVMaW5lVGV4dDoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5FZGl0Qm94XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2luZ2xlTGluZVBhc3N3b3JkOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3hcbiAgICAgICAgfSxcblxuICAgICAgICBtdWx0aUxpbmVUZXh0OiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkVkaXRCb3hcbiAgICAgICAgfSxcblxuICAgICAgICBzaG93RWRpdG9yQm94TGFiZWw6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge30sXG5cbiAgICBzaW5nbGVMaW5lRWRpdEJveERpZEJlZ2luRWRpdGluZzogZnVuY3Rpb24gc2luZ2xlTGluZUVkaXRCb3hEaWRCZWdpbkVkaXRpbmcoc2VuZGVyKSB7XG4gICAgICAgIGNjLmxvZyhzZW5kZXIubm9kZS5uYW1lICsgXCIgc2luZ2xlIGxpbmUgZWRpdEJveERpZEJlZ2luRWRpdGluZ1wiKTtcbiAgICB9LFxuXG4gICAgc2luZ2xlTGluZUVkaXRCb3hEaWRDaGFuZ2VkOiBmdW5jdGlvbiBzaW5nbGVMaW5lRWRpdEJveERpZENoYW5nZWQodGV4dCwgc2VuZGVyKSB7XG4gICAgICAgIGNjLmxvZyhzZW5kZXIubm9kZS5uYW1lICsgXCIgc2luZ2xlIGxpbmUgZWRpdEJveERpZENoYW5nZWQ6IFwiICsgdGV4dCk7XG4gICAgfSxcblxuICAgIHNpbmdsZUxpbmVFZGl0Qm94RGlkRW5kRWRpdGluZzogZnVuY3Rpb24gc2luZ2xlTGluZUVkaXRCb3hEaWRFbmRFZGl0aW5nKHNlbmRlcikge1xuICAgICAgICBjYy5sb2coc2VuZGVyLm5vZGUubmFtZSArIFwiIHNpbmdsZSBsaW5lIGVkaXRCb3hEaWRFbmRFZGl0aW5nOiBcIiArIHRoaXMuc2luZ2xlTGluZVRleHQuc3RyaW5nKTtcbiAgICB9LFxuXG4gICAgc2luZ2xlTGluZVBhc3N3b3JkRWRpdEJveERpZEJlZ2luRWRpdGluZzogZnVuY3Rpb24gc2luZ2xlTGluZVBhc3N3b3JkRWRpdEJveERpZEJlZ2luRWRpdGluZyhzZW5kZXIpIHtcbiAgICAgICAgY2MubG9nKHNlbmRlci5ub2RlLm5hbWUgKyBcIiBzaW5nbGUgbGluZSBwYXNzd29yZCBlZGl0Qm94RGlkQmVnaW5FZGl0aW5nXCIpO1xuICAgIH0sXG5cbiAgICBzaW5nbGVMaW5lUGFzc3dvcmRFZGl0Qm94RGlkQ2hhbmdlZDogZnVuY3Rpb24gc2luZ2xlTGluZVBhc3N3b3JkRWRpdEJveERpZENoYW5nZWQodGV4dCwgc2VuZGVyKSB7XG4gICAgICAgIGNjLmxvZyhzZW5kZXIubm9kZS5uYW1lICsgXCIgc2luZ2xlIGxpbmUgcGFzc3dvcmQgZWRpdEJveERpZENoYW5nZWQ6IFwiICsgdGV4dCk7XG4gICAgfSxcblxuICAgIHNpbmdsZUxpbmVQYXNzd29yZEVkaXRCb3hEaWRFbmRFZGl0aW5nOiBmdW5jdGlvbiBzaW5nbGVMaW5lUGFzc3dvcmRFZGl0Qm94RGlkRW5kRWRpdGluZyhzZW5kZXIpIHtcbiAgICAgICAgY2MubG9nKHNlbmRlci5ub2RlLm5hbWUgKyBcIiBzaW5nbGUgbGluZSBwYXNzd29yZCBlZGl0Qm94RGlkRW5kRWRpdGluZzogXCIgKyB0aGlzLnNpbmdsZUxpbmVQYXNzd29yZC5zdHJpbmcpO1xuICAgIH0sXG5cbiAgICBtdWx0aUxpbmVQYXNzd29yZEVkaXRCb3hEaWRCZWdpbkVkaXRpbmc6IGZ1bmN0aW9uIG11bHRpTGluZVBhc3N3b3JkRWRpdEJveERpZEJlZ2luRWRpdGluZyhzZW5kZXIpIHtcbiAgICAgICAgY2MubG9nKHNlbmRlci5ub2RlLm5hbWUgKyBcIiBtdWx0aSBsaW5lIGVkaXRCb3hEaWRCZWdpbkVkaXRpbmdcIik7XG4gICAgfSxcblxuICAgIG11bHRpTGluZVBhc3N3b3JkRWRpdEJveERpZENoYW5nZWQ6IGZ1bmN0aW9uIG11bHRpTGluZVBhc3N3b3JkRWRpdEJveERpZENoYW5nZWQodGV4dCwgc2VuZGVyKSB7XG4gICAgICAgIGNjLmxvZyhzZW5kZXIubm9kZS5uYW1lICsgXCIgbXVsdGkgbGluZSBlZGl0Qm94RGlkQ2hhbmdlZDogXCIgKyB0ZXh0KTtcbiAgICB9LFxuXG4gICAgbXVsdGlMaW5lUGFzc3dvcmRFZGl0Qm94RGlkRW5kRWRpdGluZzogZnVuY3Rpb24gbXVsdGlMaW5lUGFzc3dvcmRFZGl0Qm94RGlkRW5kRWRpdGluZyhzZW5kZXIpIHtcbiAgICAgICAgY2MubG9nKHNlbmRlci5ub2RlLm5hbWUgKyBcIiBtdWx0aSBsaW5lIGVkaXRCb3hEaWRFbmRFZGl0aW5nOiBcIiArIHRoaXMubXVsdGlMaW5lVGV4dC5zdHJpbmcpO1xuICAgIH0sXG4gICAgYnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24gYnV0dG9uQ2xpY2tlZCgpIHtcbiAgICAgICAgY2MubG9nKFwiYnV0dG9uIENsaWNrZWQhXCIpO1xuICAgICAgICBpZiAodGhpcy5zaW5nbGVMaW5lVGV4dC5zdHJpbmcgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0VkaXRvckJveExhYmVsLnN0cmluZyA9IFwiRW50ZXIgVGV4dDogXCIgKyB0aGlzLnNpbmdsZUxpbmVUZXh0LnN0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0VkaXRvckJveExhYmVsLnN0cmluZyA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc5MzBkZUlteG9aSWtwNnVnak1VNVVMVycsICdzY2hlZHVsZUNhbGxiYWNrcycpO1xuLy8gY2FzZXMvMDVfc2NyaXB0aW5nLzA0X3NjaGVkdWxlci9zY2hlZHVsZUNhbGxiYWNrcy5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHRpbWU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogNVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9jYWxsYmFjazogZnVuY3Rpb24gX2NhbGxiYWNrKCkge1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHRoaXMuc2VxKTtcbiAgICAgICAgaWYgKHRoaXMucmVwZWF0KSB7XG4gICAgICAgICAgICB0aGlzLmNvdW50aW5nID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY291bnRpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRpbWUgPSA1O1xuICAgICAgICB0aGlzLmNvdW50ZXIuc3RyaW5nID0gdGhpcy50aW1lLnRvRml4ZWQoMikgKyAnIHMnO1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdmFyIHNxdWFzaEFjdGlvbiA9IGNjLnNjYWxlVG8oMC4yLCAxLCAwLjYpO1xuICAgICAgICB2YXIgc3RyZXRjaEFjdGlvbiA9IGNjLnNjYWxlVG8oMC4yLCAxLCAxLjIpO1xuICAgICAgICB2YXIgc2NhbGVCYWNrQWN0aW9uID0gY2Muc2NhbGVUbygwLjEsIDEsIDEpO1xuICAgICAgICB2YXIgbW92ZVVwQWN0aW9uID0gY2MubW92ZUJ5KDEsIGNjLnAoMCwgMTAwKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKTtcbiAgICAgICAgdmFyIG1vdmVEb3duQWN0aW9uID0gY2MubW92ZUJ5KDEsIGNjLnAoMCwgLTEwMCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcbiAgICAgICAgdGhpcy5zZXEgPSBjYy5zZXF1ZW5jZShzcXVhc2hBY3Rpb24sIHN0cmV0Y2hBY3Rpb24sIG1vdmVVcEFjdGlvbiwgc2NhbGVCYWNrQWN0aW9uLCBtb3ZlRG93bkFjdGlvbiwgc3F1YXNoQWN0aW9uLCBzY2FsZUJhY2tBY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuY291bnRlciA9IGNjLmZpbmQoJ0NhbnZhcy9jb3VudF9sYWJlbCcpLmdldENvbXBvbmVudChjYy5MYWJlbCk7XG4gICAgICAgIHRoaXMuY291bnRlci5zdHJpbmcgPSB0aGlzLnRpbWUudG9GaXhlZCgyKSArICcgcyc7XG4gICAgICAgIHRoaXMuY291bnRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZXBlYXQgPSBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKHRoaXMuY291bnRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMudGltZSAtPSBkdDtcbiAgICAgICAgICAgIHRoaXMuY291bnRlci5zdHJpbmcgPSB0aGlzLnRpbWUudG9GaXhlZCgyKSArICcgcyc7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RvcENvdW50aW5nOiBmdW5jdGlvbiBzdG9wQ291bnRpbmcoKSB7XG4gICAgICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLl9jYWxsYmFjayk7XG4gICAgICAgIHRoaXMuY291bnRpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb3VudGVyLnN0cmluZyA9ICc1LjAwIHMnO1xuICAgICAgICB0aGlzLnRpbWUgPSA1O1xuICAgIH0sXG5cbiAgICByZXBlYXRTY2hlZHVsZTogZnVuY3Rpb24gcmVwZWF0U2NoZWR1bGUoKSB7XG4gICAgICAgIHRoaXMuc3RvcENvdW50aW5nKCk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGUodGhpcy5fY2FsbGJhY2ssIDUpO1xuICAgICAgICB0aGlzLnJlcGVhdCA9IHRydWU7XG4gICAgICAgIHRoaXMuY291bnRpbmcgPSB0cnVlO1xuICAgIH0sXG5cbiAgICBvbmVTY2hlZHVsZTogZnVuY3Rpb24gb25lU2NoZWR1bGUoKSB7XG4gICAgICAgIHRoaXMuc3RvcENvdW50aW5nKCk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVPbmNlKHRoaXMuX2NhbGxiYWNrLCA1KTtcbiAgICAgICAgdGhpcy5yZXBlYXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb3VudGluZyA9IHRydWU7XG4gICAgfSxcblxuICAgIGNhbmNlbFNjaGVkdWxlczogZnVuY3Rpb24gY2FuY2VsU2NoZWR1bGVzKCkge1xuICAgICAgICB0aGlzLnJlcGVhdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN0b3BDb3VudGluZygpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiXX0=
