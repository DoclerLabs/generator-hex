package <%= package %>;
import hex.module.*;
import hex.module.dependency.*;

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
