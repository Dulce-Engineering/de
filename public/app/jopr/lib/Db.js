class Db
{
  db = null;
  schema = null;

  Clear()
  {
    return Db.Clear(this.db, this.schema);
  }

  async Count(table_name)
  {
    let res = null;
    const table = Db.Get_Table(this.db, table_name);
    if (table)
    {
      const request = table.count();
      res = await Db.Get_Req_Res(request);
    }
    return res || 0;
  }

  Delete(table_name, ids)
  {
    return Db.Delete(this.db, table_name, ids);
  }

  Delete_All(table_name)
  {
    return Db.Delete_All(this.db, table_name);
  }

  Get_All(table_name)
  {
    return Db.Get_All(this.db, table_name);
  }

  Get_Table(table_name, is_readonly)
  {
    return Db.Get_Table(this.db, table_name, is_readonly);
  }

  Insert(table_name, item)
  {
    return Db.Insert(this.db, table_name, item);
  }

  Insert_If_New(table_name, data, fn)
  {
    return Db.Insert_If_New(this.db, table_name, data, fn);
  }

  Insert_Items(table_name, items)
  {
    return Db.Insert_Items(this.db, table_name, items);
  }

  Save(table_name, item)
  {
    return Db.Save(this.db, table_name, item);
  }

  Save_To_IndexedDB(db_data, schema)
  {
    return Db.Save_To_IndexedDB(this.db, db_data, schema);
  }

  Select(table_name, where_fn, order_by_fn)
  {
    return Db.Select(this.db, table_name, where_fn, order_by_fn);
  }

  Select_By_Id(table_name, id)
  {
    return Db.Select_By_Id(this.db, table_name, id);
  }

  Select_By_Ids(table_name, ids)
  {
    let res = null;
    
    if (!Utils.Is_Empty(ids))
    {

    }
  }

  Update(table_name, new_item)
  {
    return Db.Update(this.db, table_name, new_item);
  }

  // static ===================================================================

  static async Clear(db, schema)
  {
    const table_names = Object.keys(schema.stores);
    const tx = db.transaction(table_names, "readwrite");

    for (const storeName of table_names) 
    {
      tx.objectStore(storeName).clear();
    }

    return new Promise((resolve) => tx.oncomplete = resolve);
  }

  static async New(schema)
  {
    const promise = new Promise(On_Process);
    function On_Process(resolve, reject)
    {
      const request = indexedDB.open(schema.name, schema.version);
      request.onupgradeneeded = (e) => Db.On_Upgrade_Needed(e, schema);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }

    const res = new Db();
    res.schema = schema;
    res.db = await promise;

    return res;
  }

  static async Open_DB(ctx, schema)
  {
    const promise = new Promise(On_Process);
    function On_Process(resolve, reject)
    {
      const request = indexedDB.open(schema.name, schema.version);
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
    switch (event.oldVersion) 
    {
      case 0:
        Db.Create_Tables(db, schema);

      case 5:
        Db.Create_Table(db, schema, "projects");
        break;
    }
  }

  static Create_Tables(db, schema)
  {
    for (const table_name in schema.stores)
    {
      Db.Create_Table(db, schema, table_name);
    }
  }

  static Create_Table(db, schema, table_name)
  {
    if (!db.objectStoreNames.contains(table_name))
    {
      const table_schema = schema.stores[table_name];
      const options = 
      { 
        keyPath: table_schema.keyPath, 
        autoIncrement: table_schema.autoIncrement 
      };
      db.createObjectStore(table_name, options);
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

  static async Select(db, table_name, where_fn, order_by_fn)
  {
    const items = await Db.Get_All(db, table_name);
    const filtered_items = where_fn ? items.filter(where_fn) : items;
    if (order_by_fn && filtered_items?.length > 0) filtered_items.sort(order_by_fn);

    return filtered_items;
  }

  static async Select_Ids(db, table_name, fn)
  {
    const items = await Db.Select(db, table_name, fn);
    const res = items.map(item => item.id);

    return res;
  }

  static Select_By_Id(db, table_name, id)
  {
    let res_promise = null;
    if (id)
    {
      const table = Db.Get_Table(db, table_name,);
      const request = table.get(id);
      res_promise = Db.Get_Req_Res(request);
    }

    return res_promise;
  }

  static Save(db, table_name, item)
  {
    let id = null;

    if (item.id)
    {
      id = Db.Update(db, table_name, item);
    }
    else
    {
      id = Db.Insert(db, table_name, item);
    }

    return id;
  }

  static async Insert(db, table_name, item)
  {
    const ids = await Db.Insert_Items(db, table_name, [item]);
    return ids[0];
  }

  static async Insert_Items(db, table_name, items)
  {
    let ids = null;

    if (items && items.length > 0)
    {
      ids = [];
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
            ids.push(item.id);
          }
        }
      }
    }

    return ids;
  }

  static async Update(db, table_name, updated_item)
  {
    let id = null, item = updated_item;

    const existing_item = await Db.Select_By_Id(db, table_name, updated_item.id);
    if (existing_item)
    {
      item = { ...existing_item, ...updated_item };
    }
    id = Db.Put(db, table_name, item);

    return id;
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