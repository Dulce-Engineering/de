class Template
{
  static table_name = "template";

  //Insert
  //Update

  static Save(ctx, form_data)
  {
    const obj =
    {
      id: form_data.id,
      name: form_data.name?.trim() || null,
      url: form_data.url?.trim() || null,
    };

    return ctx.db.Save(Template.table_name, obj);
  }

  static Delete(ctx, id)
  {
    return ctx.db.Delete(Template.table_name, [id]);
  }

  static async Select(ctx, where_fn, order_by_fn)
  {
    const rows = await ctx.db.Select(Template.table_name, where_fn, order_by_fn);

    return rows;
  }

  static Select_By_Id(ctx, id)
  {
    return ctx.db.Select_By_Id(Template.table_name, id);
  }

  static async Get_Options(ctx)
  {
    let html = null;
    const objs = await Template.Select(ctx);
    if (objs)
    {
      html =
        "<option>None</option>" +
        "<option value='new'>New thing</option>";
      for (const obj of objs)
      {
        html += "<option value='" + obj.id + "'>" + obj.name + "</option>";
      }
    }

    return html;
  }
}

export default Template;