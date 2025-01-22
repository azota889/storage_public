(function () {
    'use strict';

    const CONST_PLUGIN_NAME = 'azt-manager-plugins';

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

    function AztApiSetup(editor, source, suggestion, placeholder) {
      LoadScriptSourceCommand.setup(editor, source);
      LoadMultipleScriptSourceCommand.setup(editor, source);
      LoadStyleSourceCommand.setup(editor, source);
      AddSuggestionActionMenuCommand.setup(editor, suggestion);
      HiddenOneSuggestionActionMenuCommand.setup(editor, suggestion);
      HiddenSuggestionActionMenuCommand.setup(editor, suggestion);
      OpenOneSuggestionActionMenuCommand.setup(editor, suggestion);
      SetContentPlaceholderActionMenuCommand.setup(editor, placeholder);
      editor.dispatch(EVENT_SETUP_API_AZT);
    }

    class HelperCore {
      static getCaretContainer(editor) {
        const selection = editor.getWin().getSelection();
        let caretContainer, range;
        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
          caretContainer = range.commonAncestorContainer;
        }
        return caretContainer;
      }
    }

    class PlaceholderObject {
      constructor(editor, pluginApi) {
        this.editor = editor;
        this.pluginApi = pluginApi;
        this.element = this.getElementForRoot();
        this.setContent(this.pluginApi.translate('lang_cms_common_start_answer_input', 'G\xf5 [kbd=/] \u0111\u1ec3 m\u1edf c\xf4ng c\u1ee5. G\xf5 [kbd=A.] n\u1ed9i dung + [kbd=tab] ho\u1eb7c [kbd=enter] \u0111\u1ec3 b\u1eaft \u0111\u1ea7u nh\u1eadp \u0111\xe1p \xe1n'));
        document.body.appendChild(this.element);
        editor.on('keydown', () => {
          this.normalCheckStartLineEmpty();
        });
        editor.on('keyup', () => {
          this.normalCheckStartLineEmpty();
        });
        editor.on('change', () => {
          this.normalCheckStartLineEmpty();
        });
        editor.on('click', () => {
          this.normalCheckStartLineEmpty();
        });
        editor.on('blur', () => {
          this.hidden();
        });
      }
      getElementForRoot() {
        const target = document.getElementById(PlaceholderObject.RootElementId);
        if (target)
          return target;
        const create_target = document.createElement('div');
        create_target.classList.add('azt-editor-placeholder');
        create_target.id = PlaceholderObject.RootElementId;
        document.body.appendChild(create_target);
        return create_target;
      }
      setContent(content) {
        this.element.innerHTML = content.replace(/\[kbd=([a-zA-Z0-9./]*)\]/g, (value, item) => {
          return this.kbd(item);
        });
      }
      normalCheckStartLineEmpty() {
        var selection = this.editor.selection, rng = selection.getRng(), currentLineText = rng.startContainer.textContent, caretPosInLine = rng.startOffset;
        if (caretPosInLine === 0 && currentLineText.length === 0) {
          let caretContainer = HelperCore.getCaretContainer(this.editor);
          const boundingClientRect = caretContainer.getBoundingClientRect();
          return this.open(boundingClientRect.y, boundingClientRect.x);
        } else {
          return this.hidden();
        }
      }
      open(top, left) {
        const bodyRect = document.body.getBoundingClientRect(), elemRect = this.editor.getContentAreaContainer().getBoundingClientRect(), offset = elemRect.top - bodyRect.top;
        const startX = elemRect.x;
        const startY = offset;
        this.element.style.display = 'flex';
        this.element.style.top = `${ startY + top + 3 }px`;
        this.element.style.left = `${ startX + left }px`;
      }
      hidden() {
        this.element.style.display = 'none';
        this.element.style.top = '';
        this.element.style.left = '';
      }
      kbd(value) {
        const element = document.createElement('kbd');
        element.innerText = value;
        return element.outerHTML;
      }
      static get RootElementId() {
        return 'azt-editor-plugin-placeholder-action';
      }
    }

    class SourceIconCore {
      static get SVG_ICONS() {
        const icons = [];
        icons[AZT_PLUGIN_SVG_ICON.AztSigma] = '<svg style="fill: none !important;" width="22" height="22" aria-hidden="true" focusable="false" data-prefix="fad" data-icon="function" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><g class="fa-duotone-group"><path class="fa-secondary" fill="currentColor" d="M330.7 177.7C303.7 218.4 288 267.3 288 320s15.7 101.6 42.7 142.3c9.8 14.7 5.7 34.6-9 44.3s-34.6 5.7-44.3-9C243.6 446.7 224 385.6 224 320s19.6-126.7 53.3-177.7c9.8-14.7 29.6-18.8 44.3-9s18.8 29.6 9 44.3zm202.6 0c-9.8-14.7-5.7-34.6 9-44.3s34.6-5.7 44.3 9C620.4 193.3 640 254.4 640 320s-19.6 126.7-53.3 177.7c-9.8 14.7-29.6 18.8-44.3 9s-18.8-29.6-9-44.3c27-40.7 42.7-89.6 42.7-142.3s-15.7-101.6-42.7-142.3z"></path><path class="fa-primary" fill="currentColor" d="M160 0C107 0 64 43 64 96v96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H64V383.5c0 16.1-12 29.8-28 31.8l-7.9 1C10.5 418.4-1.9 434.4 .3 452s18.2 30 35.7 27.8l7.9-1c48-6 84.1-46.8 84.1-95.3V256h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H128V96c0-17.7 14.3-32 32-32h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H160zM398.6 241.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L386.7 320l-33.4 33.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L432 365.3l33.4 33.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L477.3 320l33.4-33.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L432 274.7l-33.4-33.4z"></path></g></svg>';
        icons[AZT_PLUGIN_SVG_ICON.AztImage] = '<svg style="fill: none !important;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
        icons[AZT_PLUGIN_SVG_ICON.AztAdd] = '<svg style="fill: none !important;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-square"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>';
        icons[AZT_PLUGIN_SVG_ICON.AztBadge] = '<svg style="fill: none !important;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-badge-check"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>';
        icons[AZT_PLUGIN_SVG_ICON.AztLayoutList] = '<svg style="fill: none !important;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-list"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M14 4h7"/><path d="M14 9h7"/><path d="M14 15h7"/><path d="M14 20h7"/></svg>', icons[AZT_PLUGIN_SVG_ICON.AztBraces] = '<svg style="fill: none !important;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-braces"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>', icons[AZT_PLUGIN_SVG_ICON.AztListChecks] = '<svg style="fill: none !important;" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>';
        return icons;
      }
      static svg(name) {
        return SourceIconCore.SVG_ICONS[name];
      }
    }

    class SuggestionObject {
      constructor(editor) {
        this.editor = editor;
        this.menus = [];
        this.element = this.getElementForRoot();
        editor.on('keyup', event => {
          this.normalCheckEnableSuggestion(event);
        });
        editor.on('keydown', event => {
          if (this.element.getAttribute('data-open') === 'false')
            return;
          if (this.checkIgnoreKey(event.key)) {
            event.preventDefault();
            switch (event.key) {
            case 'ArrowDown':
              this.processDownActiveItem();
              break;
            case 'ArrowUp':
              this.processUpActiveItem();
              break;
            }
          }
        });
      }
      processOnMouseMoveActive(event) {
        if (this.element.getAttribute('data-open') === 'false')
          return;
        if (!event.target)
          return;
        const current = event.target;
        if (!current.closest)
          return;
        const target = current.closest('.azt-editor-suggestion-menu-item');
        if (!target)
          return;
        const current_active = this.getCurrentActive();
        if (current_active)
          current_active.classList.remove('active');
        target.classList.add('active');
      }
      getCurrentActive() {
        return this.element.querySelector('.active');
      }
      processDownActiveItem() {
        const current = this.getCurrentActive();
        if (!current)
          return;
        current.classList.remove('active');
        const nextMenuElm = this.element.querySelector(`li[data-index='${ current.getAttribute('data-next') }']`);
        if (!nextMenuElm)
          return;
        nextMenuElm.classList.add('active');
      }
      processUpActiveItem() {
        const current = this.getCurrentActive();
        if (!current)
          return;
        current.classList.remove('active');
        const nextMenuElm = this.element.querySelector(`li[data-index='${ current.getAttribute('data-pre') }']`);
        if (!nextMenuElm)
          return;
        nextMenuElm.classList.add('active');
      }
      normalCheckEnableSuggestion(event) {
        let caretContainer = HelperCore.getCaretContainer(this.editor);
        const selection = this.editor.getWin().getSelection();
        if (this.checkIgnoreKey(event.key))
          return;
        if (caretContainer && event && event.code === 'Slash') {
          const range = selection.getRangeAt(0);
          if (range.startOffset === 1 || caretContainer.textContent[range.startOffset - 2] === '\xA0' || caretContainer.textContent[range.startOffset - 2] === ' ') {
            return this.open(range.getBoundingClientRect().x, range.getBoundingClientRect().y);
          }
        }
        this.hidden(false);
      }
      checkIgnoreKey(key) {
        return [
          'ArrowDown',
          'ArrowUp',
          'Enter'
        ].includes(key);
      }
      open(x, y) {
        this.draw();
        x = x < 50 ? 50 : x;
        const bodyRect = document.body.getBoundingClientRect(), elemRect = this.editor.getContentAreaContainer().getBoundingClientRect(), offset = elemRect.top - bodyRect.top;
        const startX = elemRect.x;
        const startY = offset;
        this.element.style.display = 'block';
        this.element.style.top = `${ startY + y }px`;
        this.element.style.left = `${ startX + x }px`;
        this.element.setAttribute('data-open', 'true');
      }
      hidden(removeChar) {
        if (this.element.style.display !== 'none' && removeChar) {
          this.editor.execCommand('delete', false, null);
        }
        this.element.style.display = 'none';
        this.element.setAttribute('data-open', 'false');
      }
      getElementForRoot() {
        const target = document.getElementById(SuggestionObject.RootElementId);
        if (target)
          return target;
        const create_target = document.createElement('div');
        create_target.classList.add('azt-editor-suggestion');
        create_target.id = SuggestionObject.RootElementId;
        document.body.appendChild(create_target);
        create_target.setAttribute('data-open', 'false');
        document.addEventListener('mousemove', event => {
          this.processOnMouseMoveActive(event);
        });
        return create_target;
      }
      draw() {
        this.element.innerHTML = '';
        this.menu_open().forEach((menu, index) => {
          const menu_element = document.createElement('li');
          menu_element.classList.add('azt-editor-suggestion-menu-item');
          menu_element.setAttribute('data-index', index.toString());
          const index_pre = index === 0 ? this.menu_open().length - 1 : index - 1;
          const index_next = index === this.menu_open().length - 1 ? 0 : index + 1;
          menu_element.setAttribute('data-pre', index_pre.toString());
          menu_element.setAttribute('data-next', index_next.toString());
          menu_element.innerHTML = `<span>${ SourceIconCore.svg(menu.svgIcon) }</span><span>${ menu.name }</span>`;
          menu_element.addEventListener('click', () => {
            this.startExecCommand(menu);
          });
          if (index === 0) {
            menu_element.classList.add('active');
          }
          this.element.appendChild(menu_element);
        });
      }
      startExecCommand(command) {
        if (command.hiddenOnExcuse)
          this.hidden(true);
        this.editor.execCommand(command.callback);
      }
      addOneMenu(item) {
        if (!this.menus.find(f => f.callback === item.callback))
          this.menus.push(item);
      }
      openOneMenu(name) {
        if (!name || name.length === 0)
          return;
        const menu = this.menus.find(f => f.callback === name);
        if (!menu)
          return;
        menu.hidden = false;
      }
      hiddenOneMenu(name) {
        if (!name || name.length === 0)
          return;
        const menu = this.menus.find(f => f.callback === name);
        if (!menu)
          return;
        menu.hidden = true;
      }
      toggleOneMenu(name) {
        if (!name || name.length === 0)
          return;
        const menu = this.menus.find(f => f.callback === name);
        if (!menu)
          return;
        menu.hidden = !menu.hidden;
      }
      static get RootElementId() {
        return 'azt-editor-plugin-suggestion-action';
      }
      menu_open() {
        return this.menus.filter(f => f.hidden === false);
      }
      registerEnterPressMasterKeyDown(event) {
        if (this.element.getAttribute('data-open') === 'false')
          return;
        event.preventDefault();
        const current_active = this.getCurrentActive();
        if (!current_active)
          return;
        const index = Number(current_active.getAttribute('data-index'));
        if (!this.menu_open()[index])
          return;
        this.startExecCommand(this.menu_open()[index]);
      }
    }

    class Application {
      constructor(editor, source) {
        this.editor = editor;
        this.source = source;
        this.pluginApi = new AztPluginApi(editor);
        this.placeHolder = new PlaceholderObject(editor, this.pluginApi);
        this.suggestion = new SuggestionObject(editor);
        this.setupApi();
      }
      setupApi() {
        return AztApiSetup(this.editor, this.source, this.suggestion, this.placeHolder);
      }
      onHandleEnterPressMasterKeyDown(event) {
        this.suggestion.registerEnterPressMasterKeyDown(event);
      }
    }

    class SourceScriptManagerCore {
      constructor(name, url, mode) {
        this.name = name;
        this.url = url;
        this.mode = mode;
        this.callbacks = [];
      }
      load(dc) {
        return new Promise(resolve => {
          const scripts = dc.getElementsByTagName('script');
          for (let i = 0; i < scripts.length; i++) {
            const element = scripts[i];
            if (element.src === this.url) {
              this.result = true;
              this.callbacks.forEach(callback => callback(true));
              resolve(true);
            }
          }
          let element = dc.createElement('script');
          element.setAttribute('async', 'false');
          dc.head.appendChild(element);
          element.addEventListener('load', () => {
            this.result = true;
            this.callbacks.forEach(callback => callback(true));
            resolve(true);
          });
          element.setAttribute('src', this.url);
        });
      }
      pushCallback(callback) {
        if (this.result !== undefined) {
          return callback(this.result);
        }
        this.callbacks.push(callback);
      }
    }

    class PromiseMultipleTaskCore {
      constructor(limit_one_process, action_log_item, end_with_error) {
        this.tasks = [];
        this.queues = [];
        this.is_running = false;
        this.all_tasks = 0;
        this.wrap_counter_done = 0;
        this.count_task_root_done = 0;
        this.limit_one_process = limit_one_process !== null && limit_one_process !== void 0 ? limit_one_process : 5;
        this.result_common_temp = {
          datas: [],
          errs: []
        };
        this.action_log_item = action_log_item;
        this.end_with_error = end_with_error !== null && end_with_error !== void 0 ? end_with_error : false;
      }
      addTask(obj, task, input_params, name) {
        if (this.is_running)
          return;
        var params = !input_params ? [] : input_params;
        const index = this.queues.length;
        const wrapper = () => {
          return new Promise(resolve => {
            task.call(obj, ...params).then(value => {
              this.wrap_counter_done++;
              this.callLog(name);
              resolve({
                status: true,
                value: value,
                index: index
              });
            }).catch(e => {
              this.wrap_counter_done++;
              this.callLog(name);
              resolve({
                status: false,
                error: e,
                index
              });
            });
          });
        };
        this.all_tasks++;
        this.queues.push({
          task: wrapper,
          name
        });
      }
      callLog(name) {
        if (this.action_log_item && this.all_tasks > 0) {
          this.action_log_item.function.call({}, ...[
            this.wrap_counter_done,
            this.all_tasks,
            ...this.action_log_item.params ? this.action_log_item.params : [],
            name
          ]);
        }
      }
      start() {
        return new Promise(resolve => {
          if (this.queues.length === 0) {
            resolve({
              datas: [],
              errs: []
            });
          }
          this.result_common_temp = {
            datas: [],
            errs: []
          };
          for (let index = 0; index < this.limit_one_process; index++) {
            const task = this.queues.shift();
            if (!task)
              break;
            this.tasks.push(task);
          }
          this.count_task_root_done = 0;
          this.is_running = true;
          this.runner(resolve);
        });
      }
      checker(result, resolve) {
        this.count_task_root_done++;
        if (result.status && result.value) {
          this.result_common_temp.datas.push({
            index: result.index,
            value: result.value
          });
        } else if (result.error) {
          this.result_common_temp.errs.push({
            index: result.index,
            value: result.error
          });
        }
        if (this.result_common_temp.errs.length > 0 && this.end_with_error) {
          this.is_running = false;
          resolve(this.makeResultObj());
        }
        if (this.count_task_root_done === this.all_tasks) {
          this.is_running = false;
          resolve(this.makeResultObj());
        }
        this.nextItem(resolve);
      }
      makeResultObj() {
        return {
          datas: this.result_common_temp.datas.sort(function (a, b) {
            return a.index - b.index;
          }).map(m => m.value),
          errs: this.result_common_temp.errs.sort(function (a, b) {
            return a.index - b.index;
          }).map(m => m.value)
        };
      }
      nextItem(resolve) {
        const task = this.queues.shift();
        if (!task) {
          return;
        }
        task.task.call(this).then(result => {
          this.checker(result, resolve);
        });
      }
      runner(resolve) {
        if (this.tasks.length > 0) {
          this.tasks.forEach(task => {
            task.task.call(this).then(result => {
              this.checker(result, resolve);
            });
          });
        } else {
          this.is_running = false;
          resolve(this.makeResultObj());
        }
      }
    }

    class SourceManagerCore {
      constructor(current, iframe) {
        this.current = current;
        this.iframe = iframe;
        this.lstGlobalSources = [];
        this.lstPluginSources = [];
        this.lstStyleGlobalSource = [];
        this.lstStylePluginSource = [];
        if (Object.prototype.hasOwnProperty.call(window, SourceManagerCore.ControlName)) {
          this.lstGlobalSources = window[SourceManagerCore.ControlName];
        } else {
          window[SourceManagerCore.ControlName] = this.lstGlobalSources;
        }
        if (Object.prototype.hasOwnProperty.call(window, SourceManagerCore.ControlElementStyleName)) {
          this.lstStyleGlobalSource = window[SourceManagerCore.ControlElementStyleName];
        } else {
          window[SourceManagerCore.ControlElementStyleName] = this.lstStyleGlobalSource;
        }
        const globalStyleElement = document.getElementById(SourceManagerCore.ControlElementStyleName);
        this.currentStyle = globalStyleElement ? globalStyleElement : document.createElement('style');
        this.currentStyle.id = SourceManagerCore.ControlElementStyleName;
        this.iframeStyle = document.createElement('style');
        this.current.head.appendChild(this.currentStyle);
        this.iframe.head.appendChild(this.iframeStyle);
      }
      loadScriptWithDocument(source, list, dc) {
        return new Promise(resolve => {
          const target = list.find(f => f.name === source.name);
          if (!target || source.mode === CONST_TYPE_MODE_SOURCE.FRAME) {
            list.push(source);
            resolve(source.load(dc));
          } else {
            target.pushCallback(resolve);
          }
        });
      }
      loadMultipleSrcJs(lst) {
        return new Promise(resolve => {
          const tasks = new PromiseMultipleTaskCore();
          lst.forEach(source => {
            tasks.addTask(this, this.loadSrcJs, [
              source.name,
              source.url,
              source.mode
            ]);
          });
          tasks.start().then(() => {
            resolve(true);
          });
        });
      }
      loadSrcJs(name, url, mode) {
        return new Promise(resolve => {
          const source = new SourceScriptManagerCore(name, url, mode);
          if (mode === CONST_TYPE_MODE_SOURCE.FRAME) {
            resolve(this.loadScriptWithDocument(source, this.lstPluginSources, this.iframe));
          }
          if (mode === CONST_TYPE_MODE_SOURCE.DOCUMENT) {
            resolve(this.loadScriptWithDocument(source, this.lstGlobalSources, this.current));
          }
          if (mode === CONST_TYPE_MODE_SOURCE.ALL) {
            const tasks = new PromiseMultipleTaskCore();
            tasks.addTask(this, this.loadScriptWithDocument, [
              Object.assign(Object.assign({}, source), { mode: CONST_TYPE_MODE_SOURCE.FRAME }),
              this.lstPluginSources,
              this.iframe
            ]);
            tasks.addTask(this, this.loadScriptWithDocument, [
              Object.assign(Object.assign({}, source), { mode: CONST_TYPE_MODE_SOURCE.DOCUMENT }),
              this.lstGlobalSources,
              this.current
            ]);
            tasks.start().then(() => {
              resolve(true);
            });
          }
        });
      }
      loadStyle(name, content, mode) {
        if (mode === CONST_TYPE_MODE_SOURCE.DOCUMENT) {
          if (!this.lstStyleGlobalSource.includes(name)) {
            this.lstStyleGlobalSource.push(name);
            return this.loadStyleToElement(content, this.currentStyle);
          }
        }
        if (mode === CONST_TYPE_MODE_SOURCE.FRAME) {
          if (!this.lstStylePluginSource.includes(name)) {
            this.lstStylePluginSource.push(name);
            return this.loadStyleToElement(content, this.iframeStyle);
          }
        }
        if (mode === CONST_TYPE_MODE_SOURCE.ALL) {
          if (!this.lstStyleGlobalSource.includes(name)) {
            this.lstStyleGlobalSource.push(name);
            this.loadStyleToElement(content, this.currentStyle);
          }
          if (!this.lstStylePluginSource.includes(name)) {
            this.lstStylePluginSource.push(name);
            this.loadStyleToElement(content, this.iframeStyle);
          }
        }
      }
      loadStyleToElement(moreContent, element) {
        element.textContent = element.textContent += moreContent;
      }
      static get ControlName() {
        return 'aztSourceLoadManager__PublicAPI';
      }
      static get ControlElementStyleName() {
        return 'azt-source-load-manager__style';
      }
    }

    const StylePluginRegister = `.mce-content-body  {
    margin: 0 3rem;
    color: #1e293b;
    line-height: 25px;
}
.mce-content-body p { margin: 0; padding: 0; }
.mce-content-body img { max-width: 100% }

.azt-editor-placeholder {
    display: none;
    position: absolute !important;
    color: #969faf !important;
    font-size: small !important;
    align-items: center !important;
    margin-left: 3px !important;
    z-index: 999 !important;
    -webkit-user-select: none !important; /* Safari */
    -ms-user-select: none !important; /* IE 10 and IE 11 */
    user-select: none !important; /* Standard syntax */
}

.azt-editor-placeholder kbd {
    align-items: center !important;
    background: linear-gradient(-225deg,#d5dbe4,#f8f8f8) !important;
    border-radius: 2px !important;
    box-shadow: inset 0 -2px 0 0 #cdcde6,inset 0 0 1px 1px #fff,0 1px 2px 1px rgba(30,35,90,0.4) !important;
    display: flex !important;
    height: 18px !important;
    justify-content: center !important;
    margin: 0 5px !important;
    padding: 0 5px !important;
    color: #969faf !important;
    border: 0 !important;
    width: fit-content !important;
    font-size: x-small;
}

.azt-editor-suggestion {
    display: none;
    position: absolute !important;
    background: #fff !important;
    border-width: 1px 1px 2px !important;
    border-style: solid !important;
    border-color: #969faf63 !important;
    border-radius: 10px;
    padding: 5px !important;
    margin-top: 30px;
    z-index: 999999;
    box-shadow: inset 0 -1px 0 0 #ECEFF1, inset 0 0 1px 1px #fff, 0 1px 1px 1px #969faf !important;
}
.azt-editor-suggestion li {
    display: flex;
    align-items: center;
    padding: 5px 20px !important;
    border-radius: 5px;
    list-style: none;
    cursor: pointer !important;
    font-weight: 500;
}
.azt-editor-suggestion li span {
    display: flex;
    align-items: center;
    justify-content: center;
}

.azt-editor-suggestion .active {
    background: #2361ae;
    color: #ffffff;
}
.azt-editor-suggestion li svg {
    border-radius: 5px;
    margin-right: 10px;
}
`;

    const setup = editor => {
        var application;
        editor.on('init', () => {
          const source = new SourceManagerCore(document, editor.getDoc());
          source.loadStyle(`${ CONST_PLUGIN_NAME }__default`, StylePluginRegister, CONST_TYPE_MODE_SOURCE.ALL);
          application = new Application(editor, source);
        });
        editor.on('keydown', function (event) {
          if (!application)
            return;
          if (event.key !== 'Enter')
            return;
          application.onHandleEnterPressMasterKeyDown(event);
        });
      }, initPlugin = () => {
        tinymce.PluginManager.add(CONST_PLUGIN_NAME, setup);
      };
    initPlugin();

})();
