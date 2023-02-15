import { OphRender } from "./Core/OphRender.js";
import { StreamingApp } from "./StreamingApp/StreamingApp.js";

class OphStreamingApp extends HTMLElement
{
    connectedCallback()
    {
        let render = new OphRender(new StreamingApp);
    }
}
customElements.define("oph-streaming-app", OphStreamingApp);