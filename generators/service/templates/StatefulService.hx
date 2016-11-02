package <%= package %>;

import hex.service.stateful.StatefulService;

/**
 * Generated code
 * @author <%= author %>
 */
class <%= service.Service %> extends StatefulService<% if (service.hasInterface) { %> implements <%= service.IService %><% } %>
{
	public function new()
	{
		super();
	}
}
