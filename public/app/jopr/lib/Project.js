class Project
{
  static table_name = "projects";

  //Insert
  //Update

  static Save(ctx, form_data)
  {
    const obj =
    {
      id: form_data.id,
      title: form_data.title?.trim() || null,
      url: form_data.url?.trim() || null,
      description: form_data.description?.trim() || null,
      tech: form_data.tech?.trim() || null,
    };

    return ctx.db.Save(Project.table_name, obj);
  }

  static Delete(ctx, id)
  {
    return ctx.db.Delete(Project.table_name, [id]);
  }

  static async Select(ctx, where_fn, order_by_fn)
  {
    const projects = await ctx.db.Select(Project.table_name, where_fn, order_by_fn);

    return projects;
  }

  static Select_By_Id(ctx, id)
  {
    return ctx.db.Select_By_Id(Project.table_name, id);
  }
}

export default Project;