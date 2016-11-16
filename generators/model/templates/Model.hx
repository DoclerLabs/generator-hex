package <%= package %>;

import hex.model.Model;
import hex.model.ModelDispatcher;

/**
 * Generated code
 * @author <%= author %>
 */
class <%= model.Model %> extends Model<<%= model.ModelDispatcher %>, <%= model.IModelListener %>> implements <%= model.IModel %>
{
	public function new()
	{
		super();
	}
}

private class <%= model.ModelDispatcher %> extends ModelDispatcher<<%= model.IModelListener %>> implements <%= model.IModelListener %>
{
	public function new()
	{
		super();
	}
}
