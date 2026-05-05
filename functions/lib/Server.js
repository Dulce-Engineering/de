
class Server
{
  static New_Express(express, cors, RPC_Buddy)
  {
    const app = express();
    app.use(cors());

    const rpc_buddy = new RPC_Buddy
    (
      app,
      '/rpc-server',
      '/rpc-client',
      [
        Server
      ],
      [
        { name: "Server.Status" }
        /*{ name: "Party.Select_By_Id", inject: [db] },
        { name: "Party.Select", on_auth_fn, inject: [db, Get_Uid] },
        { name: "Party.Select_All", on_auth_fn: is_staff, inject: [Get_Ctx] },
        { name: "Party.Select_Attendee_Totals", on_auth_fn, inject: [Get_Ctx] },
        { name: "Party.Save", on_auth_fn, inject: [Get_Ctx] },
        { name: "Party.Delete", on_auth_fn, inject: [db, fb_auth, Get_Uid, RSVP, Admin] },
        { name: "Party.Close", on_auth_fn, inject: [Get_Ctx] },
        { name: "Party.Calc_Totals", on_auth_fn, inject: [Get_Ctx] },
        { name: "Party.Force_Close", on_auth_fn: is_staff, inject: [Get_Ctx] },
        { name: "Party.Invite_Link", on_auth_fn, inject: [Get_Ctx] },*/
      ],
      RPC_Buddy.Express
    );
    rpc_buddy.client_cache_control = "max-age=2592000"; // 30 days
    
    return app;
  }

  static New_Ctx(firebase)
  {
    firebase.initializeApp();
    //const fb_auth = firebase.auth();
    //const fb_db = firebase.firestore();
    //fb_db.settings({ ignoreUndefinedProperties: true });
    //const db = new Db_Firestore(fb_db);
  }  

  static Status()
  {
    return "ok";
  }
}

export default Server;