
import VideoEmbedManager from './video_media_manager'


export default (editor, opts = {}) => {

  console.log('here');
  // VideoEmbedManager(editor, {})
  console.log('there');
  
  // TODO: can this be done?
  // Create watch
  // editor.on('video:loaded', () => {
  //   console.log('video was loaded')
  //   // if(model.attributes.type == 'video'){
  //   //   console.log(model);
  //   //   console.log('component added')
  //   // }
  // })

  // Extend Video component
  // We are extending the pro
  // let video = editor.Components.getType('video');
  // let video = editor.Blocks.get('video');
  // if(video){
  //   video.on('all', function(e,t){ editor.trigger('video:loaded') })
  // }

  // video.set('')

  // // Add components
  // loadComponents(editor, options);
  // // Add blocks
  // loadBlocks(editor, options);
  // Load i18n files
  // Modal(editor);

  // editor.I18n && editor.I18n.addMessages({
  //     en,
  //     ...options.i18n,
  // });
  // // TODO: remove

  // // Add Manager Watch

  // console.log(editor);

  // // TODO Remove
  // editor.on('load', () =>
  //   editor.addComponents(
  //       `<div style="margin:100px; padding:25px;">
  //           Content loaded from the plugin
  //       </div>`,
  //       { at: 0 }
  //   ))
  
  // // TODO: create a better listener
  // editor.on('component:add', (model) => {
  //   if(model.attributes.type == 'video'){
      
  //   }
  // })

  // editor.on('component:video:add', (type) => {
  //   console.log(type);
  //   console.log('component video')
  // })

  // // editor.on('all', (type, model) => {
  // //   if(model && model.attributes && model.attributes.type == 'video'){
  // //     console.log(model, type);
  // //   }
  // // })

};