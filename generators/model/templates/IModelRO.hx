package <%= package %>;
import hex.model.IModelRO;

/**
 * Generated code
 * @author <%= author %>
 */
interface <%= model.IModelRO %> extends IModelRO<<%= model.IModelListener %>>
{
	//define getter functions here
	<% for(var i=0; i<functionsIModelRO.length; i++) {%><%= functionsIModelRO[i] %>;
	<% } %>
}
