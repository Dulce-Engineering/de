class Db
{
  static async Clear_DB(db)
  {
    const tx = db.transaction(table_names, "readwrite");

    for (const storeName of table_names) 
    {
      tx.objectStore(storeName).clear();
    }

    return new Promise((resolve) => tx.oncomplete = resolve);
  }

  static async Open_DB(ctx, schema)
  {
    const promise = new Promise(On_Process);
    function On_Process(resolve, reject)
    {
      const request = indexedDB.open("JobTrakDB", schema.version);
      request.onupgradeneeded = (e) => Db.On_Upgrade_Needed(e, schema);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }
    ctx.db = await promise;

    return ctx.db;
  }

  static async Save_To_IndexedDB(db, db_data, schema)
  {
    for (const store_name in schema.stores)
    {
      await Db.Insert_Items(db, store_name, db_data[store_name]);
    }
  }

  static On_Upgrade_Needed(event, schema)
  {
    const db = event.target.result;
    for (const store_name in schema.stores)
    {
      if (!db.objectStoreNames.contains(store_name))
      {
        const store_schema = schema.stores[store_name];
        const options = 
        { 
          keyPath: store_schema.keyPath, 
          autoIncrement: store_schema.autoIncrement 
        };
        db.createObjectStore(store_name, options);
      }
    }
  }

  static async Next_Id(db, table)
  {
    let next_id = null;
    if (table)
    {
      const data = await Db.Get_Req_Res(table.getAll());
      next_id = (data || []).reduce
        ((max, action) => Math.max(max, action.id || 0), 0) + 1;
    }
    return next_id;
  }

  static async Select(db, table_name, fn)
  {
    const items = await Db.Get_All(db, table_name);
    const res = items.filter(fn);

    return res;
  }

  static async Select_Ids(db, table_name, fn)
  {
    const items = await Db.Select(db, table_name, fn);
    const res = items.map(item => item.id);

    return res;
  }

  static Select_By_Id(db, table_name, id)
  {
    let res = null;
    if (id)
    {
      const table = Db.Get_Table(db, table_name,);
      const request = table.get(id);
      res = Db.Get_Req_Res(request);
    }

    return res;
  }

  static Save(db, table_name, item)
  {
    let res = null;

    if (item.id)
    {
      res = Db.Update(db, table_name, item);
    }
    else
    {
      res = Db.Insert(db, table_name, item);
    }

    return res;
  }

  static async Insert(db, table_name, item)
  {
    const ids = await Db.Insert_Items(db, table_name, [item]);
    return ids[0];
  }

  static async Insert_Items(db, table_name, items)
  {
    let res = null;

    if (items && items.length > 0)
    {
      res = [];
      const table = Db.Get_Table(db, table_name, false);
      if (table)
      {
        for (const item of items)
        {
          if (item)
          {
            if (item.id == null || item.id == undefined)
              item.id = await Db.Next_Id(db, table);
            await Db.Get_Req_Res(table.add(item));
            res.push(item.id);
          }
        }
      }
    }

    return res;
  }

  static async Update(db, table_name, new_item)
  {
    let res = null;

    const existing_item = await Db.Select_By_Id(db, table_name, new_item.id);
    if (existing_item)
    {
      const combined_item = { ...existing_item, ...new_item };
      res = Db.Put(db, table_name, combined_item);
    }

    return res;
  }

  static async Exists_By_Id(db, table_name, id)
  {
    const table = Db.Get_Table(db, table_name);
    const result = await Db.Get_Req_Res(table.getKey(id));
    return result != null;
  }

  static async Find_Id(db, table_name, fn)
  {
    const items = await Db.Get_All(db, table_name);
    const item = items.find(fn);

    return item == null || item == undefined ? null : item.id;
  }

  static async Exists(db, table_name, fn)
  {
    const items = await Db.Get_All(db, table_name);
    const exists = items.some(fn);

    return exists;
  }

  static async Insert_If_New(db, table_name, data, fn)
  {
    let res = null;

    const item_id = await Db.Find_Id(db, table_name, fn);
    if (item_id == null)
    {
      res = await Db.Insert(db, table_name, data);
    }
    else
    {
      res = item_id;
    }

    return res;
  }

  // low level api ============================================================

  static Get_Req_Res(request)
  {
    const res_promise = new Promise((resolve, reject) =>
    {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => Db.On_Db_Error(request, reject);
    });

    return res_promise;
  }

  static On_Db_Error(request, reject_fn)
  {
    console.error("IndexedDB error:", request.error);
    reject_fn(request.error);
  }

  static Get_Table(db, table_name, is_readonly = true)
  {
    const read_type = is_readonly ? "readonly" : "readwrite";

    let tx = null;
    try { tx = db.transaction([table_name], read_type); }
    catch (err)
    {
      console.warn(err);
      tx = null;
    }

    const store = tx ? tx.objectStore(table_name) : null;
    return store;
  }

  static async Delete(db, table_name, ids)
  {
    let res = null;

    if (ids?.length > 0)
    {
      const table = Db.Get_Table(db, table_name, false);
      const req_res = [];
      for (const id of ids) 
      {
        req_res.push(Db.Get_Req_Res(table.delete(id)));
      }
      res = Promise.all(req_res);
    }

    return res;
  }

  static async Delete_All(db, table_name)
  {
    const table = Db.Get_Table(db, table_name, false);
    const res = table ? Db.Get_Req_Res(table.clear()) : null;

    return res;
  }

  static Add(db, table_name, item)
  {
    const table = Db.Get_Table(db, table_name, false);
    const request = table.add(item);
    return Db.Get_Req_Res(request);
  }

  static Put(db, table_name, item)
  {
    const table = Db.Get_Table(db, table_name, false);
    const request = table.put(item);
    return Db.Get_Req_Res(request);
  }

  static Get_All(db, table_name)
  {
    let res = null;
    const table = Db.Get_Table(db, table_name);
    if (table)
    {
      const request = table.getAll();
      res = Db.Get_Req_Res(request);
    }
    return res;
  }
}

export default Db;