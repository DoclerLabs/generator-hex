package <%= package %>;

/**
 * Generated code
 * @author <%= author %>
 */
interface <%= model.IModel %> extends <%= model.IModelRO %>
{
	//define setter functions here
	<% for (var fun of functionsIModel) {%><%= fun %>;
	<% } %>
}
