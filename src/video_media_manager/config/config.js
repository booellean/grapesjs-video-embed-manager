export default {
    // Default endpoints
    // eg. [ 'youtube', 'vimeo', 'local' ]

    resources : [],

    // For demonstration purposes, but I suppose you could hardcode your videos here.
    // These objects will contain an array that contains a list of information.
    // Local data is very simple, see the example_api_return
    // For Vimeo and Youtube, see the example data and refer to the 
    // API documentation for setup info
    youtubeData: null,

    vimeoData: null,

    localData: null,
  
    // Content to show when modal is loading. If url is passed, it will be an image
    preloader: null,
  
    // Amount to paginate with
    per_page: 12,
  
    // Custom headers to pass with the upload request
    youtubeHeaders: {},

    vimeoHeaders: {},

    localHeaders: {},
  
    // Custom parameters to pass with the upload request, eg. csrf token
    youtubeParams: {},

    vimeoParams: {},

    localParams: {},

    // The local url for video list thumbnail data
    localLoadUrl: null,

    // The youtube url for video list thumbnail data
    youtubeLoadUrl: null,

    // The vimeo url for video list thumbnail data
    vimeoLoadUrl: null,

    // If you prefer to use a callback on the frontend, then put it here
    // This plugin will always default to the url, so that must be set to null
    // This option is only for youtube since you can query public videos
    // If you are doing anything with promises, remeber to pass this as an async function
    // NEVER pass private data here. It is public and can be seen by everyone, even if only trusted users are using this
    // @example
    // youtubeLoadCallback: async (query, params) => { // query and params will be passed by the plugin by default, but are optional depending on your callback
    //                          const {google} = require('googleapis');
    //
    //                          const youtube = google.youtube({
    //                            version: 'v3',
    //                            auth: your_public_auth_key,
    //                          });
    //
    //                          let api_key = {EXAMPLE_KEY}
    //                          let parts = self.options.youtube_playlist_parts.join(',');
    //
    //                          let query = {
    //                            part: parts,
    //                            id: channelID,
    //                            playlistId : playlistID,
    //                            maxResults: (req.query.per_page ? req.query.per_page : 20)
    //                          }
    //
    //                          if(req.query.page_token) query['pageToken'] = req.query.page_token;
    //
    //                          vids = await youtube.playlistItems.list(query);
    //
    //                          if(vids && vids.data) return vids.data;
    //
    //                          // Please remember to error handle. The plugin will check if an error was passed
    //                          return { status: '301', message: 'there was an error }
    //                       }
    youtubeLoadCallback: null,
  
    // If you have little control of your server, use this method to reformat 
    // your list data so it matches the expected format
    // This plugin has been catered to youtube
    // returns the response
    // @example
    // localBeforeLoad: (res) => return res.items.map( video => {...video, somProp : 'Necessary' }),
    localBeforeLoad: null,

    // returns the response
    // @example
    // youtubeBeforeLoad: (res) => return res.items.map( video => {...video, somProp : 'Necessary' }),
    youtubeBeforeLoad: null,

      // returns the response
    // @example
    // vimeoBeforeLoad: (res) => return res.items.map( video => {...video, somProp : 'Necessary' }),
    vimeoBeforeLoad: null,

    // If you have little control of your server, use this method to reformat 
    // your individual video data so it matches the expected format before it's inserted
    // This plugin has been catered to youtube
    // returns the response
    // @example
    // localBeforeInsert: (video) => video.type = "local", return video
    localBeforeInsert: null,

    // returns the response
    // @example
    // youtubeBeforeInsert: (video) => video.type = "youtube", return video
    youtubeBeforeInsert: null,

    // returns the response
    // @example
    // vimeoBeforeInsert: (video) => video.type = "vimeo", return video
    vimeoBeforeInsert: null,
  
  };
  