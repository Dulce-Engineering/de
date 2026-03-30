import Utils from "./Utils.js";

class Router
{
  constructor(routes)
  {
    this.routes = routes;
  }

  Go_From_Browser()
  {
    const url = window.location.search;
    this.Exec_Func(url);
  }

  Go_From_URL(url)
  {
    // save to history
    window.history.pushState({}, '', url);
    this.Exec_Func(url);
  }

  Exec_Func(url)
  {
    let fn = null;

    for (const route of this.routes)
    {
      if (!Utils.isEmpty(route.path) && url.includes(route.path))
      {
        fn = route.fn;
      }
      else if (route.path == null && fn == null)
      {
        fn = route.fn;
      }
    }

    if (fn) fn();
  }
}

export default Router;