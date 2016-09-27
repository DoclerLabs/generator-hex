package <%= package %>;
import hex.model.Model;
import hex.model.ModelDispatcher;

/**
 * Generated code
 * @author <%= author %>
 */
class <%= model.Model %> extends Model<<%= model.ModelDispatcher %>, <%= model.IModelListener %>> implements <%= model.IModel %>
{
	public function new ()
	{
		super ();
	}
	
	<% for (var fun of functionsIModelRO) {%>
	public <%= fun %>
	{
	}
	<% } %>
	<% for (var fun of functionsIModel) {%>
	public <%= fun %>
	{
	}
	<% } %>
}

private class <%= model.ModelDispatcher %> extends ModelDispatcher<<%= model.IModelListener %>> implements <%= model.IModelListener %>
{
	public function new ()
	{
		super ();
	}
	
	<% for (var fun of functionsIModelListener) {%>
	public <%= fun %>
	{
	}
	<% } %>
}
