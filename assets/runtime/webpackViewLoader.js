define([
		'mmirf/util/deferredWithState'
	, 'mmirf/configurationManager'
	, 'mmirf/logger'
	, 'mmirf/resources'
	, 'mmirf/commonUtils'
	, 'mmirf/controllerManager'
	, 'module'
],function(
	deferred,
	configurationManager,
	Logger,
	res,
	utils,
	ctrlManager,
	module
){

	/**
	 *
	 * Loads compiled/generated views (layouts and partials).
	 *
	 * <br>
	 * <strong>Configuration (configuration.json)</strong>
	 * <br>
	 *
	 * NOTE that in difference to the standard viewLoader, this viewLoader implementation
	 *      only loads compiled/generated views, i.e. the configuration value
	 *      <code>"usePrecompiledViews"</code> (Boolean) is ignored (i.e. always assumed to be TRUE).
	 *
	 * The configuration value <code>"usePrecompiledViews"</code> (Boolean) allows
	 *
	 *
	 * If {@link mmir.PresentationManager.CONFIG_DEFAULT_LAYOUT_NAME} is a non-empty string, then
	 * the corresponding layout will be used as default layout, instead of
	 * {@link mmir.PresentationManager.DEFAULT_LAYOUT_NAME}.
	 *
	 *
	 * @param  {PresentationManager} _instance
	 *          the instance of the PresentationManager
	 * @param  {Map<string, Layout>} _layouts
	 *          the layout collection of the PresentationManager for adding loaded layouts
	 * @param  {Map<string, View>} _views
	 *          the view collection of the PresentationManager for adding loaded views
	 * @param  {Map<string, Partial>} _partials
	 *          the partials collection of the PresentationManager for adding loaded partials
	 * @param  {Function} createViewKey
	 *          the PresentationManager's helper function for creating keys to be used when
	 *          adding views to <code>_views</code>:<br>
	 *          <code>createViewKey(ctrl: {mmir.ctrl.Controller|String}, view: {mmir.view.View|String}) : {String}</code>
	 * @param  {Function} createPartialKey
	 *          the PresentationManager's helper function for creating keys to be used when
	 *          adding partials to <code>_partials</code>:<br>
	 *          <code>createPartialKey(partial: {mmir.view.Partial|String}, view: {mmir.view.View|String}) : {String}</code>
	 * @return {Promise}
	 *          a deferred promise that gets resolved when the views (layouts, and partials) are loaded
	 *
	 * @memberOf ViewLoader
	 */
	function loadViews (
			_instance, _layouts, _views, _partials, _createViewKey, _createPartialKey
	) {

		/**
		 * The name of the configuration field that holds
		 * the name for the default layout.
		 *
		 * @private
		 * @type String
		 * @constant
		 * @memberOf ViewLoader.init
		 */
		var CONFIG_DEFAULT_LAYOUT_NAME = _instance.CONFIG_DEFAULT_LAYOUT_NAME;

		/**
		 * Name for the default layout, that will be loaded.
		 *
		 * If NULL, no default layout will be loaded
		 * (see below configurationManager.get(CONFIG_DEFAULT_LAYOUT_NAME...))
		 *
		 * @private
		 * @type String
		 * @memberOf ViewLoader.init
		 */
		var defaultLayoutName = _instance.DEFAULT_LAYOUT_NAME;


		/**
		 * The logger for the PresentationManager.
		 *
		 * @private
		 * @type mmir.tools.Logger
		 * @memberOf ViewLoader.init
		 */
		var logger = Logger.create(module);//initialize with requirejs-module information

		// determine if default-layout has a custom name (or is disabled, in it was set to null)
		var defLayoutName = configurationManager.get(CONFIG_DEFAULT_LAYOUT_NAME, void(0));
		if(typeof defLayoutName !== 'undefined'){
			defaultLayoutName = defLayoutName;
		}

		/**
		 * HELPER get the (webpack) module ID for the default layout
		 *
		 * @private
		 * @memberOf ViewLoader.init
		 */
		function getDefaultLayoutId(defaultLayoutName){

			//the default layout is not attached to a controller:
			// -> so instead, search in gen-path of layouts for an entry with the default layout's name

			var layoutGenPath = res.getCompiledLayoutPath().replace(/\/$/, '');//<- remove trailing slash
			var layoutsFileList = utils.listDir(layoutGenPath, /\.js$/i);

			defaultLayoutName = defaultLayoutName[0].toLowerCase() + defaultLayoutName.substring(1);
			var reDefId = new RegExp('\\b'+defaultLayoutName+'.js$');
			var index = -1;
			for(var i=0,size=layoutsFileList.length; i < size; --i){
				if(reDefId.test(layoutsFileList[i])){
					index = i;
					break;
				}
			};

			return index !== -1? layoutsFileList[index].replace(/\.js$/, '') : null;
		}

		/**
		 * HELPER load the default layout
		 *
		 * @private
		 * @memberOf ViewLoader.init
		 */
		function loadDefaultLayout(){

			if(defaultLayoutName){
				var defaultLayoutId = getDefaultLayoutId(defaultLayoutName);
				if(defaultLayoutId){
					__webpack_require__(defaultLayoutId);
				} else {
					logger.error('Could not load default layout "'+defaultLayoutName+'" (set configuration '+CONFIG_DEFAULT_LAYOUT_NAME+' to null if no default layout should be used).');
				}
			} else {
				logger.info('The name for the default Layout was set to "'+defaultLayoutName+'", no default Layout will be loaded!');
			}
		}

		/**
		 * HELPER load views / partials / layouts from a list of FileInfo elements
		 *
		 *
		 * @param  {Array<FileInfo>} infoList list of file-info elements, where
		 * 																			fileInfo.name: view name
		 * 																			fileInfo.path: path to view source (not present in webpack build)
		 * 																			fileInfo.genPath: (webpack) module ID with additional suffix ".js"
		 * @param  {String} viewType (for debug output) type of views in the list, e.g. "layout" or "view"
		 * @param  {String} ctrlName (for debug output) the controller to which the infoList belongs
		 *
		 * @private
		 * @memberOf ViewLoader.init
		 */
		function loadViews(infoList, viewType, ctrlName){

			if(!infoList){
				//NOTE empty array is allowed, but no FALSY value instead of an array!
				logger.warn('invalid list for '+viewType+' in controller '+ctrlName);
				return;
			}

			var reClean = /\.js$/;
			infoList.forEach(function(info){
				var id = info.genPath;
				if(id){
					__webpack_require__(id.replace(reClean, ''));
				} else {
					logger.warn('missing module ID for '+viewType+' in controller '+ctrlName+': ', JSON.stringify(info));
				}
			});
		}



		///////////// start intialization: ////////////////

		/**
		 * Deferred / promise for loading views.
		 *
		 * @type Promise
		 * @private
		 * @memberOf ViewLoader.init
		 */
		var defer = deferred();

		loadDefaultLayout();

		var ctrls = ctrlManager.getNames();
		var name, ctrl, layout;
		for(var i=0, size = ctrls.length; i < size; ++i){

			name = ctrls[i];
			ctrl = ctrlManager.get(name);

			loadViews(ctrl.getViews(), 'view', name);
			loadViews(ctrl.getPartials(), 'partial', name);
			layout = ctrl.getLayout();
			if(layout){
				loadViews([layout], 'layout', name);
			}
		}

		defer.resolve();

		return defer;

	};//END: loadViews(){

	return loadViews;
});
