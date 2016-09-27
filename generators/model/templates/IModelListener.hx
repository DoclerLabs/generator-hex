package <%= package %>;

/**
 * Generated code
 * @author <%= author %>
 */
interface <%= model.IModelListener %>
{
	//define listener functions here
	<% for (var fun of functionsIModelListener) {%><%= fun %>;
	<% } %>
}
