/**
 * A-Frame component, that shows and hides the 'AR' video feed when the user looks down.
 * @type {Object}
 *
 * @author Barthy Bonhomme <post@barthy.koeln>
 * @licence MIT
 */
export const ArcHandCamera = {

  schema: {

    /**
     * View angle in degrees below which the camera stream fades in.
     */
    angle: {
      type: 'number',
      default: -30
    },

    /**
     * Duration to wait after the view angle falls below the defined value and after which the camera stream fades in.
     */
    delay: {
      type: 'number',
      default: 300
    },

    /**
     * Whether the component should be rendered on top of everything else or be able to go through other elements.
     */
    onTop: {
      type: 'boolean',
      default: true
    },

    /**
     * Video element id. Necessary if this component is used multiple times in an A-Frame scene.
     */
    id: {
      type: 'string',
      default: 'arc-hand-camera-video'
    }
  },

  /**
   * Initialise component
   */
  init () {
    /**
     * Whether the component is enabled or not
     * @type {boolean}
     */
    this.enabled = false

    /**
     * Stores the 'world' direction in which the camera looks
     * @type {Vector3}
     */
    this.directionVector = new THREE.Vector3(0, 0, 0)

    /**
     * Current angle in radians
     * @type {number}
     */
    this.angleRadians = 0

    /**
     * Stores the last/previous camera angle in radians
     * @type {number}
     */
    this.lastCameraAngle = 0

    /**
     * Stores the timeout id for debouncing/delaying the video show/hide operation
     * @type {?number}
     */
    this.timeout = null

    /**
     * Video element used to stream camera input
     * @type {HTMLElement}
     */
    this.video = document.createElement('VIDEO')

    this.video.id = this.data.id
    this.video.setAttribute('crossorigin', 'anonymous')
    this.video.setAttribute('playsinline', 'true')
    this.video.setAttribute('muted', 'true')
    this.video.setAttribute('style', 'width:1024px; height:512px;')

    this.bindFunctions()
    this.addEventListeners()

    this.updateAngle()
    this.hideVideo()
  },

  /**
   * Update schema data calculations
   */
  update () {
    this.updateAngle()

    const videoMesh = this.el.getObject3D('mesh')
    videoMesh.renderOrder = this.data.onTop ? 990 : undefined
    videoMesh.material.depthTest = this.data.onTop
    videoMesh.material.depthWrite = this.data.onTop
  },

  /**
   * Calculate the angle in radians from degrees
   */
  updateAngle () {
    this.angleRadians = (this.data.angle / 180) * Math.PI
  },

  /**
   * Bind functions to the component
   */
  bindFunctions () {
    this.showVideo = this.showVideo.bind(this)
    this.hideVideo = this.hideVideo.bind(this)
    this.enterVR = this.enterVR.bind(this)
    this.exitVR = this.exitVR.bind(this)
    this.arcRemoteConnected = this.arcRemoteConnected.bind(this)
  },

  /**
   * Add event listeners
   */
  addEventListeners () {
    this.el.sceneEl.addEventListener('enter-vr', this.enterVR)
    this.el.sceneEl.addEventListener('exit-vr', this.exitVR)
    this.el.sceneEl.addEventListener('arc-remote-connected', this.arcRemoteConnected)
  },

  /**
   * Start streaming Video
   */
  async arcRemoteConnected () {
    if (this.video.srcObject) {
      return
    }

    try {
      this.video.srcObject = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 1024,
          height: 512,
          facingMode: 'environment'
        },
        audio: false
      })

      this.el.appendChild(this.video)
      this.el.setAttribute('src', `#${this.data.id}`)
    } catch (error) {
      console.info('hand camera not started because: ', error)
    }
  },

  /**
   * Set the camera reference
   */
  enterVR () {
    this.enabled = true
  },

  /**
   * Remove the camera reference
   */
  exitVR () {
    this.enabled = false
    this.hideVideo()
  },

  /**
   * Check camera angle and show or hide the video feed
   */
  tick () {
    if (!this.enabled || !this.el.object3D || !this.video.srcObject) {
      return
    }

    this.el.sceneEl.camera.getWorldDirection(this.directionVector)

    if (this.lastCameraAngle >= this.angleRadians && this.directionVector.y < this.angleRadians) {
      this.debounceShowVideo()
    } else if (this.lastCameraAngle <= this.angleRadians && this.directionVector.y > this.angleRadians) {
      this.hideVideo()
    }

    this.lastCameraAngle = this.directionVector.y
  },

  /**
   * Set a timer that will show the video
   */
  debounceShowVideo () {
    this.timeout = setTimeout(this.showVideo, this.data.delay)
  },

  /**
   * Make the video visible
   */
  showVideo () {
    this.video.play()
    this.el.emit('activate')
  },

  /**
   * Hide the video
   */
  hideVideo () {
    clearTimeout(this.timeout)
    this.el.emit('deactivate')
    this.video.pause()
  }
}
