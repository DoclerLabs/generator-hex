package <%= props.packageName %>;

import hex.compiler.parser.xml.XmlCompiler;
import hex.log.layout.LogProxyLayout;

/**
* Main class for <%= props.appName %>
*/
class Main {

	static function main() {
		#if debug
		var proxy : LogProxyLayout = new LogProxyLayout();
		#if js
		var controller = new hex.log.layout.LogLayoutHTMLView( proxy );
		proxy.addListener( new hex.log.layout.SimpleBrowserLayout( controller.consoleWrapperTaget ) );
		proxy.addListener( new hex.log.layout.JavaScriptConsoleLayout() );
		#elseif flash
		proxy.addListener( new hex.log.layout.TraceLayout() );
		#end
		#end

		new Main();
	}

	public function new()
	{
		XmlCompiler.readXmlFile( "<%= paths.packagePath %>/configuration/context.xml" );
	}
}
