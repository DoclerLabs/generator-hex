package <%= package %>;

import hex.view.viewhelper.ViewHelper;

/**
 * Generated code
 * @author <%= author %>
 */
interface <%= view.ViewHelper %> extends ViewHelper<<%= view.IView %>>
{
	public function new()
	{
		super();
	}
	
	override function _initialize() : Void 
	{
		super._initialize();
	}
}
