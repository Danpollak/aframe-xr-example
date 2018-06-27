if (typeof AFRAME === 'undefined') {
  throw new Error(
    'Component attempted to register before AFRAME was available.'
  )
}

const setComponentProperty = AFRAME.utils.entity.setComponentProperty

AFRAME.registerComponent('spawn', {
  // Allows for multiple instances of animations
  dependencies: ['tag'],

  schema: {},

  init: function () {
    this.bindMethods()
    this.editor = this.el.sceneEl.getAttribute('editor') === 'true'
    this.setListener = false
    this.tapData = null

    // make the object invisible on start
    this.el.setAttribute('visible', false);
    window.addEventListener('touchstart', this.onTouchStart)
    this.el.sceneEl.addEventListener('updateFrame', this.handleSpawn)

  },

  handleSpawn: function (data) {
    const self = this
    const frame = data.detail
    if (this.tapData !== null) {
    const x = this.tapData[0];
    const y = this.tapData[1];
    this.tapData = null;
    data.detail.findAnchor(x, y).then(function (anchorOffset) {
        if (anchorOffset) {
            // will set the position and orientation based on the anchorOffset attached to the entity
            const anchor = self.el
            anchor.setAttribute('xranchor', {})
            anchor.components.xranchor.anchorOffset = anchorOffset
            anchor.object3D.visible = true
            }
    })
    .catch(function (err) {
        console.error('Error in hit test', err)
    })
    }
  },

  onTouchStart: function (ev) {
    if (!ev.touches || ev.touches.length === 0) {
      console.error('No touches on touch event', ev)
      return
    }
    this.tapData = [
      ev.touches[0].clientX / window.innerWidth,
      ev.touches[0].clientY / window.innerHeight
    ]
  },

  bindMethods: function () {
    this.onTouchStart = this.onTouchStart.bind(this)
    this.handleSpawn = this.handleSpawn.bind(this)
  }
})
