import defaults from './config/config';
const css =  require('./css/styles.js');
import pluginBlocks from 'grapesjs-blocks-basic';

export default grapesjs.plugins.add('grapesjs-video-embed-manager', (editor, options) => {
    console.log(editor)
    // TODO: remove
    pluginBlocks(editor, {})

    // Globals
    let Modal, component;
    const opts = {...defaults, ...options};
    let current_page = 1;
    let preloader, dataContainer, container, aside, videoList, footer, pagination;
    (opts.preloader ?  (preloader = document.createElement('img'), preloader.src = opts.preloader, preloader.setAttribute('alt', 'Loading...')) : (preloader = document.createElement('h2'), preloader.innerHTML = 'Loading...'), preloader.id="preloader");
    let query, trail_amount, total_pages, total_videos;
    let large_trail_amount = 10,
        medium_trail_amount = 5,
        small_trail_amount = 3;
    let current, currentIndex = 0;
    
    // icons
    let first_page = { d: "M13,21,7,12l6-9H9L3,12l6,9Z  M21,21l-6-9,6-9H17l-6,9,6,9Z" };
    let last_page = { d: "M11,3l6,9-6,9h4l6-9L15,3Z  M3,3l6,9L3,21H7l6-9L7,3Z" };
    let next_page = { d: "M 8 3 L 14 12 L 8 21 L 12 21 L 18 12 L 12 3 L 8 3 z" };
    let previous_page = { d: "M 13 3 L 7 12 L 13 21 L 17 21 L 11 12 L 17 3 L 13 3 z" };

    // Error Messages
    // let messages = {},
    // e = 10,
    // b = 11,
    // w = 12,
    // C = 13,
    // L = 14,
    // D = 15,
    // t = 21,
    // r = 22;
    // messages[e] = "Video cannot be loaded from the passed link.";
    // messages[b] = "Error during load videos request.";
    // messages[w] = "Missing videoManagerLoadURL option.";
    // messages[C] = "Parsing load response failed.";
    // messages[L] = "Missing video object.";
    // messages[D] = "Missing video URL.";
    // messages[t] = "Error during delete video request.";
    // messages[r] = "Missing videoManagerDeleteURL option."; 

    // console.log(opts);


    // TODO: create a better listener
    // editor.on('all', (model, opts, a) => {
    //     // if(model.attributes.type == 'video'){
    //         console.log(opts, a)
    //     // }
    // })
    // TODO: create a better listener
    editor.on('component:add', (model) => {
        if(model.attributes.type == 'video'){
            console.log('added')
            component = model;
            editor.runCommand('open-videos');
        }
    })

    editor.Commands.add('open-videos', {
        run(editor, sender) {
            console.log('open-videos');
            console.log(editor, sender)
            // Add an event listener to make pagination readable on small screen sizes
            window.addEventListener('resize', setPaginationBind );
            return open();
        },
        stop(editor, sender) {
            // Remove event listender
            window.removeEventListener('resize', setPaginationBind );
            dataContainer.remove();
            console.log('open-videos stopped');
            console.log(editor, sender)
        },
    });

    editor.Commands.add('insert-video', {
        run(editor, sender, options) {
            console.log('insert-video');
            console.log(options, sender);

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
        stop(editor, sender) {
            console.log('insert-video stopped');
            console.log(editor, sender)
        },
    });

    const _init = () => {
        Modal = editor.Modal;
    }

    const open = () => {
        if(!Modal) _init();

        Modal.open({
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

        dataContainer = document.createElement('div');
        dataContainer.id = 'data-container';

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

        container.appendChild(preloader), container.appendChild(videoList);
        dataContainer.appendChild(container), dataContainer.appendChild(footer);

    }

    const renderHtml = () => {
        getInitialHtmlElements();

        // If no resources were provided, we can't make any calls
        if(!opts.resources || !opts.resources.length){
            return renderError();
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
        if(!opts.resources[currentIndex]) return errorHandling();// TODO: return error Handling
        
        // Check if the manager already has data to be loaded
        // Also used for example purposes
        if(opts[`${current}Data`]){
            preloader.style.display = 'none';
            // Reminder, youtube page data has to be manually set
            current_page = opts[`${current}Data`].page;
            return setData();
        }

        return getVideos();
    }


    const getVideos = () => {
        query = buildQuery();

        let loadUrl = opts[`${current}LoadUrl`];
        let callbackUrl = opts[`${current}LoadCallback`];
        preloader.style.display = 'block';

        // TODO: setup the storage manager to save this and load here before hand
        // TODO: set page data manually if youtube
        // Call setData here...
        console.log(loadUrl + query);
        return loadUrl ? 
            fetch( loadUrl + query )
            .then( res => res.json() )
            .then( (data) =>{
                if(current == 'youtube') data.page = current_page;
                opts[`${current}Data`] = data;
                console.log(data);
                preloader.style.display = 'none';
                return setData();
            })
            .catch( error => console.log(error)) // TODO: handle errors
            : callbackUrl ? console.log('other stuff')
            : console.log('no stuff')
    }

    const setVideos = () => {
        let data = opts[`${current}Data`];
        let videos = data.items || data.data;

        if(videos.length > 0){
            videoList.innerHTML = '';
            for(let i = 0; i < videos.length; i++){
                createVideoThumb(videos[i], i);
            }
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
        let thumbs = video.thumbnails || video.pictures.sizes;
        let defaultThumb = thumbs.default || thumbs.filter( thumb => thumb.width > 300 && thumb.width < 900)[0] || thumbs[0];
        let url = (defaultThumb.url ? 'url' : 'link');
        if(!(id && video && thumbs && defaultThumb)) return errorHandling(L, video);

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

            // TODO: fix event
            // editor.events.trigger("videoManager.videoLoaded", [img])
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
            imgLi.remove(), errorHandling(e, video) 
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

        if(!(index && id)) return errorHandling(10);

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

            // TODO: fix;
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
        // TODO: figure out page query
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

    // TODO: specify codes
    const errorHandling = (e, a) => {
        console.log(e, a);

        // editor.notificationManager.open({
        //     text: 'A test informational notification.',
        //     type: 'info'
        //   });
        
        // 10 <= e && e < 20 ? preloader.hide() : 20 <= e && e < 30 && $instance(".fr-video-deleting").removeClass("fr-video-deleting"), editor.events.trigger("videoManager.error", [{
        //     code: e,
        //     message: messages[e]
        // }, a])
    }

    // TODO: make this pretty.
    const renderError = () => {
        container.innerHTML = '';
        let error = document.createElement('h2')
        error.classList.add('error')
        error.innerHTML = 'There were no video resources provided. Please provide at least one video source.'
        container.appendChild(error);
    }
})
