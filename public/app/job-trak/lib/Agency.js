class Agency
{
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