package <%= package %>;

import hex.service.stateless.http.HTTPService;
import hex.service.stateless.http.HTTPServiceConfiguration;

/**
 * Generated code
 * @author <%= author %>
 */
class <%= service.Service %> extends HTTPService<% if (service.hasInterface) { %> implements <%= service.IService %><% } %>
{
	public function new()
	{
		super();
	}

	@PostConstruct
    override public function createConfiguration() : Void
    {
    	this.setConfiguration( new HTTPServiceConfiguration( /* enter url here */ ) );
    	//this.setParser( new FlickrPhotosParser() );
    }
}
