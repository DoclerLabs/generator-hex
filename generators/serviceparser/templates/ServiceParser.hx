package <%= package %>;

import hex.data.IParser;

/**
 * Generated code
 * @author <%= author %>
 */
class <%= parser.ServiceParser %> implements IParser<<%= parser.returnType %>>
{
	public function new()
	{
	}

	public function parse( serializedContent : Dynamic, target : Dynamic = null ) : <%= parser.returnType %>
	{
		/* parse serializedContent here */
	}
}
