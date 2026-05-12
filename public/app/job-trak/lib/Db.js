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

  static async Open_DB(ctx)
  {
    const promise = new Promise(On_Process);
    function On_Process(resolve, reject)
    {
      const request = indexedDB.open("JobTrakDB", 3);
      request.onupgradeneeded = (event) => 
      {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("jobs")) db.createObjectStore("jobs", { keyPath: "id" });
        if (!db.objectStoreNames.contains("agencies")) db.createObjectStore("agencies", { keyPath: "id" });
        if (!db.objectStoreNames.contains("contacts")) db.createObjectStore("contacts", { keyPath: "id" });
        if (!db.objectStoreNames.contains("action_logs")) db.createObjectStore("action_logs", { keyPath: "id" });
        if (!db.objectStoreNames.contains("attachments")) db.createObjectStore("attachments", { keyPath: "id" });
        if (!db.objectStoreNames.contains("profiles")) db.createObjectStore("profiles", { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }
    ctx.db = await promise;

    return ctx.db;
  }

  static async Save_To_IndexedDB(db, db_data)
  {
    await Db.Insert_Items(db, "jobs", db_data.jobs);
    await Db.Insert_Items(db, "agencies", db_data.agencies);
    await Db.Insert_Items(db, "contacts", db_data.contacts);
    await Db.Insert_Items(db, "action_logs", db_data.action_logs);
    await Db.Insert_Items(db, "attachments", db_data.attachments);
    await Db.Insert_Items(db, "profiles", db_data.profiles);
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

  static Select_By_Id(db, table_name, id)
  {
    const table = Db.Get_Table(db, table_name,);
    const request = table.get(id);
    return Db.Get_Req_Res(request);
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

  static async Delete_By_Id(db, table_name, id)
  {
    const table = Db.Get_Table(db, table_name, false);
    const res = Db.Get_Req_Res(table.delete(id));
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

  /**
   * Converts a File object to a JSON-serializable object including content
   * @param {File} file 
   * @returns {Promise<Object>}
   */
  static async Serialize_File(file)
  {
    const promise = new Promise(On_Process);
    function On_Process(resolve, reject)
    {
      const reader = new FileReader();

      reader.onload = () =>
      {
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          content: reader.result // This is the base64 string
        });
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    }

    return promise;
  }

  /**
   * Recreates a File object from serialized JSON data
   * @param {Object} serialized - The object containing metadata and base64 content
   * @returns {Promise<File>}
   */
  static async Deserialize_File(serialized)
  {
    // 1. Fetch the data URL to convert it back to a Blob
    const response = await fetch(serialized.content);
    const blob = await response.blob();

    // 2. Reconstruct the File using the stored metadata
    return new File([blob], serialized.name, {
      type: serialized.type,
      lastModified: serialized.lastModified
    });
  }
}

export default Db;