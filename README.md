# ARCS A-Frame Hand Camera

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

A-Frame component that streams a camera feed onto a video texture.
Used to show the users hands holding a remote control device.

## Installation

Use one of the following:

```bash
yarn add arcs-vr/arc-aframe-hand-camera
npm install arcs-vr/arc-aframe-hand-camera
```

## Usage

Import the component files. There are then available as A-Frame components.
The components will react to the `arcs-connect` event and automatically enable all remote events they require.

```js
import 'arc-aframe-hand-camera'
```

### Schema:

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `angle` | Number | -30 | Angle in degrees. If the uesr's view angle passes below this number, the video stream is faded in. | |
| `delay` | Number | 300 | Time in milliseconds used to debounce the showing and hiding of the video texture. |
| `onTop` | Boolean | true | Whether the component should be rendered on top of everything else or be able to go through other elements. |
| `id` | String | 'arc-hand-camera-video' | Video element id. Necessary if this component is used multiple times in an A-Frame scene. |

### Markup:

Use an `a-video` tag and animate its opacity:

```html
<a-video animation__activate="property: opacity; from: 0; to: 1; startEvents: activate; dur: 200; delay: 100;"
         animation__activate_visibility="property: visible; from: false; to: true; startEvents: activate; dur: 0;"
         animation__deactivate="property: opacity; from: 1; to: 0; startEvents: deactivate; dur: 200;"
         animation__deactivate_visibility="property: visible; from: true; to: false; startEvents: deactivate; dur: 0; delay: 200;"
         arcs-ar-camera
         opacity="0"
         transparent="true"
         visible="true"
/>
```

I suggest attaching it to the player or camera object in order to make it a head-down display (HDD). 

## More

Look at the [`arcs-vr/arc-aframe-vue-template`](https://github.com/arcs-vr/arc-aframe-vue-template) for easier setup and at the
[`arcs-vr/arc-aframe-vue-demo`](https://github.com/arcs-vr/arc-aframe-vue-demo) for example usage.
