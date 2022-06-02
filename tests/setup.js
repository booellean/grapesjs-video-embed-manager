import { TextEncoder, TextDecoder } from 'util';
import VideoEmbedManager from '../src/index';
import BlocksBasic from 'grapesjs-blocks-basic';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const localStorage = {
    getItem(key) {
        return this[key];
    },
    setItem(key, value) {
        this[key] = value;
    },
    removeItem(key, value) {
        delete this[key];
    },
};

global.grapesjs = require('grapesjs');
global.$ = global.grapesjs.$;
global.grapesjs.plugins.add('grapesjs-blocks-basic', BlocksBasic)
global.grapesjs.plugins.add('grapesjs-video-embed-manager', VideoEmbedManager)
global.localStorage = localStorage;
global.alerts = [];

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ }),
  })
);

jest.spyOn(window, 'alert').mockImplementation( (e) => {
    return global.alerts.push(e)
});

global.setBadCallFetch = () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ noData: true }),
        })
    );
}

global.setGoodCallBadDataFetch = () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ noData: true }),
        })
    );
}

global.setGoodCallGoodDataFetch = () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                data: {
                    href: 'https://booellean.itch.io/',
                    description: "Unfortunately, I have been busy with what life throws at you. Hopefully I will have a better, more permanent profile soon.",
                    icon: "",
                    image: "https://img.itch.zone/aW1nLzkwNTg5NTgucG5n/original/BOHpEC.png",
                    keywords: "",
                    provider: "",
                    title: "booellean - itch.io",
                    type: "",
                    url: "https://en.wikipedia.org/wiki/Facebook_Platform",
                    target: '_blank',
                    class: 'og-parent'
                }
            }),
        })
    );
}