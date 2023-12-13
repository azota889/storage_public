(function () {
    'use strict';

    const CONST_PLUGIN_NAME = 'azt-helper-question';

    const EVENT_SETUP_API_AZT = 'azt-dispatch-setup-api';
    const EVENT_AZT_PUSH_JSON_CONTENT = 'azt-dispatch-push-json-content';
    const AZT_CLASS_ANSWER_MANAGER = 'azt-answer-managers';
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

    class Application {
      constructor(editor, pluginApi) {
        this.editor = editor;
        this.pluginApi = pluginApi;
        this.pluginApi.addOneSuggestionMenu(this.pluginApi.translate('lang_editor_common_add_detailed_solution', 'Th\xeam l\u1eddi gi\u1ea3i chi ti\u1ebft'), 'azt-helper-question-add', AZT_PLUGIN_SVG_ICON.AztListChecks, false, true);
        this.pluginApi.addOneSuggestionMenu(this.pluginApi.translate('lang_editor_common_delete_detailed_solution', 'X\xf3a l\u1eddi gi\u1ea3i chi ti\u1ebft'), 'azt-helper-question-remove', AZT_PLUGIN_SVG_ICON.AztListChecks, true, true);
        this.editor.on(EVENT_AZT_PUSH_JSON_CONTENT, event => {
          if (event.name === 'QUESTION_MULTIPLE_CHOICE_JSON') {
            this.processJsonToElement(event.content);
          }
        });
        this.editor.on('NewBlock', event => {
          this.processWithNewLine(event.newBlock);
          this.detachElementWithBody();
        });
        this.editor.on('keydown', () => {
          this.detachElementWithBody();
        });
        this.editor.addCommand('azt-helper-question-remove', () => {
          this.getAllHelperElement().forEach(element => {
            element.remove();
          });
        });
      }
      processJsonToElement(jsonObj) {
        const element = document.createElement('div');
        element.classList.add('azt-helper-question-manager');
        element.setAttribute('data-translate-text', this.pluginApi.translate('lang_editor_common_detailed_solution_guide', 'H\u01b0\u1edbng d\u1eabn gi\u1ea3i chi ti\u1ebft'));
        element.innerHTML = jsonObj.help;
        this.editor.getBody().appendChild(element);
      }
      loopCheck(element) {
        if (element && element.classList.contains('azt-helper-question-manager'))
          ;
        if (element.textContent.length > 0)
          return element;
        return this.loopCheck(element.nextElementSibling);
      }
      detachElementWithBody() {
        if (this.editor.getBody().querySelectorAll(`.${ AZT_CLASS_ANSWER_MANAGER }`).length > 0) {
          const answerElm = this.editor.getBody().querySelector(`.${ AZT_CLASS_ANSWER_MANAGER }`), target = this.loopCheck(answerElm.nextElementSibling);
          if (target) {
            target.classList.add('azt-helper-question-manager');
            target.setAttribute('data-translate-text', this.pluginApi.translate('lang_editor_common_detailed_solution_guide', 'H\u01b0\u1edbng d\u1eabn gi\u1ea3i chi ti\u1ebft'));
          }
        }
        this.editor.getBody().querySelectorAll('.azt-helper-question-manager').forEach((element, index) => {
          if (index > 0)
            element.classList.remove('azt-helper-question-manager');
        });
        if (this.editor.getBody().querySelectorAll('.azt-helper-question-manager').length > 0) {
          this.pluginApi.hiddenOneSuggestionMenu('azt-helper-question-add');
          this.pluginApi.openOneSuggestionMenu('azt-helper-question-remove');
        } else {
          this.pluginApi.openOneSuggestionMenu('azt-helper-question-add');
          this.pluginApi.hiddenOneSuggestionMenu('azt-helper-question-remove');
        }
      }
      getAllHelperElement() {
        const startElement = this.editor.getBody().querySelector('.azt-helper-question-manager');
        if (!startElement)
          return [];
        const elementsBelow = [];
        let currentElement = startElement;
        while (currentElement) {
          elementsBelow.push(currentElement);
          currentElement = currentElement.nextElementSibling;
        }
        return elementsBelow;
      }
      processWithNewLine(target) {
        if (target.classList.contains('azt-helper-question-manager')) {
          target.classList.remove('azt-helper-question-manager');
        }
      }
    }

    const StylePluginRegister = `.azt-helper-question-manager {
    width: 100%;
    position: relative;
    margin-top: 55px !important;
}

.azt-helper-question-manager::before {
    content: '';
    width: 100%;
    top: -15px;
    position: absolute;
    height: 1px;
    background: #2361ae;
}

.azt-helper-question-manager::after {
    content: attr(data-translate-text);;
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: -15px;
    color: #2361ae;
    display: block;
    width: fit-content;
    padding: 5px 10px;
    text-transform: uppercase;
    background: #fff;
    border-radius: 10px;
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
