package <%= package %>;
import hex.module.*;
import hex.module.dependency.*;

/**
 * Generated code
 * @author <%= author %>
 */
class <%= className %> extends Module implements <%= interfaceName %>
{

  public function new()
	{
		super();
	}

	// Don't ask why, it is mandatory!
	override function _getRuntimeDependencies() : IRuntimeDependencies
	{
		var rd = new RuntimeDependencies();
		return rd;
	}
}
