import {pass, none, smart, Use, Extended, Placeholder, Bind, RenderApp, toInlineStyle, LE_LoadScript, LE_LoadCss, LE_InitWebApp} from "../../lib/caged-le.js"

import { UseAnchors, UseAnchorsRoot, AnchorsSystmeRootStyle, AnchorsSystemInit } from "./app/anchors.js"

import { Model } from "./app/model.js"
import { RootView } from "./app/rootView.js"
import { ChildsView } from "./app/childsView.js"
import { ConnectionsView } from "./app/connectionsView.js"

LE_InitWebApp(async ()=>{


  // ACE EDITOR LIB
  await LE_LoadScript("https://ajaxorg.github.io/ace-builds/src-min-noconflict/ace.js")


  let app = RenderApp(document.body, { div: {
    
    id: "app",

    props: UseAnchorsRoot,
    attrs: {id: "app", style: AnchorsSystmeRootStyle },
    onInit: $ => AnchorsSystemInit($),

    css: [`
      * { box-sizing: border-box !important;}
      body { padding: 0px; margin: 0px; }
      .shadow{
        -webkit-box-shadow: 0px 6px 50px -1px rgb(0 0 0 / 72%);
        -moz-box-shadow: 0px 6px 50px -1px rgb(0 0 0 / 72%);
        box-shadow: 0px 6px 50px -1px rgb(0 0 0 / 72%);
      }
    `],


    "=>": [

      Model,

      RootView,
      
      ChildsView,

      ConnectionsView,

      { button: { text: "Save", a:{ style: "position: absolute"}, handle: {onclick: $=>$.le.model.storage.saveDef()} }},
      { button: { text: "Load", a:{ style: "position: absolute; top: 40px"}, handle: {onclick: $=>$.le.model.storage.loadDef()}, onInit: $=>$.le.model.storage.loadDef()}},

      { button: { 
        text: "show", 
        a:{ style: "position: absolute; top: 70px"}, 
        handle: { onclick: $=>{
          let recomposed = $.le.model.recompose()
          console.log(recomposed)
          $.le.preview.code = `window.renderized_app && window.renderized_app.destroy(); window.renderized_app = RenderApp(document.getElementById('app-preview'), ${recomposed});`
          $.le.preview.visible = true
        }} 
      }},

      // preview
      { div: {
        id: "preview",

        props: {
          ...UseAnchors(),
          width: $ => $.parent.Width-100,
          height: $ => $.parent.Height-100,
          left: 50,
          top: 50,

          visible: false,
          code: ""
        },
      
        attrs: { 
          class: "shadow", 
          style: $ => ({ ...$.this.Anchors, backgroundColor: "white", zIndex: "999", border: "2px solid black", visibility: $.this.visible ? "visible" : "hidden" }) 
        },

        "=>": [

          { button: { 
            text: "x", 
            props: { ...UseAnchors(), left: 0, top: -35, width: 30, height: 30}, 
            attrs: { style: $ => ({ ...$.this.Anchors, zIndex: "1000" }) }, 
            handle: {onclick: $=>{$.le.preview.visible = false; $.le.preview.code = ""} } 
          }},

          { div: {

            props: {
              ...UseAnchors(),
              width: $ => $.parent.Width,
              height: $ => $.parent.Height,

              latestApp: undefined
            },
          
            attrs: { id: "app-preview", style: $ => ({ ...$.this.Anchors, zIndex: "1", overflow: "auto" }) },

            on: { parent: { codeChanged: ($, code)=>{
              $.this.latestApp && $.this.latestApp.destroy()
              if (code.length > 0){
                $.this.latestApp = eval(code) 
                console.log($.this.latestApp)
              }
            }}}
          }}
        ]

      }}

    ]

  }})

})