import {pass, none, smart, Use, Extended, Placeholder, Bind, RenderApp, toInlineStyle, LE_LoadScript, LE_LoadCss, LE_InitWebApp, LE_BackendApiMock} from "../../../lib/caged-le.js"
import {Router} from "../router/routing.js"
import {processModelApi} from "../model/api.js"

import { Steps, SimpleSteps } from "../components/steps.js"

export const HomePage = async (state)=>{ return { 
  div: {
    id: "home",

    props: {
      projects: undefined,
      selected_project: undefined,
      selected_instance_id: undefined
    },
    
    onInit: async $=>{
      await $.this.api.getProjects()
    },
    
    def: {
      api: {
        getProjects: async $=>{
          $.scope.projects = await processModelApi.getProjects()
        }
      }
    },

    attrs: { style: "width: 100%; height: 100%; padding: 0px; margin: 0px;" },

    css: [
      `
      * { box-sizing: border-box !important;}

      body { padding: 0px; margin: 0px; }
      `
    ],
    
    "=>": [

      // PROJECTS
      { div: { meta: {forEach:"project", of: $=>$.scope.projects || []},

        attrs: {style: { borderRadius: "5px", backgroundColor:"#2c3e50", color: "white", margin: "20px", padding: "5px 15px 15px 15px"}},

        "=>": [

          { h4: { text: $=>$.meta.project.name, a: {style: {margin:"0px", marginBottom: "10px"}} }},

          { li: { meta: {forEach:"instance", of: $=>$.meta.project?.instances || []},
            
            handle: {
              onclick: $=>{
                console.log($.meta.instance.id, )
                // $.scope.selected_instance_id = $.meta.instance.id
                // $.scope.selected_project = $.meta.project

                // setTimeout(()=>
                  Router.navigate("details", {
                    selected_instance_id: $.meta.instance.id,
                    selected_project: $.meta.project
                  })
                // , 3000)
              }
            },

            "=>": [
              { span: { text: $=>$.meta.instance.name }},

              Extended(Steps, {
                props: {
                  num_steps: $=>$.meta.instance.todo,
                  step_idx: $=>$.meta.instance.done,
                },
                a: { style: {display: "inline-block", margin: "0 10px"}}
              }),

              { span: { text: $=>"(" +$.meta.instance.done + "/" + $.meta.instance.todo +")"}},
            ]
          }}
        ]
        
      }},

    ]
  }
}}
