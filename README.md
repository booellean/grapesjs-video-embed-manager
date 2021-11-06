# Video Embed Manager

[DEMO](https://grapesjs-video-embed-manager.glitch.me)

### HTML
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/grapesjs-video-embed-manager"></script>

<div id="gjs"></div>
```

### JS
```js
const editor = grapesjs.init({
	container: '#gjs',
  height: '100%',
  storageManager: false,
  plugins: ['grapesjs-video-embed-manager'],
});
```

## Summary

* Plugin name: `grapesjs-video-embed-manager`
* A wrapper that turns the grapesjs video component into a dynamic experience, opening a modal similar to the GrapesJS Asset Manager. This plugin has been optimized to work with Youtube, Vimeo, and a local video server. No loading of components or blocks necessary.

## Options
### *See src/video_media_manager/config/config.js for detailed information about each option.

| Option | Description | Default |
|-|-|-
| `resources` | The resources to query to get your videos. Valid options are `youtube`, `vimeo`, and `local`. | [] |
| `youtubeLoadUrl` | The server url used to manage getting videos.  | null |
| `youtubeLoadCallback` | Only for youtube since there are public videos. This is a custom callback that can be used to obtain the vidoes instead. | null |
| `youtubeBeforeLoad` | ADVANCED: If you need to alter the data before it is loaded. This is best used if you have little control over how the data is returned. | null |
| `youtubeBeforeInsert` | ADVANCED: If you want to alter the video data before it is inserted. This will probably only be used if you have a custom video component. | null |
| `youtubeData` | This is a pseudo option mainly used for demo purposes. Used to manage what videos are currently showing on page. | null |
| `youtubeHeaders` | Any headers that need to be passed in your request. | {} |
| `youtubeParams` | Any parameters that need to be passed in your request. | {} |
| `vimeoLoadUrl` | See youtube description. Same value used for Vimeo. | null |
| `vimeoBeforeLoad` | See youtube description. Same value used for Vimeo. | null |
| `vimeoBeforeInsert` | See youtube description. Same value used for Vimeo. | null |
| `vimeoData` | See youtube description. Same value used for Vimeo. | null |
| `vimeoHeaders` | See youtube description. Same value used for Vimeo. | {} |
| `vimeoParams` | See youtube description. Same value used for Vimeo. | {} |
| `localLoadUrl` | See youtube description. Same value used for your local videos. | null |
| `localBeforeLoad` | See youtube description. Same value used for your local videos. | null |
| `localBeforeInsert` | See youtube description. Same value used for your local videos. | null |
| `localData` | See youtube description. Same value used for your local videos. | null |
| `localHeaders` | See youtube description. Same value used for your local videos. | {} |
| `localParams` | See youtube description. Same value used for your local videos. | {} |
| `preloader` | image src string used for the loading preloader. If not provided, the manager will just say "loading".| null |
| `per_page` | The amount of videos to show in manager view. Will be used in your server queries. | 12 |

## Query Values for local development

| Option | Description |
|-|-
| per_page | This will tell your server how many videos to return. |
| page | This will tell your server which page number you are requesting |
| page_token | Used only for youtube, but I suppose you could emulate their style and use page tokens instead of page numbers |

## What's with the Error Codes?

If the Video Manager errors due to improper setup or other factor, sometimes a message accompanied by an HTTP Status Code will appear. Technically, some of the errors are client side and not from a server, however, there aren't good status codes for client side (unless I am completely in the dark). Because of this, a somewhat descriptive HTTP Status Code will be used alongside the error so you can make an educated guess as to why something has happened.

## Download

* CDN
  * `https://unpkg.com/grapesjs-video-embed-manager`
* NPM
  * `npm i grapesjs-video-embed-manager`
* GIT
  * `git clone https://github.com/booellean/grapesjs-video-embed-manager.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/grapesjs-video-embed-manager.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['grapesjs-video-embed-manager'],
      pluginsOpts: {
        'grapesjs-video-embed-manager': { 
          preloader : 'https://gifimage.net/wp-content/uploads/2018/04/loading-icon-gif-6.gif',
          resources: [ 'youtube', 'vimeo', 'local' ],
          per_page: 5,
          youtubeLoadCallback: (data) => data,
          youtubeLoadUrl: '/fake/callback'
      }
  });
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import plugin from 'grapesjs-video-embed-manager';
import 'grapesjs/dist/css/grapes.min.css';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [grapesjs-video-embed-manager],
  pluginsOpts: {
    'grapesjs-video-embed-manager': { /* options */ }
  }
  // or
  plugins: [
    editor => ['grapesjs-video-embed-manager'](editor, { /* options */ }),
  ],
});
```



## Development

Clone the repository

```sh
$ git clone https://github.com/booellean/grapesjs-video-embed-manager.git
$ cd grapesjs-video-embed-manager
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build the source

```sh
$ npm run build
```



## License

MIT

## Important Note
This plugin adds to the dblclick event of the video component. This was decided by the dev so that the end user wouldn't have to load a custom component that is exactly the same as the video componenet, but with this one feature. It has been tested to not override any future dblcick events if the video component is ever updated.
