class Contact
{
  static table_name = "contacts";

  //Insert
  //Update
  
  static Save(ctx, form_data)
  {
    const contact =
    {
      id: form_data.id,
      name: form_data.name?.trim() || null,
      email: form_data.email?.trim() || null,
      phone: form_data.phone?.trim() || null,
      position: form_data.position?.trim() || null,
      linkedin: form_data.linkedin?.trim() || null,
      agency_id: parseInt(form_data.agency_id) || null,
    };

    return ctx.db2.Save(Contact.table_name, contact);
  }

  static Delete(ctx, id)
  {
    return ctx.db2.Delete(Contact.table_name, [id]);
  }

  //Select

  static Select_By_Id(ctx, id)
  {
    return ctx.db2.Select_By_Id(Contact.table_name, id);
  }

  static async Select_Extended(ctx)
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
  }

  static async Insert_If_New(ctx, contact, agency_id)
  {
    let res = null;

    if (contact && contact.email)
    {
      contact.agency_id = agency_id;
      res = await ctx.db2.Insert_If_New
        ("contacts", contact, c => c.email === contact.email);
    }

    return res;
  }
}

export default Contact;