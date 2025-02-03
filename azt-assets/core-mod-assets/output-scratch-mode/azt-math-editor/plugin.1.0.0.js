(function () {
	'use strict';

	const CONST_PLUGIN_NAME = 'azt-math-editor';

	const EVENT_SETUP_API_AZT = 'azt-dispatch-setup-api';
	const EVENT_AZT_PUSH_JSON_CONTENT = 'azt-dispatch-push-json-content';
	var CONST_TYPE_MODE_SOURCE;
	(function (CONST_TYPE_MODE_SOURCE) {
		CONST_TYPE_MODE_SOURCE[(CONST_TYPE_MODE_SOURCE['FRAME'] = 0)] = 'FRAME';
		CONST_TYPE_MODE_SOURCE[(CONST_TYPE_MODE_SOURCE['DOCUMENT'] = 1)] = 'DOCUMENT';
		CONST_TYPE_MODE_SOURCE[(CONST_TYPE_MODE_SOURCE['ALL'] = 2)] = 'ALL';
	})(CONST_TYPE_MODE_SOURCE || (CONST_TYPE_MODE_SOURCE = {}));
	var AZT_PLUGIN_SVG_ICON;
	(function (AZT_PLUGIN_SVG_ICON) {
		AZT_PLUGIN_SVG_ICON[(AZT_PLUGIN_SVG_ICON['AztSigma'] = 0)] = 'AztSigma';
		AZT_PLUGIN_SVG_ICON[(AZT_PLUGIN_SVG_ICON['AztImage'] = 1)] = 'AztImage';
		AZT_PLUGIN_SVG_ICON[(AZT_PLUGIN_SVG_ICON['AztAdd'] = 2)] = 'AztAdd';
		AZT_PLUGIN_SVG_ICON[(AZT_PLUGIN_SVG_ICON['AztBadge'] = 3)] = 'AztBadge';
		AZT_PLUGIN_SVG_ICON[(AZT_PLUGIN_SVG_ICON['AztLayoutList'] = 4)] = 'AztLayoutList';
		AZT_PLUGIN_SVG_ICON[(AZT_PLUGIN_SVG_ICON['AztBraces'] = 5)] = 'AztBraces';
		AZT_PLUGIN_SVG_ICON[(AZT_PLUGIN_SVG_ICON['AztListChecks'] = 6)] = 'AztListChecks';
	})(AZT_PLUGIN_SVG_ICON || (AZT_PLUGIN_SVG_ICON = {}));

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
			return new Promise((resolve) => {
				LoadScriptSourceCommand.call(this.editor, {
					name,
					url,
					mode,
					callback: resolve
				});
			});
		}
		loadMultipleScript(lst) {
			return new Promise((resolve) => {
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
			if (!window['aztEditorFnsTranslateService']) return default_content !== null && default_content !== void 0 ? default_content : content;
			return window['aztEditorFnsTranslateService'](content, default_content);
		}
	}

	function AztApiRegister(editor) {
		return new Promise((resolve) => {
			editor.on(EVENT_SETUP_API_AZT, () => {
				resolve(new AztPluginApi(editor));
			});
		});
	}

	class HelperCore {
		static castJsonToClassObj(cls, jsonStr, dfObj) {
			try {
				const resultData = Object.assign(cls, JSON.parse(jsonStr));
				if (!Array.isArray(resultData)) {
					return resultData;
				} else {
					return dfObj !== null && dfObj !== void 0 ? dfObj : undefined;
				}
			} catch (ex) {
				return dfObj !== null && dfObj !== void 0 ? dfObj : undefined;
			}
		}
		static aztPluginExecCommand(name, payload, editor) {
			editor.execCommand(name, false, payload);
		}
		static pushContentLatexToElement(content, element) {
			element.setAttribute('data-latex', content);
			element.innerHTML = `$$${content}$$`;
			this.changeStatusElementToPending(element);
		}
		static changeStatusElementToPending(element) {
			element.classList.remove('azt-math-processing', 'azt-math-viewed');
			element.classList.add('azt-math-pending');
		}
		static changeStatusElementToProcessing(element) {
			element.classList.remove('azt-math-processing', 'azt-math-viewed');
			element.classList.add('azt-math-processing');
		}
		static changeStatusElementToViewed(element) {
			element.classList.remove('azt-math-processing', 'azt-math-pending');
			element.classList.add('azt-math-viewed');
		}
		static changeStatusElementToSelected(element) {
			element.classList.remove('azt-math-document-selected');
			element.classList.add('azt-math-selected');
		}
		static changeStatusElementToDocumentSelect(element) {
			element.classList.remove('azt-math-selected');
			element.classList.add('azt-math-document-selected');
		}
		static setupMceElement() {
			const mfe = new window.MathfieldElement();
			mfe.classList.add('mfe-editor');
			mfe.setOptions({
				fontsDirectory: 'https://azota889.github.io/storage_public/azt-assets/core-mod-assets/mathlive/fonts',
				soundsDirectory: 'https://azota889.github.io/storage_public/azt-assets/core-mod-assets/mathlive/sounds',
				defaultMode: 'math'
			});
			return mfe;
		}
	}

	class Application {
		constructor(editor, pluginApi) {
			this.editor = editor;
			this.pluginApi = pluginApi;
			this.pluginApi
				.loadMultipleScript([
					{
						name: 'tex-mml-chtml',
						url: 'https://239114911.e.cdneverest.net/cdnazota/azt-assets/core-mod-assets/js/tex-mml-chtml/tex-mml-chtml.js',
						mode: CONST_TYPE_MODE_SOURCE.FRAME
					},
					{
						name: 'mathlive',
						url: 'https://unpkg.com/mathlive',
						mode: CONST_TYPE_MODE_SOURCE.DOCUMENT
					}
				])
				.then(() => {
					this.detachAllElement();
					this.editor.addCommand('azt-math-editor-start-create', () => {
						this.onHandleExecuteSuggestion();
					});
					this.editor.on('Redo', () => {
						this.detachAllElement();
					});
					this.editor.on('Undo', () => {
						this.detachAllElement();
					});
					this.editor.on('Change', () => {
						this.removeAllSelected();
						this.detachAllElement();
					});
					this.editor.on('click', (e) => {
						this.removeAllSelected();
						const closest = e.target.closest(`.plugin_mathjax_process`);
						if (closest) {
							HelperCore.changeStatusElementToSelected(closest);
						}
					});
					this.editor.on('dblclick', (e) => {
						const closest = e.target.closest(`.plugin_mathjax_process`);
						if (closest) {
							this.onDoubleClick(closest);
						}
					});
					this.editor.getDoc().addEventListener('selectionchange', () => {
						const selection = this.editor.getDoc().getSelection();
						this.removeAllDocumentSelected();
						if (selection.type === 'Range') {
							if (selection.focusNode.nodeName !== '#text') {
								const focusElement = selection.focusNode;
								if (focusElement.classList.contains('plugin_mathjax_process')) {
									HelperCore.changeStatusElementToDocumentSelect(focusElement);
									return;
								}
							}
							if (selection.anchorOffset !== selection.focusOffset) {
								const childMain = this.getSelected(selection);
								if (childMain && childMain.length > 0) {
									for (let i = 0; i < childMain.length; i++) {
										HelperCore.changeStatusElementToDocumentSelect(childMain[i]);
									}
									return;
								}
							}
						}
					});
					this.pluginApi.addOneSuggestionMenu(this.pluginApi.translate('lang_editor_common_add_new_formula', 'Th\xeam c\xf4ng th\u1ee9c m\u1edbi'), 'azt-math-editor-start-create', AZT_PLUGIN_SVG_ICON.AztSigma, false, true);
				});
		}
		createHook(content) {
			const hook_element = this.editor.getDoc().createElement('span');
			hook_element.classList.add('plugin_mathjax_process');
			HelperCore.pushContentLatexToElement(content, hook_element);
			return hook_element;
		}
		removeAllDocumentSelected() {
			const targetHooks = this.editor.getDoc().querySelectorAll('.azt-math-document-selected');
			for (let i = 0; i < targetHooks.length; i++) {
				const element = targetHooks[i];
				element.classList.remove('azt-math-document-selected');
			}
		}
		getSelected(selection) {
			const tex2jaxElements = [];
			const range = selection.getRangeAt(0);
			const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_ELEMENT);
			let currentNode = walker.nextNode();
			while (currentNode) {
				if (range.intersectsNode(currentNode) && currentNode.classList.contains('plugin_mathjax_process')) {
					tex2jaxElements.push(currentNode);
				}
				currentNode = walker.nextNode();
			}
			return tex2jaxElements;
		}
		onDoubleClick(element) {
			this.onHandleExecuteSuggestion(element);
		}
		removeAllSelected() {
			const targetHooks = this.editor.getDoc().querySelectorAll('.azt-math-selected');
			for (let i = 0; i < targetHooks.length; i++) {
				const element = targetHooks[i];
				element.classList.remove('azt-math-selected');
			}
		}
		detachAllElement() {
			const otherHook = this.editor.getDoc().querySelectorAll('azt-math');
			for (let index = 0; index < otherHook.length; index++) {
				const element = otherHook[index];
				if (!element.classList.contains('plugin_mathjax_process')) {
					element.classList.add('plugin_mathjax_process');
					element.classList.add('azt-math-pending');
				}
			}
			const targetHooks = this.editor.getDoc().querySelectorAll('.plugin_mathjax_process');
			for (let i = 0; i < targetHooks.length; i++) {
				const element = targetHooks[i];
				if (element.classList.contains('azt-math-pending')) {
					this.processElement(element);
					continue;
				}
				if (element.classList.contains('azt-math-viewed') && element.firstElementChild === null) {
					HelperCore.changeStatusElementToPending(element);
					this.processElement(element);
				}
			}
		}
		onHandleExecuteSuggestion(target) {
			const mfe = HelperCore.setupMceElement();
			this.editor.windowManager.open({
				title: this.pluginApi.translate('lang_cms_common_formula_editor', 'Tr\xecnh ch\u1ec9nh s\u1eeda c\xf4ng th\u1ee9c'),
				body: {
					type: 'panel',
					items: [
						{
							type: 'htmlpanel',
							html: '<div id="formula-mathtype-editor"></div>'
						}
					]
				},
				buttons: [
					{
						type: 'cancel',
						text: this.pluginApi.translate('lang_editor_common_close', '\u0110\xf3ng')
					},
					{
						type: 'submit',
						text: target ? this.pluginApi.translate('lang_editor_common_edit', 'Ch\u1ec9nh s\u1eeda') : this.pluginApi.translate('lang_editor_common_add_formula', 'Th\xeam c\xf4ng th\u1ee9c'),
						primary: true
					}
				],
				onSubmit: (api) => {
					mfe.executeCommand(['toggleVirtualKeyboard']);
					if (!target) {
						this.editor.insertContent(this.createHook(mfe.value).outerHTML);
						this.editor.insertContent(' ');
						return api.close();
					}
					HelperCore.pushContentLatexToElement(mfe.value, target);
					HelperCore.changeStatusElementToPending(target);
					this.processElement(target);
					this.editor.focus();
					return api.close();
				},
				onCancel: () => {
					mfe.executeCommand(['toggleVirtualKeyboard']);
				}
			});
			mfe.value = target ? target.getAttribute('data-latex') : '';
			const formulaElement = document.getElementById('formula-mathtype-editor');
			formulaElement.appendChild(mfe);
			mfe.focus();
			mfe.executeCommand(['toggleVirtualKeyboard']);
		}
		processElement(element) {
			HelperCore.changeStatusElementToProcessing(element);
			element.setAttribute('contenteditable', 'false');
			element.textContent = `$$${element.getAttribute('data-latex')}$$`;
			this.editor.getDoc().defaultView.MathJax.typeset([element]);
			HelperCore.changeStatusElementToViewed(element);
		}
	}

	const StylePluginRegister = `.mfe-editor {
    font-size: 25px !important;
    padding: 10px !important;
    width: 100% !important;
    border: 1px solid #CFD8DC !important;
    border-radius: 5px;
}

.tox-dialog__body-content {
    overflow: hidden !important;
}

/* Hide the virtual keyboard toggle */
math-field::part(virtual-keyboard-toggle) {
display: none;
}

.ML__keyboard {
    z-index: 999999 !important;
}

.tox .tox-dialog-wrap {
    align-items: flex-start !important;
    padding-top: 20px;
}

mjx-container {
    display: inline-block !important;
    margin: 0 !important;
    padding: 0 !important;
}
.plugin_mathjax_process
.plugin_mathjax_process:focus,
.plugin_mathjax_process:focus-visible,
.plugin_mathjax_process::selection {
    outline: none !important;
}

.plugin_mathjax_process {
    position: relative;
    display: inline-block !important;
    cursor: pointer !important;
    outline: none !important;
    padding: 5px 0;
    margin: 0 5px;
}

.plugin_mathjax_process:hover {
    outline: 1px solid #2361ae !important;
    box-shadow: 2px 2px 3px rgba(0,0,0,.1) inset,0 0 !important;
}

.plugin_mathjax_process:hover::before,
.azt-math-selected::before,
.azt-math-document-selected::before {
    content: '\u03a3';
    position: absolute;
    top: 0;
    left: -11px;
    font-size: 10px;
    background: #2361ae;
    color: #FFF;
    padding: 0 2px;
    border-radius: 5px 0 0 5px;
}

.azt-math-selected {
    background: rgba(158,201,250,.3) !important;
    outline: 1px solid #2361ae !important;
    box-shadow: 2px 2px 3px rgba(0,0,0,.1) inset,0 0 !important;
}
.azt-math-document-selected {
    background: rgb(158 201 250) !important;
    outline: 1px solid #2361ae !important;
    box-shadow: 2px 2px 3px rgba(0,0,0,.1) inset,0 0 !important;
}`;

	const setup = (editor) => {
			AztApiRegister(editor).then((pluginApi) => {
				pluginApi.loadStyle(`${CONST_PLUGIN_NAME}__default`, StylePluginRegister, CONST_TYPE_MODE_SOURCE.ALL);
				new Application(editor, pluginApi);
			});
		},
		initPlugin = () => {
			tinymce.PluginManager.add(CONST_PLUGIN_NAME, setup);
		};
	initPlugin();
})();
