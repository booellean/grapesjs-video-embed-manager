module.exports = `
#video-container > #video-list > li.video-container > figure > img {
    width: 100%;
}

#video-modal > .gjs-mdl-dialog {
    height: 80vh;
    width: 75vw;
    max-width: 100%;
    display: flex;
    flex-flow: column nowrap;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content {
    flex-grow: 1;
    height: 0;
    overflow: hidden;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div:first-child { height: 100% }
#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > #video-container {
    flex-grow: 1;
    height: 0;
    overflow-y: auto;
}


#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > aside#video-tabs > .tablinks{
    font-size: .9em;
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    opacity: .5;
    transform: skew(20deg, 0deg);
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > aside#video-tabs > .tablinks > span{
    display: inline-block;
    padding: 0 .7em;
    transform: skew(-20deg, 0deg);
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > aside#video-tabs > .tablinks.gjs-four-color{
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    opacity: 1;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > #video-container > ul#video-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    box-sizing: border-box;
    padding: 1rem;
    flex-grow: 1;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > #video-container > ul#video-list,
#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > #video-container > ul#video-list li.video-container{
    width: 33.33%;
    box-sizing:border-box;
    padding: 1rem;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > #video-container > ul#video-list li.video-container > figure{
    margin: .5rem;
    cursor: pointer;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > #video-container > ul#video-list li.video-container > figure > figcaption{
    text-align: center;
    margin: .2em;
    font-size: .9em;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > #video-container > ul#video-list li.video-container > figure > img{
    transition: transform .2s ease-in-out, box-shadow .2s ease-in-out;
    font-size: 2vh;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > #video-container > ul#video-list li.video-container > figure:hover > img{
    transform: translate(0, -1em) scale(1.1);
    box-shadow: 0 2.2em 1.9em -1.8em rgb(145 145 145);
    -webkit-box-shadow: 0 2.2em 1.9em -1.8em rgb(145 145 145);
    -moz-box-shadow: 0 2.2em 1.9em -1.8em rgb(145 145 145);
}

@media screen and (max-width: 61.875em){
    #video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > #video-container > ul#video-list li.video-container{
        width: 50%;
    }
}

@media screen and (max-width: 37.5em){
    #video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > #video-container > ul#video-list li.video-container{
        width: 100%;
    }
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul > li {
    padding: 0 .5em;
}

/* Pagination styling */

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul > li > a,
#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul > li > a > svg {
    pointer-events: none
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer{
    width: 100%;
    z-index: 5;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate{
    width: 100%;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar]{
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    padding-top: 1em;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li{
    list-style: none;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li:not(.dots){
    cursor: pointer;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li > a > svg{
    width: 1.4em;
    fill: #ddd;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li > .disabled-link > svg{
    fill: #505050;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li > .disabled-link{
    /* TODO: correct color */
    color: #505050;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li[aria-label^=Page],
#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li[aria-hidden=true]
{
    margin: 0 .3rem;
    border-radius: 50em;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li[aria-label^=Page] > a,
#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li[aria-hidden=true] > a
{
    text-decoration: none;
}

#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li[aria-label^=First],
#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li[aria-label^=Previous],
#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li[aria-label^=Next],
#video-modal > .gjs-mdl-dialog > .gjs-mdl-content > div > #data-container > footer#video-paginate-footer > nav#video-paginate > ul[role=menubar] li[aria-label^=Last]
{
    padding: 0 .2rem;
}
`;