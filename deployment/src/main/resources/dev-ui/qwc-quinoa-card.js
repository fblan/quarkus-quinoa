import {LitElement, html, css} from 'lit';
import {JsonRpc} from 'jsonrpc';
import {notifier} from 'notifier';
import {pages} from 'build-time-data';
import '@vaadin/progress-bar';
import '@vaadin/button';
import 'qwc/qwc-extension-link.js';

const NAME = "Quinoa";
const DESCRIPTION = "Quinoa serves single page applications or web components (built with NodeJS: React, Angular, Vue, Lit, …)";

export class QwcQuinoaCard extends LitElement {

    jsonRpc = new JsonRpc(this);

    static styles = css`
      .identity {
        display: flex;
        justify-content: flex-start;
      }

      .description {
        padding-bottom: 10px;
      }

      .logo {
        padding-bottom: 10px;
        margin-right: 5px;
      }

      .card-content {
        color: var(--lumo-contrast-90pct);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 2px 2px;
        height: 100%;
      }

      .card-content slot {
        display: flex;
        flex-flow: column wrap;
        padding-top: 5px;
      }

      .button {
        cursor: pointer;
      }

      .installIcon {
        color: var(--lumo-primary-text-colo);
      }

      .restartIcon {
        color: var(--lumo-primary-text-colo);
      }
    `;

    static properties = {
        description: {type: String},
        build_in_progress: {state: true, type: Boolean},
        build_complete: {state: true, type: Boolean},
        build_error: {state: true, type: Boolean},
        result: {type: String}
    };

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this.build_in_progress = false;
        this.build_complete = false;
        this.build_error = false;
        this.result = "";
    }

    render() {
        let progress;
        if (this.build_in_progress) {
            progress = html`
                <div class="report">
                    <div>Executing Node command...</div>
                    <vaadin-progress-bar indeterminate theme="contrast"></vaadin-progress-bar>
                </div>`;
        } else if (this.build_complete) {
            progress = html`
                <div class="report">
                    <div>${this.result}</div>
                    <vaadin-progress-bar value="1"
                                         theme="${this.build_error} ? 'error' : 'success'"></vaadin-progress-bar>
                </div>`;
        } else {
            progress = html`
                <div class="report"></div>`;
        }

        return html`
            <div class="card-content" slot="content">
                <div class="identity">
                    <div class="logo">
                        <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjI1NnB4IiBoZWlnaHQ9IjI4OXB4IiB2aWV3Qm94PSIwIDAgMjU2IDI4OSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+CiAgICA8Zz4KICAgICAgICA8cGF0aCBkPSJNMTI3Ljk5OTk5OSwyODguNDYzNzcxIEMxMjQuMDI0ODQ0LDI4OC40NjM3NzEgMTIwLjMxNDY5OSwyODcuNDAzNzI4IDExNi44Njk1NjQsMjg1LjU0ODY1NiBMODEuNjIzMTg4NCwyNjQuNjEyODM4IEM3Ni4zMjI5OCwyNjEuNjk3NzI0IDc4Ljk3MzA4NTQsMjYwLjYzNzY4MiA4MC41NjMxNDU4LDI2MC4xMDc2NjEgQzg3LjcxODQyNTksMjU3LjcyMjU3IDg5LjA0MzQ3NzUsMjU3LjE5MjU0NyA5Ni40NjM3Njg4LDI1Mi45NTIzODEgQzk3LjI1ODc5NzksMjUyLjQyMjM2MSA5OC4zMTg4NDA1LDI1Mi42ODczNzIgOTkuMTEzODcxOCwyNTMuMjE3MzkyIEwxMjYuMTQ0OTI3LDI2OS4zODMwMjQgQzEyNy4yMDQ5NywyNjkuOTEzMDQ1IDEyOC41MzAwMjEsMjY5LjkxMzA0NSAxMjkuMzI1MDUzLDI2OS4zODMwMjQgTDIzNS4wNjQxODIsMjA4LjE2NTYzNCBDMjM2LjEyNDIyNSwyMDcuNjM1NjExIDIzNi42NTQyNDUsMjA2LjU3NTU3MSAyMzYuNjU0MjQ1LDIwNS4yNTA1MTkgTDIzNi42NTQyNDUsODMuMDgwNzQ2NyBDMjM2LjY1NDI0NSw4MS43NTU2OTI5IDIzNi4xMjQyMjUsODAuNjk1NjUyNiAyMzUuMDY0MTgyLDgwLjE2NTYzMjQgTDEyOS4zMjUwNTMsMTkuMjEzMjUwNiBDMTI4LjI2NTAxLDE4LjY4MzIzMDUgMTI2LjkzOTk1OSwxOC42ODMyMzA1IDEyNi4xNDQ5MjcsMTkuMjEzMjUwNiBMMjAuNDA1Nzk1NCw4MC4xNjU2MzI0IEMxOS4zNDU3NTUxLDgwLjY5NTY1MjYgMTguODE1NzM0OSw4Mi4wMjA3MDQxIDE4LjgxNTczNDksODMuMDgwNzQ2NyBMMTguODE1NzM0OSwyMDUuMjUwNTE5IEMxOC44MTU3MzQ5LDIwNi4zMTA1NiAxOS4zNDU3NTUxLDIwNy42MzU2MTEgMjAuNDA1Nzk1NCwyMDguMTY1NjM0IEw0OS4yOTE5MjQ3LDIyNC44NjEyODYgQzY0LjkyNzUzNjQsMjMyLjgxMTU5NSA3NC43MzI5MTk2LDIyMy41MzYyMzQgNzQuNzMyOTE5NiwyMTQuMjYwODcxIEw3NC43MzI5MTk2LDkzLjY4MTE1OSBDNzQuNzMyOTE5Niw5Mi4wOTEwOTg1IDc2LjA1Nzk3MTEsOTAuNTAxMDM1OCA3Ny45MTMwNDI4LDkwLjUwMTAzNTggTDkxLjQyODU3MTYsOTAuNTAxMDM1OCBDOTMuMDE4NjM0Myw5MC41MDEwMzU4IDk0LjYwODY5NDgsOTEuODI2MDg3MyA5NC42MDg2OTQ4LDkzLjY4MTE1OSBMOTQuNjA4Njk0OCwyMTQuMjYwODcxIEM5NC42MDg2OTQ4LDIzNS4xOTY2ODkgODMuMjEzMjUxMiwyNDcuMzg3MTY0IDYzLjMzNzQ3MzcsMjQ3LjM4NzE2NCBDNTcuMjQyMjM2MiwyNDcuMzg3MTY0IDUyLjQ3MjA1MDIsMjQ3LjM4NzE2NCAzOC45NTY1MjE0LDI0MC43NjE5MDYgTDExLjEzMDQzNDcsMjI0Ljg2MTI4NiBDNC4yNDAxNjU4MSwyMjAuODg2MTI5IDUuNjg0MzQxODllLTE0LDIxMy40NjU4NCA1LjY4NDM0MTg5ZS0xNCwyMDUuNTE1NTI4IEw1LjY4NDM0MTg5ZS0xNCw4My4zNDU3NTU3IEM1LjY4NDM0MTg5ZS0xNCw3NS4zOTU0NDY1IDQuMjQwMTY1ODEsNjcuOTc1MTU1MiAxMS4xMzA0MzQ3LDY0LjAwMDAwMDYgTDExNi44Njk1NjQsMi43ODI2MDc1MiBDMTIzLjQ5NDgyNCwtMC45Mjc1MzU4NDEgMTMyLjUwNTE3NiwtMC45Mjc1MzU4NDEgMTM5LjEzMDQzNiwyLjc4MjYwNzUyIEwyNDQuODY5NTY1LDY0LjAwMDAwMDYgQzI1MS43NTk4MzQsNjcuOTc1MTU1MiAyNTYsNzUuMzk1NDQ2NSAyNTYsODMuMzQ1NzU1NyBMMjU2LDIwNS41MTU1MjggQzI1NiwyMTMuNDY1ODQgMjUxLjc1OTgzNCwyMjAuODg2MTI5IDI0NC44Njk1NjUsMjI0Ljg2MTI4NiBMMTM5LjEzMDQzNiwyODYuMDc4Njc2IEMxMzUuNjg1Mjk5LDI4Ny42Njg3MzkgMTMxLjcxMDE0NSwyODguNDYzNzcxIDEyNy45OTk5OTksMjg4LjQ2Mzc3MSBMMTI3Ljk5OTk5OSwyODguNDYzNzcxIFogTTE2MC41OTYyNzQsMjA0LjQ1NTQ4OCBDMTE0LjIxOTQ2MSwyMDQuNDU1NDg4IDEwNC42NzkwODksMTgzLjI1NDY1OSAxMDQuNjc5MDg5LDE2NS4yMzM5NTUgQzEwNC42NzkwODksMTYzLjY0Mzg5MyAxMDYuMDA0MTQxLDE2Mi4wNTM4MzIgMTA3Ljg1OTIxMiwxNjIuMDUzODMyIEwxMjEuNjM5NzUyLDE2Mi4wNTM4MzIgQzEyMy4yMjk4MTMsMTYyLjA1MzgzMiAxMjQuNTU0ODY0LDE2My4xMTM4NzIgMTI0LjU1NDg2NCwxNjQuNzAzOTM1IEMxMjYuNjc0OTQ3LDE3OC43NDk0ODQgMTMyLjc3MDE4NywxODUuNjM5NzUzIDE2MC44NjEyODMsMTg1LjYzOTc1MyBDMTgzLjEyMjE1NCwxODUuNjM5NzUzIDE5Mi42NjI1MjYsMTgwLjYwNDU1NiAxOTIuNjYyNTI2LDE2OC42NzkwOSBDMTkyLjY2MjUyNiwxNjEuNzg4ODIxIDE5MC4wMTI0MjMsMTU2Ljc1MzYyNCAxNTUuMjk2MDY1LDE1My4zMDg0ODkgQzEyNi40MDk5MzgsMTUwLjM5MzM3NSAxMDguMzg5MjM1LDE0NC4wMzMxMjYgMTA4LjM4OTIzNSwxMjAuOTc3MjI2IEMxMDguMzg5MjM1LDk5LjUxMTM4NzUgMTI2LjQwOTkzOCw4Ni43OTA4OTAxIDE1Ni42MjExMTksODYuNzkwODkwMSBDMTkwLjU0MjQ0Myw4Ni43OTA4OTAxIDIwNy4yMzgwOTUsOTguNDUxMzQ3MiAyMDkuMzU4MTc4LDEyMy44OTIzNCBDMjA5LjM1ODE3OCwxMjQuNjg3MzcxIDIwOS4wOTMxNjcsMTI1LjQ4MjQwMyAyMDguNTYzMTQ3LDEyNi4yNzc0MzQgQzIwOC4wMzMxMjcsMTI2LjgwNzQ1NCAyMDcuMjM4MDk1LDEyNy4zMzc0NzQgMjA2LjQ0MzA2NCwxMjcuMzM3NDc0IEwxOTIuNjYyNTI2LDEyNy4zMzc0NzQgQzE5MS4zMzc0NzUsMTI3LjMzNzQ3NCAxOTAuMDEyNDIzLDEyNi4yNzc0MzQgMTg5Ljc0NzQxMiwxMjQuOTUyMzgyIEMxODYuNTY3Mjg5LDExMC4zNzY4MTMgMTc4LjM1MTk2NiwxMDUuNjA2NjI1IDE1Ni42MjExMTksMTA1LjYwNjYyNSBDMTMyLjI0MDE2NSwxMDUuNjA2NjI1IDEyOS4zMjUwNTMsMTE0LjA4Njk1NyAxMjkuMzI1MDUzLDEyMC40NDcyMDUgQzEyOS4zMjUwNTMsMTI4LjEzMjUwNiAxMzIuNzcwMTg3LDEzMC41MTc2IDE2NS42MzE0NzEsMTM0Ljc1Nzc2NiBDMTk4LjIyNzc0NCwxMzguOTk3OTMxIDIxMy41OTgzNDQsMTQ1LjA5MzE2OSAyMTMuNTk4MzQ0LDE2Ny44ODQwNTggQzIxMy4zMzMzMzMsMTkxLjIwNDk3IDE5NC4yNTI1ODksMjA0LjQ1NTQ4OCAxNjAuNTk2Mjc0LDIwNC40NTU0ODggTDE2MC41OTYyNzQsMjA0LjQ1NTQ4OCBaIiBmaWxsPSIjNTM5RTQzIj48L3BhdGg+CiAgICA8L2c+Cjwvc3ZnPgo="
                             alt="${NAME}"
                             title="${NAME}"
                             width="32"
                             height="32">
                    </div>
                    <div class="description">${DESCRIPTION}</div>
                </div>
                ${this._renderCardLinks()}
                ${this._renderActions()}
                ${progress}
            </div>
        `;
    }

    _renderActions() {
        return html`
            <vaadin-button theme="small" @click=${() => this._install()} class="button"
                           title="Run package manager 'install' command to update packages and restart the Node server">
                <vaadin-icon class="installIcon" icon="font-awesome-solid:cloud-arrow-down"></vaadin-icon>
                Install/Update Packages
            </vaadin-button>
        `;
    }

    _install() {
        this.build_complete = false;
        this.build_in_progress = true;
        this.build_error = false;
        this.result = "";
        this.jsonRpc.install()
            .onNext(jsonRpcResponse => {
                const msg = jsonRpcResponse.result;
                if (msg === "started") {
                    this.build_complete = false;
                    this.build_in_progress = true;
                    this.build_error = false;
                } else if (msg.includes("installed")) {
                    this.build_complete = true;
                    this.build_in_progress = false;
                    this.result = msg;
                    this._success('Packages updated or installed successfully.');
                } else {
                    this.build_complete = true;
                    this.build_in_progress = false;
                    this.build_error = true;
                    this._error(msg)
                }
            });
    }

    _success(message) {
        notifier.showSuccessMessage(message, "top-center");
    }

    _error(message) {
        notifier.showErrorMessage(message, "top-stretch");
    }

    _renderCardLinks() {
        return html`${pages.map(page => html`
            <qwc-extension-link slot="link"
                                extensionName="${NAME}"
                                iconName="${page.icon}"
                                displayName="${page.title}"
                                staticLabel="${page.staticLabel}"
                                dynamicLabel="${page.dynamicLabel}"
                                streamingLabel="${page.streamingLabel}"
                                path="${page.id}"
                                ?embed=${page.embed}
                                externalUrl="${page.metadata.externalUrl}"
                                webcomponent="${page.componentLink}">
            </qwc-extension-link>
        `)}`;
    }

}

customElements.define('qwc-quinoa-card', QwcQuinoaCard);