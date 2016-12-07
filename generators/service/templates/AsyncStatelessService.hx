package <%= package %>;

import hex.service.stateless.AsyncStatelessService;

/**
 * Generated code
 * @author <%= author %>
 */
class <%= service.Service %> extends AsyncStatelessService<% if (service.hasInterface) { %> implements <%= service.IService %><% } %>
{
	public function new()
	{
		super();
	}
}
