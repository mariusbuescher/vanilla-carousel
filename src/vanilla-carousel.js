(function(global, factory) {

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(global, global.document);
    } else if (typeof define === 'function' && define.amd) {
        define([], factory(global, global.document));
    } else {
        global.VanillaCarousel = factory(global, global.document);
    }

})(typeof window !== 'undefined' ? window : this, function(window, document) {
    'use strict';

    var VanillaCarousel = function(element, options) {
        this.element = element;
        this.settings = options || {};

        this.settings.stageClass = this.settings.stageClass || 'vanilla-stage';
        this.settings.itemClass = this.settings.itemClass || 'vanilla-item';
        this.settings.noAnimationClass = this.settings.noAnimationClass || 'vanilla-no-animation';
        this.settings.responsive = (this.settings.responsive) ? this.settings.responsive : true;

        var width = element.clientWidth;
        this.currentItem = this.settings.start || 0;
        var starItem = this.currentItem;

        var items = element.children;
        this.itemCount = items.length;
        var realItemCount = this.itemCount;
        realItemCount += (this.settings.loop) ? 2 : 0;

        var innerContainer = document.createElement('div');
        innerContainer.className = this.settings.stageClass;

        innerContainer.style.width = realItemCount * width + 'px';
        this.itemWidth = width;

        while (items.length > 0) {
            var item = items.item(0);

            item.style.width = item.clientWidth + 'px';
            item.classList.add('vanilla-item');
            innerContainer.appendChild(item);
        }

        if ( this.settings.loop === true ) {
            innerContainer.insertBefore(
                innerContainer.children.item(innerContainer.children.length - 1).cloneNode(true),
                innerContainer.children.item(0)
            );
            innerContainer.appendChild(innerContainer.children.item(1).cloneNode(true));
            starItem += 1;
        }

        if (this.settings.responsive) {
            window.addEventListener('resize', function() {

                var width = this.itemWidth = element.clientWidth;
                var itemCount = this.itemCount;
                var stage = this.stageElement;
                var children = stage.children;
                var currentItem = this.currentItem;

                if (this.settings.loop) currentItem += 1;

                itemCount += this.settings.loop ? 2 : 0;

                stage.classList.add(this.settings.noAnimationClass);

                stage.style.width = (width * itemCount) + 'px';
                for (var i = 0; i < children.length; i++) {
                    children.item(i).style.width = width + 'px';
                }

                stage.style.transform = 'translate(-' + (currentItem * width) + 'px, 0)';

                setTimeout(function() {
                    stage.classList.remove(this.settings.noAnimationClass);
                }.bind(this), 10);

            }.bind(this));
        }

        innerContainer.style.transform = 'translate(-' + (starItem * this.itemWidth) + 'px, 0)';

        element.innerHTML = '';
        element.appendChild(innerContainer);

        this.stageElement = innerContainer;

        return this;
    };

    VanillaCarousel.prototype.next = function() {
        var newItem = this.currentItem + 1;
        if (!this.settings.loop && newItem > this.itemCount - 1) newItem = this.itemCount - 1;
        this.goto(newItem);
    };

    VanillaCarousel.prototype.prev = function() {
        var newItem = this.currentItem - 1;
        if (!this.settings.loop && newItem < 0) newItem = 0;
        this.goto(newItem);
    };

    VanillaCarousel.prototype.goto = function(index) {
        if (index === this.currentItem) return;

        var newIndex = index;
        var realIndex = (this.settings.loop) ? index + 1 : index;

        if (index < 0) {
            newIndex = this.itemCount - 1;
        } else if (index > this.itemCount - 1) {
            newIndex = 0;
        }

        this.currentItem = newIndex;

        if (index < 0 || index > this.itemCount - 1) {
            var transitionEndCb = function() {
                this.stageElement.removeEventListener('transitionend', transitionEndCb);

                var newRealIndex = newIndex + 1;

                this.stageElement.classList.add(this.settings.noAnimationClass);

                this.stageElement.style.transform = 'translate(-' + (newRealIndex * this.itemWidth) + 'px, 0)';

                setTimeout(function() {
                    this.stageElement.classList.remove(this.settings.noAnimationClass);
                }.bind(this), 10);
            }.bind(this);

            this.stageElement.addEventListener('transitionend', transitionEndCb);
        }

        this.stageElement.style.transform = 'translate(-' + (realIndex * this.itemWidth) + 'px, 0)';

    };

    return VanillaCarousel;

});
