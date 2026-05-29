class Contact
{
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