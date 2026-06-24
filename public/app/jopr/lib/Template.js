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

    return ctx.db2.Save(Template.table_name, obj);
  }

  static Delete(ctx, id)
  {
    return ctx.db2.Delete(Template.table_name, [id]);
  }

  static async Select(ctx)
  {
    const agencies = await ctx.db2.Select(Template.table_name);
    if (agencies)
    {
      agencies.sort((a, b) => a.name.localeCompare(b.name));
    }
    return agencies;
  }

  static Select_By_Id(ctx, id)
  {
    return ctx.db2.Select_By_Id(Template.table_name, id);
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