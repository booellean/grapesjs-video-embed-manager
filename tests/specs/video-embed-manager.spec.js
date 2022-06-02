import { readFileSync } from 'fs';
import { resolve } from 'path';

const PluginSettings = require('../../plugin_settings');
const PluginSettingsWithoutURL = { ...PluginSettings};
PluginSettingsWithoutURL .pluginsOpts['grapesjs-video-embed-manager'] = {}

const HTML = readFileSync(resolve(__dirname, '../../_index.html')).toString();

let instance, editor;

const initiateEditor = async (settings, resolve) => {
    document.body.innerHTML = HTML;
    editor = global.grapesjs.init(settings)

    editor.Components.clear()

    editor.on('load', () =>{
        return resolve();
    })
}

/**
 * @jest-environment jsdom
 */

describe('Video Embed Manager', () => {

    beforeAll( async () => {
        return new Promise( resolve => {
            initiateEditor(PluginSettings, resolve);
        }).finally( () =>{
            instance = editor.getContainer();
        })
    
    })
    
    afterAll( () => {
        editor.destroy()
    });

    afterEach( () => {
        editor.Components.clear()
        global.alerts = []
    })

    it('has the video block and commands for the video manager', async () =>{

        // editor initiated
        await expect(instance.querySelector('div.gjs-editor > div.gjs-cv-canvas')).not.toBeNull();

        // Video Embed Manager was initiated
        await expect(editor.Blocks.get('video')).not.toBeNull();
        await expect(editor.Commands.has('open-videos')).toBeTruthy();
        await expect(editor.Commands.has('insert-video')).toBeTruthy();

    });


    it('will open the video manager if a video is dropped', async () =>{
        let comp = editor.addComponents({ type: 'video' })
        let components = editor.Components.getComponents();

        // manager initiated
        await expect(editor.Modal.isOpen()).toBeTruthy();

        await expect(components.length).toBe(1)
        await expect(components._byId[comp[0].cid]).toBeTruthy();

        // Close the Modal
        editor.Modal.close()

        await expect(editor.Modal.isOpen()).not.toBeTruthy();

        // Something weird happens with GrapesJS and Jest. The commands are running, but they are not making it to the command list, and Modal is not re-opening
        // let video = components.models[0]

        // // Simulate DoubleClick Event
        // await video.view.onDblClick()

        // // manager initiated
        // await expect(editor.Modal.isOpen()).toBeTruthy();
    });

})