(function () {
	'use strict';

	const CONST_PLUGIN_NAME = 'azt-image-editor';

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

	class Application {
		constructor(editor, pluginApi) {
			this.editor = editor;
			this.pluginApi = pluginApi;
			this.editor.addCommand('azt-image-editor-start-choose-image', () => {
				this.loadImageAndConvertToBase64();
			});
			this.pluginApi
				.loadMultipleScript([
					{
						name: 'mnpaint_bundle.js',
						url: 'https://239114911.e.cdneverest.net/cdnazota/azt-assets/core-mod-assets/js/mnpaint_bundle.js?v=0.3',
						mode: CONST_TYPE_MODE_SOURCE.DOCUMENT
					}
				])
				.then(() => {
					this.pluginApi.addOneSuggestionMenu(this.pluginApi.translate('lang_editor_common_add_new_image', 'Th\xeam h\xecnh \u1ea3nh m\u1edbi'), 'azt-image-editor-start-choose-image', AZT_PLUGIN_SVG_ICON.AztImage, false, true);
					this.editor.on('NewBlock', () => {
						this.detachAll();
					});
					this.editor.on('Change', () => {
						this.detachAll();
					});
					this.editor.on('dblclick', (event) => {
						const closest = event.target.closest(`.azt-image-editor-manager-that`);
						if (closest) {
							this.onHandleExecuteSuggestion(closest);
						}
					});
				});
		}
		loadImageAndConvertToBase64() {
			const inputElement = document.createElement('input');
			inputElement.type = 'file';
			inputElement.accept = 'image/*';
			inputElement.addEventListener('change', (event) => {
				var _a;
				const target = event.target;
				const file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
				if (file) {
					const reader = new FileReader();
					reader.onloadend = () => {
						const base64String = reader.result;
						const imageElement = new Image();
						imageElement.crossOrigin = 'anonymous';
						imageElement.onload = () => {
							imageElement.width = imageElement.width * 0.6;
							imageElement.height = imageElement.height * 0.6;
							this.editor.focus();
							this.editor.execCommand('mceInsertContent', false, imageElement.outerHTML);
						};
						imageElement.src = base64String;
					};
					reader.readAsDataURL(file);
				}
			});
			inputElement.click();
		}
		onHandleExecuteSuggestion(target) {
			const editor = mnpaint.getInstance();
			const image_el = document.createElement('img');
			this.editor.windowManager.open({
				size: 'large',
				title: this.pluginApi.translate('lang_cms_common_image_editor', 'Tr\xecnh ch\u1ec9nh s\u1eeda h\xecnh \u1ea3nh'),
				body: {
					type: 'panel',
					items: [
						{
							type: 'htmlpanel',
							html: '<div id="only-image-editor_image__process"></div>'
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
						text: this.pluginApi.translate('lang_editor_common_complete', 'Ho\xe0n th\xe0nh'),
						primary: true
					}
				],
				initialData: { codeBlock: target ? target.getAttribute('content') : '' },
				onSubmit: (api) => {
					const newSrcOutput = editor._imgCtx.canvas.toDataURL('image/png', 1);
					target.setAttribute('width', (editor._imgCtx.canvas.width * 0.6).toString());
					target.setAttribute('height', (editor._imgCtx.canvas.height * 0.6).toString());
					target.setAttribute('src', newSrcOutput);
					this.editor.focus();
					return api.close();
				}
			});
			const source = document.getElementById('only-image-editor_image__process');
			const src_source = target.getAttribute('src') || '';
			image_el.onload = () => {
				editor.startSession(image_el);
				editor.config.width = source.clientWidth;
				editor.config.height = source.clientHeight;
				editor.config.resizable = false;
				editor.config.stopWhenClickOutsize = false;
				editor.config.stopWhenClickOutside = false;
				editor.config.autoUpdateSource = 'change';
			};
			source.appendChild(image_el);
			image_el.src = src_source;
		}
		detachAll() {
			this.processImageAztTag();
			this.processCommonImageTag();
		}
		processCommonImageTag() {
			this.editor
				.getBody()
				.querySelectorAll('img')
				.forEach((element) => {
					element.classList.add('azt-image-editor-manager-that');
				});
		}
		processImageAztTag() {
			this.editor
				.getBody()
				.querySelectorAll('azt-image')
				.forEach((element) => {
					if (element.hasAttribute('processing')) return;
					element.setAttribute('procession', 'true');
					const imageOut = new Image();
					element.parentNode.insertBefore(imageOut, element);
					const link = element.getAttribute('data-link');
					const x = Number(element.getAttribute('data-x'));
					const y = Number(element.getAttribute('data-y'));
					const width = Number(element.getAttribute('data-width'));
					const height = Number(element.getAttribute('data-height'));
					element.remove();
					const img = new Image();
					img.crossOrigin = 'anonymous';
					img.onload = () => {
						const canvas = document.createElement('canvas');
						const ctx = canvas.getContext('2d');
						canvas.width = width;
						canvas.height = height;
						ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
						imageOut.crossOrigin = 'anonymous';
						imageOut.src = canvas.toDataURL('image/png');
						imageOut.width = width * 0.6;
						imageOut.height = height * 0.6;
					};
					img.src = link;
				});
		}
	}

	const StylePluginRegister = `.azt-image-editor-manager-that {
    cursor: pointer;
}

.tox-form__group {
    height: 100% !important;
}

#only-image-editor_image__process {
    width: 100%;
    height: 100%;
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
