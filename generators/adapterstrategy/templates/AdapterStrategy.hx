package <%= package %>;

<% if (as.injector) { %>import hex.di.IInjectorContainer;
<% } %>import hex.event.AdapterStrategy;

/**
 * Generated code
 * @author <%= author %>
 */
class <%= as.name %> extends AdapterStrategy<% if (as.injector) { %> implements IInjectorContainer<% } %>
{
    public function new()
    {
    	super( this, this.onAdapt );
    }

    public function onAdapt( s : String ) : Dynamic
    {
    	throw new hex.error.VirtualMethodException( "'onAdapt' not implemented" );
    }
}
