(function () {
    'use strict';

    const CONST_PLUGIN_NAME = 'azt-code-block';

    const EVENT_SETUP_API_AZT = 'azt-dispatch-setup-api';
    const EVENT_AZT_PUSH_JSON_CONTENT = 'azt-dispatch-push-json-content';
    var CONST_TYPE_MODE_SOURCE;
    (function (CONST_TYPE_MODE_SOURCE) {
      CONST_TYPE_MODE_SOURCE[CONST_TYPE_MODE_SOURCE['FRAME'] = 0] = 'FRAME';
      CONST_TYPE_MODE_SOURCE[CONST_TYPE_MODE_SOURCE['DOCUMENT'] = 1] = 'DOCUMENT';
      CONST_TYPE_MODE_SOURCE[CONST_TYPE_MODE_SOURCE['ALL'] = 2] = 'ALL';
    }(CONST_TYPE_MODE_SOURCE || (CONST_TYPE_MODE_SOURCE = {})));
    var AZT_PLUGIN_SVG_ICON;
    (function (AZT_PLUGIN_SVG_ICON) {
      AZT_PLUGIN_SVG_ICON[AZT_PLUGIN_SVG_ICON['AztSigma'] = 0] = 'AztSigma';
      AZT_PLUGIN_SVG_ICON[AZT_PLUGIN_SVG_ICON['AztImage'] = 1] = 'AztImage';
      AZT_PLUGIN_SVG_ICON[AZT_PLUGIN_SVG_ICON['AztAdd'] = 2] = 'AztAdd';
      AZT_PLUGIN_SVG_ICON[AZT_PLUGIN_SVG_ICON['AztBadge'] = 3] = 'AztBadge';
      AZT_PLUGIN_SVG_ICON[AZT_PLUGIN_SVG_ICON['AztLayoutList'] = 4] = 'AztLayoutList';
      AZT_PLUGIN_SVG_ICON[AZT_PLUGIN_SVG_ICON['AztBraces'] = 5] = 'AztBraces';
      AZT_PLUGIN_SVG_ICON[AZT_PLUGIN_SVG_ICON['AztListChecks'] = 6] = 'AztListChecks';
    }(AZT_PLUGIN_SVG_ICON || (AZT_PLUGIN_SVG_ICON = {})));

    const AddSuggestionActionMenuCommand = {
      setup: (editor, suggestion) => {
        editor.addCommand('aztAddSuggestionActionMenu', (ui, payload) => {
          suggestion.addOneMenu(payload);
        });
      },
      call: (editor, payload) => {
        editor.execCommand('aztAddSuggestionActionMenu', false, payload);
      },
      name: 'aztAddSuggestionActionMenu'
    };
    const HiddenOneSuggestionActionMenuCommand = {
      setup: (editor, suggestion) => {
        editor.addCommand('aztHiddenOneSuggestionActionMenu', (ui, payload) => {
          suggestion.hiddenOneMenu(payload);
        });
      },
      call: (editor, payload) => {
        editor.execCommand('aztHiddenOneSuggestionActionMenu', false, payload);
      },
      name: 'aztHiddenOneSuggestionActionMenu'
    };
    const OpenOneSuggestionActionMenuCommand = {
      setup: (editor, suggestion) => {
        editor.addCommand('aztOpenOneSuggestionActionMenu', (ui, payload) => {
          suggestion.openOneMenu(payload);
        });
      },
      call: (editor, payload) => {
        editor.execCommand('aztOpenOneSuggestionActionMenu', false, payload);
      },
      name: 'aztOpenOneSuggestionActionMenu'
    };
    const HiddenSuggestionActionMenuCommand = {
      setup: (editor, suggestion) => {
        editor.addCommand('aztHiddenSuggestionActionMenu', (ui, payload) => {
          suggestion.hidden(payload);
        });
      },
      call: (editor, payload) => {
        editor.execCommand('aztHiddenSuggestionActionMenu', false, payload);
      },
      name: 'aztHiddenSuggestionActionMenu'
    };

    const LoadScriptSourceCommand = {
      setup: (editor, source) => {
        editor.addCommand('aztLoadScriptSource', (ui, payload) => {
          source.loadSrcJs(payload.name, payload.url, payload.mode).then(payload.callback);
        });
      },
      call: (editor, payload) => {
        editor.execCommand('aztLoadScriptSource', false, payload);
      },
      name: 'aztLoadScriptSource'
    };
    const LoadMultipleScriptSourceCommand = {
      setup: (editor, source) => {
        editor.addCommand('aztLoadMultipleScriptSource', (ui, payload) => {
          source.loadMultipleSrcJs(payload.lst).then(payload.callback);
        });
      },
      call: (editor, payload) => {
        editor.execCommand('aztLoadMultipleScriptSource', false, payload);
      },
      name: 'aztLoadMultipleScriptSource'
    };

    const LoadStyleSourceCommand = {
      setup: (editor, source) => {
        editor.addCommand('aztLoadStyleSource', (ui, payload) => {
          source.loadStyle(payload.name, payload.content, payload.mode);
        });
      },
      call: (editor, payload) => {
        editor.execCommand('aztLoadStyleSource', false, payload);
      },
      name: 'aztLoadStyleSource'
    };

    const SetContentPlaceholderActionMenuCommand = {
      setup: (editor, placeholder) => {
        editor.addCommand('aztSetContentPlaceholderActionMenu', (ui, payload) => {
          placeholder.setContent(payload);
        });
      },
      call: (editor, payload) => {
        editor.execCommand('aztSetContentPlaceholderActionMenu', false, payload);
      },
      name: 'aztSetContentPlaceholderActionMenu'
    };

    class AztPluginApi {
      constructor(editor) {
        this.editor = editor;
      }
      loadScript(name, url, mode) {
        return new Promise(resolve => {
          LoadScriptSourceCommand.call(this.editor, {
            name,
            url,
            mode,
            callback: resolve
          });
        });
      }
      loadMultipleScript(lst) {
        return new Promise(resolve => {
          LoadMultipleScriptSourceCommand.call(this.editor, {
            lst,
            callback: resolve
          });
        });
      }
      loadStyle(name, content, mode) {
        return LoadStyleSourceCommand.call(this.editor, {
          name,
          content,
          mode
        });
      }
      hiddenSuggestionMenu(removeChar) {
        return HiddenSuggestionActionMenuCommand.call(this.editor, removeChar);
      }
      addOneSuggestionMenu(name, callback, svgIcon, hidden, hiddenOnExcuse) {
        return AddSuggestionActionMenuCommand.call(this.editor, {
          name,
          callback,
          svgIcon,
          hidden,
          hiddenOnExcuse
        });
      }
      openOneSuggestionMenu(callback) {
        return OpenOneSuggestionActionMenuCommand.call(this.editor, callback);
      }
      hiddenOneSuggestionMenu(callback) {
        return HiddenOneSuggestionActionMenuCommand.call(this.editor, callback);
      }
      setContentPlaceholder(content) {
        return SetContentPlaceholderActionMenuCommand.call(this.editor, content);
      }
      pushJsonContent(name, content) {
        return this.editor.fire(EVENT_AZT_PUSH_JSON_CONTENT, {
          name,
          content
        });
      }
      static replaceTranslateService(callback) {
        if (!Object.prototype.hasOwnProperty.call(window, 'aztEditorFnsTranslateService')) {
          window['aztEditorFnsTranslateService'] = callback;
        }
      }
      translate(content, default_content) {
        if (!window['aztEditorFnsTranslateService'])
          return default_content !== null && default_content !== void 0 ? default_content : content;
        return window['aztEditorFnsTranslateService'](content, default_content);
      }
    }

    function AztApiRegister(editor) {
      return new Promise(resolve => {
        editor.on(EVENT_SETUP_API_AZT, () => {
          resolve(new AztPluginApi(editor));
        });
      });
    }

    class HelperCore {
      static escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      static replaceAllWithNonNullable(target, search, replacement) {
        if (replacement != undefined && target != undefined) {
          return target.toString().replace(new RegExp(HelperCore.escapeRegExp(search), 'g'), replacement);
        }
        return target;
      }
      static getTextContentWithLineBreaks(element) {
        let textContent = '';
        const traverseNode = node => {
          if (node.nodeType === Node.TEXT_NODE) {
            textContent += node.nodeValue;
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.nodeName === 'BR') {
              textContent += '\n';
            } else {
              for (const childNode of node.childNodes) {
                traverseNode(childNode);
              }
            }
          }
        };
        traverseNode(element);
        return textContent;
      }
    }

    class Application {
      constructor(editor, pluginApi) {
        this.editor = editor;
        this.pluginApi = pluginApi;
        this.pluginApi.loadScript('highlight.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js', CONST_TYPE_MODE_SOURCE.DOCUMENT).then(() => {
          this.editor.addCommand('azt-code-block--popup-new-code', () => {
            this.onHandleExecuteSuggestion();
          });
          this.pluginApi.addOneSuggestionMenu(this.pluginApi.translate('lang_editor_common_open_code_block_editor', 'M\u1edf tr\xecnh so\u1ea1n code block'), 'azt-code-block--popup-new-code', AZT_PLUGIN_SVG_ICON.AztBraces, false, true);
          this.editor.on('keydown', () => {
            this.detachAll();
          });
          this.editor.on('NewBlock', () => {
            this.detachAll();
          });
          this.editor.on('Change', () => {
            this.detachAll();
          });
          this.editor.on('dblclick', event => {
            const closest = event.target.closest(`.az-code-boxer`);
            if (closest) {
              this.onHandleExecuteSuggestion(closest);
            }
          });
        });
      }
      onHandleExecuteSuggestion(target) {
        console.log(this.pluginApi);
        this.editor.windowManager.open({
          size: 'large',
          title: this.pluginApi.translate('lang_editor_common_code_block_editor', 'Tr\xecnh ch\u1ec9nh s\u1eeda m\xe3 code block'),
          body: {
            type: 'panel',
            items: [{
                type: 'textarea',
                name: 'codeBlock',
                placeholder: this.pluginApi.translate('lang_editor_common_paste_code', 'D\xe1n \u0111o\u1ea1n code b\u1ea1n mu\u1ed1n th\xeam v\xe0o')
              }]
          },
          buttons: [
            {
              type: 'cancel',
              text: this.pluginApi.translate('lang_editor_common_close', '\u0110\xf3ng')
            },
            {
              type: 'submit',
              text: target ? this.pluginApi.translate('lang_editor_common_edit', 'Ch\u1ec9nh s\u1eeda') : this.pluginApi.translate('lang_editor_common_add_new_code_block', 'Th\xeam m\u1edbi \u0111o\u1ea1n code'),
              primary: true
            }
          ],
          initialData: { codeBlock: target ? target.getAttribute('content') : '' },
          onSubmit: api => {
            const data = api.getData();
            if (target) {
              const contentCodeBlock = data.codeBlock;
              target.setAttribute('content', contentCodeBlock);
              const codeCheck = hljs.highlightAuto(contentCodeBlock);
              const linesContent = codeCheck.value.split('\n').filter(f => f.trim().length > 0);
              target.querySelector('.azt-pre').innerHTML = linesContent.map(m => `<code class="azt-pre-code">${ m }</code>`).join('');
              this.editor.execCommand('mceAutoResize');
              this.editor.focus();
              return api.close();
            } else {
              this.editor.execCommand('mceInsertContent', false, `<code>${ data.codeBlock }</code>`);
              this.editor.focus();
              return api.close();
            }
          }
        });
      }
      detachAll() {
        this.editor.getBody().querySelectorAll('code').forEach(element => {
          if (element.hasAttribute('processing') || element.classList.contains('azt-pre-code'))
            return;
          element.setAttribute('processing', 'true');
          var contentCodeBlock = HelperCore.getTextContentWithLineBreaks(element);
          contentCodeBlock = HelperCore.replaceAllWithNonNullable(contentCodeBlock, '&lt;', '<');
          contentCodeBlock = HelperCore.replaceAllWithNonNullable(contentCodeBlock, '&gt;', '>');
          contentCodeBlock = HelperCore.replaceAllWithNonNullable(contentCodeBlock, '<br>', '\n');
          element.setAttribute('content', contentCodeBlock);
          const codeCheck = hljs.highlightAuto(contentCodeBlock);
          const linesContent = codeCheck.value.split('\n').filter(f => f.trim().length > 0);
          element.innerHTML = '';
          element.setAttribute('contenteditable', 'false');
          element.classList.add('az-code-boxer');
          element.setAttribute('data-translate-text', this.pluginApi.translate('lang_editor_common_source_code', 'M\xe3 ngu\u1ed3n'));
          const codeBlock = document.createElement('pre');
          codeBlock.classList.add('azt-pre');
          codeBlock.innerHTML = linesContent.map(m => `<code class="azt-pre-code">${ m }</code>`).join('');
          element.appendChild(codeBlock);
          this.editor.execCommand('mceAutoResize');
        });
      }
    }

    const StylePluginRegister = `.az-code-boxer {
    margin: 10px;
    padding: 0;
    background: #eceff1;
    border-radius: 5px;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    cursor: pointer;
}

.az-code-boxer[contentEditable=false][data-mce-selected] {
    outline: none;
}

.az-code-boxer::before {
    content: attr(data-translate-text);
    display: block;
    padding: 5px 10px;
    background: #2361ae;
    border-radius: 5px 5px 0 0;
    color: white;
    font-weight: 500;
} 

.az-code-boxer .azt-pre {
    border: 1px solid #2361ae;
    border-top: none;
    padding: 0;
    overflow: auto;
    border-radius: 0 0 5px 5px;
    margin: 0;
}

.az-code-boxer .azt-pre .azt-pre-code {
    display: block;
    padding: 5px 10px;
    background: linear-gradient(-225deg,#d5dbe4,#f8f8f8);
    border-radius: 0;
}

pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em
}

code.hljs {
    padding: 3px 5px
}

.hljs {
    background: #f3f3f3;
    color: #444
}

.hljs-comment {
    color: #697070
}

.hljs-punctuation,
.hljs-tag {
    color: #444a
}

.hljs-tag .hljs-attr,
.hljs-tag .hljs-name {
    color: #444
}

.hljs-attribute,
.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-name,
.hljs-selector-tag {
    font-weight: 700
}

.hljs-deletion,
.hljs-number,
.hljs-quote,
.hljs-selector-class,
.hljs-selector-id,
.hljs-string,
.hljs-template-tag,
.hljs-type {
    color: #800
}

.hljs-section,
.hljs-title {
    color: #800;
    font-weight: 700
}

.hljs-link,
.hljs-operator,
.hljs-regexp,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-symbol,
.hljs-template-variable,
.hljs-variable {
    color: #ab5656
}

.hljs-literal {
    color: #695
}

.hljs-addition,
.hljs-built_in,
.hljs-bullet,
.hljs-code {
    color: #397300
}

.hljs-meta {
    color: #1f7199
}

.hljs-meta .hljs-string {
    color: #38a
}

.hljs-emphasis {
    font-style: italic
}

.hljs-strong {
    font-weight: 700
}`;

    const setup = editor => {
        AztApiRegister(editor).then(pluginApi => {
          pluginApi.loadStyle(`${ CONST_PLUGIN_NAME }__default`, StylePluginRegister, CONST_TYPE_MODE_SOURCE.ALL);
          new Application(editor, pluginApi);
        });
      }, initPlugin = () => {
        tinymce.PluginManager.add(CONST_PLUGIN_NAME, setup);
      };
    initPlugin();

})();
