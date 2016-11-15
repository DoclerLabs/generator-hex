package <%= package %>;
import hex.module.*;
import hex.module.dependency.*;
<% if (moduleConfigName !== null) { %>import hex.mdvc.config.stateless.StatelessModuleConfig;
<% } %>
/**
 *
 * @author <%= author %>
 */
class <%= className %> extends Module implements <%= interfaceName %>
{

	public function new()
	{
		super();
	}

	override function _getRuntimeDependencies() : IRuntimeDependencies
	{
		var rd = new RuntimeDependencies();
		return rd;
	}
}

<% if (moduleConfigName !== null) { %>
private class <%= moduleConfigName %> extends StatelessModuleConfig
{
	override public function configure() : Void
	{
	    <% if (controllerName !== null) { %>
	    this.mapController( <%= 'I' + controllerName %>, <%= controllerName %> );
	    <% } %>
	    //...
	}
}
<% } %>
