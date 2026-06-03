class Agency
{
  static table_name = "agencies";

  //Insert
  //Update

  static Save(ctx, form_data)
  {
    const company =
    {
      id: form_data.id,
      name: form_data.name?.trim() || null,
      url: form_data.url?.trim() || null,
      address: form_data.address?.trim() || null,
      phone: form_data.phone?.trim() || null,
      email: form_data.email?.trim() || null,
      industry: form_data.industry?.trim() || null
    };

    return ctx.db2.Save(Agency.table_name, company);
  }

  static Delete(ctx, id)
  {
    return ctx.db2.Delete(Agency.table_name, [id]);
  }

  //Select

  static Select_By_Id(ctx, id)
  {
    return ctx.db2.Select_By_Id(Agency.table_name, id);
  }

  /*static async Select_Extended(ctx)
  {
    const contacts = await ctx.db2.Get_All(Contact.table_name);
    if (contacts)
    {
      for (const contact of contacts)
      {
        contact.agency = await ctx.db2.Select_By_Id("agencies", contact.agency_id);
      }
    }

    return contacts;
  }*/

  static async Insert_If_New(ctx, agency)
  {
    let res = null;

    if (agency && agency.name)
    {
      res = await ctx.db2.Insert_If_New
        ("agencies", agency, a => a.name === agency.name);
    }

    return res;
  }
}

export default Agency;