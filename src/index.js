import defaults from './video_media_manager/config/config';
const css =  require('./video_media_manager/css/styles.js');

// export default grapesjs ? grapesjs.plugins.add('grapesjs-video-embed-manager', (editor, options) => {
export default (editor, options = {}) => {
    // Add components
    const domcv = editor.DomComponents.getType('video');
    const dblclick = domcv.view.prototype.events.dblclick && domcv.view.prototype.events.dblclick !== 'onDblClick' ? domcv.view.prototype.events.dblclick : null;
    const oldEvent = domcv.view.prototype.events.dblclick ? domcv.view.prototype[dblclick] : null;

    // // This is a little broken, but click events should never have more than an event passed
    domcv.view.prototype.events.dblclick = 'onDblClick';

    domcv.view.prototype.onDblClick = function() {
        // Video component normally doesn't have a double click event, so we should be safe
        component = editor.getSelected() || {};
        editor.runCommand('open-videos');

        // Just in case, call original event if this was one in setup
        if(oldEvent) domcv.view.prototype[dblclick](e);
    };

    // Globals
    // Modal and current component
    let Modal, component;

    // Universal options
    const opts = {...defaults, ...options};

    // current page of query.
    let current_page = 1;

    // Html defaults
    let preloader, error, dataContainer, container, aside, videoList, footer, pagination;

    // pagination variables
    let query, trail_amount, total_pages, total_videos;

    let large_trail_amount = 10,
        medium_trail_amount = 5,
        small_trail_amount = 3;

    // current selected resource and index of resource item
    let current, currentIndex = 0;
    
    // icons
    let first_page = { d: "M13,21,7,12l6-9H9L3,12l6,9Z  M21,21l-6-9,6-9H17l-6,9,6,9Z" };
    let last_page = { d: "M11,3l6,9-6,9h4l6-9L15,3Z  M3,3l6,9L3,21H7l6-9L7,3Z" };
    let next_page = { d: "M 8 3 L 14 12 L 8 21 L 12 21 L 18 12 L 12 3 L 8 3 z" };
    let previous_page = { d: "M 13 3 L 7 12 L 13 21 L 17 21 L 11 12 L 17 3 L 13 3 z" };

    // Error animation timeout
    let timeout;

    // TODO: create a better listener
    editor.on('component:add', (model) => {
        if(model.attributes.type == 'video'){
            component = model;
            editor.runCommand('open-videos');
        }
    })

    editor.Commands.add('open-videos', {
        run(editor, sender) {
            // Add an event listener to make pagination readable on small screen sizes
            window.addEventListener('resize', setPaginationBind );
            return open();
        },
        stop(editor, sender) {
            // Remove event listender
            window.removeEventListener('resize', setPaginationBind );
            dataContainer.remove();
        },
    });

    editor.Commands.add('insert-video', {
        run(editor, sender, options) {

            if(options.current == 'youtube'){
                component.set('provider', 'yt');
                component.set('videoId', options.id);
                return;
            }

            if(options.current == 'vimeo'){
                component.set('provider', 'vi');
                component.set('videoId', options.id);
                return;
            }

            if(options.current == 'local'){
                component.set('provider', 'so');
                component.set('src', options.video.source);
                component.set('poster', options.video.poster);
                return;
            }
        },
        // stop(editor, sender) {
            // console.log('insert-video stopped');
            // console.log(editor, sender)
        // },
    });

    const _init = () => {
        Modal = editor.Modal;
    }

    const open = async () => {
        if(!Modal) _init();

        await Modal.open({
            title: 'Video Embed Manager',
            content: '',
            attributes: {
                id: 'video-modal'
            }
        })
        .onceOpen( renderHtml() )
        .onceClose( () => editor.stopCommand('open-videos'));

    }

    /**
     * This is our master list of functions that run.
     * When a modal first opens, or when a page changes, these functions are run
     */
    const setData = () =>{
        setVideos();
        setPagination();
        Modal.setContent(dataContainer);
    }

    // This should ideally be called once per page load
    const getInitialHtmlElements = () => {

        (opts.preloader ?  (preloader = document.createElement('img'), preloader.src = opts.preloader, preloader.setAttribute('alt', 'Loading...')) : (preloader = document.createElement('h2'), preloader.innerHTML = 'Loading...'), preloader.id="preloader")

        dataContainer = document.createElement('div');
        dataContainer.id = 'data-container';

        error = document.createElement('div');
        error.appendChild(document.createElement('h2'));
        error.className = 'video-error';
        error.onclick = hideError;
        error.style.display = 'none';
        error.style.height = '0px';

        let style = document.createElement('style');
        style.innerHTML = css;
        dataContainer.appendChild(style);

        aside = document.createElement('aside');
        aside.id = 'video-tabs';
        dataContainer.appendChild(aside);

        container = document.createElement('div');
        container.id = 'video-container';

        videoList = document.createElement('ul');
        videoList.id = 'video-list'

        footer = document.createElement('footer');
        footer.id = 'video-paginate-footer';

        pagination = document.createElement('nav');
        pagination.id = 'video-paginate';
        footer.appendChild(pagination);

        container.appendChild(error), container.appendChild(preloader), container.appendChild(videoList);
        dataContainer.appendChild(container), dataContainer.appendChild(footer);

        Modal.setContent(dataContainer);
    }

    const renderHtml = () => {
        getInitialHtmlElements();

        // If no resources were provided, we can't make any calls
        if(!opts.resources || !opts.resources.length){
            return errorHandling(412, opts.resources, 'You did not provide any video resources when initiating the plugin. Please pass the parameters "youtube", "vimeo", and/or "local" to the plugin option "resources" to get started.');
        }

        // If there's more than one resource, create tabs to cycle through
        if(opts.resources.length > 1){
            createTypeTabs(opts.resources);
        }else{
            aside.remove();
        }

        // Now set 
        setType();
    }

    const createTypeTabs = (sources) => {
        for(let i = 0; i < sources.length; i++){
            let button = document.createElement('button');
            let span = document.createElement('span');
            button.className = 'tablinks gjs-pn-btn gjs-two-color', button.setAttribute('data-index', i);
            if(i == currentIndex) button.classList.add('gjs-four-color');
            span.innerHTML = sources[i][0].toUpperCase() + sources[i].substring(1);
            button.onclick = setType;
            button.appendChild(span);

            aside.appendChild(button);
        }
    }

    const setType = (e = {}) =>{
        // This is only called if a user clicks the type tab
        // Otherwise this function is called once
        if(e.currentTarget || e.target){
            let button = e.currentTarget || e.target; // browser failsafe
            button.classList.add('gjs-four-color');
            document.querySelector(`button.tablinks[data-index="${currentIndex}"]`).classList.remove('gjs-four-color')
            currentIndex = button.dataset.index;
        }

        current = opts.resources[currentIndex];
        if(!current) return errorHandling(204, current, 'You seem to be requesting a video resource that doesn\'t exit!');
        
        // Check if the manager already has data to be loaded
        // Also used for example purposes
        if(opts[`${current}Data`]){
            showVideos();
            // Reminder, youtube page data has to be manually set
            current_page = opts[`${current}Data`].page;
            return setData();
        }

        return getVideos();
    }


    const getVideos = async () => {
        query = buildQuery();

        let loadUrl = opts[`${current}LoadUrl`];
        let callback = opts[`${current}LoadCallback`];
        showPreloader();

        let params = opts[`${current}Params`] ? opts[`${current}Params`] : {};
        params['headers'] = ( opts[`${current}Headers`] ? opts[`${current}Headers`] : {} );

        return loadUrl ? 
            fetch( loadUrl + query, params )
            .then( async res => {
                let data = await res.json();

                if(res.ok){
                    if(current == 'youtube') data.page = current_page;
                    if(opts[`${current}BeforeLoad`]) data = opts[`${current}BeforeLoad`](data);
                    opts[`${current}Data`] = data;
                    showVideos();
                    return setData();
                }

                try{
                    return errorHandling(res.status, loadUrl + query, data.response.data.error.message)
                }catch(error){
                    throw new Error(res.statusText)
                }
            })
            .catch( err => {
                return errorHandling(500, loadUrl + query, err)
            })
            : callback ?  handleCallback(callback, query, params)
            : errorHandling(412, loadUrl + query +'; '+ callback, 'There was no callback or load url provided for the ' + current + ' resource.')
    }

    const handleCallback = async (callback, query, params) => {
        let call = await callback(query, params);

        if(typeof call !== "object") return errorHandling(406, callback, 'Callback return was invalid')
        if(call.error) return errorHandling(error.status, callback, error.message)

        opts[`${current}Data`] = call;
        showVideos();
        return setData();
    }

    const setVideos = () => {
        let data = opts[`${current}Data`];
        let videos = data.items || data.data || [];
        videoList.innerHTML = '';

        if(videos.length > 0){
            for(let i = 0; i < videos.length; i++){
                createVideoThumb(videos[i], i);
            }
        }else{
            return errorHandling(411, data, 'There are no videos to display.')
        }
    }

    const buildQuery = () => {
        let q = '';

        if(opts.per_page) q += (q.length ? '&' : '?') + 'per_page=' + opts.per_page

        if(opts[`${current}Data`] && (opts[`${current}Data`].nextPageToken || opts[`${current}Data`].prevPageToken)){
            q += (q.length ? '&' : '?') + 'page_token=' + (current_page > opts[`${current}Data`].page ? opts[`${current}Data`].nextPageToken : opts[`${current}Data`].prevPageToken)
        }else if(opts[`${current}Data`] && opts[`${current}Data`].page){
            q += (q.length ? '&' : '?') + 'page=' + current_page
        }

        return q;
    }

    const createVideoThumb = (v, index) => {
        // Set video source
        let video = v.snippet || v;
        let id = getVideoId(v);
        let thumbs = video.thumbnails || video.pictures.sizes || [];
        let defaultThumb = thumbs.default || (thumbs.length ? thumbs.filter( thumb => thumb.width > 300 && thumb.width < 900)[0] : null) || thumbs[0];
        if(!(id && video && thumbs && defaultThumb)) return errorHandling(400, video);
        let url = (defaultThumb.url ? 'url' : 'link');
        
        let i = new Image(defaultThumb.width, defaultThumb.height),
        img = document.createElement('img'),
        figure = document.createElement("figure"),
        imgLi = document.createElement("li");
        imgLi.setAttribute('class', 'video-container video-empty video-' + index), imgLi.setAttribute('data-loading', 'Loading...'), imgLi.setAttribute('data-deleting', 'Deleting');

        i.onload = function() {
            img.setAttribute('src', defaultThumb[url]);
            let srcset = {};
            
            // We are doing it this way to ensure the srcset is produced in the right order
            for(let name in thumbs){
                let width = thumbs[name].width;
                srcset[width] = `${thumbs[name][url]} ${width}w`;
            }
            
            srcset = Object.values(srcset).join(', ');
            img.setAttribute('srcset', srcset);

            // if (defaultThumb[url] && img.setAttribute("data-url", defaultThumb[url]), video.tag)
            // generate data setAttributeibutes
            for (var r in video){ if(video.hasOwnProperty(r) && r !=='snippet') (typeof video[r] == "object" ? img.setAttribute('data-'+r, JSON.stringify(video[r])) : img.setAttribute('data-'+r, video[r])) };

            img.onload = function() {
                imgLi.classList.remove("video-empty")
            }

            figure.appendChild(img);

            let title = video.title || video.name;
            if(title){
                img.setAttribute("alt", title);
                let figcaption = document.createElement("figcaption");
                figcaption.innerText = title;
                figure.appendChild(figcaption);
            }

        },
        i.onerror = function() {
            imgLi.remove(), errorHandling(404, video) 
        },
        // load the image!
        i.src = defaultThumb[url];
        
        // set properties to query vid
        img.setAttribute("title", "Insert");
        img.setAttribute("data-index", index);
        img.setAttribute("data-id", id);
        img.setAttribute("aria-role", 'button');
        img.onclick = insertVideo;

        figure.classList.add("insert-video");

        imgLi.appendChild(figure);
        videoList.appendChild(imgLi);
    }

    const insertVideo = (e) => {
        let index, id, data, videoObj, returnObj;
        e.currentTarget ? (index = e.currentTarget.dataset.index, id = e.currentTarget.dataset.id) : e.target ? (index = e.target.dataset.index, id = e.target.dataset.id) : null;

        data = opts[`${current}Data`];
        videoObj = data.items ? data.items[index] : data.data[index];

        returnObj = {
            component: component,
            current: current,
            video : videoObj,
            id: id
        }

        if(opts[`${current}BeforeInsert`]) returnObj = opts[`${current}BeforeInsert`](returnObj);
        if(!(index && id)) return errorHandling(409, returnObj, 'The following video doesn\'t seem to have an id. Cannot insert the video into body.');

        editor.runCommand( 'insert-video', returnObj )
        editor.stopCommand('insert-video')
        Modal.close();
    }

    const setPagination = () => {
        pagination.innerHTML = '';
        let videosData = opts[`${current}Data`];
        total_videos = videosData.pageInfo ? videosData.pageInfo.totalResults : videosData.total;

        total_pages = Math.ceil( total_videos / opts.per_page );

        // How much trailing should exist in pagination is dependent if pages can be queried without a token
        // For sure youtube cannot trail pagination and can only be moved one page at a time
        // Local pagination is not set up this way, and I don't recommend setting up your server this way.
        setTrailAmount();

        if(total_pages > 1){
            let ul = document.createElement('ul');
            ul.setAttribute('role', 'menubar');
            let r = document.createElement('li');
            r.setAttribute('aria-hidden', true), r.className = 'dots more-previous', r.innerHTML = '...';

            // Create first page chevron
            if(current != 'youtube') ul.appendChild(createPaginateIcon('First Page', 1, 'page-nums chevrons first-chevrons', 1, 'video-paginate-icons', first_page.d));
            ul.appendChild(createPaginateIcon('Previous Page', (current_page - 1 <= 1 ? 1 : current_page -1 ), 'page-nums chevrons first-chevrons', (current_page - 1 <= 1 ? 1 : current_page -1 ), 'video-paginate-icons', previous_page.d));
            ul.appendChild(r);

            // This is not setup to load on anything past page 1. May fix in the future.
            let elements = [];

            // Pushing our current page...
            elements.push(createPaginateIcon('Page ' + current_page, current_page, 'page-nums dynamic-pages', current_page));
            
            let i = trail_amount;
            let j = 0;
            let add_previous = 1;
            let add_next = 1;
            while(i > 0){
                let prevPage = current_page - add_previous;
                if( prevPage > 0){
                    elements.splice(0, 0, createPaginateIcon('Page ' + prevPage, prevPage, 'page-nums dynamic-pages', prevPage));
                    add_previous++;
                    i--;
                }

                let nextPage = current_page + add_next;
                if(nextPage <= total_pages){
                    elements.push(createPaginateIcon('Page ' + nextPage, nextPage, 'page-nums dynamic-pages', nextPage));
                    add_next++;
                    i--;
                }

                // Failsafe break;
                j++
                if(j > trail_amount) break;
            }

            elements.map( el => ul.appendChild(el))

            r = r.cloneNode(true);
            r.className = 'dots more-next';
            // Create last page chevron
            ul.appendChild(r);
            ul.appendChild(createPaginateIcon('Next Page', (current_page +1 >= total_pages ? total_pages : current_page + 1), 'page-nums chevrons last-chevrons', (current_page +1 >= total_pages ? total_pages : current_page + 1), 'video-paginate-icons', next_page.d));
            if(current != 'youtube') ul.appendChild(createPaginateIcon('Last Page', total_pages, 'page-nums chevrons last-chevrons', total_pages, 'video-paginate-icons', last_page.d));

            pagination.appendChild(ul);
        }else{
            pagination.innerHTML = "<p style=\"text-align: center\">Showing All Results</p>";
        }

        updatePaginationStyles();
    }

    // Ignore this. This is only here so the event listeners for resetting pagination on resize work
    const setPaginationBind = setPagination.bind(this);

    const createPaginateIcon = (ariaLabel, dataPage, liClasses, posinset, svgClasses = null, paths = null) =>{
        let li = document.createElement('li');
        li.onclick = updatePage;
        li.setAttribute('aria-label', ariaLabel);
        li.setAttribute('data-page', dataPage);
        li.className = liClasses;
        let a = document.createElement('a');
        a.setAttribute('aria-posinset', posinset);

        if(svgClasses){
            let svg = document.createElement('svg');
            svg.setAttribute('height', '100%');
            svg.setAttribute('width', '1.3em');
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttribute('preserveaspectratio', 'xMidYMid meet');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.className = svgClasses;
            let path = document.createElement('path');
            path.setAttribute('d', paths)
            svg.append(path);
    
            a.innerHTML = svg.outerHTML;
        }else{
            a.innerHTML = dataPage;
        }

        li.append(a);
        return li;
    }

    const updatePaginationStyles = () => {
        footer.querySelectorAll('.page-nums').forEach( el => el.classList.remove('disabled-link'));
        footer.querySelectorAll('.dots').forEach( el => el.style.display = 'none');

        // Update the styles
        footer.querySelectorAll('.page-nums[aria-label="Page '+current_page+'"] a').forEach( el => el.classList.add('disabled-link'));

        if(current_page == 1) footer.querySelectorAll('.first-chevrons a').forEach( el => el.classList.add('disabled-link'));

        if((current_page + (trail_amount/2)) < total_pages) footer.querySelectorAll('.dots.more-next').forEach( el => el.style.display = 'block');

        if((current_page - (trail_amount/2)) > 1) footer.querySelectorAll('.dots.more-previous').forEach( el => el.style.display = 'block');

        if(current_page == total_pages) footer.querySelectorAll('.last-chevrons a').forEach( el => el.classList.add('disabled-link'));
    }

    const updatePage = (e) => {
        let page = parseInt(e.currentTarget.dataset.page);

        if(current_page === page) return;

        if(page){
            current_page = page;
            query = buildQuery();

            getVideos();
        }
    }

    const setTrailAmount = () => {
        if(current == 'youtube'){
            trail_amount = 0;
        }else if(window.innerWidth > 1200){
            trail_amount = large_trail_amount;
        }else if(window.innerWidth > 600){
            trail_amount = medium_trail_amount;
        }else{
            trail_amount = small_trail_amount;
        }
    }

    const getVideoId = (video) =>{
        // youtube
        if(video.contentDetails) return video.contentDetails.videoId;

        // local
        if(video.id) return video.id;

        // vimeo
        if(video.uri) return (video.uri.split('/').pop())

        // uh oh
        return null;
    }

    const errorHandling = (error_code, item, message = null) => {
        console.log(error_code, item, message);

        if(message){
            let h2 = error.querySelector('h2');
            h2.innerHTML = '<span style="display=inline-block; vertical-align:top; font-size: .8rem;">&#10006;</span> &nbsp;' + error_code + ' : ' + message;
            h2.focus();
            showError();
        }
    }

    const showVideos = () => {
        preloader.style.display = 'none';
        videoList.style.display = null;
    }

    const showPreloader = () => {
        preloader.style.display = 'block';
        videoList.style.display = 'none';
    }

    const hideError = () => {
        error.style.height = '0px';
        error.style.opacity = 0;
        timeout = setTimeout( () => {
            error.style.display = 'none';
        }, 2000)
    }

    const showError = () => {
        clearTimeout(timeout);
        error.style.display = 'block';
        let h2 = error.querySelector('h2');

        error.style.height = h2.offsetHeight + 'px';
        error.style.opacity = 1;
    }
}
// })
