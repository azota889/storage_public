(function () {
    'use strict';

    const CONST_PLUGIN_NAME = 'azt-question-multiple-choice';

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
        this.startCheckRemove = false;
        this.editor.on(EVENT_AZT_PUSH_JSON_CONTENT, event => {
          if (event.name === 'QUESTION_MULTIPLE_CHOICE_JSON') {
            this.processJsonToElement(event.content);
          }
        });
        pluginApi.addOneSuggestionMenu(this.pluginApi.translate('lang_editor_common_add_multiple_choice_question_layout', 'Th\xeam layout c\xe2u h\u1ecfi tr\u1eafc nghi\u1ec7m'), 'azt-manager-plugins--question-add-multiple-choice', AZT_PLUGIN_SVG_ICON.AztLayoutList, false, true);
        this.editor.on('keydown', event => {
          if (event.code === 'Tab') {
            event.preventDefault();
            const elm = this.editor.selection.getRng().commonAncestorContainer.parentElement;
            if (elm.tagName === 'P' && elm.textContent.startsWith('A.')) {
              if (this.checkExistAnswer())
                return;
              this.createLstAnswers('azt-question-multiple-choice-answers-layout-4', elm);
              return this.onHasChoiceTypeQuest();
            }
            if (elm.closest('.azt-question-answer')) {
              {
                this.editor.execCommand('mceInsertNewLine');
              }
            }
          }
          if (this.editor.getBody().querySelectorAll('.azt-question-multiple-choice-answers').length === 0) {
            this.onNotHasChoiceTypeQuest();
          }
        });
        this.editor.on('NewBlock', event => {
          const previousSibling = event.newBlock.previousSibling;
          if (previousSibling && previousSibling.tagName && previousSibling.tagName === 'P' && previousSibling.textContent.startsWith('A.')) {
            this.createLstAnswers('azt-question-multiple-choice-answers-layout-4', previousSibling);
            return this.onHasChoiceTypeQuest();
          }
          this.recheckElementAnswer();
        });
        this.editor.on('click', event => {
          const target = event.target;
          if (target.closest && target.closest('.azt-question-answer') && event.offsetX <= 0) {
            const liAnswerElm = target.closest('.azt-question-answer');
            if (liAnswerElm.classList.contains('correct-answer')) {
              liAnswerElm.classList.remove('correct-answer');
              const qv_string_eng_ans = this.editor.getBody().querySelector(`.qv_string_eng_ans[data-index-answer='${ liAnswerElm.getAttribute('data-index-answer').replace('.', '') }']`);
              if (qv_string_eng_ans)
                qv_string_eng_ans.classList.remove('correct-answer');
            } else {
              liAnswerElm.classList.add('correct-answer');
              const qv_string_eng_ans = this.editor.getBody().querySelector(`.qv_string_eng_ans[data-index-answer='${ liAnswerElm.getAttribute('data-index-answer').replace('.', '') }']`);
              if (qv_string_eng_ans)
                qv_string_eng_ans.classList.add('correct-answer');
            }
          }
        });
      }
      createAnswerElement() {
        const olElement = document.createElement('ol');
        olElement.classList.add(AZT_CLASS_ANSWER_MANAGER);
        olElement.classList.add('azt-question-multiple-choice-answers');
        return olElement;
      }
      createLstAnswersFromInput(answers) {
        const olElement = this.createAnswerElement();
        olElement.classList.add('azt-question-multiple-choice-answers-layout-4');
        answers.forEach(answer => {
          const liItem = document.createElement('li');
          liItem.classList.add('azt-question-answer');
          liItem.innerHTML = answer.content;
          if (answer.isTrue) {
            liItem.classList.add('correct-answer');
            const qv_string_eng_ans = this.editor.getBody().querySelector(`.qv_string_eng_ans[data-index-answer='${ answer.key }']`);
            if (qv_string_eng_ans)
              qv_string_eng_ans.classList.add('correct-answer');
          }
          liItem.setAttribute('data-index-answer', `${ answer.key }.`);
          olElement.appendChild(liItem);
        });
        this.editor.getBody().prepend(olElement);
        this.onHasChoiceTypeQuest();
      }
      processJsonToElement(jsonObj) {
        this.createLstAnswersFromInput(jsonObj.answers);
        const contentElement = document.createElement('p');
        contentElement.innerHTML = jsonObj.content;
        this.editor.getBody().prepend(contentElement);
        this.editor.selection.setCursorLocation(contentElement, 0);
      }
      recheckElementAnswer() {
        const els = this.editor.getBody().querySelectorAll('.azt-question-multiple-choice-answers .azt-question-answer');
        els.forEach((element, index) => {
          element.setAttribute('data-index-answer', [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'K',
            'L',
            'M',
            'N'
          ][index] + '.');
        });
        if (els.length) {
          this.onHasChoiceTypeQuest();
        }
      }
      onHasChoiceTypeQuest() {
        this.startCheckRemove = true;
        this.pluginApi.hiddenOneSuggestionMenu('azt-manager-plugins--question-add-multiple-choice');
        this.pluginApi.setContentPlaceholder(this.pluginApi.translate('lang_cms_common_open_tool', 'G\xf5 [kbd=/] \u0111\u1ec3 m\u1edf c\xf4ng c\u1ee5.'));
      }
      onNotHasChoiceTypeQuest() {
        if (!this.startCheckRemove)
          return;
        this.pluginApi.setContentPlaceholder(this.pluginApi.translate('lang_cms_common_start_answer_input', 'G\xf5 [kbd=/] \u0111\u1ec3 m\u1edf c\xf4ng c\u1ee5. G\xf5 [kbd=A.] n\u1ed9i dung + [kbd=tab] ho\u1eb7c [kbd=enter] \u0111\u1ec3 b\u1eaft \u0111\u1ea7u nh\u1eadp \u0111\xe1p \xe1n'));
        this.pluginApi.openOneSuggestionMenu('azt-manager-plugins--question-add-multiple-choice');
      }
      checkExistAnswer() {
        return this.editor.getBody().querySelectorAll(`.azt-question-multiple-choice-answers`).length > 0;
      }
      createLstAnswers(layout_class, previousSibling) {
        const keepElement = document.createElement('div');
        previousSibling.parentNode.insertBefore(keepElement, previousSibling);
        var cursorPointer = previousSibling;
        const olElement = this.createAnswerElement();
        olElement.classList.add(layout_class);
        previousSibling.innerHTML = previousSibling.innerHTML.substring(2);
        const liItemCurr = document.createElement('li');
        liItemCurr.classList.add('azt-question-answer');
        liItemCurr.appendChild(previousSibling);
        olElement.appendChild(liItemCurr);
        if (previousSibling.textContent.length > 0) {
          const liItemNext = document.createElement('li');
          liItemNext.classList.add('azt-question-answer');
          const nextBlock = document.createElement('p');
          nextBlock.innerHTML = '<br/>';
          liItemNext.appendChild(nextBlock);
          olElement.appendChild(liItemNext);
          cursorPointer = nextBlock;
        }
        keepElement.appendChild(olElement);
        this.editor.selection.setCursorLocation(cursorPointer, 0);
        this.recheckElementAnswer();
      }
    }

    const StylePluginRegister = `.azt-question-multiple-choice-answers {
    padding-left: 16px;
    list-style: none;
    margin: 5px;
    margin-top: 20px;
    display: grid;
    grid-row-gap: 10px;
}

.azt-question-multiple-choice-answers .azt-question-answer {
    position: relative;
    width: fit-content;
}

.azt-question-multiple-choice-answers .azt-question-answer::before {
    content: attr(data-index-answer);
    position: absolute;
    top: 50%;
    left: -12px;
    transform: translate(-50%, -50%);
}

.azt-question-multiple-choice-answers .azt-question-answer::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 2px solid #2361ae;
    top: 50%;
    left: -35px;
    transform: translate(-50%, -50%);
    cursor: pointer;
}

.azt-question-multiple-choice-answers .correct-answer::after,
.qv_string_eng_ans.correct-answer::after {
    content: '\u2713';
    background-color: #2361ae;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
}

.qv_string_eng_ans.correct-answer::after {
    font-size: 8px;
}

.qv_string_eng_ans.correct-answer {
    color: #2361ae;
}

.azt-question-multiple-choice-answers-layout-2 {
    display: grid;
    align-items: center;
    grid-template-columns: 50% 50%;
    grid-gap: 10px;
    box-sizing: border-box;
}

.azt-question-multiple-choice-answers-layout-2 .azt-question-answer {
    max-width: 90%;
}

.azt-question-multiple-choice-answers-layout-1 {
    display: grid;
    align-items: center;
    grid-template-columns: 25% 25% 25% 25%;
    grid-gap: 10px;
    box-sizing: border-box;
}

.azt-question-multiple-choice-answers-layout-1 .azt-question-answer {
    max-width: 82%;
}

.azt-question-multiple-choice-answers-layout-1-3 {
    display: grid;
    align-items: center;
    grid-template-columns: 33.33% 33.33% 33.33%;
    grid-gap: 10px;
    box-sizing: border-box;
}

.azt-question-multiple-choice-answers-layout-1-3 .azt-question-answer {
    max-width: 86%;
}

.qv_string_eng_ans {
    cursor: pointer;
    padding: 0 5px;
    font-weight: bold;
    text-decoration: underline;
    position: relative;
    height: 40px;
    display: inline-block;
    text-underline-offset: 4px;
    text-decoration-skip-ink: none;
}

.qv_string_eng_ans::after {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: 2px solid #2361ae;
    top: 30px;
    left: 50%;
    transform: translate(-160%, 0);
    cursor: pointer;
}

.qv_string_eng_ans::before {
    content: attr(data-index-answer);
    position: absolute;
    top: 23px;
    left: 50% !important;
    transform: translate(-50%, 0) !important;
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
